---
title: Using vscode
---

# {{ page.title }}


## Install vscode in ubuntu
First, update the packages index and install the dependencies by typing:
```bash
sudo apt update
sudo apt install software-properties-common apt-transport-https wget git
```
Next, import the Microsoft GPG key using the following wget command:
```bash
wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -
```

And enable the Visual Studio Code repository by typing:

```bash
sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"
```
Once the apt repository is enabled, install the latest version of Visual Studio Code with:
```bash
sudo apt update
sudo apt install code
```
Visual Studio Code has been installed on your Ubuntu desktop and you can start using it. Next, ubuntu specific Setup credential cache so that you don't have to keep typing origin usercode and password.

```bash
git config --global credential.helper store
```

## cpp setup

* <https://github.com/Microsoft/vscode-cpptools/blob/master/Documentation/LanguageServer/MinGW.md>
* <https://youtu.be/dSGW-DLMnUc>

To get include path
gcc -v -E -x c++ -


Debugging
g++ -ggdb <files>

To strip debugging symbol use -s option at release build.
g++ -ggdb -s <files>

Vscode requires xterm, so install, sudo apt install xterm

## Powershell setup

When powershell starts, it looks for startup script using the path 
stored in the `$profile` variable.

You can view and edit this file by typing `code $profile` in the powershell.
Probably simplest strategy here is to look for a script in the project root
folder called `.psrc.ps1` and if it exists, execute the script.

Add the following to the opened startup script,
```bash
$rc = ".psrc.ps1"
if (Test-Path -Path $rc -PathType Leaf) {
    & $rc
}
```
This way you can put project specific startup commands in `.psrc.ps1`.
One common usage of this is would be to add or modify path variable.
```bash
$env:Path = "SomeRandomPath";             (replaces existing path) 
$env:Path += ";SomeRandomPath"            (appends to existing path)
```

## Hard wrap for editing comments

Check [VS code to edit markdown
files](text-content.md#vs-code-to-edit-markdown-files) section to edit comments
in your source files.