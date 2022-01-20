---
title: Markdown renderer and editor in browser
---

# {{ page.title }}

## ``markdown-it`` package 
```bash
#install markdown-it
npm install markdown-it
#install markdown-it addons
npm install markdown-it-abbr markdown-it-container markdown-it-deflist markdown-it-emoji markdown-it-footnote markdown-it-ins markdown-it-mark markdown-it-sub markdown-it-sup
#install highlighter for markdown
npm install highlight.js
```
### Setting up for markdown editing

Add a javascript file, for example ``myjs.js`` as shown,
```javascript
'use strict';

const MarkdownIt = require('markdown-it');
module.exports.mdHtml = new MarkdownIt()
    .use(require('markdown-it-abbr'))
    .use(require('markdown-it-container'), 'warning')
    .use(require('markdown-it-deflist'))
    .use(require('markdown-it-emoji'))
    .use(require('markdown-it-footnote'))
    .use(require('markdown-it-ins'))
    .use(require('markdown-it-mark'))
    .use(require('markdown-it-sub'))
    .use(require('markdown-it-sup'));
```
Now we can [wrap this javascript for browser](jslib) and use it our html web app. 

For instance in Svelte we can do the following, 
```html
<script>
    import md from "./myjs.js";
  
    let src = 'markdown content';
    $:markdown = md.render(src);
  };
</script>

<textarea bind:value={source} />
<div>{markdown}</div>
```
### Synchronized scrolling
This is a rather interesting subject. This sample [project](https://github.com/kkibria/svelte-page-markdown) I did, implements it using the scheme used in [markdown-it](https://github.com/markdown-it/markdown-it/blob/master/support/demo_template/index.js) demo. VS code uses something probably similar, but they have more feature. VS code [source](https://github.com/microsoft/vscode) is worth exploring to learn more.

Every time the content is updated, the demo injects the line numbers in the generated content using ``injectLineNumbers``. Next, ``buildScrollMap`` builds a map of line number versus position using a hidden element, ``sourceLikeDiv``. This map is used by the following scroll handlers,
* ``syncSrcScroll``: handler that monitors generated content scroll position and synchronizes the markdown source position.
* ``syncResultScroll``: handler that monitors markdown source content scroll position and synchronizes the generated content position.

## Showdown.js
* Github Showdown.js [source](https://github.com/showdownjs/showdown).
* Code highlighting (showdown highlight js extension)[https://stackoverflow.com/questions/21785658/showdown-highlightjs-extension]
* Github Showdown highlighter [source](https://github.com/Bloggify/showdown-highlight),
* Highlight.js, a general purpose highlighter, <https://highlightjs.org/>, Github [source](https://github.com/highlightjs/highlight.js).
* Check showdown extensions, [Github](https://github.com/showdownjs/extension-boilerplate). To develop a new extension take a look at their  [template](https://github.com/showdownjs/extension-boilerplate) at github. There are other extensions, google it.
* Showdown extension writeup, <https://github.com/showdownjs/ng-showdown/wiki/Creating-an-Extension>.

### Showdown use

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>dev_cookbook</title>
    <script src="https://unpkg.com/showdown/dist/showdown.min.js"></script>
</head>

<body>
    <script>
        var div = document.createElement("DIV");
        document.body.appendChild(div);   // Append <button> to <body>
        var converter = new showdown.Converter();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                div.innerHTML = converter.makeHtml(this.responseText);
            }
        };
        xhttp.open("GET", "README.md", true);
        xhttp.send();
    </script>
</body>

</html>
```

## Using a code editor for entering text
Instead of a text area to enter source, we an use a code editor. 
* [Dillinger](https://dillinger.io/) is a good example, Github [source](https://github.com/joemccann/dillinger). It also integrated server side pdf generation of markdown render.
* Dillinger uses [Ace](https://ace.c9.io/) code editor, Github [source](https://github.com/ajaxorg/ace). Ace allows highlighting code.
* highlight.js has Markdown syntax highlighting, integrating markdown highlighting might be a good idea.
