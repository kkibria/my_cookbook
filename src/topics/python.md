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

To deactivate python local environment
```bash
deactivate
```


## venv to generate requirements.txt

```bash
pip freeze > requirements.txt
```

To load all the libraries in virtual environment
```bash
pip install -r requirements.txt
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


## Range header in python
Large downloads are sometimes interrupted. However, a good HTTP server that
supports the Range header lets you resume the download from where it was
interrupted. The standard Python module urllib lets you access this
functionality almost seamlessly. You need to add only the needed header and
intercept the error code the server sends to confirm that it will respond with a
partial file:

```python
import urllib, os

class myURLOpener(urllib.FancyURLopener):
    """ Subclass to override error 206 (partial file being sent); okay for us """
    def http_error_206(self, url, fp, errcode, errmsg, headers, data=None):
        pass    # Ignore the expected "non-error" code

def getrest(dlFile, fromUrl, verbose=0):
    loop = 1
    existSize = 0
    myUrlclass = myURLOpener(  )
    if os.path.exists(dlFile):
        outputFile = open(dlFile,"ab")
        existSize = os.path.getsize(dlFile)
        # If the file exists, then download only the remainder
        myUrlclass.addheader("Range","bytes=%s-" % (existSize))
    else:
        outputFile = open(dlFile,"wb")

    webPage = myUrlclass.open(fromUrl)
    if verbose:
        for k, v in webPage.headers.items(  ):
            print k, "=", v

    # If we already have the whole file, there is no need to download it again
    numBytes = 0
    webSize = int(webPage.headers['Content-Length'])
    if webSize == existSize:
        if verbose: print "File (%s) was already downloaded from URL (%s)"%(
            dlFile, fromUrl)
    else:
        if verbose: print "Downloading %d more bytes" % (webSize-existSize)
        while 1:
            data = webPage.read(8192)
            if not data:
                break
            outputFile.write(data)
            numBytes = numBytes + len(data)

    webPage.close(  )
    outputFile.close(  )

    if verbose:
        print "downloaded", numBytes, "bytes from", webPage.url
    return numbytes
```
The HTTP Range header lets the web server know that you want only a certain
range of data to be downloaded, and this recipe takes advantage of this header.
Of course, the server needs to support the Range header, but since the header is
part of the HTTP 1.1 specification, it’s widely supported. This recipe has been
tested with Apache 1.3 as the server, but I expect no problems with other
reasonably modern servers.

The recipe lets `urllib.FancyURLopener` to do all the hard work of adding a new
header, as well as the normal handshaking. I had to subclass it to make it known
that the error 206 is not really an error in this case—so you can proceed
normally. I also do some extra checks to quit the download if I’ve already
downloaded the whole file.