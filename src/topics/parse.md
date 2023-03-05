---
title: Compilers/Parsers
---

# {{ page.title }}


## Earley v/s PEG parsers
Earley and PEG parsers are two different parsing algorithms with some
similarities and differences.

Earley parser is a general-purpose parsing algorithm that can parse any
context-free grammar. It uses a dynamic programming technique to predict, scan,
and complete input tokens to construct a parse tree. Earley parser can handle
ambiguous grammars and provides the most expressive power, but it can also be
slow for large grammars or inputs.

PEG (Parsing Expression Grammar) parser, on the other hand, is a top-down
parsing algorithm that matches input against a set of parsing expressions, which
are similar to regular expressions but with more features. PEG parser
prioritizes parsing rules and avoids ambiguities by always choosing the first
matching rule. PEG parsers can be fast and efficient for parsing structured
text, but they may not be suitable for complex grammars that require
backtracking or lookahead.

Here are some key differences between Earley and PEG parsers:

* Earley parser can handle arbitrary context-free grammars, whereas PEG parser
can only handle a subset of context-free grammars that are deterministic and
unambiguous. 
* Earley parser uses a bottom-up parsing approach, whereas PEG parser uses a
top-down parsing approach. 
* Earley parser can handle ambiguity by constructing multiple parse trees,
whereas PEG parser resolves ambiguity by prioritizing rules and not
backtracking.

In summary, Earley parser is more general and powerful but can be slower and
more memory-intensive than PEG parser. PEG parser is more limited in scope but
can be faster and easier to use for certain types of parsing tasks.

## More on parsing concepts

* [Context Free
  Grammars](https://brilliant.org/wiki/context-free-grammars/#:~:text=Context%2Dfree%20grammars%20are%20studied,automatically%20from%20context%2Dfree%20grammars.)
* [Earley Parser](https://loup-vaillant.fr/tutorials/earley-parsing/)


## Python based parsers
* [lark parser](https://github.com/lark-parser/lark)
## Java based parsers

* [Antlr4](https://www.antlr.org/)

> todo: vscode setup for antlr.


## Rust based parsers
* [Writing Interpreters in Rust: a
  Guide](https://rust-hosted-langs.github.io/book/)
* [Lisp interpreter in Rust](https://vishpat.github.io/lisp-rs/)
* [Wrapper for Exposing LLVM](https://github.com/TheDan64/inkwell)
* [LR(1) parser generator for Rust](https://github.com/lalrpop/lalrpop)
* Building a compiler in Rust videos, [part1](https://youtu.be/KZokxZrghCc) and
  [part2](https://youtu.be/BmsSu_WV9Ak)
* [Create Your Own Programming Language with
  Rust](https://createlang.rs/intro.html)
* [Rust Compiler Development Guide](https://rustc-dev-guide.rust-lang.org/)
* [PEG parser generator for Rust](https://github.com/kevinmehall/rust-peg)
