---
title: Translating Java to Go language
---

# {{ page.title }}

I have written large Java projects in the past, I have used proprietary
tools to turn them into native executable. The Go language provides a nice 
alternative with several important advantages. Now I am looking into some
automated way to convert may Java codes into Go with minimal manual 
conversions. LLVM, antlr and other tools I am looking at. This will be a 
work in progress for near future.

## Links

* <https://github.com/dglo/java2go>.
* <https://github.com/andrewarrow/traot>.
* <https://talks.golang.org/2015/go-for-java-programmers.slide>.
* <https://talks.golang.org/2015/go-for-java-programmers>.
* <https://talks.golang.org>.


## LLVM
* [A Brief Introduction to LLVM](https://youtu.be/a5-WaD8VV38).
* [Introduction to LLVM Building simple program analysis tools and instrumentation](https://youtu.be/VKIv_Bkp4pk).

## Polyglot
* [An open compiler front end framework for
building Java language extensions](https://research.cs.cornell.edu/polyglot/).

## GRAAL
* [How to Create a New JVM Language in Under an Hour by Oleg Šelajev](https://youtu.be/14hqB7Q0I58).

## Some info on go
* Default go library install path for a user in windows, ``%UserProfile%\go`` directory. Check [Windows special directories/shortcuts](https://superuser.com/questions/217504/is-there-a-list-of-windows-special-directories-shortcuts-like-temp) for similar paths in windows.
* Pigeon is a PEG based parser generator in go. We can use antlr java grammar from and convert in a Pigeon gammer file and use Pigeon to parse.
Check [Documentation](https://pkg.go.dev/github.com/mna/pigeon?tab=doc).

## Use antlr and keep everything in Java world to translate
## Use antlr to generate a java parser in with golang
I prefer this option. This seems to be the path of lease resistance for now.
* [Parsing with ANTLR 4 and Go](https://blog.gopheracademy.com/advent-2017/parsing-with-antlr4-and-go/).
The author has already created golang parsers for all available grammars in (Github)[https://github.com/bramp/antlr4-grammars.git]. 