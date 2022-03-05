---
title: Simplify immutable data structures in useReducer with Immer
date: 2022-03-06
updatedAt: 2022-03-06
permalink: /blog/simplify-immutable-data-structures-in-usereducer-with-immer/
templateEngineOverride: njk,md
description: Learn how you can simplify deeply nested state updates when using useReducer with Immer.
thumbnail: simplify-immutable-data-structures-in-usereducer-with-immer.png
author: Prateek Surana
tags:
  - react
  - typescript
---

When it comes to state management in React, [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer) offers a robust API that shines when you have a complex state with multiple sub-values and using `useState` might be complicated. But things can still get a bit nasty when dealing with deeply nested objects in within your reducer. So in this article, we’ll see how Immer solves those problems and how you can significantly simplify your reducers with it.

## The problem

If you have used `useReducer` in React, then you know that you cannot mutate the current state, and you need to return a new object if you want to trigger a re-render with the updated values. If you’re curious, here’s an excerpt from the React docs that explains why it is that way:

> If you return the same value from a Reducer Hook as the current state, React will bail out without rendering the children or firing effects. (React uses the [`Object.is` comparison algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).)


It’s usually not a problem when your state is just one-level or even a two-level nested object. For instance:

```jsx
const reducer = (prevState, action) => {
	switch (action.type) {
    case 'increment-count':
      return {
        ...prevState
		count: state.count + 1
	  };
    case 'decrement-count':
      return {
        ...prevState
		count: state.count - 1
	};
    ...
    // Omitted for brevity
  }
}
```

But things start to get hard to read and error-prone as you try to modify deeply nested objects, check the below example for reference:

```jsx
const reducer = (prevState, action) => {
  switch (action.type) {
    case 'update-username':
      return {
        ...prevState,
        project: {
          ...prevState.project,
          users: {
			...prevState.project.users,
            [payload.userID]: {
                ...prevState.project.users[payload.userID],
                username: payload.username
            }
          },
        },
      };
    ...
	// Omitted for brevity
};
```

That’s where Immer comes in and saves the day. But before that:

## What is Immer anyways?

Glad you asked. If you read their description on [their homepage](https://immerjs.github.io/immer/), it says:

> Immer (German for: always) is a tiny package that allows you to work with immutable state in a more convenient way.
> 

So that description does sound like something we need from the previous section. But how does it work?

Immer provides you with a `produce` function that takes the state you want to modify as the first argument, and in the second argument is a function that receives a `draft` as its argument. Then you can modify the `draft` in that method, and the `produce` function would output the next state with the changes you made to the `draft`. The main thing to note here is that **you can apply straightforward mutations to the `draft`, and those mutations are recorded and used to produce the next state**. Let’s see an example to understand how it works: 

```jsx
const state = {
  name: 'Arya Stark',
  pets: [{ name: 'Nymeria', type: 'Direwolf' }],
};

const nextState = produce(state, (draft) => {
  draft.name = 'Jon Snow';
  draft.pets[0].name = 'Ghost';
});

console.log(state === nextState);
// false

console.log(`${state.name}'s pet is ${state.pets[0].name} 
and ${nextState.name}'s pet is ${nextState.pets[0].name}`);
// Arya Stark's pet is Nymeria
// and Jon Snow's pet is Ghost                                                    
```

As you can see in the above example, the `state` variable remains untouched yet the `nextState` reflects the changes we made to the `draftState`. Isn’t that magical 🧙‍♀️ 

If you’re interested in how the magic works behind the scenes, you should check out [this blog by the creators of Immer](https://medium.com/hackernoon/introducing-immer-immutability-the-easy-way-9d73d8f71cb3).

### Curried producers

If you’re not familiar with the term, currying is a process of converting a function that takes multiple arguments into a sequence of functions with a single argument. Check out [this explanation on StackOverflow](https://stackoverflow.com/a/36321/8252081) if the above sentence doesn’t make sense to you.

So apart from the behaviour of `produce` that we saw above, if you pass it a function as the first argument it creates a function that doesn’t apply   `produce` yet to a specific state, but instead creates a function that will apply `produce` to any state that is passed to it in the future.

For example :

```jsx
const state = {
	name: 'Thor',
	abilities: ['Worthy for Mjölnir', 'God of Thunder']
}

const addAbility = produce((draft, ability) => {
	draft.abilities.push(ability)
})

const nextState = addAbility(state, 'Virtually Immortal')

console.log(nextState.abilities) 
// ['Worthy for Mjölnir', 'God of Thunder', 'Virtually Immortal']
```

## useReducer with Immer

Now that we have seen how Immer works, you might have an idea of how it will solve the problem that we saw in the beginning with `useReducer`. 

The best way to use Immer with a `useReducer` is using curried `produce` that we saw in the previous section. So, for instance if you had a reducer like this.

```jsx
const [state, dispatch] = React.useReducer((state, action) => {
  switch (action.type) {
    case 'update-email':
      return {
        ...state,
        users: {
          ...state.users,
          [action.userID]: {
            ...state.users[action.payload.userID],
            email: action.payload.email,
          },
        },
      }
    ...
    // Omitted for brevity
  }
}, initialState)

// And then somewhere inside the component...
dispatch({ 
  type: 'update-email', 
  payload: { userID: 'john', email: 'john@doe.com' } 
})
```

This is how it would look like with a curried `produce`:

```jsx
const [state, dispatch] = React.useReducer(
  produce((draft, action) => {
    switch (action.type) {
      case 'update-email':
        draft.users[action.payload.userID].email = action.payload.email;
        break;
      ...
	    // Omitted for brevity
    }
  }),
  initialState
);
```

Neat isn’t it ;)

## But what about TypeScript?

Immer ships with basic type definitions out of the box, which can be picked by TypeScript without any further configuration. Also `produce` can automatically infer types based on the input provided:

```tsx
interface Character {
	name: string;
	family: string;
}

const character: Character = {
	name: 'Arya',
	family: 'Stark'
}

// Type of nextChacracter would also be State
const nextCharacter = produce(character, draft => {
	// ✅ You also get type safety here
	draft.name = 'Sansa'
	// ❌ Modifying any other property would result in a type error
    // draft.direwolf = 'Lady'
})
```

When it comes to curried `produce` they can also infer the types as best as possible, but in cases where they cannot be inferred directly it is recommended to use generics instead:

```tsx
// Apart from the state, type of any additional arguments needs to be defined
// as a tuple. So in the case below since the curried produce accepts a string
// for the name of the character, we take it as the second argument.
const changeCharacterName = produce<Character, [string]>((draft, name) => {
	draft.name = name;
});

const nextCharacter = changeCharacterName(character, "Jon") 
```

Lastly, when it comes to type-safety with `useReducer` I prefer using [`useImmerReducer`](https://github.com/immerjs/use-immer) because it works great with TypeScript. Under the hood it's just a [small wrapper over `useReducer` with `produce`](https://github.com/immerjs/use-immer/blob/master/src/index.ts#L29-L41) similar to what we saw in the previous section but it works pretty well with TypeScript. Here’s a small example that demonstrates how it works with TypeScript:

```tsx
interface Todo {
  id: string;
  name: string;
  done: boolean;
}

type State = Array<Todo>;

type Action =
  | { type: "ADD_TODO"; text: string }
  | { type: "TOGGLE_TODO"; id: string }
  | { type: "REMOVE_TODO"; id: string };

const reducer = (draft: State, action: Action) => {
  switch (action.type) {
    case "ADD_TODO":
      draft.push({ id: uuid(), name: action.text, done: false });
      break;
    case "TOGGLE_TODO":
      const todo = draft.find((todo) => todo.id === action.id);
      break;
    case "REMOVE_TODO":
      draft.splice(draft.findIndex((todo) => todo.id === action.id), 1);
      break;
  }
};

const TodoList = () => {
  const [todos, dispatch] = useImmerReducer<State, Action>(
    reducer,
    []
  );
  ...
  // Rest of rendering logic
}
```

## Conclusion

So to summarize in this short guide we saw:

- The problem that one faces with `useReducer` when dealing with nested data structures.
- How Immer solves the problem by giving you the ability to apply straightforward mutations to objects.
- Lastly we saw how you can use Immer with `useReducer` to simplify your state updates and how it nicely integrates with TypeScript.

Keep in mind you don’t need to go around and transform all the reducer functions in your code to use Immer. If the object you are dealing with is not deeply nested, it’s completely fine to clone it via shallow copying the previous state.

But when you think that keeping track of state updates are getting out of hand, then it might be a good idea to use Immer and just forget about the complexity of copying over state.