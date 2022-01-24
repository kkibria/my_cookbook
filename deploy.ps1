# git push origin -d gh-pages
# git branch -D gh-pages 
mdbook build
git add docs -f
git commit -m "gh-pages commit!"
git subtree split --prefix docs -b gh-pages
git push origin gh-pages
