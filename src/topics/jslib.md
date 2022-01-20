---
title: Javascript library
---

# {{ page.title }}

## Using require like a node package in browser

Lets take an example where we will use node package in a ``commonjs`` javascript file. This kind of setup would work in a node environment without
problem. But in a browser using ``require`` would normally be a problem. We can use the following method to make it work in browser.

In this example we will instantiate jquery with ``require`` as a node module. First get jquery module using npm. Then make ``test.js`` module as following.
At the end of the file we will export the API.

```javascript
var $ = require("jquery");

function getName () {
  return 'Jim';
};

function getLocation () {
  return 'Munich';
};

function injectEl() {
  // wait till document is ready 
  $(function() {
    $("<h1>This text was injected using jquery</h1>").appendTo(".inject-dev");
  });
}

const dob = '12.01.1982';

module.exports.getName = getName;
module.exports.getLocation = getLocation;
module.exports.dob = dob;
module.exports.injectEl = injectEl;
```

Now wrap everything up in a single module.
You have two options,
  * Use ``browserify``.
  * Use ``rollup``.

## Use browserify 

Assuming you have already installed ``browserify`` and ``js-beautify``, run them. If node builtins are used your ``commonjs`` file, ``browserify --s`` option will include them.

```bash
browserify test.js --s test -o gen-test.js
#optional only if you like to examine the generated file.
js-beautify gen-test.js -o pretty-gen-test.js
```
Check the outputs, you can see jquery has already been included in the output. 

Now we can load ``gen-test.js`` in the browser in an html file. It also works with svelte. Following shows using it in a svelte source. 

```html
<script>
  import { onMount } from 'svelte';
  import test from "./gen-test.js"

  let name = test.getName();
  let location = test.getLocation();
  let dob = test.dob;

  test.injectEl();
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>Location: {location}, dob: {dob}</p>
  <div class="inject-dev"></div>
</main>
```

I have built this as an npm project in [github](https://github.com/kkibria/svelte-js-library) with svelte template.

## Use rollup

If you have installed ``rollup`` this can also be done with added benefit of [tree shaking](#tree-shaking-with-rollup). ``rollup.config.js`` can be configured as, 

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
export default {
  ...
  plugins: [
    resolve({
      browser: true,

      // only if you need rollup to look inside
      // node_modules for builtins
      preferBuiltins: false, 

      dedupe: ['svelte']
    }),
    json(),
    commonjs()
  ]
}
```

### node builtins

Read [node-resolve documentation](https://github.com/rollup/plugins/tree/master/packages/node-resolve) carefully. 
If node builtins are used your ``commonjs`` file, they will be missing. You have two options,

* Import the individual builtin packages with npm, if you have only a few missing. Set ``preferBuiltins`` to ``false`` 
so that rollup can get them from ``node_modules``.
* All node builtins can be included using npm packages ``rollup-plugin-node-builtins`` and ``rollup-plugin-node-globals`` with rollup. Set ``preferBuiltins`` to ``true`` so that rollup will use builtins from these instead. You can remove ``preferBuiltins`` altogether since  
it default value is ``true`` anyways.  

## Create javascript for older browsers

The way to fix language version problems is transpiling the javascript code using [**babel**](https://babeljs.io/). To make sure transpiled code works on older browser, we have to test it on different browsers to see if and why it fails. Cross browser testing sites like <https://www.lambdatest.com> or <https://saucelabs.com/> are helpful but can be expansive depending on situation. Check the following to get an insight,

* [babel Handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/).
* Browser support for javascript, [ECMAScript compatibility table](https://kangax.github.io/compat-table/es6/).
* Youtube video, [Do you really need BABEL to compile JavaScript](https://youtu.be/MzZilaM16oY)?
* [Babel under the hood](https://medium.com/@makk.bit/babel-under-the-hood-63e3fb961243).

### babel with rollup

Read [rollup babel plugin documentation](https://github.com/rollup/plugins/tree/master/packages/babel) carefully to understand how to configure the plugin. This plugin
will invoke babel.
Next we need to understand how to configure babel, read [Babel configuration documentation](https://babeljs.io/docs/en/configuration). 

* [Making a svelte app compatible with Internet Explorer 11](https://blog.az.sg/posts/svelte-and-ie11/).
* [Svelte3, Rollup and Babel7](http://simey.me/svelte3-rollup-and-babel7/).

### babel with webpack

* [Dillinger](https://dillinger.io/) is a good example, Github [source](https://github.com/joemccann/dillinger). I tried their site on IE11 and it worked fine.
* Good info on using babel in the Github [source](https://github.com/babel/babel-loader) readme of the webpack plugin ``babel-loader``.
* [Support IE 11 Using Babel and Webpack](https://medium.com/@ramez.aijaz/transpile-typescript-to-es5-using-babel-and-webpack-f3b72a157399)

## Polyfill articles

* [Polyfills: everything you ever wanted to know, or maybe a bit less](https://medium.com/hackernoon/polyfills-everything-you-ever-wanted-to-know-or-maybe-a-bit-less-7c8de164e423).
* [Loading Polyfills Only When Needed](https://philipwalton.com/articles/loading-polyfills-only-when-needed/).

## File io from browsers

* [Saving / Loading files with Javascript (from the browser)](http://simey.me/saving-loading-files-with-javascript/)


## Tree shaking with rollup
* [Optimizing JavaScript packages for tree shaking](https://madewithlove.com/optimizing-javascript-packages-for-tree-shaking/).
* [How to bundle a npm package with TypeScript and Rollup](https://medium.com/@paleo.said/how-to-bundle-an-npm-package-with-typescript-and-rollup-f80e0f196189).


## TypeScript
We can automatically compile typescript files by running typescript compiler in watch mode,
```bash
tsc *.ts --watch
```
Check out more details on [``tsconfig.json``](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) usage.

## Best way to provide module API
I like using Javascript class to provide prototypical APIs that uses states.
APIs without states can be exported as functions.
## js asynchronous programming: Promise(), async/await explained
Traditionally, we would access the results of asynchronous code through the use of callbacks.

```javascript
let myfunc = (maybeAnID) => {
  someDatabaseThing(maybeAnID, function(error, result)) {
    if(error) {
      // build an error object and return
      // or just process the error and log and return nothing
      return doSomethingWithTheError(error);
    } else {
      // process the result, build a return object and return
      // or just process result and return nothing
      return doSomethingWithResult(result);
    }
  }
}
```

The use of callbacks is ok until they become overly nested. In other words, you have to run more asynchronous code with each new result. This pattern of callbacks within callbacks can lead to something known as *callback hell*.

To solve this we can use promise.
A promise is simply an object that we create like the later example. We instantiate it with the ``new`` keyword. Instead of the three parameters we passed in to make our car (color, type, and doors), we pass in a function that takes two arguments: ``resolve`` and ``reject``.

```javascript

let myfunc = (maybeAnID) => new Promise((resolve, reject) => {
  someDatabaseThing(maybeAnID, function(error, result)) {
    //...Once we get back the thing from the database...
    if(error) {
        reject(doSomethingWithTheError(error));
    } else {
        resolve(doSomethingWithResult(result));
    }
  }
}
```

The call to asynchronous function is simply wrapped in a promise that is returned which allows
chaining with ``.then()`` which is much more readable then the *callback hell* style coding.

Or we can have our own function that returns a promise without wrapping a callback API.

```javascript
let myfunc = (param) => new Promise((resolve, reject) => {
  // Do stuff that takes time using param
  ...
  if(error) {
      reject(doSomethingWithTheError(error));
  } else {
      resolve(doSomethingWithResult(result));
  }
}
```

The functions that consume a function returning a promise can use ``.then()``
chaining. However there is yet another cleaner alternative.
In a function we can use ``await`` to invoke a function that returns a promise.
This will make the execution wait till the promise is resolved or rejected.
We don't need to use ``.then()`` chaining, which improves readability further more.
A function that wants to use ``await`` must be declared with ``async`` keyword.

More details here,
* <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function>
* <https://levelup.gitconnected.com/async-await-vs-promises-4fe98d11038f>
* <https://www.freecodecamp.org/news/how-to-write-a-javascript-promise-4ed8d44292b8/>
* <https://medium.com/@sebelga/simplify-your-code-adding-hooks-to-your-promises-9e1483662dfa>

``async`` function always returns a promise.

from a regular function they can be called with ``.then()``

```javascript
let v = new Promise((resolve, reject) => {
    // throw Error("Returning error");
    resolve(20);
});

async function abc() {
    // test rejected promise
    // r will be undefined in case there is an error
    let r = await v.catch(() => {});
    console.log(r);
    return 35;
}

async function pqr() {
    console.log("running abc");
    let p = await abc();
    console.log(p);
}

// unused return value which is a promise
// This is perfectly acceptable if
// there was no result to return
pqr(); 

// this is how we retrieve return value from 
// an async function from a regular function
// or top level as we can't use await
// however module top level can be made async
abc().then(val => console.log(val));

```

