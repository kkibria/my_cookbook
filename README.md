# This repo consists of all my programming recipes

Read the [cookbook](https://kkibria.github.io/my_cookbook).

Read this [page](https://kkibria.github.io/my_cookbook/topics/text-content.html)
to understand how to do initial setup for deployment after you clone this repo.

## Developing content
make sure rust is up to date
```
rustup update
```

install mdbook
```
cargo install mdbook
```

install frontmatter processor
```
cargo install --git https://github.com/kkibria/mdbook-frntmtr.git
```

If you have all of the above set up, run.
```
mdbook serve --open
```
will run mdbook server locally and live update with changes.

### adding a new document
Add the new file in `SUMMARY.md` while mdbook server is running.
mdbook will create the file. Now go edit the file to add the frontmatter and title.


## deploying setup 
This is one time setup after cloning the repo. 
Copy `setup.ps1_` to `temp.ps1` and run `temp.ps1`. It might give
an error message, 'fatal: couldn't find remote ref gh-pages'. Not to worry. Delete `temp.ps1`.

## deploy
run `deploy.ps1`


## fix frontmatter
```
python .\fixfm.py .\src\topics\ .\fm.template
```


Some thoughts:

I love rust mdbook, however I feel it lacks some features. So I am contemplating two possibilities.
a. Write a plugin that can add this feature.
b. If adding the feature using plugin is too complex, then fork mdbook and make my own version of mdbook with the feature.

here are the features I am thinking of right now. 
1. I like to support frontmatter in the markdown files. The variables from frontmatter will be applied to the document templating.
2. If I open the mdbook locally using 'mdbook serve --open', then "SUMMARY.md" 
   file is live scanned and any relative link added there, mdbook will create a corresponding file if it doesn't not exit.
3. For any new markdown file it creates I like them being created from some template file.
4. When a file is markdown is created, it should look like,
```
---
title: Textual Contents
---

# {{ page.title }}

(stuff picked up from template) Textual content authoring in html is quite tedious and alternative authoring is
preferred for web sites. As such, blah blah.....
```
5. In the document if I change the title in the front matter, it should be auto-reflected by updating links in "SUMMARY.md"
6. its tagging is currently convoluted feels like. but its have tags and clicking tags should automatically open some tag search sidebar that presents
   list of documents matching the tag anf hyperlinks mush like how SUMMARY.md is used.  