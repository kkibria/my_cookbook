---
title: Peg Parsers
---

# {{ page.title }}

## PEG and Packrat

A Packrat parser is a memoizing variant of PEG that can avoid redundant
computation by caching intermediate parsing results. This memoization helps to
handle backtracking efficiently and can also improve the performance of parsing
long input sequences.

## Articles
* Wikipedia [Parsing expression
  grammar](https://en.wikipedia.org/wiki/Parsing_expression_grammar).
* [PEG Parsing Series
  Overview](https://medium.com/@gvanrossum_83706/peg-parsing-series-de5d41b2ed60),
  YouTube ["Writing a PEG parser for fun and profit" - Guido van Rossum (North
  Bay Python 2019)](https://youtu.be/QppWTvh7_sI).
* [Packrat Parsing](https://bford.info/packrat/).

## Typescript
* [tsPEG - A Fully Featured TypeScript Parser
  Generator](https://vey.ie/2019/11/27/tsPEG.html), GitHub
  [Source](https://github.com/EoinDavey/tsPEG).

## Javascript
* <https://pegjs.org/>

