---
title: Svelte Desktop and mobile app
---
# {{ page.title }}


## svelte for desktop app
* [Build a desktop app with Electron and Svelte](https://dev.to/khangnd/build-a-desktop-app-with-electron-and-svelte-44dp), [github](https://github.com/khang-nd/electron-app-svelte)
* [Getting started with Electron and Svelte](https://dev.to/o_a_e/getting-started-with-electron-and-svelte-2gn8), read the discussion in this article for problems and solutions.

## web apps & mobile apps
* <https://dev.to/ruppysuppy/turn-your-website-into-a-cross-platform-desktop-app-with-less-than-15-lines-of-code-with-electron-44m3>
* <https://www.webtips.dev/how-to-make-your-very-first-desktop-app-with-electron-and-svelte>
* <https://dev.to/khangnd/build-a-desktop-app-with-electron-and-svelte-44dp>
* <https://fireship.io/snippets/svelte-electron-setup/>

## Svelete and capacitor will allow web apps to become mobile apps
* <https://ionicframework.com>
* <https://capacitorjs.com/>
* <https://stackoverflow.com/questions/58611710/how-to-setup-svelte-js-with-ionic>
* <https://www.joshmorony.com/using-the-capacitor-filesystem-api-to-store-photos/>
* <https://gist.github.com/dalezak/a6b1de39091f4ace220695d72717ac71>


## electron and local file issue
* [Electron should be able to load local resources with enabled webSecurity](https://github.com/electron/electron/issues/23393)
* <https://www.electronjs.org/docs/api/protocol#protocolregisterfileprotocolscheme-handler-completion>

## electron app security

Getting error doing electron dialog because fs and ipcRender can not be used in browser thread securely.

* [Error while importing electron in browser, import { ipcRenderer } from 'electron'](https://github.com/electron/electron/issues/9920)

* read <https://www.electronjs.org/docs/latest/tutorial/process-model> to see how selected node environment
apis can be made available to renderer process via contextBridge.

* also see <https://stackoverflow.com/questions/44391448/electron-require-is-not-defined/59888788#59888788>.
* <https://www.electronjs.org/docs/tutorial/context-isolation>

* building secure electron app,
<https://github.com/reZach/secure-electron-template/blob/master/docs/secureapps.md>

## Node.js and frontend interaction in electron
there are two choices,
1) server backend, chromium frontend communicating over tcpip port using standard web technique
2) browser-node interaction via IPC. We can promisify this. Following is the suggested code from this [gist](https://gist.github.com/Johnz86/33425246eddc36b26c6af2d5c8e2b1a7).


``main-ipc.ts``
```typescript
import { ipcMain, BrowserWindow, Event } from 'electron'

const getResponseChannels = (channel:string) => ({
    sendChannel: `%app-send-channel-${channel}`,
    dataChannel: `%app-response-data-channel-${channel}`,
    errorChannel: `%app-response-error-channel-${channel}`
})

const getRendererResponseChannels = (windowId: number, channel: string) => ({
    sendChannel: `%app-send-channel-${windowId}-${channel}`,
    dataChannel: `%app-response-data-channel-${windowId}-${channel}`,
    errorChannel: `%app-response-error-channel-${windowId}-${channel}`
})

export default class ipc {
    static callRenderer(window: BrowserWindow, channel: string, data: object) {
        return new Promise((resolve, reject) => {
            const { sendChannel, dataChannel, errorChannel } = getRendererResponseChannels(window.id, channel)

            const cleanup = () => {
                ipcMain.removeAllListeners(dataChannel)
                ipcMain.removeAllListeners(errorChannel)
            }

            ipcMain.on(dataChannel, (_: Event, result: object) => {
                cleanup()
                resolve(result)
            })

            ipcMain.on(errorChannel, (_: Event, error: object) => {
                cleanup()
                reject(error)
            })

            if (window.webContents) {
                window.webContents.send(sendChannel, data)
            }
        })
    }

    static answerRenderer(channel: string, callback: Function) {
        const { sendChannel, dataChannel, errorChannel } = getResponseChannels(channel)

        ipcMain.on(sendChannel, async (event: Event, data: object) => {
            const window = BrowserWindow.fromWebContents(event.sender)

            const send = (channel: string, data: object) => {
                if (!(window && window.isDestroyed())) {
                    event.sender.send(channel, data)
                }
            }

            try {
                send(dataChannel, await callback(data, window))
            } catch (error) {
                send(errorChannel, error)
            }
        })
    }

    static sendToRenderers(channel: string, data: object) {
        for (const window of BrowserWindow.getAllWindows()) {
            if (window.webContents) {
                window.webContents.send(channel, data)
            }
        }
    }
}
```

``renderer-ipc.ts``
```typescript
import { ipcRenderer, remote, Event } from 'electron';

const getResponseChannels = (channel: string) => ({
    sendChannel: `%app-send-channel-${channel}`,
    dataChannel: `%app-response-data-channel-${channel}`,
    errorChannel: `%app-response-error-channel-${channel}`
})

const getRendererResponseChannels = (windowId: number, channel: string) => ({
    sendChannel: `%app-send-channel-${windowId}-${channel}`,
    dataChannel: `%app-response-data-channel-${windowId}-${channel}`,
    errorChannel: `%app-response-error-channel-${windowId}-${channel}`
})

export default class ipc {
    static callMain(channel: string, data: object) {
        return new Promise((resolve, reject) => {
            const { sendChannel, dataChannel, errorChannel } = getResponseChannels(channel)

            const cleanup = () => {
                ipcRenderer.removeAllListeners(dataChannel)
                ipcRenderer.removeAllListeners(errorChannel)
            }

            ipcRenderer.on(dataChannel, (_: Event, result: object) => {
                cleanup()
                resolve(result)
            })

            ipcRenderer.on(errorChannel, (_: Event, error: object) => {
                cleanup()
                reject(error)
            })

            ipcRenderer.send(sendChannel, data)
        })
    }

    static answerMain(channel: string, callback: Function) {
        const window = remote.getCurrentWindow()
        const { sendChannel, dataChannel, errorChannel } = getRendererResponseChannels(window.id, channel)

        ipcRenderer.on(sendChannel, async (_: Event, data: object) => {
            try {
                ipcRenderer.send(dataChannel, await callback(data))
            } catch (err) {
                ipcRenderer.send(errorChannel, err)
            }
        })
    }
}
```




