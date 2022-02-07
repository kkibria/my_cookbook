---
title: Svelte
---
# {{ page.title }}

## General capabilities
* [The Svelte Handbook](https://www.freecodecamp.org/news/the-svelte-handbook/)

### create a starter svelte project
```bash
npx degit sveltejs/template my-svelte-project
cd my-svelte-project
npm install
npm run dev
```

### vscode setting
Command Palette (⇧⌘P) then: Preferences: Configure Language Specific Settings,
```json
{
  "[svelte]": {
    "editor.defaultFormatter": "svelte.svelte-vscode",
    "editor.tabSize": 2
  }
}
```
## Svelte Browser compatibility
* [Making a svelte app compatible with Internet Explorer 11](https://blog.az.sg/posts/svelte-and-ie11/)
* [Svelte3, Rollup and Babel7](http://simey.me/svelte3-rollup-and-babel7/)

## Svelte components
* <https://github.com/hperrin/svelte-material-ui>
* <https://github.com/collardeau/svelte-fluid-header>
* <https://flaviocopes.com/svelte-state-management/>


## Svelte Component exported functions
``Comp1.svelte`` file.
```html
<script>
    import Comp2, {mod_param as C2param} from 'Comp2.svelte';

    console.log(C2param.someText);
    C2param.someFunc("Comp2 function called from Comp1");
</script>
```
``Comp2.svelte`` file.
```html
<script>
  // This is component instance context
...
</script>

<script context="module">
  // This is component module context
  export const mod_param = {
    someFunc: (text) => {
      console.log(text);
    },

    someText: "hello from Comp2" 
  }
</script>
```
> Exchanging data between components module and instance context is tricky
> So appropriate handling required in such case. It is best to use 
> [REPL](https://svelte.dev/repl) sandbox ``JS output`` window to 
> check the exact use case.   

## Component lifecycle 

Components,
1. are instantiated and composed inside parents.
1. are initialized by parents via parameters.
   Parameters are passed by value.
1. display information and interact with user.
1. manage user interaction via state transitions.
1. make the user entered information accessible to parents via bindings.
   Binding keeps parent's variable in sync with components variable.
   Binding makes the parameter behave like as if they were passed
   by pointers. 
1. send events to parent so that parent can take actions.
   Parent uses event handlers.
1. are destroyed by parents when they are no longer needed.

> A parent can get component state both via binding and events.
Bindings provide easy reactive update in parents. Events
provides an easy way when algorithmic action is required by parent.
Using both as appropriate is the best approach.

Check [Managing state in Svelte](https://dev.to/joshnuss/managing-state-in-svelte-29o7).

## Passing parameter to sub-component
Sub-components act like functions javascript function with parameters, pass parameters individually or 
all the parameters as a dictionary using a spread operator.
You can have [default values](https://svelte.dev/tutorial/default-values) inside the sub-component.

```auto
  <Comp1 param1={data} />
  <Comp2 {...selprops} />
```
Using spread operator is preferred for large number of parameters. 

Check [Passing parameters to components](https://svelte.dev/repl/aac50a4f24fd4858b1c6fffc0a75e418?version=3.23.1).

## Binding
Binding is exactly same as passing individual parameters, except you have to attach the 
``bind`` keyword in the association. 

```auto
  <Comp1 bind:param1={data} />
```
Binding will keep component parameter ``param1`` and parent variable
``data`` always in sync. When components updates ``param1`` it will be
immediately reflected in ``data``. Parent can bind ``data`` with multiple
components and they all will be in sync as well.

There is no spread style binding syntax supported.

There is a short hand syntax available for binding in the case when parameter name and variable name are the same.
```auto
  <Comp1 bind:same_name={same_name} />
  <!-- short hand syntax for above -->
  <Comp1 bind:same_name />
```
Check [component bindings](https://svelte.dev/tutorial/component-bindings).

## Events

``Parent.svelte`` source,
```auto
<script>
	import Comp1 from './Comp1.svelte';

	function handleMessage(event) {
		alert(event.detail.text);
	}
</script>

<Comp1 on:event_name={handleMessage}/>
```

``Comp1.svelte`` source,
```auto
<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function sayHello() {
		dispatch('event_name', {
			text: 'Hello!'
		});
	}
</script>

<button on:click={sayHello}>
	Click to say hello
</button>
```

To bubble up component message parent can forward it further up,
see [event forwarding](https://svelte.dev/tutorial/event-forwarding).


## develop reusable components 
using REPL, Github and npm
> todo: write up

## Generating web components with svelte
* [How to Create a Web Component in Svelte](https://dev.to/silvio/how-to-create-a-web-components-in-svelte-2g4j).



## Styling
* [What I Like About Writing Styles with Svelte](https://css-tricks.com/what-i-like-about-writing-styles-with-svelte/)
* [The zen of Just Writing CSS](https://svelte.dev/blog/the-zen-of-just-writing-css)
* <https://css-tricks.com/what-i-like-about-writing-styles-with-svelte/>
* With tailwind we can import external css file into a component, Although it is not specific for svelte, still is a good read: [Add Imports to Tailwind CSS with PostCSS](https://mattferderer.com/add-postcss-imports-to-tailwind-css).
* css in js for svelte, <https://svelte.dev/blog/svelte-css-in-js>

## Generated content and global styling in production build
Svelte allows css support of generated content with global styling. However 
it (with postcss and purgecss) removes any css that is not being used by 
the static content during production build, if it is loaded from a css file 
using postcss-include facility even it is a global style. During 
development build this doesn't happen though since we don't run purgecss in 
development build. To ensure those styles are retained we need to tell 
purgecss about those. For instance if we used a highlighter such as 
highlight.js which prepends highlight classes with ``hljs-`` prefix. Then 
we can retain styling for them by adding a whitelist pattern ``/hljs-/``

in ``postcss.config.js`` the same way as it is done for svelte in their 
official svelte template.
```javascript
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.svelte', './src/**/*.html'],
  whitelistPatterns: [/svelte-/, /hljs-/],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
})
```

### Transitions, Animations
* <https://svelte.dev/repl/865750b1ffb642f59d317747bd9f3534?version=3.4.4>
* <https://stackoverflow.com/questions/56453366/cant-use-svelte-animate-to-make-a-list-item-fly-into-a-header>
* <https://svelte.dev/repl/f4386ec88df34e3b9a6b513e19374824?version=3.4.4> for moving selected item to a position.


## state management
* <https://stackoverflow.com/questions/65092054/how-to-use-svelte-store-with-tree-like-nested-object>
* <https://www.newline.co/@kchan/state-management-with-svelte-props-part-1--73a26f45>
* <https://medium.com/@veeralpatel/things-ive-learned-about-state-management-for-react-apps-174b8bde87fb>
* <https://svelte-recipes.netlify.app/stores/>
* <https://mobx.js.org/getting-started>
* <https://blog.logrocket.com/application-state-management-with-svelte/>



### Contexts vs. stores
Contexts and stores seem similar. They differ in that stores are available to any part of an app, while a context is only available to a component and its descendants. This can be helpful if you want to use several instances of a component without the state of one interfering with the state of the others.

In fact, you might use the two together. Since context is not **reactive** and not mutable, values that change over time should be represented as stores:

```auto
const { these, are, stores } = getContext(...);
```

* [REPL context API demo](https://svelte.dev/tutorial/context-api)
* [Lighter and Faster - A Guide to the Svelte Framework](https://www.toptal.com/front-end/svelte-framework-guide),
  Github [source](https://github.com/teimurjan/svelte-login-form)

-------

## Svelte markdown editor
* [Build Markdown editor using Svelte in 10 minutes](https://dev.to/karkranikhil/build-markdown-editor-using-svelte-in-10-minutes-1c69),
  this uses [marked.js](https://marked.js.org) parser, [github](https://github.com/markedjs/marked).
* Stackedit is a vue markdown editor, but provides scroll sync. We can take
  a look at the source code and do similar thing in Svelte. Uses <https://github.com/markdown-it/markdown-it>. markdown-it has most versatile collection of plugins.
* Nice scrollbar sync example, <https://github.com/vincentcn/markdown-scroll-sync>.
* Another scrollbar sync example, <https://github.com/jonschlinkert/remarkable>. Look in the demo directory.
* The most promising markdown editing seems to be ``markdown-it``, ``vscode`` uses this for their markdown support as well. 
  This seems to be a project which evolved from 
  ``remarkable``. Check Github <https://github.com/markdown-it/markdown-it> 
  in the ``support/demo_template`` directory for the scroll syncing javascript source.
  With some modification this can be integrated with svelte.
  I like the way vscode does it, whenever the cursor is on a line, it finds
  the whole element in the preview window and draws a side bar to indicate
  the element being edited. I was able to integrate the relevant part of 
  the code from ``support/demo_template`` with svelte,
  [read more](markdown).      


## using processing p5.js in svelte
* [p5-Svelte: a quick and easy way to use p5 in Svelte!](https://dev.to/tonyketcham/p5-svelte-a-quick-and-easy-way-to-use-p5-in-svelte-3j8f), [Github](https://github.com/tonyketcham/p5-svelte)
* [Q&A #6: p5.js Sketch as Background](https://www.youtube.com/watch?v=OIfEHD3KqCg)
* <https://p5js.org/reference/#/p5/loadImage>


## Routing
* [Client-side (SPA) routing in Svelte](https://youtu.be/edFp-vuDlLs)
* [Micro client-side router inspired by the Express router](https://visionmedia.github.io/page.js/)
* [Svelte routing with page.js, Part 1](https://dev.to/ism/svelte-routing-with-page-js-part-1-2h9h)
* [Svelte routing with page.js, Part 2](https://dev.to/ism/svelte-routing-with-page-js-part-2-4l76), code in <https://github.com/iljoo/svelte-pagejs>.
* [Setting up Routing In Svelte with Page.js](https://jackwhiting.co.uk/posts/setting-up-routing-in-svelte-with-pagejs/)
* Svelte with firebase and page.js router- I have built a template, work in progress: <https://github.com/kkibria/svelte-page-markdown>.

## SPA & Search Engine Optimization (SEO)
* [SPA SEO: A Single-Page App Guide to Google’s 1st Page](https://snipcart.com/spa-seo)
* [Why Single Page Application Views Should be Hydrated on the Client, Not the Server](https://love2dev.com/blog/why-single-page-application-views-should-be-hydrated-on-the-client-not-the-server/)

## Svelte with firebase
* [svelte](https://svelte.dev/)
* [Rich Harris - Rethinking reactivity](https://youtu.be/AdNJ3fydeao)
* [Svelte 3 Reaction & QuickStart Tutorial](https://youtu.be/043h4ugAj4c)
* [Svelte + Firebase = Sveltefire (and it is FIRE 🔥🔥🔥)](https://youtu.be/urDLn8RNlCA)
* [Svelte Realtime Todo List with Firebase](https://fireship.io/lessons/svelte-v3-overview-firebase/). I built a template using this in <https://github.com/kkibria/svelte-todo>.
* Uses firebase auth web UI [Sapper/Svelte Firebase Auth UI](https://sveltecasts.dev/episodes/001-firebase-ui), github source [code](https://github.com/sveltecasts/001-auth).
* Firebase storage with svelte - [RxFire in Svelte 3 using Firebase Firestore and Authentication](https://dev.to/ajonpllc/rxfire-in-svelte-3-using-firebase-firestore-and-authentication-pca)

## Login data passing with context API

Firebase can have has it own login subscription via rxfire. However following articles are good read to understand svelte support data sharing across the app.


## Web components
* [Custom element API](https://svelte.dev/docs#run-time-custom-element-api), read this carefully.

There should be two ways we can interact with web component technology,
* Instantiate web component in a svelte component. Check this as a starting point, <https://youtu.be/-6Hy3MHfPhA>.
* instantiate a svelte component in a web component or a existing web page like a web component.

To convert your existing Svelte app into a web component, you need to,
* Add <svelte:options tag="component-name"> somewhere in your .svelte file to assign a html tag name.
* Tell the svelte compiler to create web component by adding `customElement: true` option.
However using this way would turn every svelte file it compiles to a web component. In a typical
project however you might one only the top svelte file compiled to be a web component and all other files to integrated in the top level file. This can be done using `customElement` option with a filter.

Following is a filter example that only makes web component when the file has `.wc.svelte` extension.
```
// rollup.config.js
svelte({ customElement: true, include: /\.wc\.svelte$/ }),
svelte({ customElement: false, exclude: /\.wc\.svelte$/ }),
```

Using global CSS should be done carefully since if they are not scoped properly.
Using class name to scope CSS is the right approach since svelte adds a hash to the css names.
So the same css can be used in many places with duplicating.

The property names should be restricted to lower case, camel case and hyphenation should not be used
as they have complications.

* [Can You Build Web Components With Svelte?](https://javascript.plainenglish.io/can-you-build-web-components-with-svelte-3c8bc3c1cfd8#:~:text=In%20theory%2C%20all%20you%20need,That's%20it!), slightly old, some of the issues have been fixed since then. A must read
to understand related issues. 

> Todo: We will explore this in more details in future.

### events
* <https://github.com/sveltejs/svelte/issues/3119> 

Read [MDN events article](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event).
The read-only `composed` property of the Event interface returns a Boolean which indicates
whether or not the event will propagate across the shadow DOM boundary into the standard DOM.

```
// App.svelte
<svelte:options tag="my-component" />
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<button on:click="{() => dispatch('foo', {detail: 'bar', composed: true})}">
    click me 
</button>
```
