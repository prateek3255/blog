---
title: Why using object spread with reduce probably a bad idea
date: 2021-06-14
updatedAt: 2021-06-14
permalink: /why-using-object-spread-with-reduce-bad-idea/
templateEngineOverride: njk,md
description: Explore why using object spread with .reduce() can sometimes significantly affect the performance of your JavaScript apps and libraries.
thumbnail: why-using-object-spread-with-reduce-bad-idea.png
author: Prateek Surana
tags:
  - javascript
  - best-practices
---

This tweet regarding a simplified way to use reduce got a lot of attention recently in the JavaScript community.

<div style="width:100%; display:flex; justify-content:center;">
<blockquote class="twitter-tweet" style="margin-left:auto; margin-right:auto;" data-dnt="true" data-theme="light"><p lang="en" dir="ltr">Simplify your .reduce calls by doing as much work as possible in .filter and .map instead. Compare these two snippets. Which is more readable? Notice that when map arranges data exactly how we want, our .reduce can be just Object.assign.<a href="https://twitter.com/hashtag/typescript?src=hash&amp;ref_src=twsrc%5Etfw">#typescript</a> <a href="https://twitter.com/hashtag/javascript?src=hash&amp;ref_src=twsrc%5Etfw">#javascript</a> <a href="https://t.co/3TW57kaCar">pic.twitter.com/3TW57kaCar</a></p>&mdash; Rupert Foggo McKay (@maxfmckay) <a href="https://twitter.com/maxfmckay/status/1396252890721918979?ref_src=twsrc%5Etfw">May 22, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

If you see the replies, you'll find how most people are concerned over the fact that the 2nd method is worse (which also doesn't work as expected, as [we'll discuss later in this post](#reduce-object-assign-bug)) because we are iterating the array thrice when in fact the former one is much slower. After all, the spread operator takes almost O(n) time, resulting in the overall time complexity of O(n<sup>2</sup>) for the first method. The latter is still O(n) (yes 3 times O(n) is still O(n), measuring 'hot paths' in code for time complexity is worthless) which is far better that O(n<sup>2</sup>) because of the exponential nature of the latter.






{% headingWithLink "Why is the spread operator so slow?" %}

The speed of the spread operator can vary depending upon how your JavaScript is getting compiled, but for the sake of this article, let's consider it is compiled using the v8 engine, which Node and Chrome use.

So let's assume we have a spread operator like this -

```jsx
const obj1 = { a: 'hello', b: 'world' }

const obj2 = { ...obj1, c: 'foo' }
```

Not going too deep into the implementation details of how it works, but when you use the spread operator like the above example, the compiler has to do a bunch of stuff like creating a new object literal, iterating and copying the `obj1` keys to the new object, and then adding the new keys ( `c: 'foo'` ).

Let's take this example where we convert an array of objects to an object via reduce -

```jsx
const arr = [
  { id: 'ironman', name: 'Tony Stark'},
  { id: 'hulk', name: 'Bruce Banner'},
  { id: 'blackwidow', name: 'Natasha Romanoff'},
]

const superheroes = arr.reduce(
  (acc, item) => ({
    ...acc,
    [item.id]: [item.name],
  }),
  {}
);
```

Here the `reduce` loop runs n times for the array (where n is the number of items in the array). And as we discussed earlier, there is an invisible inner loop here as well with the spread operator that copies the existing accumulator keys to the new object. 

Although the inner loop doesn't exactly run n times because it depends on the number of keys currently present in the accumulator, which grows with every iteration of the outer loop. 

To simplify the above paragraph, this is how it works -

```jsx
// First iteration
acc -> {} 
{ ...acc, ironman: 'Tony Stark' }// No key needs to be copied

// Second iteration
acc -> { ironman: 'Tony Stark' } 
{ ...acc, hulk: 'Bruce Banner' } // 1 key from the accumulator 
// would be copied to the new object

// Thrid iteration
acc -> { ironman: 'Tony Stark', hulk: 'Bruce Banner' } 
{ ...acc, blackwidow: 'Natasha Romanoff' } // 2 keys from the accumulator 
// would be copied to the new object 

// ... and so on
```

So even though the inner loop doesn't exactly run n times on every iteration, it's safe to say that it's in the same class of solutions that execute n<sup>2</sup> times, so we can say its O(n<sup>2</sup>).

 > I am assuming here that no duplicate keys are generated in the target object because the time complexity would still be classified as O(n<sup>2</sup>), but the actual run time will vary depending upon the number of duplicate keys since the size of the accumulator would vary accordingly with every iteration.

But what if you're using some transpiler like [Babel](https://babeljs.io/) or [TypeScript's transpiler](https://www.typescriptlang.org/play) and targeting ES5 (which we generally do to support older browsers).

Well, first, if you see the specification of the [object rest spread proposal on tc39](https://github.com/tc39/proposal-object-rest-spread/blob/master/Spread.md), you will see that -

```jsx
let ab = { ...a, ...b };

// Desugars to - 
let ab = Object.assign({}, a, b); 
```

Here, the desugared syntax also has a similar time complexity as the spread operator because it is doing pretty much the same thing, creating a new object and then iterating and copying the keys of the remaining objects to the new object.

Babel transpiles the [spread syntax to something similar to the desugared TC39 proposal](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=false&spec=true&loose=true&code_lz=MYewdgzgLgBCBGArAjDAvDA3jAHgLhgE4YBfAKDNElgUQCZ0sYBPA5ABlIqul0ewB0Q2sgA0MIQNp1xALwIAOEjDJA&debug=false&forceAllTransforms=true&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=false&timeTravel=false&sourceType=script&lineWrap=true&presets=env%2Creact&prettier=false&targets=&version=7.14.3&externalPlugins=). Although [TypeScripts transpiler creates nested `Object.assign` calls](https://www.typescriptlang.org/play?#code/MYewdgzgLgBCBGArAjDAvDA3jAHgLhgE4YBfAWAChLRJYFEAmdLGATwOQAZTLrxpczbADpR9ZABoYo4fQZSAXgQAcJGJSA), which I'm not sure why. 

If you want to get into the weeds of what I tried to explain above, you can refer to [this awesome](https://www.richsnapp.com/article/2019/06-09-reduce-spread-anti-pattern) article by [Rich snapp](https://twitter.com/snapwich) that covers the same topic in much greater detail.







{% headingWithLink "The better solution" %}

So what is the right way of converting an array to an object like this? Well, there are many ways, and if you see the Twitter thread, you will see a lot of people arguing about how some methods are faster than others. I won't be covering all that, but speaking strictly in terms of time complexity, here is my favorite one -

```jsx
let result = {}

users.forEach((user) => {
  if (user.active) {
    result[user.id] = user.name;
  }
});
```

In the above method since we are mutating the result object directly the complexity here is O(n), also its more readable as well.

This method using [`Object.fromEntries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries) is also very neat because `Object.fromEntries` is built to convert iterables to object.

```jsx
const filteredUsers = users
  .filter((user) => user.active)
  .map((user) => [user.id, user.name]);

const result = Object.fromEntries(filteredUsers);
```

<div class="bg-blue-100 px-9 py-1 rounded-md mt-12 relative" x-data="{ showMore: false }" id="reduce-object-assign-bug">
<div class="absolute p-2 bg-white rounded-full" style="top:-14px; left:-14px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
</div>

Lastly, let's talk about the method that the tweet author suggested. As I mentioned initially, it might look much worse, but 3x O(n) is still O(n), so complexity wise we are probably good. Still, a small mistake leads to a slightly unexpected result and a significantly worse performance.

```jsx
users
  .filter((user) => user.active)
  .map((user) => ({ [user.id]: user.name }))
  .reduce(Object.assign, {});
```

<button x-show.transition.opacity.duration.100ms="!showMore" x-on:click="showMore = !showMore" class="flex gap-1 m-0 p-0 border-none bg-transparent items-center font-bold mb-3 mt-4">
Show more <span> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg> </span>
</button>

<div x-cloak x-show.transition.opacity.duration.300ms="showMore">

The problem here is in the `reduce` call where we directly pass `Object.assign` to it. If you check the documentation for `reduce` you'll find that it passes the [following arguments to the callback function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#how_reduce_works) -

```jsx
arr.reduce(function(accumulator, currentValue, currentIndex, array) {
  // Ommitted for brevity
}, initialValue)
```

So we end up passing all these parameters to `Object.assign`, which increases the complexity of the operation and returns a slightly weird result. To understand, let's take a look at one of the iterations of the `reduce` call -

```jsx
// users = [
//  { id: 'id1', name: 'foo', active: true }, 
//  { id: 'id2', name: 'bar', active: true }
// ]

// After the processing data is done by the filter and map
// functions, this gets passed to the Object.assign in the first
// iteration of the  reduce

Object.assign({}, { id1: 'foo' }, 0, [{ id1: 'foo' }, { id2: 'bar' }])

// Let's take a look at the arguments being passed -

// First argument is the accumulator which for the first iteration is 
// an empty object - {}

// Second argument is the currentValue which is the first item from 
// the array generated by the preceding map - { id1: 'foo' }

// Third argument is the currentIndex which represents the index of the
// current item - 0

// Last argument is the array itself which is generated by map in the 
// previous step - [{ id1: 'foo' }, { id2: 'bar' }]
```

The first two arguments are what we expected, the third argument being [a number doesn't have any effect,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#primitives_will_be_wrapped_to_objects) the last argument is where the problem starts. Since arrays are also objects in JavaScript, they are also copied via `Object.assign` with their indexes as the keys. You can view the [generated result in this repl](https://replit.com/@prateek3255/object-assign-bug#index.js).

The correct way would be to pass only required arguments to `Object.assign` -

```jsx
users
  .filter((user) => user.active)
  .map((user) => ({ [user.id]: user.name }))
  .reduce((acc, currentValue) => Object.assign(acc, currentValue), {});
```

[Jake](https://twitter.com/jaffathecake) wrote a really nice article about this pattern explaining [why you shouldn't use functions as callbacks unless they're designed for it](https://jakearchibald.com/2021/function-callback-risks/).
</div>
</div>







{% headingWithLink "Wait, isn't this premature optimization?" %}

As much as I want to say it is, it's probably not. Since the reduce with spread technique is exponentially worse than the rest of the methods, it gets gruesome with just a little increase in data.

Take [this repl running on Node 12](https://replit.com/@prateek3255/reduce-timings#index.js), for example. You can see how the time taken goes from just a couple of milliseconds for 10 times to a few 100 ms for 100 items and a staggering 1-2 seconds for 1000 items. Meanwhile, the difference between the rest of O(n) methods stays under 10ms for all the cases.

The results could be even worse if you're running this on a browser and your users are using some low-powered devices. You could block the main thread and block any interactions for a few hundred milliseconds, resulting in a very laggy UX.

{% image "comparison-computational-complexity.png", "Comparing computational complexity of different Big O notations" %}

So if we were arguing amongst the O(n) methods that we discussed in the previous section, then that probably would have been a case for premature optimization but not this. Since as its clear from the above graph how the reduce with spread method (with O(n<sup>2</sup>) complexity) gets considerably worse with the increasing input size.





{% headingWithLink "Conclusion" %}

So, in conclusion, you should try to avoid this pattern in your code, even if you think that the data set is small enough to have any significant impact on performance because you may end up using this method in places where it actually hampers the performance.