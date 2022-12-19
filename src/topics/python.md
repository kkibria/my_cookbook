---
title: Python
---

# {{ page.title }}

## Virtual environment for python

The venv module provides support for creating lightweight “virtual environments” with their own site directories, optionally isolated from system site directories. Each virtual environment has its own Python binary (which matches the version of the binary that was used to create this environment) and can have its own independent set of installed Python packages in its site directories.

1. First find out the python
path of the version of python you need to use, for example, ``C:/Python39/python.exe``.
2. Go to the root folder of the project and create virtual environment called ``env`` for the project.
```bash
cd my_proj
C:/Python39/python.exe -m venv .venv
```
3. Now activate the environment
```bash
./.venv/scripts/Activate
```

if you are developing a module then you need to have a separate staging area for the module so that we can develop and test,
```bash
mkdir lib_staging
```

Now we need to add this directory to the python module search path in a the file ``sitecustomize.py``
located in `.venv` directory,

`.venv/sitecustomize.py`
```python
import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../lib_staging")))
```

You can place your modules in lib_staging area as a git sub-project or however the way you want to
manage development. 
