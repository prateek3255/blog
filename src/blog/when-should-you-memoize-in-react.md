---
title: When should you memoize in React
date: 2021-04-18
updatedAt: 2021-04-21
permalink: /blog/when-should-you-memoize-in-react/
templateEngineOverride: njk,md
description: Explore why premature optimization can be bad in React and when should you actually use the memoization methods provided by React
thumbnail: when-should-you-memoize-in-react.png
author: Prateek Surana
tags:
  - react
  - best-practices
---

If you have heard about or used the React memoization methods (useMemo, useCallback, and memo), you might often get tempted to use them in situations where you might not need them.

When I first learned about these methods, I also often ended up using them everywhere because what harm optimizing something could do, right?

Well, as you might have guessed by now, I was wrong because these hooks and methods exist for some specific use cases, and if they're used mindlessly everywhere, they can actually worsen your app's performance.

In this article, I'll try my best to explain -

1. {% slugifiedLink "Why premature optimization is bad" %}
2. {% slugifiedLink "How can you optimize your code without memoizing" %}
3. {% slugifiedLink "When should you actually memoize" %}






{% headingWithLink "Why premature optimization is bad" %}

You might have heard this famous quote by [Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth), that "Premature optimization is the root of all evil." Well, the quote might be old, but it still holds its value for software engineers like us trying to eagerly optimize without analyzing its benefits. So let's understand why it is bad to prematurely memoize in React -






{% headingWithLink "useCallback", "h3" %}

Let's start with an example. What do you think about, handleChange in the below code snippet?

```jsx
const MyForm = () => {
  const [firstName, setFirstName] = React.useState('');

  const handleSubmit = event => {
    /**
     * Omitted for brevity
     */
  };
  
  const handleChange = React.useCallback(event => {
    setFirstName(event.target.value);
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="firstName" onChange={handleChange} />
      <button type="submit" />
    </form>
  );
};
```

I used to think that `useCallback` improves performance by returning a memoized callback that only changes if one of the dependencies changes. In our case, since the dependency array is empty, it would get memoized and would be more efficient than the normal inline function, right?

But, it's not as simple as that, because **every optimization comes with a cost associated with it**. And in the above case, the optimization is not worth the cost it comes with. But why?

```jsx
const handleChange = React.useCallback(event => {
    setFirstName(event.target.value);
}, []);
```

In the above case, `useCallback()` is called every time our `MyForm` component re-renders. Even though it returns the same function object, still the inline function is created on every render, `useCallback` just skips it to have the same reference to the function. Not only that, but we also have the empty dependency array, which itself is doing some work by running through some logical expressions to check if the variables inside have changed, etc.

So this is not really an optimization since **the optimization costs more than not having the optimization**. Also, our code is a bit more difficult to read than it was before because of the function being wrapped in a useCallback.

And as far as inline functions go, this is what [the official documentation on the React website](https://reactjs.org/docs/faq-functions.html#is-it-ok-to-use-arrow-functions-in-render-methods) says, and [they are not actually as bad as you think they are](https://reacttraining.com/blog/react-inline-functions-and-performance/).




{% headingWithLink "useMemo different yet similar", "h3" %}

`useMemo` is also very similar to `useCallback`, with the only difference that it allows memoization to any value type. It does so by accepting a function that returns a value and is only recomputed when the items in the dependency list change. So again, if I didn't want to initialize something on every render, I could do this right? 

```jsx
const MightiestHeroes = () => {
  const heroes = React.useMemo( () => 
    ['Iron man', 'Thor', 'Hulk'], 
  []);
	
	return (
		<>
			{/* Does something with heroes, Ommited for brevity */}
		</>
	)

}
```

Again the savings are so minimal that making the code more complex isn't worth it, and it's probably worse because of the same reasons, which we discussed in the previous section.

For a case like this you would be much better off by defining the array outside the component.

```jsx
const heroes = ['Iron man', 'Thor', 'Hulk'];

const MightiestHeroes = () => {
	// Ommited for brevity 
	
}
```



{% headingWithLink "Edge cases with memo", "h3" %}

The same thing goes with `memo`, if we're not careful enough your memoized component might end up doing more work and hence being more inefficient than the normal counterpart

Take this sandbox for example, how many times do you think this memoized component will render when you are incrementing the count.

<iframe src="https://codesandbox.io/embed/musing-brahmagupta-chx76?expanddevtools=1&fontsize=12&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark&view=split"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     loading="lazy"
     title="musing-brahmagupta-chx76"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

But shouldn't it render only once because it takes only one `children` prop which doesn't appear to be changing across renders? 

Well `memo` does a shallow comparison of the previous props and the new props and re-renders only when the props have changed. So if you've been working with JavaScript for some time then you must be aware of [Referential Equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using) -

```jsx
2 === 2 // true
true === true // true
'prateek' === 'prateek' // true

{} === {} // false
[] === [] // false
() => {} === () => {} // false
```

And since `typeof children === 'object`, the equality check in memo always returns false, so whenever the parent re-renders, it will cause our memoized component to re-render as well.




{% headingWithLink "How can you optimize your code without memoizing" %}

In most cases, check if you can split the parts that change from the parts that don't change, this will probably solve most of the problems without needing to use memoization. For example, in the previous React.memo example, if we separate the heavy lifting component from the counting logic, then we can prevent the unnecessary re-renders.

<iframe src="https://codesandbox.io/embed/summer-bird-w6nvm?expanddevtools=1&fontsize=12&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark&view=split"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     loading="lazy"
     title="summer-bird-w6nvm"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

You can checkout Dan Abramov's article [Before you Memo](https://overreacted.io/before-you-memo/) if you want to read more about it.

But in some cases, you would need to use the memoization hooks and functions, so let's look at when you should use these methods.





{% headingWithLink "When should you actually memoize" %}



{% headingWithLink "useCallback and useMemo", "h3" %}

The main purpose of `useCallback` is to maintain **referential equality** of a function when passing it to a memoized component or using it in a dependency array (since functions are not referentially equal, as discussed above). For `useMemo` apart from referential equality and like `memo`, it is also a way to **avoid recomputing expensive calculations.** Let's understand how they work with some examples -


{% headingWithLink "Referential Equality", "h4" %}

First, let's see how these hooks help us maintain referential equality, take a look at the following example (keep in mind that this is a contrived example to explain the use case of these hooks, actual implementations will vary)

```jsx
const PokemonSearch = ({ weight, power, realtimeStats }) => {
  const [searchquery, setSearchQuery] = React.useState('');

  const filters = {
    weight,
    power,
    searchquery,
  };

  const { isLoading, result } = usePokemonSearch(filters);

  const updateQuery = newQuery => {
    /**
     * Some other stuff related to
     * analytics, omitted for brevity
     */
    setSearchQuery(newQuery);
  };

  return (
    <>
      <RealTimeStats stats={realtimeStats} />

      <MemoizedSearch query={searchquery} updateQuery={updateQuery} />

      <SearchResult data={result} isLoading={isLoading} />
    </>
  );
};

const usePokemonSearch = filters => {
  const [isLoading, setLoading] = React.useState(false);

  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    /**
     * Fetch the pokemons using filters
     * and update the loading and result state
     * accordingly, omitted for brevity
     */
  }, [filters]);

  return { result, isLoading };
};
```

In this example, we have a `PokemonSearch` component that uses the `usePokemonSearch` custom hook to fetch the pokemons for a given set of filters. Our component receives the weight and power filters from the parent component. It also receives a prop for real-time stats, which changes quite often, as the name suggests.

Our component itself handles the last filter, called `searchQuery`, via `useState`. We pass this filter to a memoized component called `MemoizedSearch` with a method to update it called `updateQuery`. 

You might have noticed by now the first problem with our example, every time our `PokemonSearch` re-renders, a new reference of our `updateQuery` function would be created (which would not be equal to the previous reference because of how referential equality works in JavaScript), causing the `MemoizedSearch` component to re-render unnecessarily, even when the `searchQuery` is same.

This is where `useCallback` saves the day -

```jsx
const updateQuery = React.useCallback(newQuery => {
    /**
     * Some other stuff related to
     * analytics, omitted for brevity
     */
    setSearchQuery(newQuery);
}, []);
```

This would help us in maintaining the same reference of the `updateQuery` function which will avoid the unnecessary re-renders of our `MemoizedSearch` component causing it to re-render only when the `searchQuery` changes.

If you check the `usePokemonSearch` custom hook, it has a `useEffect` that relies on the `filters` prop to decide whether to fetch the details of the pokemons whenever it changes. I hope that you noticed the next problem with our example as well. Every time the `PokemonSearch` re-renders, let's suppose not due to the change in one of the filters, it creates a new reference to our `filters` object, which won't be referentially equal to the last one causing the `useEffect` to run with every render of `PokemonSearch` and hence making a lot of unnecessary API calls.

Let's fix this with `useMemo` -

```jsx
const filters = React.useMemo(() => ({
  weight,
  power,
  searchquery,
}), [weight, power, searchQuery]);
```

Now the filter object reference will only be updated when either of our filter changes, thus calling the `useEffect` only when one of our filters change.

So the final code with all the optimizations looks like this -

```jsx
const PokemonSearch = ({ weight, power, realtimeStats }) => {
  const [searchquery, setSearchQuery] = React.useState('');

  const filters = React.useMemo(() => ({
    weight,
    power,
    searchquery,
  }), [weight, power, searchQuery]);

  const { isLoading, result } = usePokemonSearch(filters);

  const updateQuery = React.useCallback(newQuery => {
    /**
     * Some other stuff related to
     * analytics, omitted for brevity
     */
    setSearchQuery(newQuery);
  }, []);

  return (
    <>
      <RealTimeStats stats={realtimeStats} />

      <MemoizedSearch query={searchquery} updateQuery={updateQuery} />

      <SearchResult data={result} isLoading={isLoading} />
    </>
  );
};

const usePokemonSearch = filters => {
  const [isLoading, setLoading] = React.useState(false);

  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    /**
     * Fetch the pokemons using filters
     * and update the loading and result state
     * accordingly, omitted for brevity
     */
  }, [filters]);

  return { result, isLoading };
};
```


{% headingWithLink "Avoiding recomputing expensive calculations", "h4" %}

Apart from referential equality, the `useMemo` hook, similar to the `memo` function, serves one more purpose of avoiding recomputing expensive calculations with every render if they are not required.

For instance, take the following example, if you try to update the name really fast, you will be able to see a certain lag because the 35th Fibonacci number (which is purposefully slow and blocks the main thread while computing) is getting calculated every time your component re-renders even though the position remains the same.

<iframe src="https://codesandbox.io/embed/expensive-calculation-without-usememo-p393q?fontsize=12&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark&view=split"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     loading="lazy"
     title="expensive-calculation-without-usememo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Now let's try this with `useMemo`.  Try updating the name really fast again and see the difference -

<iframe src="https://codesandbox.io/embed/expensive-calculation-with-usememo-s8hmx?fontsize=12&hidenavigation=1&theme=dark&view=split"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     loading="lazy"
     title="expensive-calculation-with-usememo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

With `useMemo` we only re-calculate the Fibonacci number only when the position changes thus avoiding the unnecessary main thread work.



{% headingWithLink "memo", "h3" %}

If your component re-renders the same result given the same props, `React.memo` can give you a performance boost by skipping re-rendering if the props haven't changed.

Dmitri created a really nice illustration in his article [Use React.memo() Wisely](https://dmitripavlutin.com/use-react-memo-wisely/) which you should use a general rule of thumb when you're thinking about memoizing a component.

{% image "when-to-use-react-memo.png", "When should you use React.memo" %}


Enough with the concepts, let's try to understand this with an example on when `React.memo` can be handy. In the below sandbox, we have a `usePokemon` hook that returns some static and real-time data for a pokemon.

The static details include the name image and abilities of the Pokemon. In contrast, the real-time info includes details like the number of people who want this Pokemon and the number of people who own the Pokemon, which change quite often.

These details are rendered by three components `PokemonDetails`  which renders the static details, and `Cravers` and `Owners`, which render the real-time info, respectively.

<iframe src="https://codesandbox.io/embed/pokemon-memo-tdkel?fontsize=12&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark&view=split"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     loading="lazy"
     title="pokemon-memo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Now, if you check the console in the above sandbox, it doesn't look good because even though `PokemonDetails` consist of static data, it still re-renders every time any of our real-time values change, which is not very performant. So let's use the Checklist by Dmitri mentioned above to see if we should memoize it - 

- **Is it a pure functional component, that given the same props renders the same output?**

    Yes, our `PokemonDetails` component is functional and renders the same output with the same props ✅
- **Does it re-render often?**

    Yes, it re-renders often because of the realtime values provided by our custom hook ✅

- **Does it re-render with the same props?**

    Yes, the props it uses don't change at all across all its renders ✅
- **Is it a medium to big size component?**

    Since this is a very contrived example, it isn't really isn't in the sandbox, but for the sake of this example let's assume it is (Although even though isn't very expensive but given that it satisfies the above three conditions it still is a pretty good case for memoization) ✅

Since, our component satisfies the above conditions, let's memoize it -

<iframe src="https://codesandbox.io/embed/pokemon-memo-forked-1j97f?fontsize=12&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark&view=split"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     loading="lazy"
     title="pokemon-memo (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

If you check the console in the above sandbox, you'll see that it gets re-rendered only once, optimizing our code quite a bit by saving us potentially expensive re-renders.



{% headingWithLink "Conclusion" %}

If you've reached this far, I assume you get the point I am trying to make here. I'll repeat it **every optimization you do comes with a cost associated with it**, and the optimization is only worth it if the benefits outweigh the cost. In most cases, you might even not need to apply these methods if you can separate the parts that often change from the parts that don't change that much, as we discussed above.

I know it's a bit annoying, and maybe in the future, some really smart compiler could automatically take care of these things for you, but till then, we would have to be careful and [analyze the benefits](https://reactjs.org/docs/profiler.html) while using these optimizations.





{% headingWithLink "Have I read this before?" %}

You might have because some parts of it were inspired by [this excellent post](https://kentcdodds.com/blog/usememo-and-usecallback) by Kent C. Dodds. I really enjoyed the post, and realized that these methods were still often misused and hence deserved more attention, so I decided to write about it with examples from some situations that I have faced.