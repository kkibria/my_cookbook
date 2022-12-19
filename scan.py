
# This checks for inconsistencies

import os
# pip install python-frontmatter
import frontmatter
import regex as re
import pathlib

def normalize (fpn):
    p = pathlib.Path(fpn)
    return str(pathlib.PurePosixPath(p))

os.chdir("src")
doclist = {}
sumlist = {}

for top, dirs, files in os.walk("."):
    for fn in files:
        if fn.endswith(".md"):
            fn = normalize(os.path.join(top, fn))
            if fn in ["doclist.md", "SUMMARY.md"]:
                continue
            doclist[fn] = fn

for doc in doclist:
    with open(doc, "r", encoding="utf8") as f:
        meta = frontmatter.load(f)
        if 'title' in meta:
            doclist[doc] = meta['title']
        else:
            doclist[doc] = doc

with open("SUMMARY.md", "r") as f:
    lines = f.readlines()

pattern = re.compile(r'\[([^][]+)\](\(((?:[^()]+|(?2))+)\))')
for line in lines:
    m = pattern.search(line)
    if m: 
        description, _, url = m.groups()
        doc = normalize(url)
        sumlist[doc] = description

with open("doclist.md", "w") as f:
    for doc in doclist:
        print("[{}]({})".format(doclist[doc], doc), file=f)
        if doc not in sumlist:
            print(f"Missing {doc} in SUMMARY.md")
        else:
            if doclist[doc] != sumlist[doc]:            
                print(f"Title mismatch for {doc} in SUMMARY.md")

print ("# doclist.md has been updated with list of current titles.")