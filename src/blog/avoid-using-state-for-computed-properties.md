---
title: Why you should avoid using state for computed properties
date: 2021-07-18
updatedAt: 2021-07-18
permalink: /blog/why-you-should-avoid-using-state-for-computed-properties/
templateEngineOverride: njk,md
description: Understand why creating state variables for properties that can be computed is a bad idea, and how you can handle some edge cases when you need to derive your state from props.
thumbnail: why-you-should-avoid-using-state-for-computed-properties.png
author: Prateek Surana
tags:
  - react
  - best-practices
---


I have often seen many people (including my past self) creating state variables for any kind of value that can change across renders including the ones that can be directly dervied from existing state or props. This pattern can often lead to some nasty and hard to debug state synchronization bugs, which can be easily avoided by computing those properties on the fly instead.

Let's try to understand with an example of what I meant in the above paragraph. Consider this example where we have a form with a field for name, and a submit button, which remains disabled until the user enters a name (A much better way to do this would be using [HTML form validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation), but don't forget this is a contrived example 😅). Right now, it has two state variables, one for keeping track of the name and the other for error ([Try it out on codesandbox](https://codesandbox.io/s/simple-name-state-9l8c5?file=/src/App.js)) -

```jsx
function App() {
  const [name, setName] = React.useState("");
  const [hasError, setHasError] = React.useState(true);

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
    setHasError(value.trim().length < 1);
  };

  return (
    <div className="App">
      <div className="form-item">
        <label>Name:</label>
        <input type="text" value={name} onChange={handleNameChange} />
      </div>
      <button disabled={hasError}>Submit</button>
    </div>
  );
}
```

Now, this might seem fine at first but imagine if a new requirement comes in, and you need to add a new field to the form, which is also required, so you would now need to update the `hasError`  value there as well to keep the value in sync.

To exemplify the above problem, let's extend our above example by adding a field for age, and let's imagine the age needs to be greater than 18 years. ([Try it out on codesandbox)](https://codesandbox.io/s/simple-name-with-gender-state-7wroc?file=/src/App.js)

```js/2,5-9,17-24,32-35
function App() {
  const [name, setName] = React.useState("");
  const [age, setAge] = React.useState(0);
  const [hasError, setHasError] = React.useState(true);

  const handleErrorUpdate = ({ currentName, currentAge }) => {
    setHasError(currentName.trim().length < 1 
      || currentAge < 18 
      || currentAge > 100);
  };

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
    handleErrorUpdate({ currentName: value, currentAge: age });
  };

  const handleAgeChange = (event) => {
    const value =
      event.target.value.length > 0 
      ? parseInt(event.target.value, 10) 
      : 0;
    setAge(value);
    handleErrorUpdate({ currentName: name, currentAge: value });
  };

  return (
    <div className="App">
      <div className="form-item">
        <label>Name:</label>
        <input type="text" value={name} onChange={handleNameChange} />
      </div>
      <div className="form-item">
        <label>Age:</label>
        <input type="number" value={age} onChange={handleAgeChange} />
      </div>
      <button disabled={hasError}>Submit</button>
    </div>
  );
}
```

For the sake of DRY, I have moved the error update logic to a separate function. If we go by this logic, then we would have to call the `handleErrorUpdate` method every time we add or update a required form field. If we miss updating the error state, it can cause the `hasError` state to go out of sync and result in hard to debug errors for complex applications.

Now instead of doing it like this, we can calculate the error in a `useEffect` and set the error state there like this ([Try it out on codesandbox](https://codesandbox.io/s/simple-name-with-gender-state-use-effect-5zu27?file=/src/App.js)) - 

```jsx
React.useEffect(() => {
  setHasError(name.trim().length < 1 || age < 18 || age > 100);
}, [name, age]);
```

And yes, this does simplify the code by removing the unnecessary code for calling the error handler wherever the relevant state is supposed to be updated. Also, if you're using [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) (which you should definitely use), it would warn you if you add some new variable to the `setHasError` logic and don't include it in the dependency array.

But what if there's something even better? As you can see, the `hasError` state is just being derived from the existing state that we already have in our component. So instead of maintaining a separate state for it, we can calculate it on the fly with every render like this -

```jsx
const hasError = name.trim().length < 1 || age < 18 || age > 100;
```

This way, we wouldn't need to worry about `hasError` getting out of sync by introducing a new dependency. Also, it is a lot easier to understand and saves us an additional render. ([Try it out on codesandbox)](https://codesandbox.io/s/simple-name-with-gender-state-final-8znyv?file=/src/App.js)

One thing you might argue about is performance. Since we calculate this computed state property on every render wouldn't it be less performant than calculating it only when one of the dependent variables changes as we did previously?

The answer is yes, it depends. It could be if it's some computationally expensive calculation and variable that the calculation relies on don't change that often with every render, but guess what the [`React.useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo) hook is built exactly for these kinds of situations.

> Although for most cases like the example we are working on, using `React.useMemo` would be a case of premature optimization because the variables depend on all the variables that cause a re-render, and it's not that expensive. You can also check out my article on [when you should memoize](https://prateeksurana.me/blog/when-should-you-memoize-in-react/) if you are interested in exploring this topic further.






{% headingWithLink "What about derived state from props?" %}

For props as well, you can rely on the same pattern of directly deriving the desired values from props as we discussed in the previous section and avoid managing the state internally to steer clear of any state synchronization problems. So for our previous example, if the name and age values were provided via props from the parent component, our implementation for `hasError` would have remained the same.

```jsx
function App ({ name, age }) {
  ...
  const hasError = name.trim().length < 1 || age < 18 || age > 100;
  ...
} 
```

Although there are some edge cases where you need the props just for initial values and then manage them via some state internally.

Let's try to understand when you might run into a situation like this, with [an example from this issue on the React repo](https://github.com/facebook/react/issues/15523) asking the same question.

In this example, we have a list of items and every item has an edit button next to it, clicking on which opens an editor on the side where the user can edit the item properties and can save or cancel the updates. Currently, the item properties are passed as props to the editor component, which it then uses as initial values for its internal state, which handles the editor inputs.

<iframe src="https://codesandbox.io/embed/dervied-state-from-props-problem-2r0js?fontsize=12&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dervied-state-from-props-problem"
     loading="lazy"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

This is what the code for the Editable list looks like -

```jsx
import React, { useState } from "react";

const StatefulEditor = (props) => {
  const [name, setName] = useState(props.item.name);
  const [description, setDescription] = useState(props.item.description);

  return (
    <div className="editor">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="button-container">
        <button
          onClick={() =>
            props.onConfirm({ id: props.item.id, name, description })
          }
        >
          Ok
        </button>
        <button onClick={props.onCancel}>Cancel</button>
      </div>
    </div>
  );
};

const EditableList = (props) => {
  const [itemUnderEdit, setItemUnderEdit] = useState(null);

  const closeEditor = () => setItemUnderEdit(null);
  const saveChangedItem = (itemToSave) => {
    props.handleItemUpdate(itemToSave);
    closeEditor();
  };

  return (
    <div className="editable-list">
      <div>
        {props.items.map((item) => (
          <div key={item.id}>
            {item.name}
            <button onClick={() => setItemUnderEdit(item)}>Edit</button>
          </div>
        ))}
      </div>
      {itemUnderEdit && (
        <StatefulEditor
          item={itemUnderEdit}
          onConfirm={saveChangedItem}
          onCancel={closeEditor}
        />
      )}
    </div>
  );
};

export default EditableList;
```

If you click on 'Ok' or 'Cancel' to close the editor after editing an item and then opening another item, this seems to be working fine. But try clicking on the edit button for any other item without closing the editor. You will notice the problem with this approach. The values in the editor remain the same even though the props have changed.

So why does this happen? It is because the state only gets initialized during the initial component mount, and even though the change in props cause a re-render, our `useState` cannot be re-initialized. This is one of the reasons why the [React docs recommend avoiding this pattern](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#anti-pattern-erasing-state-when-props-change).

But for our case, we have to rely on this pattern, so what can we do to keep the state and props in sync for this case?

Well, as it turns out, there are a few ways of fixing it. One is that you can add a `key` prop with the value as the id of your item to the Editor component. This would cause React to [unmount the previous instance of the component and remount it](https://stackoverflow.com/a/43892905/8252081) causing our state to be initialized again whenever the props, i.e. the key with item id, change.

```jsx/2
...
        <StatefulEditor
          key={item.id}
          item={itemUnderEdit}
          onConfirm={saveChangedItem}
          onCancel={closeEditor}
        />
...
```

This should suffice for most situations. If your component tree is expensive, then the above method can slightly affect performance because your component gets unmounted and remounted again. So what the [React docs recommend](https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops) is that you update the state during rendering, and React will re-run the component with updated state immediately after the current render. So in our case, this is what it would look like this - 

```jsx/3-9
const StatefulEditor = (props) => {
  const [name, setName] = useState(props.item.name);
  const [description, setDescription] = useState(props.item.description);
  const [id, setId] = useState(props.item.id);

  if (props.item.id !== id) {
    setName(props.item.name);
    setId(props.item.id);
    setDescription(props.item.description);
  }

  return (
    ...
  )
}
```

Here is the sandbox with the above fix, and if you check again you'll see that the issue is gone now - 

<iframe src="https://codesandbox.io/embed/dervied-state-from-props-solution-bmpsy?fontsize=12&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dervied-state-from-props-solution"
     loading="lazy"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Since this is a contrived example, it doesn't look great. In a real-world scenario, you might want to use [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer) if you have too many individual states to manage like this.





{% headingWithLink "Conclusion" %}

So I hope this article helped you understand why creating state variables for computed properties is not a good idea and how you can compute them on the fly instead and optimize via `useMemo` if needed. We also saw how you could sync state with props in some edge cases where you don't have any other reasonable option. You can also check out [this article by Kent C. Dodd's](https://kentcdodds.com/blog/dont-sync-state-derive-it), which talks about the same topic, with some additional thoughts on how you can handle it in other libraries as well.

Also, let me know in the comments section below if I have missed something or if you have better alternative ideas for the examples I used in this article.