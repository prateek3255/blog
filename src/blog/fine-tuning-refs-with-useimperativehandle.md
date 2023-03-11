---
title: Fine-tuning refs with useImperativeHandle
date: 2023-03-11
updatedAt: 2023-03-11
permalink: /blog/fine-tuning-refs-with-useimperativehandle/
templateEngineOverride: njk,md
description: Understand what refs in React are, how you can use them to manipulate DOM nodes and how you can customize the exposed refs with useImperativeHandle
thumbnail: fine-tuning-refs-with-useimperativehandle.png
author: Prateek Surana
tags:
  - react
---

React is a powerful UI library that provides developers with a great developer experience (DX) through its declarative approach to building user interfaces. This approach abstracts away the complexity of manipulating DOM nodes, making it easier to build UIs. However, there are times when you need to access the DOM nodes managed by React, such as when you need to focus a node or measure its size. Unfortunately, there is no built-in way to do this with React.

This is where refs come in. The `useRef` API provided by React allows you to pass refs to a DOM node, which gives you access to that node. You can then perform actions or manipulate the node via the native JavaScript DOM API. Additionally, React provides the `useImperativeHandle` API, which lets you customize or expose only a subset of methods for that node.

So, in this article, we will be looking at how refs allow you to manipulate DOM nodes, how you can fine-tune them with `useImperativeHandle`, and some gotchas that you need to take care of when working with this hook.

But before we begin:


{% headingWithLink "What are refs anyways?" %}

If you’re familiar with refs in React, feel free to skip this section. But if you need a refresher or have no idea what they are, continue reading.

Refs are kind similar to a state in React in the sense that you want your component to remember a piece of information across re-renders. The most important thing that separates refs from the state is that, **unlike state, they do not trigger a re-render when updated, and unlike state, they are also mutable.** 

You can use the [`useRef`](https://beta.reactjs.org/reference/react/useRef) hook and pass it an initial value that you want to reference.

```jsx
import { useRef } from "react";

const Component = () => {
	const ref = useRef(0);
	//    ^ { current: 0 }
}
```

The hook returns an object with a `current` property holding the initial value. Unlike state, this value is meant to be mutable, enabling you to save, read, and modify it across renders. Hence, Refs provide an alternative to React's one-way data flow since updates on refs won't cause your component to re-render.

The most simple use case where you might need refs is when you want to store an interval ID for a `setTimeout()` or `setInterval()` so as to clear the interval when needed.

<iframe src="https://codesandbox.io/embed/ref-demo-0q01ij?fontsize=14&hidenavigation=1&theme=dark&codemirror=1&hidedevtools=1&view=split&editorsize=65"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="ref-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Keep in mind **not to use refs during rendering** (using them to display data on screen or deriving some value from them that ends up affecting the data displayed to the user) because changing them doesn’t trigger a re-render you might end up showing incorrect data.

Although the most common use of refs is getting access to DOM nodes. As we discussed at the beginning of this article React takes care of manipulating the DOM for you to match the render output of your components, but sometimes you need to do something that React can't, like focusing on an input or calculating the size of a node. In these cases, you can use refs to access the DOM node and use the JavaScript DOM APIs on it.

Here is the simplest example that demonstrates how you can use refs to get access to DOM nodes:

<iframe src="https://codesandbox.io/embed/focus-input-with-ref-5cp5rn?fontsize=14&hidenavigation=1&theme=dark&codemirror=1&hidedevtools=1&view=split"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="ref-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

In the above example, when the button is clicked, the `inputRef` is used to access the input's DOM node, and we use the [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) instance method to focus the input.

{% callout %}
Conceptually you can think of passing a ref hook to React elements as functions that are called after a component is rendered and these functions get DOM node passed as the argument. So passing a ref from the `useRef` hook to a React element is just syntactic sugar for:

```jsx
<input
  ref={(node) => {
    ref.current = node;
  }}
/>
```

Check out [TKDodo’s blog](https://tkdodo.eu/blog/avoiding-use-effect-with-callback-refs) for more info about how this pattern can be useful you need to do something with DOM nodes on mount without relying on the `useRef` and `useEffect` hooks.

{% endcallout %}


Sometimes, the DOM node that you want to access may not be readily available inside your component but is located somewhere inside a React component. In that case, you can use the [`forwardRef`](https://beta.reactjs.org/reference/react/forwardRef) API to forward the DOM node to the relevant HTML element.

For instance in the above example if the input we wanted to use was a React component we can expose the ref from that component like this:

```jsx
import { useRef, forwardRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}

const MyInput = forwardRef(function MyInput(props, ref) {
	return <input {...props} ref={ref} />;
})
```

{% callout %}
Manipulating DOM nodes with refs allows you to use them as an escape hatch, allowing you to do things like focus a node, scroll a node into view, etc., for which there is not a built-in way to do with React. But keep in mind to use them with a grain of salt, using them only for non-destructive actions like focusing, scrolling, etc., and avoid modifying DOM nodes directly managed by React because it can lead to inconsistencies and [can even cause runtime errors](https://beta.reactjs.org/learn/manipulating-the-dom-with-refs#best-practices-for-dom-manipulation-with-refs).

{% endcallout %}


{% headingWithLink "Enter useImperativeHandle" %}

In the previous section, we learned about refs, how to use them to persist values across renders, and how to access DOM nodes using refs. React also provides another hook called [`useImperativeHandle`](https://beta.reactjs.org/reference/react/useImperativeHandle) that allows you to customize the ref handle exposed by your React components.

But why would you want to do that in the first place? Well, let’s take an example to understand the need for this hook.

The most common use case would be if you’re building a component for a library and you only want to expose a subset of the available DOM methods to the consumers of your component.

For example, you are building an Input component, and you allow the parent to pass the ref to the underlying DOM element, but you only want to expose the [`select`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select) method on the input.

```jsx
import { useRef, useImperativeHandle, forwardRef } from "react";

const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    select: () => {
      inputRef.current.select();
    }
  }));

  return <input ref={inputRef} {...props} />;
});

// Some other component that uses our CustomInput component
const App = () => {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
                 // ^ This will throw an error ❌
  };

  const selectText = () => {
    inputRef.current.select();
  };

  return (
    <div>
      <CustomInput ref={inputRef} value="refs are awesome" />
      <button onClick={focusInput}>Focus Input</button>
      <button onClick={selectText}>Select text in input</button>
    </div>
  );
};

export default App;
```

Try it out yourself [on this sandbox](https://codesandbox.io/s/refs-with-input-ufc73c?file=/src/App.js)

The `useImperativeHandle` hook takes in two parameters: the forwarded ref passed from the parent and a function that takes no arguments and returns the ref handle you want to expose (usually, it would be an object with the methods you want to expose). It also takes in an optional third argument which is a dependency array that lists all the reactive values that your second `createHandle` argument might use, causing it to re-execute whenever any dependency changes and assign the newly created handle to the ref.

Also the object you expose with the `createHandle` argument doesn’t need to have a one-to-one mapping with the DOM elements methods. You can expose different methods that do specific tasks on the DOM node. Take this [AutoSelect component from Sentry](https://github.com/getsentry/sentry/blob/master/static/app/components/autoSelectText.tsx) for instance:

```jsx
import { useImperativeHandle, useRef, forwardRef } from "react";

function selectText(node) {
  if (node instanceof HTMLInputElement && node.type === "text") {
    node.select();
  } else if (node instanceof Node && window.getSelection) {
    const range = document.createRange();
    range.selectNode(node);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}

const AutoSelectText = forwardRef(({ children, className, ...props }, ref) => {
  const element = useRef(null);

  function handleClick() {
    if (!element.current) {
      return;
    }
    selectText(element.current);
  }

  useImperativeHandle(ref, () => ({
    selectText: () => selectText(element.current)
  }));

  return (
    <div {...props} onClick={handleClick} className="select-text">
      <span ref={element}>{children}</span>
    </div>
  );
});

export default AutoSelectText;

```

This component selects the text inside the component when it’s clicked. It also exposes a custom method `selectText` on the ref via `useImperativeHandle`, which allows the parent component to select the text inside the component.

Now the parent component can access the `selectText` method of the component by passing the ref to the component:

```jsx
const ParentComponent = () => {
  const childRef = useRef(null);

  return (
    <div>
      <AutoSelectText ref={childRef} />
      <button onClick={() => childRef.current.selectText()}>
        Select Text
      </button>
    </div>
  );
}

```

[Checkout this sandbox](https://codesandbox.io/s/auto-select-text-hi1o7u) to try it out for yourself.

Since you can expose whatever you want from the custom handle, you can do all kinds of stuff that might involve multiple DOM refs or even refs that are passed to the child components. The [new React docs have the best example for this](https://beta.reactjs.org/reference/react/useImperativeHandle#exposing-your-own-imperative-methods), where the component exposes a `scrollAndFocusAddComment` method via an imperative handle that lets the parent component scroll the list of comments and focus on an input field.

{% headingWithLink "Beyond DOM nodes" %}

The recommended usage for `useImperativeHandle` is to expose/customize the imperative methods available on child components' DOM nodes. But its technically not limited to that, and you can also modify the state of the child component from the parent component.

For instance, you have a carousel component that has previous and next buttons to navigate between different items. Imagine a scenario where you want to go to a different slide from the parent component but you want to keep the component uncontrolled? Well `useImperativeHandle` can help you out here:

<iframe src="https://codesandbox.io/embed/carousel-with-useimperative-85g409?fontsize=14&hidenavigation=1&theme=dark&codemirror=1&hidedevtools=1&view=split&module=%2Fsrc%2FApp.jsx"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="ref-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

But keep in mind this is not a recommended behavior. You should ideally **use refs only for imperative behaviors that can’t be achieved via props since it goes against React’s core fundamentals of one-way data flow and can also get bug prone and difficult to test**.

Hence, in this case, it would have been better if the current slide was controlled by the parent instead and was passed to the Carousel component as a prop.

<iframe src="https://codesandbox.io/embed/carousel-controlled-4ffew3?fontsize=14&hidenavigation=1&theme=dark&codemirror=1&hidedevtools=1&view=split&module=%2Fsrc%2FApp.jsx"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="ref-demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

{% headingWithLink "Conclusion" %}

In conclusion, we saw what refs are, how you can access DOM nodes with them, and how the `useImperativeHandle` hook acts as another powerful tool that allows you to customize the ref handle exposed by your React components. With this hook, you can expose only a subset of methods for a given node or customize the methods you want to expose, making it easier for the consumer components by giving consumer components access to the imperative behaviours they need.

Lastly we also saw how with React being a declarative library, it’s not recommended to use refs for imperative behaviors that can be achieved via props, even though it's technically possible to do so with `useImperativeHandle`.
