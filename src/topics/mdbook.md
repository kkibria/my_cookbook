---
title: Build book with mdbook
---


To do a new book,
# install mdbook and the front matter preprocessor
We support a subset of Yaml in front matter.

```bash
cargo install mdbook
cargo install --git https://github.com/kkibria/mdbook-frntmtr.git
```

# initialize a folder
mdbook init my_book
cd my_book
git init

# setup `book.toml`
add following,
```
[book]
src = "src"

[build]
build-dir = "docs"

[preprocessor.frntmtr]
command = "mdbook-frntmtr"
```

# publish to github
publish your folder in github. in github rep settings go to github pages and
change folder to `docs` and note the public url.

# add content
start the server,
```
mdbook serve -o
```
Now modify or add contents in `src` folder. It will live update.