---
title: Python CLI
---


# {{ page.title }}

## 1. Treat your tools as a single “studio toolbox” project

Instead of a bunch of one-off scripts scattered everywhere, I’d do:

```text
~/dev/videotools/
    pyproject.toml   ← uv project
    src/
        templates/
            my_template.txt
        videotools/
            __init__.py
            trim.py
            thumbs.py
            rename.py
            captions.py
            ...
```

* One repo, one `pyproject.toml`.
* Each `.py` inside `videotools` is a small CLI with a `main()` function.
* Version-controlled with git so you can clone it anywhere later.

## 2. Let `uv` own everything

Install `uv` if uv is not already installed,
```
pip3 install uv
```

Create project 
```
mkdir videotools
cd videotools
uv init --package
```

In `pyproject.toml`, define your console scripts:

```toml
[project]
name = "videotools"
version = "0.1.0"
# ...

[project.scripts]
studio-trim   = "videotools.trim:main"
studio-thumbs = "videotools.thumbs:main"
studio-rename = "videotools.rename:main"
```

Now your workflow on **any** machine becomes:

Inside `videotools`,
```bash
uv sync           # once per machine
uv run studio-trim ...
uv run studio-rename ...
```

## 3. Promote the important commands to “real” CLIs

Once a tool feels “stable” and you want it globally available:

Inside `videotools`,
```bash
uv tool install .   # or uv tool install --upgrade .
```

Now you can just:

```bash
studio-trim ...
studio-rename ...
```

This uses uv’s shim system, not system Python, so it stays clean but feels “native”.

If you later switch machines:

```bash
git clone videotools
cd videotools
uv tool install .
```

> Keep OS-specific stuff outside Python



## When you have data files
For instance you can have a template file you need to use

### Minimal example for your template loader:

Folder:

```
src/videotools/templates/my_template.txt
```

`pyproject.toml`:

```toml
[tool.setuptools.package-data]
"studio_tools" = ["templates/*.txt"]
```

Python:
In cli you can read the file, 
```python
from importlib.resources import files

def load_template(name="my_template.txt"):
    return files("studio_tools").joinpath(f"templates/{name}").read_text()
```
