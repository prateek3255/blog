---
title: JavaScript tips for React Developers
date: 2021-02-28
permalink: /javascript-tips-for-react-developers/
templateEngineOverride: njk,md
description: Check out how you can write more efficient, maintainable and clean React code with these simple tips.
thumbnail: javascript-tips-for-react-developers.png
author: Prateek Surana
tags:
  - best-practices
  - react
  - javascript
---
I have been working with React for the past couple of years, so naturally, I am not really proud of the code that I wrote when I was just beginning with React, because now I know the mistakes I made which I wasn't aware of back then.

But fast-forwarding to today, I have learned quite a bit along the way through contributing to open source, watching/reading some interesting blogs and conference talks and viewing how other people write code.

Here are some Javascript tips that would've helped my past self and maybe you, in writing more efficient and maintainable React code -




{% headingWithLink "1. Use conditional rendering effectively" %}

As a React developer, you must've been in a situation where you only want to display a component when a certain condition from a prop or state is satisfied or render different components depending on the different values of the state.

For instance, if you have a component where you want to show a loading indicator when the request is being made and render the component with data when the request is successful, this is the way I like to do it -

```jsx
const SomeComponent = ({ isLoading, data }) => {

	if(isLoading) {
    return <Loader/>
  }

  return (
     <DataHandler>
       .
       .
     </DataHandler>
  );

}
```

But what if you want to render something inside JSX when a particular condition is satisfied in that case you can use the Logical AND operator (`&&`) to render it -

```jsx
const Button = ({ showHomeIcon, children, onClick }) => (
  <button type="button" onClick={onClick}>
    {showHomeIcon && <HomeIcon />}
    {children}
  </button>
);
```

Although a more useful scenario would be doing something like this, where you have an optional prop called icon which is a string and contains the name of the icon that can be used to render the icon component accordingly  -

```jsx
const Button = ({ icon, children, onClick }) => (
  <button type="button" onClick={onClick}>
    {/* Icon won't be rendered if the value of
        icon prop is anything other than a string */}
    {typeof icon === "string" && <Icon name={icon} />}
    {children}
  </button>
);

// Renders a button with a home icon
<Button icon="home" onClick={handleClick}>Home</Button>

// Renders a button without an icon
<Button onClick={handleClick}>About</Button>
```

So this solves the problem when you only have one component but what about when you have two or more than two components that you want to render based on some prop or state variable?

For two components ternary operator is my goto method, because of its simiplicity -

```jsx
const App = props => {
  const canViewWelcomeText = isUserAuthenticated(props);

  return canViewWelcomeText ? (
    <div>Hey, there! Welcome back. Its been a while.</div>
  ) : (
    <div>You need to login to view this page</div>
  );
};
```

And if you have quite a few components that need to be rendered from a condition, then switch case is probably the best one to go with -

```jsx
const getCurrentComponent = currentTab => {
  switch (currentTab) {
    case 'profile':
      return <Profile />;
    case 'settings':
      return <Settings />;
    default:
      return <Home />;
  }
};

const Dashboard = props => {
  const [currentTab, setTab] = React.useState('profile');

  return (
    <div className="dashboard">
      <PrimaryTab currentTab={currentTab} setTab={setTab} />
      {getCurrentComponent(currentTab)}
    </div>
  );
}; 
```




{% headingWithLink "2. Avoid using truthy tests" %}

If you are familiar with JavaScript then you might be aware of [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) and [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) values. So a truthy test is nothing but using this coercion ability of JavaScript in control flow statements like this

```jsx
// ❌ Avoid adding checks like these 
// for non boolean variables
if (somVar) {
	doSomething();
} 
```

This might look good at first if you want to avoid something like `null` since it is a falsy value so the statement will work as expected. But the catch here is that this is prone to bugs that can be very difficult to track down. This is because the above statement would block the flow for not `null` but also for all these falsy values of `someVar` which we might want to avoid -

```jsx
someVar = 0
someVar = ""
someVar = false
someVar = undefined
```

So what is the correct way for these checks? 

The valid way is being as straightforward as possible for these checks to avoid any bugs from creeping in. For the above case it would be -

```jsx
// ✅ Explictly check for the conditions you want
if (someVar !== null) {
	doSomething();
}
```

> If you're sure that the variable being passed is a boolean then you can use the former approach. 

This also applies when doing conditional rendering with the Logical and operator that we saw in the previous tip.

If the first operator is falsy then JavaScript returns that object. So in case of an expression like `0 && "javascript"` will return `0` and `false && "javascript"` will return `false` . This can bite you if you were doing something like this -

```jsx
// ❌ This will end up rendering 0 as the text if 
// the array is empty
{cats.length && <AllCats cats={cats} />}

// ✅ Use this instead because the result of the 
// condition would be a boolean
{cats.length > 0 && <AllCats cats={cats} />}
```





{% headingWithLink "3. Use optional chaining and nullish coalescing" %}

When dealing with data in our apps we often need to deal with parts of data that call be `null` or `undefined` and provide default values.

Let's suppose we have an API that returns the details of a Pet in the following format -

```jsx
// Endpoint - /api/pets/{id}
{
  id: 42,
  name: 'Ghost',
  type: 'Mammal',
  diet: 'Carnivore'
  owner: {
    first_name: 'Jon',
    last_name: 'Snow',
    family: {
      name: 'Stark',
      location: 'Winterfell'
    }
  }
}
```

So you could do something like this if you wanted the first name of the pet owner

```jsx
const ownerName = pet.owner.first_name;
```

But like all things in the universe can't be perfect, our API doesn't guarantee that all the details would be available for any given pet and can be `null` or `undefined`.

In that case, the above line of code can result and the following error "Reference error cannot read property `first_name` of `null`" and crash your app if the owner is `null`.

This is where [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) saves you. The optional chaining operator (`?.`) allows you to read the property deep in the chain without having to validate whether the chain is valid, and instead of a reference error, it would return the same old `undefined`. 

So we could easily check for the owner name or even the owner family name without worrying about any errors, like this - 

```jsx
const ownerName = pet?.owner?.first_name;
const ownerFamily = pet?.owner?.family?.name;
```

> Optional chaining can also be used with function calls on properties you are not really sure to exist. For instance, you can do this with an array `friends?.join(",")` , this won't result in an error if friends is anything other than an array, even `undefined`.

Now, this would avoid errors but you still wouldn't want your users to show `undefined` in case it is not available. This is where Nullish Coalescing comes in -

```jsx
const ownerName = pet?.owner?.first_name ?? 'Unknown';
```

The [Nullish Coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator) (`??`) returns the right hand side operand when the left hand side is `null` or `undefined` and otherwise it returns the left hand side operand.

You might think here that the [Logical Or operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR) (`||`) would also have done the same thing. Well in that case I hope you haven't forgotten the truthy and falsy hell of JavaScript that we just covered. Since this operator would return the right hand side operand for all falsy values and can cause hard to debug errors as mentioned in the previous section.

> Since these methods were recently released with [ECMAScript 2020 spec](https://auth0.com/blog/javascript-whats-new-es2020/) browser compatibility for these methods is still in the preliminary stages and only the modern browsers support it right now.
>
> But don't worry most setups we use to compile our apps have already got us covered. If you're using TypeScript ≥ 3.7 then [these methods are supported out of the box](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html).
>
> Else if you're using a typical Webpack + babel setup then you can include the [`@babel/plugin-proposal-optional-chaining`](https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining) and [`@babel/plugin-proposal-nullish-coalescing-operator`](https://babeljs.io/docs/en/babel-plugin-proposal-nullish-coalescing-operator) plugins in your babel config to support these methods.







{% headingWithLink "4. Avoid premature optimization" %}

Be really careful when you want to memoize something in React, because if not done properly it might lead to even worse performance.

I have often seen people prematurely optimizing everything they come across without considering the cost it comes with. For instance, using `useCallback` in situations like this -

```jsx
const MyForm = () => {
  const [firstName, setFirstName] = React.useState('');

  const handleSubmit = event => {
    /**
     * Ommitted for brevity
     */
  };
  
  // ❌ useCallback is unnecessary and can actually be worse for performance
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

Now you might've heard that `useCallback` is known to improve performance by memoizing the function and only updating it when the dependencies change. That is true but you need to understand that **every optimization comes with a cost associated with it**.

In the above case, you are doing more work by creating a `useCallback` which in itself is running some logical expression checks, hence you're better off with just defining the inline function directly like this -

```jsx
const handleChange = event => {
    setFirstName(event.target.value);
};
```

The same things apply with `React.memo`. If you have a component like this that accepts children props, then memoizing the component is basically useless if the children are not memoized -

```jsx
const UselessMemoizedHeader = React.memo(({ children }) => <div>{children}</div>);

const SomeComponent = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <UselessMemoizedHeader>
        <span>Header</span>
      </UselessMemoizedHeader>
      Count: {count}
      <button type="button" onClick={() => setCount(currentCount => currentCount + 1)}>
        Increment count
      </button>
    </div>
  );
};
```

In the above case, the `UselessMemoizedHeader` component would re-render every time you increment the count even though you might think it is memoized.

But why? Since memo just does a shallow comparison of the current props and previous props, and because the children prop won't be [refrentially equal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness) you end up re-rendering the `UselessMemoizedHeader` component every time the count changes. 

Your code ends up being even worse off because of that unnecessary children prop comparison on every render.

So when do you actually need to memoize? Well Kent C. Dodds [covers all the above things with when you should memoize in great detail](https://kentcdodds.com/blog/usememo-and-usecallback) in his article. I would recommend you give it a read.







{% headingWithLink "5. Be vigilant with dependency arrays" %}

The React hooks related to memoization([`useCallback`](https://reactjs.org/docs/hooks-reference.html#usecallback) and [`useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo)) and the [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) hook take a second argument as an array usually known as dependency array.

In case of `useEffect` the effect is re-run only when a shallow equality check of the dependency array is not equal to the previous values.

```jsx
React.useEffect(() => {
  /**
   * Fetch data with new query
   * and update the state
   */
}, [query]); // < The effect reruns only when the query changes
```

Similarly, the memoization hooks, are recomputed only when the values in their dependency array change

```jsx
const someValue = React.useMemo(() => 
  computationallyExpensiveCalculation(count), 
[count]); // < someValue is recomputed only when count changes
```

So now that's clear. Can you find out why does the effect runs everytime the CatSearch component re-renders, even when the query, height and color props are essentially the same -

```jsx
const CatSearch = ({ height, color, query, currentCat }) => {
  const filters = {
    height,
    color,
  };

  React.useEffect(() => {
    fetchCats(query, filters);
  }, [query, filters]); // ❌ This effect will run on every render

  return (
    /**
     * Ommited for brevity
     */
  );
};
```

Well as we discussed in the last section, React just does a shallow comparison of the items in the dependency array and since the filter object gets created in every render it can never be referentially equal to the filter object in the previous render.

So the correct way to do this would be -

```jsx
React.useEffect(() => {
    fetchCats(query, { height, color });
}, [query, height, color]); // ✅ The effect will now run only when one of these props changes
```

The same applies for spreading the dependencies like this - 

```jsx
React.useEffect(() => {
   /**
    * Ommited for brevity
    */
}, [...filterArray, query]); // ❌ This effect would also run on every render
```

> If you are using [ESLint](https://eslint.org/) as your linter then you should definitely install the [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks), it will warn you and even fix issues automatically (if [autofix on save](https://www.digitalocean.com/community/tutorials/workflow-auto-eslinting) is enabled) for most of the mistakes people generally make with these hooks.

Also if you're more interested in how `useEffect` works and how the dependency array affects the effect, then you should definitely check out [A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/) by [Dan Abramov](https://twitter.com/dan_abramov).
