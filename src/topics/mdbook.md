---
title: Mdbook
---

# {{ page.title }}

To do a new book, first you need to install `rust`.
## install mdbook and the front matter preprocessor
We support a subset of Yaml in front matter.

```bash
cargo install mdbook
cargo install --git https://github.com/kkibria/mdbook-frntmtr.git
```

## initialize a folder
mdbook init my_book
cd my_book
git init

## Hosting the content at github pages
For static sites github pages is a great choice. It is free and easy to use.
### setup `book.toml`
add following,
```
[book]
src = "src"

[build]
build-dir = "gh-pages/docs"

[preprocessor.frntmtr]
command = "mdbook-frntmtr"
```

### Setup the Project branches
`setup.ps1`
```
git push origin -d gh-pages
mkdir gh-pages
Set-Location gh-pages
$url = git remote get-url origin
git clone $url .
git checkout -b gh-pages
git rm -r .
git commit -m "clearing master contents"
git push origin gh-pages
git branch -D master
Set-Location ..
```

### Setup github to pick up the branch and folder
Publish your folder in github. In github repo settings go to `github pages` and
branch to `gh-pages` and change folder to `docs` and note the public url for the site.

### Add content
Start the local server for development,
```
mdbook serve -o
```
Now modify or add contents in `src` folder. It will live update. Once you are happy with the
content you can deploy.

### Deploy to github pages
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