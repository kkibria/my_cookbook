---
title: Java to Go language
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

## Manual porting
* [Lessons learned porting 50k loc from Java to Go](https://blog.kowalczyk.info/article/19f2fe97f06a47c3b1f118fd06851fad/lessons-learned-porting-50k-loc-from-java-to-go.html)

Edited excerpts from the article,
### String vs. string

In Java, `String` is an object
that really is a reference (a pointer). As a result, a string can be `null`.
In Go `string` is a value type.
It can't be `nil`, only empty.
> Idea: mechanically replace `null` with `""`.

### Errors vs. exceptions

Java uses exceptions to communicate errors.
Go returns values of `error`
interface.
> Idea: Change function signatures to return error values and propagate them up the call
stack.


### Generics

Go doesn't have Generics.
Porting generic APIs was the biggest
challenge.


Here's an example of a generic method in
Java:


```
public <T> T load(Class<T> clazz, String id) {
```

And the caller:


```
Foo foo = load(Foo.class, "id")
```

Two strategies can be useful.

One is to use `interface{}`,
which combines value and its type, similar to `object` in Java. This is not preferred
approach. While it works, operating on `interface{}` is clumsy for the user of the
library.


The other is to use reflection
and the above code was ported as:

```
func Load(result interface{}, id string) error
```

Reflection to query type of
`result` can be used to create values of that type from JSON document.


And the caller side:


```
var result *Foo
err := Load(&result, "id")
```

### Function overloading

Go doesn't have overloading.

Java:
```
void foo(int a, String b) {}
void foo(int a) { foo(a, null); }
```


In go write 2 functions instead:
```
func foo(a int) {}
func fooWithB(a int, b string) {}
```

When number of potential arguments was large
use a struct:

```
type FooArgs struct {
	A int
	B string
}
func foo(args *FooArgs) { }
```

### Inheritance

Go is not especially object-oriented and
doesn't have inheritance.
Simple cases of inheritance can be ported
with embedding.


```
class B : A { }
```

Can sometimes be ported as:


```
type A struct { }
type B struct {
	A
}
```

We've embedded `A` inside
`B`, so `B` inherit all the methods and fields of `A`.


It doesn't work for virtual functions.
There is no good way to directly port code
that uses virtual functions.
One option to emulate virtual function is to
use embedding of structs and function pointers. This essentially re-implements virtual table
that Java gives you for free as part of `object` implementation.

Another option is to write a stand-alone
function that dispatches the right function for a given type by using type switch.
### Interfaces

Both Java and Go have interfaces but they
are different things. You can create a Go interface type
that replicated Java interface.

Or just dont use interfaces, instead use exposed concrete structs in the API.

### Circular imports between packages

Java allows circular imports between
packages.
Go does not.
As a result you will not able to replicate the
package structure of Java code. Restructuring will be needed.

### Private, public, protected

Go simplified access by only having public vs.
private and scoping access to package level.

### Concurrency

Go's concurrency is simply the best and a
built-in race detector is of great help in repelling concurrency bugs.

Mechanical translation will require 
restructuring it to be more Go idiomatic.

### Fluent function chaining

Java has function chaining like this,

```
List<ReduceResult> results = session.query(User.class)
                        .groupBy("name")
                        .selectKey()
                        .selectCount()
                        .orderByDescending("count")
                        .ofType(ReduceResult.class)
                        .toList();
```

This only works in languages that
communicate errors via exceptions. When a function additionally returns an error, it's no longer
possible to chain it like that.


To replicate chaining in Go, 
"stateful error" approach would be useful:


```
type Query struct {
	err error
}

func (q *Query) WhereEquals(field string, val interface{}) *Query {
	if q.err != nil {
		return q
	}
	// logic that might set q.err
	return q
}

func (q *Query) GroupBy(field string) *Query {
if q.err != nil {
		return q
	}
	// logic that might set q.err
	return q
}

func (q *Query) Execute(result interface{}) error {
	if q.err != nil {
		return q.err
	}
	// do logic
}
```

This can be chained:


```
var result *Foo
err := NewQuery().WhereEquals("Name", "Frank").GroupBy("Age").Execute(&result)
```


### Go code is shorter

This is not so much a property of Java but
the culture which dictates what is considered an idiomatic code.


In Java setter and getter methods are
common. As a result, Java code:


```
class Foo {
	private int bar;

	public void setBar(int bar) {
		this.bar = bar;
	}

	public int getBar() {
		return this.bar;
	}
}
```

ends up in Go as:


```
type Foo struct {
	Bar int
}
```

