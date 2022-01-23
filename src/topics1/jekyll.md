---
title: Jekyll stuff
---

# {{ page.title }}

## Jekyll filter

Filters are to be saved in ``_plugins`` directory.

```ruby
module Jekyll
  module BibFilter
    REGEXP = /\bjournal\b[\w\s= \{\-\.\,\(\)\-\:\+\'\/\..]+\},?/

    def bibFilter(bib)
      #filter text using regexp
      str = "#{bib}".gsub(REGEXP,'')
      #print filtered text
      "#{str}"
    end
 end
end

Liquid::Template.register_filter(Jekyll::BibFilter)
```
