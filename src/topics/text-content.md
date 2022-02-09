---
title: Textual Contents
---

# {{ page.title }}

Textual content authoring in html is quite tedious and alternative authoring is 
preferred for web sites.
As such, [markdown](https://www.markdownguide.org/getting-started/) format has 
gathered popularity and is being used quite widely. This format is really just a simple
text file that can be produced by any text editor.

We will look into Content Management with markdown for web sites. These sites can contain
a collection of markdown files. Content Management allows them to be organized and navigated
in a useful way. They are transformed to html before they are rendered in a browser.

However, wherever you will host the content, their flow is something important to
understand clearly before you start. For instance, we can talk about github pages.

## Hosting Content in github pages
Github pages is quite popular for hosting as it is free and git
controlled. Although there are several options available for github pages,
there is a idea of separation of concern behind those options.
They implemented the idea by using two different git branches. 
One for textual content like markdown source files and the
other for generated html. Usually, the markdown source file lives in the default branch
`master` as we may edit those files more frequently. When we are ready to deploy our
content, the generated html will live in another branch, lets call it `gh-pages`.
github allows configuring the repository such that it's web server will check out html
from `gh-pages` branch and use.

### Scaffolding setup
Knowing this, we will need to scaffold our project in way so that it is convenient
to manage. As such, I will suggest one way that felt most convenient for me.

```text
my_project (folder)
   +-- .git (points to master branch)
   +-- .gitignore (set to ignore gh-pages folder)
   +-- (markdown contents)
   +-- deploy.sh (used for deploying generated content)
   +-- gh-pages (folder)
         +-- .git (points to gh-pages branch)
         +-- (generated html contents)
```

Using terminal, create a project folder and open it in vscode,

```bash
mkdir my_project
cd my_project
echo "gh-pages" > .gitignore
mkdir gh-pages

# This will create the master branch
git init
git add .
git commit -m "first commit" 

code .
```
### Create repository in github and publish the default branch
With vscode, in source control panel, create a github repository and 
push everything we have so far to github. 

If you are not using vscode, then you can manually create github repository
and push the `master` branch.

### Create and publish the html branch
Now we create the `gh-pages` branch.
Following bash script will do this,
```bash
URL=`git remote get-url origin`
pushd gh-pages
git clone $URL .

# create gh-pages branch
git checkout -b gh-pages

# clear everything came from master 
git branch -D master
git rm -r .
git commit -m "clearing master contents"

# push the branch to github
git push origin gh-pages
popd
```

Now the scaffolding is ready. We need to create a script that will deploy
generated content.

### Setup a deploy script
`deploy.sh`
```bash
command_to_generate_html
pushd gh-pages
git add .
git commit -m "deploy"
git push origin gh-pages
popd
```

If you are in windows, you can create equivalent powershell or command line scripts.

### Setup github to pick up the branch and folder
In github repo settings go to `github pages` and
setup branch to `gh-pages` and change folder to `docs` and note the public url 
they provide for the site.


### Create and publish the html branch (powershell version)
```
$url = git remote get-url origin
mkdir gh-pages
Set-Location gh-pages
git clone $url .
git checkout -b gh-pages
git rm -r .
git commit -m "clearing master contents"
git push origin gh-pages
git branch -D master
Set-Location ..
```

### Setup a deploy script (powershell version)
`deploy.ps1`
```
command_to_generate_html
Set-Location gh-pages
git add .
git commit -m "deploy"
git push origin gh-pages
Set-Location ..
```

## html to markdown conversion
* <github.com/suntong/html2md>. Its a tool written in golang. Works nice!