---
title: Translating Python to Javascript language
---

# {{ page.title }}

I have written large Python projects in the past, looking into converting some to javascript.

## Links
* <https://www.transcrypt.org/>


## virtual environment for python

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
## setup transcrypt

We have to use virtual environment for ``transcrypt`` to function correctly.

4. Now install ``transcrypt``
```bash
pip install transcrypt
```
## converting to javascript
have a python file
``test-trans.py``
```python
import os
from pathlib import Path

inifile = os.path.join(Path.home(), ".imagesel", "config.ini")
print(inifile)
```

now test it with python
```
py test-trans.py
```

in order to use os and pathlib we need to replace them with equivalent javascript calls
using stubs. we will create stubs in dir called ``stubs``
these are special python files that can use javascript libraries.

``os.py``
```python
p = require('path')

class path:
    def join(*args):
        return p.join(*args)
```

``pathlib.py``
```python
os = require ('os')

class Path:
    def home():
        return os.homedir()
```

Now we can convert them to javascript 
```bash
python -m transcrypt -b -n ..\test-trans.py
```
This will produce a directory called ``__target__`` with all the javascript files in it.

## converting to a node bundle

Now initialize node environment and install rollup

```bash
npm init // accept defaults
npm i rollup
```

Next we need to use rollup to bundle them for node,
```bash
node_modules\.bin\rollup .\__target__\test-trans.js --o bundle.js --f cjs
```

Now test it with node
```
node bundle.js
```
We get the same result.

deactivate python local environment
```bash
deactivate
```

## venv to generate requirements.txt

```bash
pip freeze > requirements.txt
```

## some python request module issues with SSL 

* <https://stackoverflow.com/questions/51925384/unable-to-get-local-issuer-certificate-when-using-requests-in-python>

Sometimes, when you are behind a company proxy, it replaces the certificate chain with the ones of Proxy. Adding the certificates in cacert.pem used by certifi should solve the issue.

  1. Find the path where cacert.pem is located -

> Install certifi, if you don't have. Command: `pip install certifi`

    import certifi
    certifi.where()
    C:\\Users\\[UserID]\\AppData\\Local\\Programs\\Python\\Python37-32\\lib\\site-packages\\certifi\\cacert.pem


  2. Open the URL (or base URL) on a browser. Browser will download the certificates of chain of trust from the URL.
 The chain looks like,

    Root Authority (you probably already have this) 
    +-- Local Authority (might be missing)
        +-- Site certificate (you don't need this)

  3. You can save the whole chain as ``.p7b`` file, which can be opened in windows explorer. Or you can just save the Local Authority as Base64 encoded ``.cer`` files.

  4. Now open the cacert.pem in a notepad and just add every downloaded certificate contents (`---Begin Certificate--- *** ---End Certificate---`) at the end.

 
## python image manipulation as they are downloaded

```python
import os
import io
import requests
from PIL import Image
import tempfile

buffer = tempfile.SpooledTemporaryFile(max_size=1e9)
r = requests.get(img_url, stream=True)
if r.status_code == 200:
    downloaded = 0
    filesize = int(r.headers['content-length'])
    for chunk in r.iter_content(chunk_size=1024):
        downloaded += len(chunk)
        buffer.write(chunk)
        print(downloaded/filesize)
    buffer.seek(0)
    i = Image.open(io.BytesIO(buffer.read()))
    i.save(os.path.join(out_dir, 'image.jpg'), quality=85)
buffer.close()
```

* <https://stackoverflow.com/questions/37751877/downloading-image-with-pil-and-requests>
* <https://www.kite.com/python/answers/how-to-read-an-image-data-from-a-url-in-python>