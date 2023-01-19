---
title: Cross Platform Apps
---

# {{page.title}}

One of the most convenient way to build cross platform apps is to web technology
for the frontend user interface. This a well understood technology and as such
the gui can be built with standard web page design tooling.

Most popular such app design environment is electron, which is chromium based.
the backend of electron app is node.
The problem with electron is distributable bundle size. The are quite large,
because bundle includes node, and chromium.
In order to reduce bundle size, new similar environments are using
* Webview, instead of chromium. Desktops distros are equipped with webview.
* Faster and lighter compiled binary backend.

As a result, the bundles are orders of magnitude smaller, more secure compared
to Electron.

One such environment is Tauri, which rust based. Here, I will record my notes as
I try to build a Tauri app, with svelte frontend. 


# Installing

* Install rust. Run the installer from 
[rust](https://www.rust-lang.org/tools/install) site.
* Install tauri. Follow instructions from [tauri] (https://tauri.app/v1/guides/getting-started/setup/sveltekit/) site. 

## Tauri

```
cargo install create-tauri-app
# cargo create-tauri-app
```

Install tauri cli
```
cargo install tauri-cli
```

## create the project

```
npm create svelte@latest tauri-svelte
cd tauri-svelte
git init

# add tauri to project
cargo tauri init

npm install @tauri-apps/api
```

## run in dev mode
```
cargo tauri dev
```

## build the production version
```
cargo tauri build
```