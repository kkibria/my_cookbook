---
title: Decorator like behavior
---


# {{ page.title }}

* <https://users.rust-lang.org/t/are-derive-macros-in-rust-similar-to-decorators-in-python/46686/4>



## Rust Macros

Rust macros can programmatically alter the source to to add additional behavior
like decorators do. There are two types we can mention in this context.

-   `#[derive(SomeName)]` is an attribute that can only be applied to
    `struct/enum/union` type definitions, and it then applies the `SomeName`
    procedural macro (called a _derive_ macro) to the _source code_ that makes the
    type definition. The macro can then output / spit / emit its own forged source
    code, **that will be emitted _alongside_ the original type definition source,
    which remains unaffected by the macro**.

-   `#[some_name]` is an attribute that can be applied to any Rust item (and in the
    future, even Rust expressions and statements (and maybe even types and
    patterns)), including functions. It applies the procedural macro `some_name` to
    the _source code_ that makes the item definition. That **input source code is
    not re-emitted**, so the attribute macro has all the power to decide what gets
    emitted instead.


Their mechanisms are very different. But in practice, you can achieve very
similar things with both.
The main difference being using some form of global state; the Python
decorator, by virtue of just having to be a classic Python callable, can hold
some internal state; whereas the procedural macros are executed within a
special compilation pass, and the order of the different calls, or even the
amount of times the macro may be called is not guaranteed. Ideally, procedural
macros should hold no state. That's why crates providing procedural macros
also provide other stuff, to handle that shared state.

## Examples / comparison

#### 0 - hold internal state for Python function calls (scoped "globals"):

```python
def with_state(f):
    return f()

# Usage:
@with_state
def add_x():
    x = 0
    def add_x(y):
        nonlocal x
        return x + y
    return add_x

x = 27  # Internal scope is untouchable
assert add_x(42) == 42
```

#### 1 - Memoization

  - **Python**

    ```python
    from contextlib import suppress
    from functools import wraps
    
    def memoized(f):
        cache = {}
        @wraps(f)
        def wrapped_f(*args):  # kwargs not supported for simplicity
            nonlocal cache
            with suppress(KeyError):
                return cache[args]
            cache[args] = ret = f(*args)
            return ret
        return wrapped_f
    
    @memoized
    def fibo(n):
        """Naive recursive implementation."""
        return n if n <= 1 else fibo(n - 1) + fibo(n - 2)
    
    print(fibo(80))  # Would never compute unless cached
    ```

  - **Rust**
    (using a `macro_rules!` macro with [`#[macro_rules_attribute]`](https://docs.rs/macro_rules_attribute))

    ```rust
    #[macro_use]
    extern crate macro_rules_attribute;
    
    macro_rules! memoize {(
        $( #[$attr:meta] )*
        $pub:vis
        fn $fname:ident (
            $( $arg_name:ident : $ArgTy:ty ),* $(,)?
        ) $( -> $RetTy:ty)?
        $body:block
    ) => (
        $( #[$attr] )*
        #[allow(unused_parens)]
        $pub
        fn $fname (
            $( $arg_name : $ArgTy ),*
        ) $(-> $RetTy)?
        {
            /// Re-emit the original function definition, but as a scoped helper
            $( #[$attr] )*
            fn __original_func__ (
                $($arg_name: $ArgTy),*
            ) $(-> $RetTy)?
            $body
    
            ::std::thread_local! {
                static CACHE
                    : ::std::cell::RefCell<
                        ::std::collections::HashMap<
                            ( $($ArgTy ,)* ),
                            ( $($RetTy)? ),
                        >
                    >
                    = ::std::default::Default::default()
                ;
            }
            CACHE.with(|cache| {
                let args = ($($arg_name ,)*);
                if let Some(value) = cache.borrow().get(&args) {
                    return value.clone();
                }
                let ($($arg_name ,)*) = args.clone();
                let value = __original_func__($($arg_name),*);
                cache.borrow_mut().insert(args, ::std::clone::Clone::clone(&value));
                value
            })
        }
    )}
    
    #[macro_rules_attribute(memoize!)]
    fn fibo (n: u64) -> u64
    {
        dbg!(n);
        if n <= 1 { n } else { fibo(n - 1) + fibo(n - 2) }
    }
    
    fn main ()
    {
        dbg!(fibo(5));
        dbg!(fibo(5));
    }
    ```


#### 2 - Tracing function calls

  - **Python**

    ```python
    from functools import wraps
    
    @with_state
    def traced():
        depth = 0
        def traced(f):
            @wraps(f)
            def wrapped_f(*args, **kwargs):
                nonlocal depth
                print("{pad}{fname}({args}{sep}{kwargs})".format(
                    pad = "    " * depth,
                    fname = f.__name__,
                    args = ", ".join(map(repr, args)),
                    sep = ", " if args and kwargs else "",
                    kwargs = ", ".join("{} = {!r}".format(k, v) for k, v in kwargs.items()),
                ))
                depth += 1
                try:
                    ret = f(*args, **kwargs)
                except Exception as e:
                    depth -= 1
                    print("{}raised {!r}".format("    " * depth, e))
                    raise
                else:
                    depth -= 1
                    print("{}= {!r}".format("    " * depth, ret))
                    return ret
            return wrapped_f
        return traced
    ```


      - so that:

        ```python
        @traced
        def fibo(n):
            return n if n <= 1 else fibo(n - 1) + fibo(n - 2)
    
        fibo(4)
        ```

        outputs:

        ```text
        fibo(4)
            fibo(3)
                fibo(2)
                    fibo(1)
                    = 1
                    fibo(0)
                    = 0
                = 1
                fibo(1)
                = 1
            = 2
            fibo(2)
                fibo(1)
                = 1
                fibo(0)
                = 0
            = 1
        = 3
        ```

  - **Rust**
    (Actual attribute macro)