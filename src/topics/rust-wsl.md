---
title: Rust setup in wsl
---


# {{ page.title }}

## rust with vscode
I installed the VS Code extension,
* rust-analyzer (for IDE support)

It provides lot of helpers, including
refactoring that makes it easy to write code. This also puts a command in
command pallet (ctrl+shift+p) called `rust analyzer: debug` which starts the
debug, without setting vscode debug configuration which is nice!

But then it started becoming frustrating.

## rust in wsl
Why do we need to even use wsl to build rust. It has to do with symbolic debug
with vscode. In windows the default is MSVC-style debugging using `cppvsdbg`
for debugging. Unfortunately with this many symbols were reported as "gotten
optimized away". Even when `cargo.toml` contains,
```
[profile.dev]
opt-level = 0           # no optimizations
debug = true            # emit debug info (level 2 by default)
```

So, the common recommendation I found was to use `lldb` for debug. So I
installed the VS Code extension,
* CodeLLDB (LLDB frontend)

Under windows, LLDB did give symbols that were missing before, but lldb was
running so slow that it was almost unusable. When I tried in wsl under vscode,
things were running very nicely. 

## Cross compile for windows msvc in wsl
But I wanted windows binary. Rust toolchain can compile for windows `msvc`
target, but I needed to use `msvc` linker which lives in windows side. In order
to use the linker in the cargo flow, I followed instructions from
<https://github.com/strickczq/msvc-wsl-rust> for setting up the linker. In my
case I use vscode. So I downloaded Build Tools for Visual Studio and then
installed `C++ Build Tools` workload.

This setup works great.
