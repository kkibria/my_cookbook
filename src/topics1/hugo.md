---
title: Hugo stuff
---

# {{ page.title }}

## tutorial
* [Hugo - Static Site Generator | Tutorial](https://www.youtube.com/playlist?list=PLLAZ4kZ9dFpOnyRlyS-liKL5ReHDcj4G3).

## How to build Hugo Theme
* [Develop a Theme for Hugo](https://www.zeolearn.com/magazine/develop-a-theme-for-hugo)

## Adding tailwind
* [How to setup Tailwind with PurgeCSS and PostCSS](https://flaviocopes.com/tailwind-setup/)

## Install Hugo
First install google golang from their [website](https://golang.org/dl/) appropriate to your computer.

Then build ``hugo`` from source code using their github repo. 
```bash
mkdir $HOME/src
cd $HOME/src
git clone https://github.com/gohugoio/hugo.git
cd hugo
go install --tags extended
```

>If you are a Windows user, substitute the ``$HOME`` environment variable above with ``%USERPROFILE%``.

## Create a site for github pages
Go to github and create a repo. Get the git https clone URL.

Now create a hugo directory, 

```bash
mkdir <repo_name>
cd my repo
hugo new site .
git remote add origin <repo_clone_url>
git push -u origin master
```

This will create the scaffolding for hugo. Now we will get a theme. Go to the themes github page and get the clone url. 

```bash
cd themes
git clone <theme_clone_url>
cd ..
```
This wll create a directory with same name as the theme. Now copy the theme config to the our config.

```bash
cp themes/<theme_name>/exampleSite/config.toml .
```
Now edit the config.toml file and delete the ``themesdir`` as appropriate.

At this point you can add content, and do your own theme.  

> Need to play with themes.

# Render Math
[KaTex in Hugo](https://eankeen.github.io/blog/posts/render-latex-with-katex-in-hugo-blog/)

# Integrate slides capability
* [io-2012-slides](https://github.com/kkibria/io-2012-slides)
* [html5slides](https://github.com/kkibria/html5slides)

# Integrate PDF generation
* [Using pandoc](https://github.com/tanakh/pandoc-html5slide)
* [wkhtmltopdf, Convert HTML to PDF using Qt Webkit engine](https://github.com/wkhtmltopdf)
* [Weasyprint a python tool](https://weasyprint.readthedocs.io)