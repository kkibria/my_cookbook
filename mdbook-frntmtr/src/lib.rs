use std::collections::HashMap;
use mdbook::book::{Book, BookItem};
use mdbook::errors::{Result};
use mdbook::preprocess::{Preprocessor, PreprocessorContext};

pub struct Frntmtr;

impl Frntmtr {
    pub fn new() -> Frntmtr {
        Frntmtr
    }
}

impl Preprocessor for Frntmtr {
    fn name(&self) -> &str {
        "frntmtr"
    }

    fn run(&self, _ctx: &PreprocessorContext, mut book: Book) -> Result<Book> {
        let res = None;
        book.for_each_mut(|item: &mut BookItem| {
            if let Some(Err(_)) = res {
                return;
            }

            if let BookItem::Chapter(ref mut chapter) = *item {
                let content = chapter.content.clone();
                let mut meta: HashMap<&str, &str> = HashMap::new();
                let p = content.splitn(3, "---").collect::<Vec<&str>>();
                if p.len() == 3 {
                    for line in p[1].split('\n') {
                        let parts = line.splitn(2, ':').collect::<Vec<&str>>();
                        if parts.len() == 2 {
                            meta.insert(parts[0].trim(), parts[1].trim());
                        }
                    }
                    // update contents
                    chapter.content = String::from(p[2]);
                    for (key, val) in meta.iter() {
                        let mut keyvar: String = "{{ page.".to_owned();
                        keyvar.push_str(key);
                        keyvar.push_str(" }}");
                        chapter.content = chapter.content.replace(&keyvar.as_str(), val);
                    }

                    // update Title
                    if let Some(title)= meta.get("title") {
                        chapter.name = String::from(*title);
                    }
                }
            }
        });

        res.unwrap_or(Ok(())).map(|_| book)
    }

    fn supports_renderer(&self, renderer: &str) -> bool {
        renderer != "unknown"
    }
}

