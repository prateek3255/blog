---
title: Inside look at JavaScript Prototypes
date: 2021-12-21
updatedAt: 2021-12-21
permalink: /blog/inside-javascript-prototypes/
templateEngineOverride: njk,md
description: Learn what prototypes are in JavaScript, what are they used for, what prototype chaining is and how do JavaScript classes work under the hood with these concepts.
thumbnail: inside-javascript-prototypes.png
author: Prateek Surana
tags:
  - javascript
---

Prototypes are a core part of JavaScript, so much so that JavaScript is often referred to as a prototype-based language. 

Although it is entirely possible that you've been using JavaScript for a while now and haven't ever heard about prototypes  (they're mostly abstracted out by the syntax) and knowing about them might not directly help in the day-to-day code we write but it will help you get a better understanding of JavaScript as a language.

So in this article, we'll explore what prototypes are, what are they used for, what prototype chaining is, how it helps with prototypal inheritance, and lastly, how JavaScript classes work under the hood. We'll also be looking at examples throughout this article which you can try out yourself with any JavaScript compiler or even the browser console.





{% headingWithLink "What are prototypes anyways?" %}

In a nutshell, prototypes are a mechanism by which JavaScript objects can inherit features from one another. Objects can have a prototype object which they use as a template to inherit their properties and methods from.

Have you ever wondered whenever you create an object or an array you get a bunch of handy methods ( `hasOwnProperty` , `toString`, etc.) right of the table even though you didn't define them when you created the object?

```jsx
let obj = { name: "Prateek" };
obj.hasOwnProperty("name"); // true

let nums = [1, 2, 3];
nums = nums.map(num => num + 1); // [2, 3, 4]
```

Whenever you create objects and arrays in JavaScript, they come with their default prototype and the properties you saw above, defined on the default prototypes of  [Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#instance_methods) and [Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#instance_methods), respectively.

The way it works is that whenever you try to access a property on an object like `obj.hasOwnProperty` above, JavaScript first checks whether the object has a property called `hasOwnProperty` or not. If the property isn't defined on the object, it looks into its prototype, and if it cannot find it there, only then it returns `undefined`. In the example above, `hasOwnProperty` is a function defined on the Object's prototype; hence we are able to call it.

You can get the prototype of any object using the `Object.getPrototypeof` method. Try running the below snippet in the console to see all the methods that along with `hasOwnProperty` that are available with the default Object prototype

```jsx
let obj = { foo: 'bar'}
console.log(Object.getPrototypeOf(obj))
```

{% image "prototypes-getprototypeof.png", "The object prototype with Object.getPrototypeOf" %}

You can even see the prototype properties by just logging the object onto the console, the prototype properties are visible under `[[Prototype]]`.

{% image "prototypes-in-console.png", "The prototype visible under [[Prototype]] in console" %}

So the prototype is just another object with many template properties shared by all the objects with the same prototype.

{% image "prototypes-object-visualization.png", "Object prototype visualization" %}

{% callout %}
You can also access the prototype via the [`__proto__`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto) property (try logging `obj.__proto__` in the console) on objects, but it's deprecated and will probably soon be dropped from the web standards.
{% endcallout %}

You might think that since the prototype is just a JavaScript object, what happens if you mutate it. Try running the below snippet in the browser console and see what happens.

```jsx
let obj = { name: 'jon' }
let prototype = Object.getPrototypeOf(obj)
prototype.foo = 'bar'
console.log(obj.foo)

let obj2 = { name: 'arya' }
console.log(obj2.foo) // "bar"
```

Since we mutated the default Object prototype which is referenced by all the objects by default, accessing the `foo` property on any of them would give you `"bar"` as the value.

What we just did above is known as prototype pollution, it used to be a popular way to add custom properties to shared objects, but it was not only dangerous (imagine an attacker making application-wide changes by modifying the prototype), with modern browsers it is also a [very slow operation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) hence it's not recommended.

The recommended way to create objects with a custom prototype is using [`Object.create`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) with accepts the prototype as its argument.

```jsx
let car = { 
  wheels: 4,
  honk: function() {
    console.log('Beep!')
  }
}

let prius = Object.create(car)
prius.manufacturer = 'Toyota'

console.log(prius.manufacturer) // 'Toyota'
console.log(prius.wheels) // 4
console.log(prius.honk()) // Beep!
```

Here is a visualization to help you better understand the above snippet:

{% image "prototypes-car-example-visualization.png", "Object.create visualization" %}

In the above example, the object `prius` has `car` as its prototype, so it would be able to access the properties of the prototype while adding some of its own properties as well.






{% headingWithLink "The prototype for creating prototypes" %}

In the last section, we saw the role of prototypes in JavaScript objects, how you can manipulate object prototypes and how you can create an object with a custom prototype via `Object.create`. Although creating objects with custom prototypes via `Object.create` is not ideal because you cannot set any properties on the object while creating the object, also the syntax is not very neat.

So, now let's take a look at another more prevalent way of creating objects with custom prototypes that you may have seen/used before, constructor functions.

Before we dive into what constrctor functions are and how they work, let's look at an interesting thing about JavaScript functions. Whenever you create a function in JavaScript, it has a `prototype` property which is an object and that object has a property called `constructor` that points back to the function itself. You can go ahead and try creating a function and logging the `prototype` property in the browser to see it for yourself. We'll be looking at why it exists in a minute.

{% image "prototypes-constructor-function-example.png", "Constructor function example" %}

Hence if you do `foo.prototype.constructor === foo` it would return `true`   

{% callout %}
Keep in mind that this property is not the same as the prototype as we saw in the last section. In fact, you can go ahead and verify it for yourself by running `Object.getPrototypeOf(foo) === foo.prototype` in the context of the above example and you'll get `false` as the output. Also, the object in the `prototype` property has its own prototype which is the same as the Object prototype we saw in the previous sections.

So to avoid confusion for the rest of the article I'll be using `prototype` when referring to the prototype property of constructor functions and "prototype of {object}" when referring to the prototype of the object.

{% endcallout %}


{% image "prototypes-constructor-function-visualization.png", "Constructor function visualization" %}

Now that we know about the `prototype` property of functions let’s take a look at how it helps with creating objects with custom prototype via constructor functions:

```jsx
function Person(name) {
  this.name = name;
}

let person1 = new Person("Prateek")

console.log(person1.name) // Prateek
console.log(Object.getPrototypeOf(person1)) // { constructor: function Person }
```

In the above snippet, we have a regular function with a property `name` defined on its execution context, via the `this` keyword. When we invoke a function with the new keyword, apart from executing the function it does a bunch of other things:

- To begin with, it creates a new blank JavaScript object and sets the prototype of that object to the `Person` function’s `prototype` property.
- Next, it points this newly created object to the `this` context of the function (i.e., all references to `this` inside the function now point to the newly created object, so in our case, the name property gets defined on that object).
- Lastly, if no object is being returned from the function, it returns `this`.

Now I guess you might have understood how we got the output in the logs for the above snippet. 

Since the `name` property is defined on `this`, we get an object with the `name` property whose value is the argument that we to the function. Also, the newly created object's prototype points to our function's `prototype` property.

{% image "prototypes-object-created-with-constructor-function.png", "Object created with constructor function" %}

You can further verify it by running the following code:

```jsx
console.log(Object.getPrototypeOf(person1) === Person.prototype) // true
```

You can now also create properties on the functions `prototype` property and since it is the prototype shared with all the objects created with `Person` as the constructor function, it would also be available to all those objects.

```jsx
Person.prototype.sayHello = function() {
  console.log(`Hello, ${this.name}`)
}

person1.sayHello() // Hello, Prateek
```





{% headingWithLink "Prototype chaining" %}

Until now, we saw how prototypes in JavaScript work and how JavaScript searches for the property in the prototype if it cannot find that property in that object.

Now you might wonder what if the prototype had another prototype, and that prototype had another prototype, and so on... Will JavaScript keep looking for the property down that chain?

Well the answer is yes. Try running the below snippet in console to see how it works:

```jsx
let car = {
  wheels: 4
}

let tesla = Object.create(car)
tesla.mode = 'electric'

let modelS = Object.create(tesla)
modelS.type = 'sedan'

console.log(modelS.wheels) // 4
console.log(modelS.mode) // electric
```

So whenever you access a property on an object, JavaScript looks if that property exists on that object. If not, it looks for it in its prototype and keeps repeating the same behavior until it reaches the end of the prototype chain and returns `undefined` only if nothing is found at the end of the chain.


{% image "prototypes-chaining-visualization.png", "Prototype chaining" %}

Now that we have an idea of how prototype chaining works let's see how we can use it to implement inheritance with constructor functions.

Consider we have the following constructor function:

```jsx
function Human(name, age, gender) {
  this.name = name
  this.age = age
  this.gender = gender
}

Human.prototype.introduce = function () {
  console.log(`Hey there! I'm ${this.name}`)
}
```

Let’s assume we want to create another constructor function called `Developer` that inherits from the above function.

```jsx
function Developer(name, age, gender, expertise) {
  Human.call(this, name, age, gender)
  this.expertise = expertise
}
```

In the above snippet, we use JavaScript’s [`call`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) method to bind the `Developer` function’s `this` context when calling the `Human` function. The `call` method accepts the `this` context as the first argument and passes the rest of the arguments to the function itself.

But just calling the constructor function isn't enough since you won't be able to access the prototype methods and variables. The `Developer` function's `prototype` property is still the default one which is just an object with the `constructor` property that references the function itself.

```jsx
let john = new Developer("John", 23, "male", "Frontend")

console.log(john.age) // 23
console.log(john.expertise) // Frontend
john.introduce() // TypeError: john.introduce is not a function
```

So to fix that, we'll be using our old friend `Object.create` to create a new object `Human.prototype` as its prototype, and set `Developer.prototype` to that value:

```jsx
Developer.prototype = Object.create(Human.prototype)
```

Although this introduces a minor issue that the `Developer` function's constructor property now points to the `Human` function because we overrode its prototype, it is not something that we would want.

```jsx
console.log(Developer.prototype.constructor === Human) // true
```

To fix that we'll define the `constructor` property on `Developer.prototype` that points to the function again

```jsx
Developer.prototype.constructor = Developer
```

{% callout %}
The way we did it above fixes the issue, but we would still have one little problem. If you were to use the `prototype` inside a `for in` loop, the `constructor` property would also appear in that loop, which you might not want. To fix that, you can define the `constructor` as a non-enumerable property on `Developer.prototype` using [`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).
{% endcallout %}

You can now also define new properties on `Developer.prototype` and access them on the objects created via the `Developer` constructor function

```jsx
Developer.prototype.describeExpertise = function() { 	
   console.log(`Hello I'm ${this.name} and I'm a ${this.expertise}`) 
}
```

Let's try creating a new object, with the `Developer` constructor function

```jsx
const jane = new Developer("Jane", 23, "female", "Android Developer")

jane.introduce() // Hey there! I'm Jane
jane.describeExpertise() // Hello I'm Jane and I'm a Android Developer
```

Again here’s a visualization to help you grasp what’s happening here:

{% image "prototypes-prototypal-inheritance-visualization.png", "Prototypal inheritance example" %}






{% headingWithLink "Classes in JavaScript" %}

So now that we understand how prototype and prototype chaining work and how they allow for prototypal inheritance in JavaScript, let's look at JavaScript classes.

The `class` keyword was officially added to JavaScript with ES6 in 2015. The classes created with the `class` keyword are primarily syntactic sugar over the prototypal inheritance we saw in the previous section. Still, they also have some syntax and semantics that are not shared with pre-ES6 class-like semantics.

For example, let's take the `Human` function that we created in the previous section, adding it here for reference:

```jsx
function Human(name, age, gender) {
  this.name = name
  this.age = age
  this.gender = gender
}

Human.prototype.introduce = function () {
  console.log(`Hey there! I'm ${this.name}`)
}
```

The equivalent class code for the above function would be

```jsx
class Human {
  constructor(name, age, gender) {
    this.name = name
	  this.age = age
	  this. gender = gender
  }

  introduce() { 	 
    console.log(`Hey there! I'm ${this.name}`) 	
  } 
}
```

As you can see, the syntax with `class` is much easier to understand and is similar to what you might have seen in some other languages. It gets even better when it comes to inheritance. Remember the changes we had to make to the `Developer` function so that it could inherit the prototype from `Human`. Let's retake a look at it for reference:

```jsx
function Developer(name, age, gender, expertise) {
  Human.call(this, name, age, gender)
  this.expertise = expertise
}

// Inherit the prototype from human
Developer.prototype = Object.create(Human.prototype)
// Add the overrridden constructor property again
Developer.prototype.constructor = Developer

Developer.prototype.describeExpertise = function() {
	console.log(`Hello I'm ${this.name} and I'm a ${this.expertise}`)
}
```

This is how it looks like with the class syntax:

```jsx
class Developer extends Human {
	constructor(name, age, gender, expertise) {
		super(name, age, gender)
		this.expertise = expertise
	}

	describeExpertise() {
		console.log(`Hello I'm ${this.name} and I'm a ${this.expertise}`)
	}
}
```

Creating objects from class is exactly similar to what we did in the previous section.

```jsx
let dev = new Developer("Dev", 33, "male", "iOS Developer")

dev.introduce(). // Hey there! I'm Dev
dev.describeExpertise(). // Hello I'm Dev and I'm a iOS Developer
```

Apart from the things we saw above JavaScript classes have multiple other features like private fields, mixins, getters etc. but those would be out of scope of this article. I would recommend you to check out the [MDN docs for classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) if you're interested in learning more about them.






{% headingWithLink "Conclusion" %}

To summarize again, in this article we learned what prototypes are and what are they used for, how you can create objects with a custom prototype with constructor functions, what is prototype chaining and how you can achieve prototypal inheritance with it, and finally, how do all these concepts apply to JavaScript classes.

If you made it till here, I hope you learned something new about JavaScript and understand why it is called a prototype-based language. 

P.S. - The visualizations I created for this article were made with [Excalidraw](https://excalidraw.com/) and were inspired by the mental models from [Dan Abramov](https://twitter.com/dan_abramov) and [Maggie Appleton](https://maggieappleton.com/)’s [Just JavaScript](https://justjavascript.com/) course.