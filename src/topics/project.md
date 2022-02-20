---
title: Project in github or gitlab
---

# {{ page.title }}


## github
Create a new repository.

Create a new folder ``prj_dir`` and ``README.md`` file,
```bash
cd prj_dir
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin master
```

Push an existing folder maintained with git,
```bash
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin master
```

> Note: vscode now provides gui interface to create a repository in github directly
> from a local repo with push of a button.

## gitlab
Create a local project directory. In this example we will use ``prj_dir` as the directory name. Now populate the ``prj_dir`` with all the files and folders that will be used for initial commit.

```bash
cd prj_dir
git init
git add .
git commit -m "initial commit"
git push --set-upstream https://gitlab.com/USERNAME/REPOSITORY.git master
git remote add origin https://gitlab.com/USERNAME/REPOSITORY.git
git pull
```

I created a convenience npm module that will execute the above commands without typing them individually. You can clone from [https://gitlab.com/kkibria/gitlab.git](https://gitlab.com/kkibria/gitlab.git), build the npm module and install.

## Changing a remote's URL
The ``git remote set-url`` command changes an existing remote repository URL.
```bash
$ git remote -v
> origin  https://github.com/USERNAME/REPOSITORY1.git (fetch)
> origin  https://github.com/USERNAME/REPOSITORY1.git (push)
# Change remote's URL,
$ git remote set-url origin https://github.com/USERNAME/REPOSITORY2.git
# Verify
$ git remote -v
> origin  https://github.com/USERNAME/REPOSITORY2.git (fetch)
> origin  https://github.com/USERNAME/REPOSITORY2.git (push)
```

## Setting up your own git server
* <https://medium.com/@kevalpatel2106/create-your-own-git-server-using-raspberry-pi-and-gitlab-f64475901a66>
* [Install self-managed GitLab](https://about.gitlab.com/install/#raspberry-pi-os). They have a version for raspberry pi.


## Git Workflow
* <https://musescore.org/en/handbook/developers-handbook/finding-your-way-around/git-workflow>.
Describes git workflow for their project,
but a great page to consider for any project using git.


## Remove tags
little python script will create a powershell command,
```python
import subprocess
import re

proc = subprocess.Popen('git tag', stdout=subprocess.PIPE)
tags = proc.stdout.read().decode("utf-8").split()

file1 = open("tagremove.ps1","w")
for tag in tags:
    found = re.match(r"^v\d+", tag)
    if found:
        continue
    file1.write("git tag -d {tag}\ngit push --delete origin {tag}\n".format(tag=tag))
file1.close()
```

## Autogenerate binaries using github action

Github action yaml file that builds binary on a tag push.

```yaml
# This workflow will install Python dependencies, run tests and lint with a single version of Python
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-python-with-github-actions

name: Binary release

on:
  push:
    tags:
      - 'v*' # Push events to matching v*, i.e. v1.0, v20.15.10

jobs:
  build-windows:
    runs-on: windows-latest

    steps:
    - uses: actions/checkout@v2
    - name: Set up Python 3.9
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install wxPython
        pip install pyinstaller

    - name: build executable
      run: |
        pyinstaller -F --add-data "./source/datafile.txt;." "./source/myapp.py"

    - uses: actions/upload-artifact@v2
      with:
        name: myapp-windows
        path: dist/

  build-macos:
    runs-on: macos-latest

    steps:
    - uses: actions/checkout@v2
    - name: Set up Python 3.9
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install wxPython
        pip install pyinstaller

    - name: build executable
      run: |
        pyinstaller -F --add-data "./source/datafile.txt:." "./source/myapp.py"

    - uses: actions/upload-artifact@v2
      with:
        name: myapp-macos
        path: dist/

  build-ubuntu:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Set up Python 3.9
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        sudo apt-get install build-essential libgtk-3-dev
        URL=https://extras.wxpython.org/wxPython4/extras/linux/gtk3/ubuntu-20.04
        python -m pip install --upgrade pip
        pip install -U -f $URL wxPython
        pip install pyinstaller

    - name: build executable
      run: |
        pyinstaller -F --add-data "./source/datafile.txt:." "./source/myapp.py"

    - uses: actions/upload-artifact@v2
      with:
        name: myapp-ubuntu
        path: dist/
        
  create-release:
    needs: [build-windows, build-macos, build-ubuntu]
    runs-on: windows-latest

    steps:
    - name: Create Release
      id: create_release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: Release ${{ github.ref }}
        draft: false
        prerelease: false

    - name: get windows artifact
      uses: actions/download-artifact@v2
      with:
        name: myapp-windows
        path: windows/

    - uses: papeloto/action-zip@v1
      with:
        files: windows/
        dest: myapp-windows-exe.zip

    - name: Upload Windows Asset
      uses: actions/upload-release-asset@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        upload_url: ${{ steps.create_release.outputs.upload_url }} # This pulls from the CREATE RELEASE step above, referencing it's ID to get its outputs object, which include a `upload_url`. See this blog post for more info: https://jasonet.co/posts/new-features-of-github-actions/#passing-data-to-future-steps 
        asset_path: ./myapp-windows-exe.zip
        asset_name: windows-exe.zip
        asset_content_type: application/zip

    - name: get macos artifact
      uses: actions/download-artifact@v2
      with:
        name: myapp-macos
        path: macos/

    - uses: papeloto/action-zip@v1
      with:
        files: macos/
        dest: myapp-macos-exe.zip

    - name: Upload macos Asset
      uses: actions/upload-release-asset@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        upload_url: ${{ steps.create_release.outputs.upload_url }} 
        asset_path: ./myapp-macos-exe.zip
        asset_name: macos-exe.zip
        asset_content_type: application/zip

    - name: get ubuntu artifact
      uses: actions/download-artifact@v2
      with:
        name: myapp-ubuntu
        path: ubuntu/

    - uses: papeloto/action-zip@v1
      with:
        files: ubuntu/
        dest: myapp-ubuntu-exe.zip

    - name: Upload ubuntu Asset
      uses: actions/upload-release-asset@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        upload_url: ${{ steps.create_release.outputs.upload_url }} 
        asset_path: ./myapp-ubuntu-exe.zip
        asset_name: ubuntu-exe.zip
        asset_content_type: application/zip
```

## Remove all local and remote tags
```
# Clear All local tags
git tag -d $(git tag -l)

# Fetch remote All tags
git fetch

# Delete All remote tags
git push origin --delete $(git tag -l)

# Clear All local tags again
git tag -d $(git tag -l)
```

## create and push a specific tag
```
# create a tag
git tag test123

# list all local tags
git tag -l     

# push a specific tag to remote named 'origin'
git push origin tag test123
```