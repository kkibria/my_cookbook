---
title: Mdbook
---

# {{ page.title }}

To do a new book, first you need to install `rust`.
## Install mdbook and the front matter preprocessor
With this preprocessor we can support a subset of Yaml in front matter.

```bash
cargo install mdbook
cargo install --git https://github.com/kkibria/mdbook-frntmtr.git
```

## Hosting at github pages
For static sites, github pages is a great choice. It is free and easy to use.
Generate the scaffolding using instructions from [Hosting Content in github pages](text-content.md#hosting-content-in-github-pages) section.

## Initialize Project folder
```bash
cd my_project
mdbook init
mkdir src
```
### Setup `book.toml`
add following,
```
[book]
src = "src"

[build]
build-dir = "gh-pages/docs"

[preprocessor.frntmtr]
command = "mdbook-frntmtr"
```

### Add content
Start the local server for development,
```
mdbook serve -o
```
Now modify or add contents in `src` folder. It will live update. Once you are happy with the
content you can deploy.

### Deploy to github pages (powershell version)
`deploy.ps1`
```
mdbook build
Set-Location gh-pages
git add .
git commit -m "deploy"
git push origin gh-pages
Set-Location ..
```

Now the site will be served by github pages.

