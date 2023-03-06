# This repo consists of all my programming recipes

Read the [cookbook](https://kkibria.github.io/my_cookbook).

## gitbook articles that inspired me to create this book

* [https://medium.com/@rebeccapeltz/publish-your-book-online-with-gitbook-fc0ce9b7f12](https://medium.com/@rebeccapeltz/publish-your-book-online-with-gitbook-fc0ce9b7f12)

Later, I converted them to rust based mdbook format.

I used this gist to push generated html,
<https://gist.github.com/belohlavek/61dd16c08cd9c57a168408b9ac4121c2>


## Developing content

```
mdbook serve --out
```
will run mdbook server locally and live update with changes.

### adding a new document
Add the new file in `SUMMARY.md` while mdbook server is running.
mdbook will create the file. Now go edit the file to add the frontmatter and title.


## deploying
following will build and deploy

`deploy.ps1`
```powershell
mdbook build
git add docs -f
git add .
git commit -m "deploy commit!"
git push origin master
```

