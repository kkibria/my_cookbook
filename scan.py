import os
# pip install python-frontmatter
import frontmatter

os.chdir("src")
doclist = {}
for top, dirs, files in os.walk("."):
    for fn in files:
        if fn.endswith(".md"):
            doclist[os.path.join(top, fn)] = os.path.join(top, fn)

for doc in doclist:
    with open(doc, "r", encoding="utf8") as f:
        meta = frontmatter.load(f)
        if 'title' in meta:
            doclist[doc] = meta['title']
        else:
            doclist[doc] = doc

with open("doclist.md", "w") as f:
    for doc in doclist:
        print("[{}]({})".format(doclist[doc], doc), file=f)
