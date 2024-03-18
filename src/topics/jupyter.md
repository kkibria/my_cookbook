---
title: Jupyter Notebook
---

# {{ page.title }}


## Running jupyter ipykernel locally

Create or open a new terminal for the project. Activate the
virtual environment.

### Get the jupyter installed

Install if you haven't already in your virtual environment.

```
pip install jupyter notebook
```

### Start the server

```
python -m jupyter notebook --no-browser
```
This will start the server. It will print the url of the
server with a random token, usually looks something like,
```
http://localhost:8888/tree?token=25e02d584db26b33f9171302057b32e19f6b32e6227b48d7
```
Copy the url.

### Connect a vscode notebook as client
There is many benefits using vscode as a client. Editing
source with intellisense is always beneficial. Follow the
steps for vscode to connect to the server.

1. Open the `.ipynb` file. This will ask you to select a
   kernel. Select an `existing kernel`.
1. It will ask for url, type url you copied, hit enter.
1. Type a display name so that you can identify later,
   project name is a good idea, hit enter.

It will connect and now you can use it. For other `.ipynb`
files in the same project you can select the same display
name.

### Debug mode
To run in debug mode, 
```
python -m jupyter notebook --debug --no-browser
```
This will produce lot of messages to diagnose problems.

## Custom visualization
* <https://www.stefaanlippens.net/jupyter-custom-d3-visualization.html>
