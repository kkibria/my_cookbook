# This repo consists of all my programming recipes

## gitbook articles that inspired me to create this book

* [https://medium.com/@rebeccapeltz/publish-your-book-online-with-gitbook-fc0ce9b7f12](https://medium.com/@rebeccapeltz/publish-your-book-online-with-gitbook-fc0ce9b7f12)

Later, I converted them to rust based mdbook format.

I used this gist to push generated html,
<https://gist.github.com/belohlavek/61dd16c08cd9c57a168408b9ac4121c2>

following will build and deploy
```
mdbook build
git add docs -f
git commit -m "gh-pages commit!"
git subtree split --prefix docs -b gh-pages
git push origin gh-pages
```