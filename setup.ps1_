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
