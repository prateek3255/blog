---
title: A JavaScript Developer's Guide to Go
date: 2025-05-22
updatedAt: 2025-05-22
permalink: /blog/guide-to-go-for-javascript-developers/
templateEngineOverride: njk,md
description: A guide for JavaScript developers for getting started with Go, by covering and comparing the fundamental concepts of both languages.
thumbnail: guide-to-go-for-javascript-developers.png
author: Prateek Surana
tags:
  - go
  - javascript
---


After spending five years as a JavaScript developer building both frontend and backend systems, I spent the last year transitioning to Go for server-side code. During that time I couldn't help but notice the differences between syntax, fundamentals, practices, and runtime environments between the languages and the effects they had on actual runtime performance and developer productivity.

Go has also recently captured the JavaScript community's attention when Microsoft announced their [official TypeScript compiler port to Go](https://devblogs.microsoft.com/typescript/typescript-native-port/), promising speeds up to 10× faster than the current compiler.

So the purpose of this blog is to serve as a starting point for JavaScript developers curious about or wanting to learn more about the language. I'll try cover the essential fundamental concepts of Go, while comparing it to similar concepts in JavaScript/TypeScript, and sharing some gotchas that my JavaScript wired brain had to adjust to.

This blog is split into the following sections exploring and comparing the different aspects of the languages:

1. {% slugifiedLink "The Basics" %}
    1. {% slugifiedLink "Compilation and Execution" %}
    2. {% slugifiedLink "Packages" %}
    3. {% slugifiedLink "Variables" %}
    4. {% slugifiedLink "Structs And Types" %}
    5. {% slugifiedLink "Zero values" %}
    6. {% slugifiedLink "Pointers" %}
    7. {% slugifiedLink "Functions" %}
2. {% slugifiedLink "Arrays and Slices" %}
3. {% slugifiedLink "Maps" %}
4. {% slugifiedLink "Comparisons" %}
5. {% slugifiedLink "Methods and Interfaces" %}
6. {% slugifiedLink "Error Handling" %}
7. {% slugifiedLink "Concurrency" %}
8. {% slugifiedLink "Formatting and Linting" %}
9. {% slugifiedLink "Conclusion" %}

JavaScript has multiple runtimes, to avoid confusion I will specifically be comparing Go with Node.js as Go is primarily used for backend, and also since TypeScript is the norm these days I would be also be mostly using examples from it.

{% headingWithLink "The Basics" %}

{% headingWithLink "Compilation and Execution","h3","Compilation and Execution" %}

The first fundamental difference you need to understand is how the code is executed. Go is a compiled language so it needs to be compiled first to a native machine code binary which can then be executed, whereas JavaScript is interpreted and hence is executed without a compilation step (there are certain optimizations that v8 does with JIT like [identifying hot paths and generating machine code](https://sujeet.pro/post/deep-dives/v8-internals/), but that is not relevant to the scope of this article). 

For example with Node.js you can create a JavaScript file and then run it directly using the `node` CLI.

```jsx
// hello.js

console.log("Hello, World!")
```

And then you can directly execute it:

```bash
> node hello.js
	Hello, World!
```

To get started with Go you would need to download the binary release of Go for your system from [https://go.dev/dl/](https://go.dev/dl/). 

This is what a hello world program looks like in Go:

```go
// hello.go

package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

{% playgroundLink "https://goplay.tools/snippet/VRAOHHr3xO4" %}

(We'll cover details of the syntax used above in the upcoming sections)

To run this program, you would need to build it and then execute the resulting binary:

```bash
> go build hello.go

> ./hello
  Hello, World!
```

Or you can just use the `run` command which compiles and executes in one step:

```bash
> go run hello.go
  Hello, World!
```

Since Go compiles to native machine code you would need to compile different binaries for different architectures if you want your code to be executable on different platforms, fortunately Go makes it fairly straightforward with the [`GOOS` and `GOARCH` environment variables](https://www.digitalocean.com/community/tutorials/building-go-applications-for-different-operating-systems-and-architectures).

{% headingWithLink "Packages","h3","Packages" %}

Every Go program is made up of packages and starts by running the main package, within the main package there must be a function called `main` which then serves as the entry point for the program, and the program exits when the main function returns.

```go
// main.go

package main

import (
	"fmt"
)

func main() {
	fmt.Println("Hello world")
}
```
{% playgroundLink "https://goplay.tools/snippet/VRAOHHr3xO4" %}

{% callout %}

The rest of the examples in this blog, the `package main` and `func main()` might be omitted for brevity, you can use the playground links next to the snippets to run the examples.

{% endcallout %}

Packages in Go are also similar to how we have Modules in JavaScript, they are a collection of related source files. You can create and import packages similar to how we import modules in JavaScript. In the above snippet as well we import the `fmt` package from Go's standard library.

{% callout %}

`fmt` (short for format) is one of the core packages of Go. It is used for formatted I/O, inspired by C’s `printf` and `scanf`. The `Println` function above prints, arguments in the default format with a newline at the end. 

And throughout this article you’ll also see `Printf` that prints formatted output using default specifiers (you can read more about the available specifiers in the [official docs](https://pkg.go.dev/fmt)).

{% endcallout %}

Similar to `package.json` Go programs have a `go.mod` that serves as a configuration file for a Go modules and contains information about the module and its dependencies. A typical Go module file looks like this:

```go
module myproject

go 1.16

require (
    github.com/gin-gonic/gin v1.7.4
    golang.org/x/text v0.3.7
)
```

The first line declares the module's import path, which uniquely identifies the module, the second line is the minimum version of Go required for the module and lastly we have all the direct and indirect dependencies with their specific versions.

To create a package in Go you would need to create a new directory with the name of the package and then all the Go files in that directory would be a part of that package by declaring the package name at the top of the file.

And the way you export stuff from your packages is also interesting in Go. In JavaScript if you’re using ESModules we use the `export` keyword to make something available outside the module. But in Go a name is exported if it begins with a capital letter.

The following example demonstrates whatever we discussed above:

```go
// go.mod

module myproject

go 1.24

// main.go

package main

import (
	"fmt"
	"myproject/fib"
)

func main() {
	sequence := fib.FibonacciSequence(10)
	
	// This would result in an error
	// firstFibonacciNumber := fib.fibonacci(1)
	
	fmt.Println("Fibonacci sequence of first 10 numbers:")
	fmt.Println(sequence)
}

// fib/fib.go

package fib

// Since this function doesn't start with a capital letter it isn't exported
func fibonacci(n int) int {
    if n <= 0 {
        return 0
    }
    if n == 1 {
        return 1
    }
    
    return fibonacci(n-1) + fibonacci(n-2)
}

// This function is exported since it starts with a capital letter
func FibonacciSequence(n int) []int {
    sequence := make([]int, n)
    
    for i := 0; i < n; i++ {
        sequence[i] = fibonacci(i)
    }
    
    return sequence
}
```
{% playgroundLink "https://goplay.tools/snippet/N_t92lh9TVZ" %}

In the above example we created another package called `fib` by creating a directory with the same name. And also if you look carefully, only the `FibonacciSequence` function is exported since it starts with a capital letter and hence is accesible outside the package.


{% headingWithLink "Variables","h3","Variables" %}

Go is statically typed, i.e. you declare (or infer) the type of every variable and these types are checked during the compilation phase itself. Unlike JavaScript where variables can hold any type of value, and are only evaluated when the program is running.

So for example, in JavaScript you can get away with doing stuff like this:

```jsx
let x = 5;
let y = 2.5;
let sum = x + y;     // Works fine: 7.5
let weird = x + "2"; // Also "works": "52" (but might not be what you want!)
```

But with Go, you need to be very explicit about types, you can find all the [primitive types here](https://go.dev/tour/basics/11), `var` is the equivalent of `let` of modern JavaScript:

```jsx
var x int = 5 
// or x := 5 which is a short assignment statement 
// can be used in place of a var declaration with implicit type.

var y float64 = 2.5

// This won't compile:
sum := x + y  // Error: mismatched types int and float64

// Must explicitly convert:
sum := float64(x) + y
```
{% playgroundLink "https://goplay.tools/snippet/pcBQ1yzifU2" %}

{% callout %}

I need to mention that TypeScript does help solve the type problem, but its still just a syntactic superset of JavaScript, that eventually compiles to JavaScript itself.

{% endcallout %}

Similar to `const` in JavaScript, Go also has `const` which is used for declaring constants, the are declared similar to vars but using const keyword:

```go
const pi float64 = 3.14

// Or declare without type for direct inference
const s = "hello"
```

But unlike JavaScript `const` in Go can only be used with primitive values (character, string, boolean, or numeric values), and not with the other complex types.

{% callout %}

In Go declaring a variable and not using it is not just a warning like some linters will give in case of JavaScript or TypeScript but a compilation error instead.

{% endcallout %}

{% headingWithLink "Structs And Types","h3","Structs And Types" %}

Just like you can represent a collection of fields using JavaScript objects, you can use structs in Go to represent a collection of fields.

```go
type Person struct {
	Name string
	Age  int
}

p := Person{
	Name: "John",
	Age: 32,
}

// Or create composite structs

type User struct {
	Person Person
	ID     string
}

u := User{
	Person: p,
	ID:     "123",
}
```
{% playgroundLink "https://goplay.tools/snippet/Ts4lLCOVenj" %}

{% callout %}
In Go, struct field names must also be capitalized to be exported (accessible from other packages or for [JSON marshalling](https://pkg.go.dev/encoding/json)). Lowercase struct fields are unexported and package-private.

{% endcallout %}

Now you might find the syntax similar to TypeScript types/interfaces at first, but the behavior is different: in TypeScript, types just dictate the shape of values, and you can pass in any superset of a different type and it will work. In Go, structs are a concrete data type, and assignment compatibility is nominal, not structural. So while this will work in TypeScript:

```ts
interface Person {
  name: string,
  age: number
}

interface User {
  name: string,
  age: number,
  username: string
}

function helloPerson(p: Person) {
  console.log(p)
}

helloPerson({
  name: "John",
  age: 32
})

const x: User = {
  name: "John",
  age: 32,
  username: "john",
}

helloPerson(x)
```
{% playgroundLink "https://www.typescriptlang.org/play/?#code/JYOwLgpgTgZghgYwgAgArQM4HsTIN4BQyyIcAthAFzIZhSgDmANEcnA1SQK5kBG0BAL4ECoSLEQoAqhmj5WpCtVr0QzVu04ge-KC2JdZURZxWMhImFxAIwwHMgAWEADYus6KNhAAKAA7Unt4AlPLECDjYLhAAdO4M-sEWBM5uHpg4PoTEJtQARABSWI4gefpsHNQAzABMQkkEESC0yAAe1DJyALxhJOSchcWl5ZrVNeWG0LnIeQBWQ2XJqe5Bma3BQA" %}

This won’t in Go:

```go
type Person struct {
    Name string
    Age  int
}

type User struct {
    Name     string
    Age      int
    Username string
}

func HelloPerson(p Person) {
    fmt.Println(p)
}

func main() {
    // This works fine
    HelloPerson(Person{
        Name: "John",
        Age:  32,
    })

    // This won't work
    x := User{
        Name:     "John",
        Age:      32,
        Username: "john",
    }
    
    // Error: cannot use x (type User) as type Person in argument to HelloPerson
    HelloPerson(x)
    
    // To make it work, you would need to explicitly convert:
    // HelloPerson(Person{Name: x.Name, Age: x.Age})
}
```
{% playgroundLink "https://goplay.tools/snippet/0xrXOeygwd2" %}

Types in Go are not only for structs, they can define any type of value a variable can hold:

```go
type ID int

var i ID
i = 2
```

A common use case is creating string-based enums:

```go
type Status string

const (
	StatusPending  Status = "pending"
	StatusApproved Status = "approved"
	StatusRejected Status = "rejected"
)

type Response struct {
	Status Status
	Meta   string
}

res := Response{
	Status: StatusApproved,
	Meta:   "Request successful",
}
```
{% playgroundLink "https://goplay.tools/snippet/RTqn_jvfbs9" %}

Although unlike TypeScript's discriminated unions, Go's custom types (like `Status`) are just aliases for their underlying type. The compiler won't prevent you from assigning any string to a `Status` variable:

```go
var s Status
s = "hello" // This compiles fine
```
{% playgroundLink "https://goplay.tools/snippet/KqOpDOvsMUv" %}

When it comes to TypeScript, its type system is Turing complete, allowing you to extend or manipulate existing types to create new types and perform complex computations entirely at the type level. This enables advanced type validations and type-safe abstractions.

```ts
type Person = {
  firstName: string;
  lastName: string;
  age: number;
}

// Extended type which has all properties of Person
// with additional properties
type Doctor = Person & {
  speciality: string;
}

type Res = { status: "success", data: Person } | { status: "error", error: string }

// Res is a discriminated union allowing you to have
// access to different properties based on the status
function getData(res: Res) {
  switch (res.status) {
    case "success":
      console.log(res.data)
      break;
    case "error":
      console.log(res.error)
      break;
  }
}

// A type in which all properties are optional
type OptionalDoctor = Partial<Doctor>

// A type with only firstName and speciality properties
type MinimalDoctor = Pick<Doctor, "firstName" | "speciality">
```
{% playgroundLink "https://www.typescriptlang.org/play/?#code/C4TwDgpgBAChBOBnA9gOygXigbwFBSgDMBLJYAOQEMBbCALikWHmNQHMBufKAG0qaq0GTFuy4FKbelFQBXagCMEXAL65cAeg1QAogA9gEVABMIxqKEhQA7gAtiAY1tRb-KJR48oYeMkjxgYghEKGRCWAQUVE1ta2JgZ0pjY3jiNA9vX39A4NxLaAARZAdgZHhMCKQ0KAAyHG5ESAdiD3iQYWZWTlw1PPBoACVgiuxGYEpgWUQGACJEWQcHYMQZgBooYwnKBjgq9BUoAB8cMYmp2YRfeDWoS7KO0TYoXq0oIZDiEMoNz4cWalYEzMUFkqDS6A8PGQcXYUBAyFkFmQLkoADcIDF3ItlkifoRCAgjMBMn4EDkQgp+MDqgloEwzohcIRQSVwVApMAClsABTwYIMd4ASnqBEQcWATigvOCADp6ZNEMK8AQCA4qVA5gslogVnRuCqoA40CgeBAZVC2NLEDLNuNBfqVQo+ZQANbiFVqxDQGZ3a56g2q43IU3m5CWvnW332gNQJ0QV3utQvbQAQQs-SgrBs9klkJJ2SCXz5oTAgXSPD6VgA8qXwR4iiUyhUYJQAi0eAAeBuleAAPnUrzT+Rs8WcaB4ICIpAENGglBMjCa7ba+bJhcr0AAsqxiNR68Ue83HC6uweyusZiQyIIIDMjhrGhBmq1QDNe0A" %}

Structs in Go are primarily data containers and don’t have any of the manipulation features like TypeScript types. The closest thing we have is struct embedding, which is Go's way of achieving composition and a form of inheritance:

```go
type Person struct {
	FirstName string
	LastName  string
}

type Doctor struct {
	Person
	Speciality string
}

d := Doctor{
  Person: Person{
    FirstName: "Bruce",
    LastName:  "Banner",
  },
  Speciality: "gamma",
}

fmt.Println(d.Person.FirstName) // Bruce

// The keys of embedded structs get promoted
// so this also works
fmt.Println(d.FirstName) // Bruce

```
{% playgroundLink "https://goplay.tools/snippet/_LJbGUj9-S1" %}

{% headingWithLink "Zero Values","h3","Zero Values" %}

Another thing that might throw your JavaScript brain off initially is the concept of zero values in Go. In JavaScript you can define a variable and by default its value would be `undefined`.

```tsx
let x: number | undefined;

console.log(x); // undefined

x = 3

console.log(x) // 3
```
{% playgroundLink "https://www.typescriptlang.org/play/?#code/DYUwLgBAHgXBB2BXAtgIxAJwgHwo+AJiAGYCW8IBA3AFA0DGA9vAM6OgB0wjA5gBRQAlFQgB6UXkIlylOlAgBeCAGY6TVuxBdeAwWInKgA" %}

But with Go if you initialize a variable without an explicit value, it gets assigned its corresponding *zero value.* Here are the default values for some of the primitive types:

```go
var i int // 0
var f float64 // 0
var b bool // false
var s string // ""

x := i + 7 // 7
y := !b // true
z := s + "string" // string
```
{% playgroundLink "https://goplay.tools/snippet/NXPb9UiWj0z" %}

Similarly structs also have zero values by default for their fields:

```go
type Person struct {
    name string  // ""
    age  int     // 0
}

p := Person{} // Creates a Person with empty string name and age 0
```
{% playgroundLink "https://goplay.tools/snippet/-Qj1pxeMWkR" %}

Go also has `nil` which is similar to `null` in JavaScript but, only reference type variables can hold a `nil` value, to understand what those are, we need to take a look at pointers in Go.

{% headingWithLink "Pointers","h3","Pointers" %}

Go has pointers sort of similar to languages like C and C++ where a pointer holds a memory address to a value.

You can declare pointers for a type `T` using the `*T` syntax. Zero value of any pointer is `nil` in Go

```go
var i *int

i == nil // true
```
{% playgroundLink "https://goplay.tools/snippet/QEpRTztXggP" %}

The `&` operator generates a pointer to its operand and the `*` operator gets the underlying value of a pointer which is also called as dereferencing a pointer. 

```go
x := 42
i := &x
fmt.Println(*i) // 42

*i = 84
fmt.Println(x) // 84
```
{% playgroundLink "https://goplay.tools/snippet/VjT8Pafk3xN" %}

But keep in mind if the pointer is `nil` and you try to dereference it, it would cause the famous [null pointer dereference error](https://www.youtube.com/watch?v=bLHL75H_VEM):

```go
var x *string

fmt.Println(*x) // panic: runtime error: invalid memory address or nil pointer dereference
```
{% playgroundLink "https://goplay.tools/snippet/DdJGZo9cpkp" %}

This segues into a key difference for JavaScript developers: in JavaScript, apart from primitive values all things are passed by reference implicitly, whereas Go makes it explicit with pointers.  For instance, objects in JavaScript are passed by reference, so if you modify the object inside a function, it modifies the original object:

```jsx
let obj = { value: 42 }

function modifyObject(o) {
    o.value = 84  // Original object is modified
}

modifyObject(obj)
console.log(obj.value)  // 84
```
{% playgroundLink "https://www.typescriptlang.org/play/?#code/DYUwLgBA9gRgVhAvBA3hAbgQ2AVxALggBYAmCAXwChKAzHAOwGMwBLKeiAWygBMWaAngHl4IZgAooASlSUI86ADosuEEggAOIvID0OiEIBOLAOYt62aKOYQWAZy69+LED0pVK3PoJFwxYSXgpSkZ2OyhQRWAoE0C4ZWw8GQg9TSIgA" %}

In Go almost everything is passed by value (except slices, maps and channels which we’ll cover in the upcoming sections) unless you are using pointers, so this does not work in Go:

```go
type Object struct {
	Value int
}

func modifyObject(o Object) {
	o.Value = 84
}

o := Object{Value: 42}
modifyObject(o)
fmt.Println(o.Value) // 42
```
{% playgroundLink "https://goplay.tools/snippet/-nt_ZN68xMx" %}

Unless you’re using pointers:

```go
func modifyObjectPtr(o *Object) {
    o.Value = 84  // Go allows this shorthand for structs 
    // instead of doing (*o).Value
}

o := Object{Value: 42}
modifyObjectPtr(&o)
fmt.Println(o.Value) // 84
```
{% playgroundLink "https://goplay.tools/snippet/v4wI6_cRoOz" %}

This is because when we pass a pointer, we're passing the memory address of the original object, allowing us to modify the underlying value directly. And it just not for structs you can create a pointer to any type, including primitive types:

```go
func modifyValue(x *int) {
    *x = 100
}

y := 42
modifyValue(&y)
fmt.Println(y) // 100
```
{% playgroundLink "https://goplay.tools/snippet/3jXZoqLjHpe" %}

{% headingWithLink "Functions","h3","Functions" %}

We saw a brief look at functions in the last section, and as you might have guessed it by now they're pretty similar to how they work in JavaScript. Their signature is also pretty similar to JavaScript apart from the `func` keyword instead of `function`.

```go
func greet(name string) string {
	if name == "" {
		name = "there"
	}
	return "Hello, " + name
}
```

Similar to JavaScript they’re also first class, which means that they can be assigned to variables and passed around, and hence also support higher order functions and closures. For example:

```go
func makeMultiplier(multiplier int) func(int) int {
	return func(x int) int {
		return x * multiplier
	}
}

double := makeMultiplier(2)

double(2) // 4
```
{% playgroundLink "https://goplay.tools/snippet/I50FbD-qkr9" %}

Go also has the support for returning multiple values from a function. This pattern comes in really handy for error handling which we’ll take a look at in the later section

```go
func parseName(fullName string) (string, string) {
    parts := strings.Split(fullName, " ")
    if len(parts) < 2 {
        return parts[0], ""
    }
    return parts[0], parts[1]
}

firstName, lastName := parseName("Bruce Banner")

fmt.Printf("%s, %s", lastName, firstName) // Banner, Bruce
```
{% playgroundLink "https://goplay.tools/snippet/jaC8_4Xbckl" %}

{% headingWithLink "Arrays and Slices" %}

In Go unlike JavaScript arrays are of fixed capacities, length is a part of their type and hence they cannot be resized. This might sound limiting but we’ll get to a better way of dealing with arrays in a minute. 

First let’s take a refresher on how arrays work in JavaScript:

```tsx
let s: Array<number> = [1,2,3];

s.push(4)

s[1] = 0

console.log(s) // [1, 0, 3, 4] 
```

You declare an array with size like this in Go:

```go
var a [3]int
// ^ This creates an array of 3 items with zero values: [0 0 0]

a[1] = 2 // [0 2 0]

// Or you can also define an array with initial values:
b := [3]int{1,2,3}
```
{% playgroundLink "https://goplay.tools/snippet/N7dS0pJ_UCL" %}

Notice how there isn’t a push method because arrays are of fixed lengths in Go. And this is where slices come in. A slice is a dynamically sized flexible view into the array:

```go
c := [6]int{1,2,3,4,5,6}

d := c[1:4] // [2 3 4]
```
{% playgroundLink "https://goplay.tools/snippet/dER8L-Fw4h9" %}


Now this might look like JavaScript’s slice at first glance, but keep in mind JavaScript’s slice returns a shallow copy, whereas Go’s slice maintains reference to the underlying array. So this works in JavaScript:

```tsx
let x: Array<number> = [1,2,3,4,5,6];

let y = x.slice(1,4)

y[1] = 0

console.log(x,y) // x = [1, 2, 3, 4, 5, 6] y = [2, 0, 4]
```
{% playgroundLink "https://www.typescriptlang.org/play/?ssl=7&ssc=57&pln=1&pc=1#code/DYUwLgBAHgXBCCAnRBDAngHgHYFcC2ARiIgHwQC8EA2gIwA0ATHQMx0AsdArHQGwC6AbgBQQ0JDQVoAOgDOwAJYBjEAAp6bAJQi0tPpIAMIxQHssM46CnBjAcxVQ6aDRAD0L6JNp0ITCKwgcENwQ-BASlFS++t5sfEA" %}

Modifying a slice in Go changes the underlying array, so for above example:

```go
d[0] = 0

fmt.Println(c) // [1 0 3 4 5 6]
```
{% playgroundLink "https://goplay.tools/snippet/ytJ5UotV5t2" %}

Now the part where things get interesting is slice literals. You can create a slice literal by omitting the length part in the array

```go
var a []int

// or

b := []int{1,2,3}

a == nil // true
```
{% playgroundLink "https://goplay.tools/snippet/72k43lVxRwl" %}

For `b` it creates the same array as we saw previously, but b stores the slice that references it. Also if you remember zero values from previous section a zero value of a slice is `nil` so in the above case `a` would be `nil` , since the underlying pointer to the array is `nil` .

Apart from the underlying array, slices also have a length and a capacity, where length is the number of items a slice currently has and capacity is the number of elements in the underlying array. You can access the length and capacity of a slice using the `len` and `cap` methods:

```go
s := []int{1,2,3,4,5,6}

t := s[0:3]

fmt.Printf("len=%d cap=%d %v\n", len(t), cap(t), t)
// len=3 cap=6 [1 2 3]
```
{% playgroundLink "https://goplay.tools/snippet/23Y5XwkkC2J" %}

In the above example the slice `t` has length of 3 because of how it was sliced from the original array but the underlying array has a remaining capacity of 6. 

You can also use the built-in `make` function to create a slice, using the syntax `make([]T, len, cap)` . It allocates a zeroed array and returns a slice that references that array.

```go
a := make([]int, 5)  // len(a)=5, cap(a)=5 

b := make([]int, 0, 5) // len(b)=0, cap(b)=5
```
{% playgroundLink "https://goplay.tools/snippet/sSlO_jyvkoT" %}

There is also a built-in `append` method which let’s you append items to a slice without worrying about the length or capacity of the slice:

```go
a := []int{1,2,3}

a = append(a,4) // [1 2 3 4]
```
{% playgroundLink "https://goplay.tools/snippet/MemMp3lI9_A" %}

`append` always returns slice containing all the elements of the original slice plus the provided values. If the underlying array is too small to fit the values append creates a bigger array and returns the slice pointing to that array (the Go team has [this great blog](https://go.dev/blog/slices-intro) if you're interested in learning how it works internally).

Unlike JavaScript Go doesn’t have built in declarative functional helpers like `map`,  `reduce` , `filter` etc. So you can use the plain old `for` for iterating over a slice or an array:

```go
for i, num := range numbers {
	fmt.Println(i, num) 
}

// Or this if you just want the number
// for _, num := range numbers
```
{% playgroundLink "https://goplay.tools/snippet/iEpJOHjTMmN" %}

Lastly as we know in JavaScript arrays are non primitive type so they’re always passed by reference:

```jsx
function modifyArray(arr) {
  arr.push(4);
  console.log("Inside function:", arr); // Inside function: [1, 2, 3, 4]
}

const myArray = [1, 2, 3];
modifyArray(myArray);
console.log("Outside function:", myArray); // Outside function: [1, 2, 3, 4] 
```

In Go arrays are passed by value, as we saw in the previous section that slices are a descriptor of an array segment, and contain a pointer to the array, so passing this descriptor means changes to the slice elements affect the underlying array.

```go
func modifyArray(arr [3]int) {
    arr[0] = 100
    fmt.Println("Array Inside:", arr) // Array Inside: [100, 2, 3]
}

func modifySlice(slice []int) {
    slice[0] = 100
    fmt.Println("Slice Inside:", slice) // Slice Inside: [100, 2, 3]
}


myArray := [3]int{1, 2, 3}
mySlice := []int{1, 2, 3}

modifyArray(myArray)
fmt.Println("Array After:", myArray) // Array After: [1, 2, 3]

modifySlice(mySlice)
fmt.Println("Slice After:", mySlice) // Slice After: [100, 2, 3]
```
{% playgroundLink "https://goplay.tools/snippet/EkXXRTBKYzh" %}

{% headingWithLink "Maps" %}

Maps in Go are actually very similar to the `Map` in JavaScript than to JavaScript Objects (JSON) which are much more common for storing key value pairs.

To take a refresher this is how Maps work in JavaScript:

```tsx
const userScores: Map<string, number> = new Map();

// Adding key-value pairs
userScores.set('Alice', 95);
userScores.set('Bob', 82);
userScores.set('Charlie', 90);

// Define an interface for the user age object
interface UserAgeInfo {
  age: number;
}

// Alternative creation with initial values using the interface
const userAges: Map<string, UserAgeInfo> = new Map([
  ['Alice', { age: 28 }],
  ['Bob', { age: 34 }],
  ['Charlie', { age: 22 }]
]);

// Getting values
console.log(userScores.get('Alice')); // 95

// Deleting an entry
userScores.delete('Bob');

// Size of the map
console.log(userScores.size); // 2
```
{% playgroundLink "https://www.typescriptlang.org/play/?#code/MYewdgzgLgBArhApgJwMqmYiAuGBZAQwAcAeaZASzAHMAaGMOAWwCMUA+GAXgcQHd8xABQBKANwAoCQHppMAIIATRVWowA1ogCeAWgBuBADZxEMIgQrIIEhCnQhMEAHRIoQgOTzDFYInf0ATgBWcRskNAwsF0Q3dwAhEBZ-GAAOACZQ2wiHKNcPAGEACwJkbz9AgAZQmTkAEUQAMypTAjAYKigUBoJfGAaHGChC0yyYAmpTRIArRGAoCQ6untMAVXD5CYBJMH6YAG8JGDGJ3EZWFEkAXylZBUNO5DACKAo9U2BMZ4pwGD4KIfaYH+FCMMAMxiw8AgqkGw0BD26vgkoEgsCyGywuEIpHIqnoaxQGO2-U4PDA-EERCEAG1DjBqZ5vL5kntjohcGkUjBLgBdWh0hkJJL0VnjdkwADMABZuXyBe4iiUyiy2Ry0rKJDzqrcAOIxF40MFGEzWFEQECGRBOQwgahCLL2RxOCaxLw+PwicQwW7BG51RCWg1qVowRBgKDILRhOyRZyKAMxRAeIXubVyVAUABekwasNMTGIyPA5st1tt9vCjtyWcQXtuaSAA" %}

And very similarly this is how maps also work in Go:

```go
// Creating a map
userScores := map[string]int{
    "Alice":   95,
    "Bob":     82,
    "Charlie": 90,
}

type UserAge struct {
		age int
}

// Alternative way to create
userAges := make(map[string]UserAge)
userAges["Alice"] = UserAge{age: 28}
userAges["Bob"] = UserAge{age: 34}
userAges["Charlie"] = UserAge{age: 22}

// Getting values
aliceScore := userScores["Alice"]
fmt.Println(aliceScore) // 95

// Deleting an entry
delete(userScores, "Bob")

// Size of the map
fmt.Println(len(userScores)) // 2
```
{% playgroundLink "https://goplay.tools/snippet/SC0q91MPMrd" %}

One thing worth noting is that, if you try to access a key that doesn’t exist in the map you’ll get the zero value for the type of value, so in the above case this would result in `davidScore` being set to zero, unlike `undefined` in JavaScript

```go
davidScore := userScores["David"] // 0
```

So how do you figure out if an item is actually in the map or not. Well retrieving a value from map returns two values the first one being the value itself which is what we have seen in the above case, and the second one being a boolean which represents whether the value actually existed in the map or not.

```go
davidScore, exists := userScores["David"]
if !exists {
    fmt.Println("David not found")
}
```
{% playgroundLink "https://goplay.tools/snippet/Pr2bOa4ofQi" %}

Lastly similar to slices we saw earlier, map variables are also pointers to the underlying data structure, so they are also passed by reference similar to slices.

```go
func modifyMap(m map[string]int) {
    m["Zack"] = 100  // This change will be visible to the caller
}

scores := map[string]int{
    "Alice": 95,
    "Bob":   82,
}

fmt.Println("Before:", scores)  // Before: map[Alice:95 Bob:82]

modifyMap(scores)

fmt.Println("After:", scores)   // After: map[Alice:95 Bob:82 Zack:100]

```
{% playgroundLink "https://goplay.tools/snippet/jNykGSnUQOx" %}

{% headingWithLink "Comparisons" %}

In JavaScript things can get confusing at times when doing strict equality checks. You can compare primitive types by value but everything else is compared and passed by reference.

```jsx
let a = 5
let b = 5
console.log(a === b) // true - compared by value

let str1 = "hello"
let str2 = "hello"
console.log(str1 === str2) // true - compared by value

let a1 = { name: "Hulk" }
let a2 = { name: "Hulk" }
let a3 = a1

console.log(a1 === a2) // false - different refrences despite identical content
console.log(a1 === a3); // true - same reference
```
{% playgroundLink "https://www.typescriptlang.org/play/?#code/DYUwLgBAhhC8EFYBQpICM6KQYwPYDsBnXUAOmFwHMAKGWeiNASggHpWIwAnAVxAgC0EPAFsADlC4gAJowCeEAG5RgfJCnARC3AIyYARAAsQwCvo2RtXAEwHjp3ObxESIclWpW99eFest2Tl5+IVEJKVk0BWVVEHVUaG8IAG8IfCgREAAuCH0ACR5gAGt9CABfC2hbeFT0zJz8wpLyyqgAZkwoHXVnYjIKGi64Bih-Ng4AMxVCEIhpAEsJiZApfEgpCdXsEEI5nbF5sH556RA1+ewVYQIjtZwCPrcB2m8RtqYAbnGgvkEtDP4GxWZ22QA" %}

But that’s not the case in Go, where almost everything is compared by value even composite types like structs and arrays as long as they don’t contain incomparable types (slices, maps etc.). For example:

```go
type Person struct {
    Name string
    Age  int
}


p1 := Person{Name: "Alice", Age: 30}
p2 := Person{Name: "Alice", Age: 30}

fmt.Println("p1 == p2:", p1 == p2) // true - same content, different instances

// Arrays are compared by value
arr1 := [3]int{1, 2, 3}
arr2 := [3]int{1, 2, 3}

fmt.Println("arr1 == arr2:", arr1 == arr2) // true - same content, different instances

// But slices can't
tasks := []string{"Task1", "Task2", "Task3"}
tasks2 := []string{"Task1", "Task2", "Task3"}

// This would not compile:
// fmt.Println(tasks == tasks2) // invalid operation: tasks == tasks2

// Although this is allowed
fmt.Println(tasks == nil) // false

// But when a struct contains incomparable types, it becomes incomparable
type Container struct {
    Items []int // slice is incomparable
}

c1 := Container{Items: []int{1, 2, 3}}
c2 := Container{Items: []int{1, 2, 3}}

// This would not compile:
// fmt.Println("c1 == c2:", c1 == c2) // error: struct containing slice cannot be compared

// Pointers are compared by reference (address)
pp1 := &Person{Name: "Bob", Age: 25}
pp2 := &Person{Name: "Bob", Age: 25}
pp3 := pp1

fmt.Println("pp1 == pp2:", pp1 == pp2) // false - different instances
fmt.Println("pp1 == pp3:", pp1 == pp3) // true - same instance
fmt.Println("*pp1 == *pp2:", *pp1 == *pp2) // true - dereferencing compares values
```
{% playgroundLink "https://goplay.tools/snippet/DMRAkVXJ-MY" %}

{% headingWithLink "Methods and Interfaces" %}

In JavaScript we use Class Objects to bundle related properties and methods that model a real world concept into a single entity. You can create Objects using Classes, where Classes are just syntactic sugar over JavaScript’s prototypal inheritance system (checkout [this article](https://prateeksurana.me/blog/how-javascript-classes-work-under-the-hood/) if you're interested in  learning more about it).

```jsx
class Rectangle {
  length: number;
  width: number;

  
  constructor(length: number, width: number) {
    this.length = length;
    this.width = width;
  }

  area() {
    return this.length * this.width;
  }
}

const r = new Rectangle(4, 5);
console.log(r.area()); // 20
```
{% playgroundLink "https://www.typescriptlang.org/play/?ssl=17&ssc=29&pln=1&pc=1#code/MYGwhgzhAEBKCmwAuYB2BzE9oG8BQ00WGSAFgFzSoCuAtgEbwBOA3AdAO4CWAJmZTQbM27dsAD2qCEibVk4pgApi6flTqMmAGk681gzQEpc7QmS4QAdCrLQAvEXglSbQmdIXL3PqXu6frtAAvnjsYEzwYIrG+G7QEUjUTKjQ5lY2vgBUqR5W3mSBISF4ElJI8X6o8BxwiCgYWIoALDoArIZspRDiWNbi6IpMluGR0R3QAPQT0ABMAAxAA" %}

Go does not have classes, unlike many other languages but has the ability to allow you to define methods directly on types. Methods are special functions which has a special receiver argument that comes between the `func` keyword and method name. For example:

```go
type Rectangle struct {
	length float64
	width  float64
}

func (r Rectangle) Area() float64 {
	return r.length * r.width
}

func main() {
	r := Rectangle{
		length: 4,
		width:  5,
	}
	fmt.Println(r.Area()) // 20
}
```
{% playgroundLink "https://goplay.tools/snippet/HWQk6JXotK8" %}

Since methods are just functions with receiver arguments the above example can be rewritten with zero change in functionality like:

```go
func Area(r Rectangle) float64 {
	return r.length * r.width
}
```
{% playgroundLink "https://goplay.tools/snippet/EzhF-H_375x" %}

The above snippet is an example of a value receiver where you receive a copy of the type in the receiver variable. Although more often then not you will be declaring methods using pointer receivers. The methods with pointer receivers can modify the value to which receiver points.

```go
type Rectangle struct {
	length float64
	width  float64
}

func (r Rectangle) Area() float64 {
	return r.length * r.width
}

func (r *Rectangle) Double() {
	r.length = r.length * 2
	r.width = r.width * 2
}

func main() {
	r := Rectangle{
		length: 4,
		width:  5,
	}
	
	r.Double()
	fmt.Println(r.Area()) // 80
}
```
{% playgroundLink "https://goplay.tools/snippet/hoakk7i4sGJ" %}

{% callout %}

As a convenience Go automatically interprets the statement `r.Double()` as `(&r).Double()` since `Double()` method has a pointer receiver.

{% endcallout %}

Another benefit of using pointer receivers is that you avoid copying the value on every method call which can be efficient if its a large struct.

{% headingWithLink "Interfaces","h3","Interfaces" %}

As we know TypeScript has `type` and `interface` to define the signature of an object, but like other languages they can also be used with classes to define their signature variables and methods using the `implements` keyword:

```tsx
interface Shape {
  area(): number;
  perimeter(): number;
}

class Circle implements Shape {
   #radius: number

  constructor(radius: number) {
    this.#radius = radius
  }
  
  area(): number {
    return Math.PI * this.#radius * this.#radius;
  }
  
  perimeter(): number {
    return 2 * Math.PI * this.#radius;
  }
}

function printArea(s: Shape) {
    console.log(s.area())
}

let c = new Circle(3)

printArea(c)
```
{% playgroundLink "https://www.typescriptlang.org/play/?#code/JYOwLgpgTgZghgYwgAgMoAs4AcUG8BQyycUEcAFAJQBcyIArgLYBG0A3IcjlMIxJFCq0GLdvgC++fAgA2cAM7zkAYWBRZKXlhkQ+4JRmx5OyAMRQ4AE2D15wpqyhSiCAPYh5YKPQRhXgi2tbe1EoSmQCIiIwdGB5ADpzKxslAF5kQJTOSSJOEjIhOgdoCJMM-nooEGQAWTgY+IAFAElkACpkGLjEzNt2ztiEpKD5DiIc5E5uXn5oQpFHUqjysErqgCZ+uoaW-q6h3tHsiSkYehBfYHcuHnAAQVIKOzRMHHDIqLcPVx14mVcAObkBL5CiUSgnfA6MDIBDIdIgCAAdxUag05AAzBD8FhbmAHgUEJQgA" %}

Go’s interfaces also serve a similar purpose, in Go interface type is also defined as a set of method signatures and it can hold a value that implements those methods. For example

```go
package main

import (
	"fmt"
	"math"
)

type Shape interface {
	area() float64
	perimeter() float64
}

type Rectangle struct {
	length float64
	width  float64
}

func (r *Rectangle) area() float64 {
	return r.length * r.width
}

func (r *Rectangle) perimeter() float64 {
	return 2 * (r.length + r.width)
}

type Circle struct {
	radius float64
}

func (c *Circle) area() float64 {
	return math.Pi * c.radius * c.radius
}

func (c *Circle) perimeter() float64 {
	return 2 * math.Pi * c.radius
}

func printArea(s Shape) {
	fmt.Println(s.area())
}

func main() {
	r := &Rectangle{
		length: 4,
		width:  5,
	}
	
	c := &Circle{
		radius: 3,
	}
	
	fmt.Println("Rectangle area:")
	printArea(r)
	
	fmt.Println("Circle area:")
	printArea(c)
}
```
{% playgroundLink "https://goplay.tools/snippet/EjS07cGLbxs" %}

In the above example notice how there is no implements keywords for Rectangle yet we are able to pass it to a function that requires the type `Shape`, in Go a type implements an interface, by implementing its methods without any explicit implements keyword. 

This might seem weird at first but its a very powerful feature of Go’s design allowing us to decouple the definition of an interface from its implementation, which means you can create interfaces for existing types.

Under the hood interfaces in Go can be thought of as a tuple containing a value and a concrete type. So in case of the above example:

```go
var r Shape

r = &Rectangle{
		length: 4,
		width:  5,
}

fmt.Printf("%v, %T", r, r) // &{4 5}, *main.Rectangle
```
{% playgroundLink "https://goplay.tools/snippet/CKfcPbcQiZX" %}

Similarly a nil interface wouldn’t have a value or a concrete type, and accessing a property on the interface would cause a nil pointer exception.

```go
var r Shape

fmt.Printf("(%v, %T)\n", r, r) // <nil>, <nil>

r.Area() // Runtime error: nil pointer exception
```
{% playgroundLink "https://goplay.tools/snippet/3qH1bG6wchL" %}

A variable of type of an empty interface can hold any value, its the equivalent of `any` in TypeScript. 

```go
var r interface{}

r = 42

r = "Bruce Banner"
```
{% playgroundLink "https://goplay.tools/snippet/y9eGnKoRluB" %}

{% callout %}

Go 1.18, also introduced a type called `any` which is just an alias for empty interface so `var r any` will also work in the above example.

{% endcallout %}

Lastly we also have type assertions in Go, which can be used to get the underlying concrete value of an interface. For instance for the above case

```go
var s Shape

s = &Circle{
	radius: 3,
}

c, ok := s.(*Circle) // c would be of type *Circle
fmt.Println(c, ok) // &{3} true

r, ok := s.(*Rectangle) // r would be of type *Rectangle
fmt.Println(r, ok) // <nil> false
```
{% playgroundLink "https://goplay.tools/snippet/awYt73mK5iZ" %}

And its not just for struct types, type assertions work for primitive types as well:

```go
var i interface{} = "hello"

s, ok := i.(string)
fmt.Println(s, ok)

f, ok := i.(float64)
fmt.Println(f, ok)
```
{% playgroundLink "https://goplay.tools/snippet/JysEU1GCbiS" %}

{% headingWithLink "Error Handling" %}

This is one of my favourite parts about Go, and something JavaScript should definitely copy. The way you handle errors in Go is extremely explicit and there are also linters that would warn you if you don’t handle an error.

One of the most common ways of handling errors in JavaScript is using `try catch` , and the following is a typical example of a function that reads some JSON files, processes them and returns the JSON:

```jsx

async function processFiles(filePaths) {
  try {
    const fileContents = await Promise.all(
      filePaths.map(path => fs.promises.readFile(path, 'utf-8'))
    );
    
    const results = fileContents.map(content => JSON.parse(content));
    return results;
  } catch (error) {
    // Which operation failed? The file read or the JSON parse?
    // Which file caused the problem?
    console.error("Something went wrong:", error);
    return null;
  }
}
```

In the above code even though we are handling exceptions we don’t have a granular level idea on which operation might fail without adding extra like maybe wrapping every file read and parse operation in try catch for instance.

But Go takes a different approach to error handling. Instead of using exceptions, Go functions can return multiple values, and by convention, the last return value is typically an error, so the above example looks something like this in Go:

```go
func processFiles(filePaths []string) ([]map[string]string, error) {
    var results []map[string]string
    
    for _, path := range filePaths {
        // Handle each error individually at the source
        data, err := os.ReadFile(path)
        if err != nil {
            return nil, fmt.Errorf("failed to read file %s: %w", path, err)
        }
        
        var result map[string]string
        err = json.Unmarshal(data, &result) 
        
        if err != nil {
            return nil, fmt.Errorf("failed to parse JSON from file %s: %w", path, err)
        }
        
        results = append(results, result)
    }
    
    return results, nil
}
```

In the Go example above, errors are handled explicitly at each step, making it clear exactly where and why something failed. The error value is checked immediately after each operation that could fail, and if there is an error, the function returns early with a detailed error message.

This approach also forces developers to think about and handle error cases explicitly, rather than letting exceptions bubble up through the call stack unhandled.

Go also has something called defer functions, giving us the ability to execute a statement just after the surrounding function exits. So for example:

```go
func main() {
	defer fmt.Println("World")
	defer fmt.Println("Go")
	fmt.Println("Hello")
}

// Output:
// Hello
// Go
// World
```
{% playgroundLink "https://goplay.tools/snippet/6aLLD8qxgZo" %}

The defer functions execute in LIFO order, hence “World” is printed at the end.

Defer function pairs really well with Go’s error handling, allowing you to place cleanup code right next to some resource allocation, but executed only when the function exits. For example:

```go
package main

import (
	"database/sql"
	"fmt"
	
	_ "github.com/lib/pq" // PostgreSQL driver
)

func getUsername(userID int) (string, error) {
    // Open database connection
    db, err := sql.Open("postgres", "postgresql://username:password@localhost/mydb?sslmode=disable")
    if err != nil {
        return "", fmt.Errorf("failed to connect to database: %w", err)
    }
    defer db.Close() // This ensures db connection is closed when function exits
    
    // Execute the query
    var username string
    err = db.QueryRow("SELECT username FROM users WHERE id = $1", userID).Scan(&username)
    if err != nil {
        return "", fmt.Errorf("failed to get username: %w", err)
    }
    
    return username, nil
}
```

In the above example the defer statement to close the db is places right after when we open the database connection, this ensures that the connection is closed if there was no error while opening it regardless of how the function exits, and also places the cleanup code right next to acquisition giving a clear picture of what resources need to be released.

In JavaScript we use something like a `finally` block to achieve a similar goal. This is what the above example would look like in JavaScript:

```jsx
const { Client } = require('pg');

async function getUsername(userId) {
    const client = new Client({
        connectionString: "postgresql://username:password@localhost/mydb"
    });
    
    try {
        await client.connect();
        
        // Execute query directly
        const result = await client.query("SELECT username FROM users WHERE id = $1", [userId]);
        
        if (result.rows.length === 0) {
            throw new Error("User not found");
        }
        
        return result.rows[0].username;
    } catch (error) {
        throw new Error(`Database error: ${error.message}`);
    } finally {
        await client.end(); // This is equivalent to Go's defer for cleanup
    }
}
```

Defer functions can also be used to recover from panics, panics are Go's equivalent of a runtime error or exception in JavaScript. In both languages when a panic or a runtime exception occurs, the program stops executing the current function and starts unwinding the stack, and terminates the program in case the exception is not handled at the end (in case of Go you also still execute any deferred functions along the stack). 

While in JavaScript, you can use the same try catch block to gracefully handle any runtime errors, in Go you need to use a special function called `recover` inside `defer` functions to handle panics. For example:

```go
package main

import (
  "fmt"
)

func riskyOperation() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered from panic:", r)
        }
    }()
    
    // This will cause a panic
    var arr []int
    fmt.Println(arr[1]) // Accessing out of bounds
}

func main() {
    riskyOperation()
    fmt.Println("Program continues after recovery")
}
```
{% playgroundLink "https://goplay.tools/snippet/NfqH0R3d0rA" %}

In the above example when panic occours the deferred function is executed, which calls `recover` to catch the panic and prevent the program from crashing. This allows you to [handle the error gracefully and continue execution](https://go.dev/blog/defer-panic-and-recover).


{% headingWithLink "Concurrency" %}

The way both of these languages handle concurrency is where they differ the most. While JavaScript is single threaded at its core, because of its event driven architecture, it allows non blocking I/O operations with callbacks, Promises etc. that execute on the main thread. This event driven architecture allows JavaScript to have concurrency without multi threading.

Go supports true concurrency through goroutines, which are lightweight threads (~2KB each) managed by the Go runtime. Unlike JavaScript's single-threaded event loop, Go can execute code in parallel across multiple OS threads. While Go code itself is synchronous, goroutines enable parallel execution across CPU cores.

Here is how you can create a goroutine:

```go
package main

import (
	"fmt"
	"time"
)

func say(s string) {
	fmt.Println(s)
}

func main() {
	go say("world")
	say("hello")
	
	// We have added sleep to prevent program from exiting
	// before goroutine runs, there are better ways to
	// handle this using channels and wait groups
	time.Sleep(100 * time.Millisecond)
}
```
{% playgroundLink "https://goplay.tools/snippet/4JccVK4Q0gz" %}

The `go` keyword in the above example executes the function in a new goroutine that runs in parallel to the current one.

To understand how goroutines compare to JavaScript's event loop, here’s an example where we make a couple of API calls in parallel and wait for the response using `Promise.all`:

```jsx
const fetchData = async () => {
  try {
    // Start both requests "in parallel"
    const postPromise = fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => response.json());
    
    const commentsPromise = fetch('https://jsonplaceholder.typicode.com/posts/1/comments')
      .then(response => response.json());
    
    // Wait for both promises to resolve
    const [post, comments] = await Promise.all([postPromise, commentsPromise]);
    
    console.log('Post:', post);
    console.log('Comments:', comments);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchData();
```
{% playgroundLink "https://www.typescriptlang.org/play/?#code/MYewdgzgLgBAZgUysAFgEQIZQzAvDDCATzGBgAoBKPAPhgG8AoGGKAJyIeZZgHpeYAZWxtYAIxBQUMNggCOAVwTQIMAEQBLMDAAOGNhgA2hhIbXcWoSLB0hoABTYgAthogI88JKnIByFFBQOhAAXPwAVhDgOoYYwAgoIIYAJghsAHRQRDoaoKnpoM68tiq8AIy+lBY8mSgIYOSyELaQHrh0TS3u6ZHgVJQA3NXVVtAwhc71UBCOLm5tXsgofgFBoRFRYDFxCUmpGVk5eQgFLsV20+W8E1MQldUstfWNyl1tHa-g3b0NlIPDPD4AgA6hgNLA4CA2DAJFJdE5XO5VFAQDJlEkAG4IEZfWAAbRKUAANOMXJMwNMALqeDAAdzBsFmiJORkM5AJFyZ8xJNwpMwR80p-0BOMgSROhhAAHM-PYLiFfCTCcKeKNxelJTLfABhMm3BU8vV8lUAX3GWFQFDSTjY1CYgLVJnS1qhfgAomwbYtUFopTBklgMAaYC7bUMWCbGCahoxEEtMNgqAMgA" %}

And here is how you would implement something similar in Go using goroutines:

```jsx
package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	var postJSON, commentsJSON string
	var postErr, commentsErr error

	// Add two items to wait for
	wg.Add(2)

	// Fetch post in a goroutine
	go func() {
		defer wg.Done()
		resp, err := http.Get("https://jsonplaceholder.typicode.com/posts/1")
		if err != nil {
			postErr = err
			return
		}
		defer resp.Body.Close()

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			postErr = err
			return
		}

		postJSON = string(body)
	}()

	// Fetch comments in a goroutine
	go func() {
		defer wg.Done()
		resp, err := http.Get("https://jsonplaceholder.typicode.com/posts/1/comments")
		if err != nil {
			commentsErr = err
			return
		}
		defer resp.Body.Close()

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			commentsErr = err
			return
		}

		commentsJSON = string(body)
	}()

	// Wait for both goroutines to complete
	wg.Wait()

	// Handle any errors
	if postErr != nil {
		fmt.Println("Error fetching post:", postErr)
		return
	}
	if commentsErr != nil {
		fmt.Println("Error fetching comments:", commentsErr)
		return
	}

	// Print results
	fmt.Println("Post JSON:", postJSON)
	fmt.Println("Comments JSON:", commentsJSON)
}
```
{% playgroundLink "https://goplay.tools/snippet/a36f7R8WqtT" %}

{% callout %}

The above example uses `WaitGroup`, which are part of the `sync` package, that provides basic [synchronization primitives](https://pkg.go.dev/sync) for Go.

{% endcallout %}

The key difference in the examples is that JavaScript achieves concurrency through asynchronous I/O and the event loop, by delegating I/O operations to browser or Node.js which perform these operations outside of the main thread, however for CPU intensive tasks JavaScript would still run on the single main thread blocking everything else. Go, on the other hand, enables true parallelism with goroutines that can execute simultaneously across CPU cores. Here's an example of how you can run CPU intensive tasks in parallel using goroutines:

```go
package main

import (
	"fmt"
	"sync"
)

func sum(s []int, result *int, wg *sync.WaitGroup) {
	defer wg.Done() // Signal that this goroutine is done
	
	sum := 0
	for _, v := range s {
		sum += v
	}
	*result = sum
}

func main() {
	s := []int{7, 2, 8, -9, 4, 0}
	
	var wg sync.WaitGroup
	var x, y int
	
	// Add 2 goroutines to the wait group
	wg.Add(2)
	
	// Launch goroutines
	go sum(s[:len(s)/2], &x, &wg)
	go sum(s[len(s)/2:], &y, &wg)
	
	// Wait for both goroutines to complete
	wg.Wait()
	
	fmt.Println(x, y, x+y)
}
```
{% playgroundLink "https://goplay.tools/snippet/SUPwpsSM17e" %}

In the above example we are doing a CPU intensive task of summing up two halves of a slice in parallel using goroutines, something like this isn't natively supported in JavaScript unless you use [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) or [worker threads in Node.js](https://nodejs.org/api/worker_threads.html).

{% headingWithLink "Formatting and Linting" %}

Go comes with an official formatter from the standard library with [Gofmt](https://pkg.go.dev/cmd/gofmt) package. Unlike different projects having a custom configuration with Prettier in the JavaScript ecosystem, Gofmt is not very configurable but is widely accepted in [most Go projects](https://go.dev/blog/gofmt#format-your-code), and most editors have default extensions to auto format Go code using it.

When it comes to linting, Go similar to JavaScript has a bunch of linting rules built by the community, which can warn about or auto fix variety of code quality issues. [`golangci-lint`](https://golangci-lint.run/welcome/install/) is one of the popular Go linters runner, which runs multiple linters in parallel and integrates over a hundred configurable linters.

{% headingWithLink "Conclusion" %}

If you've made it this far, I hope this guide has given you a solid foundation in Go and helped you understand how it compares to JavaScript—both as a language and how they run.

We've covered the essential fundamentals, but we've only scratched the surface of Go's powerful standard library and ecosystem. If you're interested in diving deeper, the best next step is to start building. Go excels at creating CLIs, web servers, microservices, system tools, and even language compilers.

Here are some resources to continue your Go journey:

- [https://gobyexample.com/](https://gobyexample.com/)
- [https://go.dev/doc/articles/wiki/](https://go.dev/doc/articles/wiki/)
- [https://github.com/urfave/cli](https://github.com/urfave/cli)