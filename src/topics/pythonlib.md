---
title: Python library
---

# {{ page.title }}

## Refactoring library
Often time we have to move library functions from files to
files to reorganize. just to make sure they all functions
are same between old set of files to new set of files
following can be used,

`compare_mods.py`
```python
import importlib

a = '''
chill_test
'''

b = '''
src.test.libtest1
books.book1.ch7
books.book1.ch8
books.book1.ch2_4
books.book1.ch5_6
experiment
'''

def funcs(mods: str) -> set:
    l = mods.strip().split()
    mods = map(importlib.import_module, l)
    dirs = map(dir, mods)
    return set([i for d in dirs for i in d])

sa = funcs(a)
sb = funcs(b)
print(sa)
print(sb)
print (sa ^ sb)
```
where a is the list of old python modules and b is the new
ones.

## Python object
it is easy to create an object and attributes.
```python
obj = lambda: None
obj.exclude = 'hello'
```

### Turning a dict to object
```python
attr = {"a" : "b", "c": "d", "e": "f"}
obj = lambda: None
obj.__dict__ = attr

print(obj.a)
print(obj.c)
print(obj.e)
```


