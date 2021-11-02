---
title: Mastering data fetching with React Query and Next.js
date: 2021-11-02
updatedAt: 2021-11-02
permalink: /blog/mastering-data-fetching-with-react-query-and-next-js/
templateEngineOverride: njk,md
description: Learn how React Query simplifies data fetching and caching for you and how it works in tandem with the Next.js pre-rendering methods
thumbnail: mastering-data-fetching-with-react-query-and-next-js.png
author: Prateek Surana
tags:
  - react
  - next-js
  - react-query
---

React takes pride in calling itself an unopinionated UI library by giving you as a developer a choice for everything from bundling, routing, state management, etc. But it also has its downsides since there is no standard/recommended way of doing things, choosing from so many available options can get overwhelming sometimes. 

This paradox of choices gave birth to frameworks like Next.js that take the burden off your shoulders by managing things like routing, bundling, server-side and static rendering, etc., yet giving you the best possible developer experience. But you're still mostly on your own when it comes to state management and data fetching, and for that you can use a library or no library according to the nature and scale of your application.

Most web apps rely heavily on fetching and modifying data on the server and displaying it to the user. Though managing and storing asynchronous data can be handled inside components with states and effects, this can get out of hand quickly. Especially as your application grows, and an increasing number of components require the same piece of data across different pages or parts of your app.

This is where react-query comes in by allowing you to manage and cache server state throughout your application, with a zero-config yet customizable API. So in this post, we will look at how react-query works, the problems it solves, and how it nicely integrates with the different rendering mechanisms of Next.js.





{% headingWithLink "Why React Query?" %}

When it comes to client-state management libraries for React, most of the popular ones (Redux, MobX, etc.) are great for managing client-side only state, but they require a lot of boilerplate code and are not efficient when it comes to managing async or server state.

React Query takes pride in calling itself a server state library for React. What it means is that instead of you doing the work of making the API requests, storing the response in a globally accessible state, and modifying that state when mutating some data on the server, React Query does all that for you with almost zero-config. 

This sentence [from the docs](https://react-query.tanstack.com/guides/does-this-replace-client-state) summarizes it the best, I believe -

> React Query replaces the boilerplate code and related wiring used to manage cache data in your client state and replaces it with just a few lines of code.

Apart from the things mentioned above, React Query also handles things like refetching and updating stale data in the background, deduping multiple requests requesting the same data into one, pagination, lazy loading, garbage collection of server state, and many more things that wouldn't have been easy to implement yourself from scratch.

So if a majority of your application relies on managing asynchronous server state, React Query is a library worth checking out. 

I recommend you also check the [motivation section in their docs](https://react-query.tanstack.com/overview#motivation) if you're interested in reading about what I discussed above in more detail.

{% callout %}
I know there are other libraries worth mentioning ([SWR](https://swr.vercel.app/), [RTK-Query](https://redux-toolkit.js.org/rtk-query/overview)) that do pretty much the same thing that React Query does, and they are also pretty good at it. But the reason I chose React Query over the others is that it is highly configurable, has a nice API, and provides more features than the others. You can find a complete comparison with other similar [libraries in their docs](https://react-query.tanstack.com/comparison).
{% endcallout %}





{% headingWithLink "Setup" %}

Throughout this post, we will be building a simple Pokémon app that allows you to search your favorite Pokémon and show details like XP, abilities etc. for those Pokémon on a dedicated page via the [PokéAPI](https://pokeapi.co/).

To begin with, we will be using [`create-next-app`](https://nextjs.org/docs/api-reference/create-next-app) to create a simple Next.js TypeScript project -

```bash
npx create-next-app@latest --ts
# or
yarn create next-app --typescript
```

Since we are going to use React Query, we will also need to install the `react-query` package -

```bash
npm install react-query
# or
yarn add react-query
```

Now, to use queries anywhere in our app, we need to create a `QueryClient` that allows the queries to interact with the cache. And for your `QueryClient` to be globally available for your application, you need to wrap your application with the `QueryClientProvider`.

The way we do it in Next.js is by creating a [Custom App](https://nextjs.org/docs/advanced-features/custom-app) component via `pages/_app.tsx` -

```tsx
// pages/_app.tsx

import React from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;

```

Since apart from running the above code on the client, Next.js runs it on the server as well, we are creating the `QueryClient` instance inside the app on React state (you can use `useRef` as well). This ensures that data is not shared between different users and requests, while still only creating the `QueryClient` once per component lifecycle.

You may have also noticed the `ReactQueryDevtools` in the code above. React Query comes with its dedicated devtools that help tremendously with inspecting and debugging your queries. It is a must have when you're starting your journey with React Query. Also, by default, it's only included in your app's bundle when `process.env.NODE_ENV === 'development'` so you don't need to worry about excluding them from your production build.

[💻 CodeSandbox up to this point](https://codesandbox.io/s/initial-setup-react-query-k39bw?file=/pages/_app.tsx:0-498)







{% headingWithLink "Fetching data on the client" %}

Now that we have the base setup ready, let's start writing our first Query. Since the purpose of this guide is to give your an overview of data fetching with React Query and Next.js, I won't be focusing on the styling aspects and will be using some already pre-built presentational components with styles.

To begin with, we will be creating a search page that allows you to search for Pokémon, and displays the names of matching pokémon. 

```tsx
// pages/index.tsx

import { useQuery } from "react-query";
import React from "react";
import useDebounce from "../utils/useDebounce";
import searchPokemons from "../utils/searchPokemons";

export default function IndexPage() {
  const [searchValue, setSearchValue] = React.useState("");
  const debounedSearchValue = useDebounce(searchValue, 300);

  const { isLoading, isError, isSuccess, data } = useQuery(
    ["searchPokemons", debounedSearchValue],
    () => searchPokemons(debounedSearchValue),
  );

  return (
    <div className="home">
      <h1>Search Your Pokemon</h1>
      <input
        type="text"
        onChange={({ target: { value } }) => setSearchValue(value)}
        value={searchValue}
      />
    </div>
  );
}
```

*(If you're curious about the helpers imported at the start or the styles used, you will be able check them out in the sandbox attached at the end of this section)*

Let's break down what's happening in the above piece of code. Apart from the `useQuery` hook, we have a pretty simple UI that consists of a text field where the user will type their search query and a state for managing that query. We also use a [`useDebounce` hook](https://usehooks.com/useDebounce/) that gives us a [debounced](https://css-tricks.com/debouncing-throttling-explained-examples/) value for the search query that updates at most every 300ms. We will be using this debounced value while making API requests so that we don't end up making a request for every keystroke the user types in the input field.

Now let's take a look at what's happening with the `useQuery` hook. If you check the [guide for queries](https://react-query.tanstack.com/guides/queries) in documentation, you will find that to subscribe to any query in your component, you need at least two things. A **unique key**, that will be used as the query hash for caching your query, and **a function that returns a promise** that resolves the data or throws an error.

When it comes to [query keys](https://react-query.tanstack.com/guides/query-keys), they can be anything from simple strings to something as complex as an array or even nested objects. The only thing that React Query asks from you is that they should be unique to your Query's data. 

In our case, the resulting data depends on the `debounedSearchValue` . It will return different results for different values and the same result for the same values. Hence we are using an [array key](https://react-query.tanstack.com/guides/query-keys#array-keys) - `["searchPokemons", debounedSearchValue]`, which will always be unique for our data.

Lastly, we have the second argument, which is a function that returns a promise. In our case, it would be the `searchPokemons` method that returns a promise resolving to an array of strings containing the names of the found Pokémon for a given query string.

{% callout %}
The PokéAPI doesn't have the support for searching pokémon, so I have created a function that searches a local array of all the ~900 Pokémon species and returns a Promise that resolves with an artificial delay. If you're curious, there is an [open issue for implementing search in PokéAPI](https://github.com/PokeAPI/pokeapi/issues/474). I will integrate the actual API if it's ever implemented.
{% endcallout %}

Now that we have the initial query ready, lets render the searched output - 

```js/15-17,20-31,41
// pages/index.tsx

import { useQuery } from "react-query";
import React from "react";
import useDebounce from "../utils/useDebounce";
import searchPokemons from "../utils/searchPokemons";
import PokemonsSearchResult from "../components/CompactPokemonCard";

export default function IndexPage() {
  const [searchValue, setSearchValue] = React.useState("");
  const debounedSearchValue = useDebounce(searchValue, 300);

  const { isLoading, isError, isSuccess, data } = useQuery(
    ["searchPokemons", debounedSearchValue],
    () => searchPokemons(debounedSearchValue),
    {
      enabled: debounedSearchValue.length > 0
    }
  );

  const renderResult = () => {
    if (isLoading) {
      return <div className="search-message">Loading...</div>;
    }
    if (isError) {
      return <div className="search-message">Something went wrong</div>;
    }
    if (isSuccess) {
      return <PokemonsSearchResult pokemons={data} />;
    }
    return <></>;
  };

  return (
    <div className="home">
      <h1>Search Your Pokemon</h1>
      <input
        type="text"
        onChange={({ target: { value } }) => setSearchValue(value)}
        value={searchValue}
      />
      {renderResult()}
    </div>
  );
}
```

**Checkout the full code in [the sandbox 💻](https://codesandbox.io/s/fetching-data-on-client-5t7e4?file=/pages/index.tsx)**

You can also test out the final result below ([live URL](https://csb-5t7e4-a6yfohygb-prateeksurana3255.vercel.app/)):

<iframe src="https://csb-5t7e4-a6yfohygb-prateeksurana3255.vercel.app/"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Pokedex client"
     loading="lazy"
   ></iframe>

We have now added a function `renderResult` that renders the query's result based on its state, which we get from the query result. We show a simple message for loading and error states and use a presentational component that renders the Pokémon names in a grid for a successful response.

One more thing you will notice is that I have added an argument to the `useQuery` hook. Apart from the `queryKey` and the function that returns a Promise, `useQuery` also accepts an object as a third argument which allows you to control various behaviors of the hook. You can find the [complete list of options in the docs](https://react-query.tanstack.com/reference/useQuery).

In our case, we are using the `enabled` option, which prevents the Query from running automatically when set to false. So we wouldn't want to execute a request initially when the search string is empty or when the user clears the text field.If you're interested in exploring the other options, feel free to try them out in [the sandbox](https://codesandbox.io/s/fetching-data-on-client-5t7e4?file=/pages/index.tsx). 

You can also test out the "show stale data and update in background" feature, which we discussed initially, by searching for the same term again. You'll notice that it doesn't show the loading state for it and shows you the cached data while it makes the request in the background. (Check out the [guide for caching in the docs](https://react-query-v2.tanstack.com/docs/guides/caching) if you're interested in how it works and how you can customize this behavior).

So to summarize, in this section, we saw how we can the `useQuery` hook works and how it simplifies data fetching on the client-side for you. But if you're using a framework like Next.js you probably won't be fetching the data on the client-side all the time, for some of the pages, you might want to pre-render pages at build time or on the server. Well, guess what? React Query has got your back. Let's check out how you would handle it in the next section.

[💻 CodeSandbox up to this point](https://codesandbox.io/s/fetching-data-on-client-5t7e4?file=/pages/index.tsx)







{% headingWithLink "Fetching data on the server" %}

In the last section, we saw how React Query simplifies data fetching and managing server state on the client for you. But that's not all. 

If you've been using Next.js for a while, you are probably aware of how it simplifies Server-side rendering and Static site generation for you (If not, I would definitely recommend you to check out their [tutorial on pre-rendering](https://nextjs.org/learn/basics/data-fetching)).

Let's implement this in our Pokémon example to get a better understanding of how this works. 

To demonstrate this, we'll be continuing the current example and adding a new page that will display the details of a particular Pokémon. We'll be using [Next.js' dynamic routes](https://nextjs.org/docs/routing/dynamic-routes) to create a new route `/pokemon/[id]` for it.

First, let's start with what we learned in the previous section about fetching the queries on the client and then build upon that. To create the route, we want create a file called `pages/pokemon/[id].tsx` and add the following code to it -

```tsx
// pages/pokemon/[id].tsx

import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import PokemonCard from "../../components/PokemonCard";

const fetchPokemon = (id: string) =>
  axios
    .get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then(({ data }) => data);

export default function Pokemon() {
  const router = useRouter();
  const pokemonID = typeof router.query?.id === "string" ? router.query.id : "";

  const { isSuccess, data: pokemon, isLoading, isError } = useQuery(
    ["getPokemon", pokemonID],
    () => fetchPokemon(pokemonID),
    {
      enabled: pokemonID.length > 0
    }
  );

  if (isSuccess) {
    return (
      <div className="container">
        <PokemonCard
          name={pokemon.name}
          image={pokemon.sprites?.other?.["official-artwork"]?.front_default}
          weight={pokemon.weight}
          xp={pokemon.base_experience}
          abilities={pokemon.abilities?.map((item) => item.ability.name)}
        />
      </div>
    );
  }

  if (isLoading) {
    return <div className="center">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="center">
        We couldn't find your pokemon{" "}
        <span role="img" aria-label="sad">
          😢
        </span>
      </div>
    );
  }

  return <></>;
}
```

**Check out the code on [this sandbox](https://codesandbox.io/s/fetching-data-on-server-s95i4?file=/pages/pokemon/%5Bid%5D.tsx)**

The above snippet is very similar to the code we saw in the previous section. For the second argument of `useQuery`, we are using [`axios`](https://github.com/axios/axios) to fetch the data from the PokéAPI this time, which also returns a Promise with the data or the error.

I have also linked the cards in the search result we created in the previous section to this page. You can test out searching and click on any of the items from the result [in the sandbox.](https://codesandbox.io/s/fetching-data-on-server-s95i4?file=/pages/index.tsx)

Now with this page, our Pokémon app might look complete. However we are still loading the data on the client side, due to which the transition isn't very smooth, and we are presented with a loading indicator on the initial page load. 

Also this page isn't very SEO friendly. If we were to add some meta tags with the Pokémon details they would only be added when the browser render the page, executes the JavaScript and then fetches the Pokémon details (Although Google says that the googlebot runs the client side JavaScript and renders pages but still nothing beats a pre-rendered page with all the meta tags and content already available). Similarly, the social media previews won't work for this page because they don't execute the client-side JavaScript.

So let's statically pre-render these pages with Next.js' [`getStaticProps` method](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation).

{% callout %}
Using Static pre-rendering instead of server-side pre-rendering because the data is publicly available, will barely ever change, and we want the best possible SEO performance. Do check out [when should I use `getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#when-should-i-use-getstaticprops) in the Next.js docs for more info. Although the code would have been very similar if we were creating a server-rendered page as well.
{% endcallout %}

Before we get into the next part of this section, there are a couple of terms that you should be aware of to understand what is happening -

- **dehydrating queries** - Dehydration refers to creating a frozen representation of the cache. This can be later hydrated on the browser with React Query's hydrate methods. This is useful if you want to store the cache for later use, for instance in `localstorage` or in our case sending the cache from server to client.
- **hydrating queries** - Hydration lets you add any previously dehydrated state to the cache on a `QueryClient` instance with the full functionality of the library when the app is rendering on the browser.

React Query lets you fetch any number of queries you want during any of the Next.js pre-rendering steps and then dehydrate those queries. This allows you to pre-render your markup that will be available with all the data on page load and once the page renders on the client, React Query will hydrate those dehydrated queries with the full functionality of the library.

To begin with, we will need to modify `_app.tsx` so that the dehydrated queries (which we will be passing as props in the next step) can be hydrated when the app renders on the client.

Make the following changes in the `_app.tsx` file -

```ts/2,11,14
import React from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "../styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
```

In the above snippet, the [`Hydrate` component](https://react-query.tanstack.com/reference/hydration#hydrate-1) will hydrate the `queryClient` with the cached data we fetched on the server.

Notice how we're using `pageProps.dehydratedState` for the `state` prop of the `Hydrate` component. This prop is for the dehydrated state will be hydrated on the client. If you check the [Next.js docs for the `App` component](https://nextjs.org/docs/advanced-features/custom-app), you'll see that `pageProps` is an object with the initial props that were preloaded by any of their [data fetching methods](https://nextjs.org/docs/basic-features/data-fetching).

So for the hydration to work, we will need to return the dehydrated cache with the `dehydratedState` prop from the `getStaticProps` method that we'll be using for the `pages/pokemon/[id].tsx` page.

Add the following snippet to the end of `pages/pokemon/[id].tsx` file -

```tsx
// pages/pokemon/[id].tsx

// ...rest of the code we added in the previous section

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id as string;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["getPokemon", id], 
    () => fetchPokemon(id)
  );  

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking"
  };
};
```

**Check out the code on [this sandbox](https://codesandbox.io/s/fetching-data-on-server-final-stl70?file=/pages/pokemon/%5Bid%5D.tsx)**

In the above snippet, we are using Next.js' `getStaticProps` method to prefetch the pokémon on the server via the `prefetchQuery` method with the same key that we're using in the component. And then we are dehydrating the `queryClient` to the `dehyrdatedState` prop that will be used by `_app` as we saw in the previous section.

Since this is a dynamic page, we have to use `getStaticPaths` that provides an initial set of paths that can be used to pre-render these pages at build time. Although we are passing it an empty array, none of the pages would be generated at build time.

Instead, we are using [`fallback: "blocking"`](https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking) in which any new page is server-side generated and then cached for future requests, so it only happens once per path. So if anyone visits `/pokemon/pikachu` for the first time, the page would be pre-rendered on server-side, and for any future requests for this page, Next.js would directly return the cached pre-rendered HTML.  

Similar to what we did in the `_app` component, you should always create a new `QueryClient` instance in these server side data fetching methods, **this ensures that data is not shared between different users and requests.**

That's it. With these changes, this page is now pre-rendered, and there's no more loading indicator and you can very easily add some meta tags for nice social media previews. My favorite part was how we didn't even have to touch the component code when we moved this page from a client-side rendered page to a  pre-rendered page.

{% callout %}
One thing you'll notice is that even though we are pre-rendering the page when the page renders on the client, React Query still makes an API request to the same pokémon API in the browser.

That's because of how React Query sets its defaults. By default, the `staleTime` is 0, which means that as soon as the component renders on the client and the Query is rehydrated, it is stale for React Query, and it would be refetched in the background as we saw earlier. But don't worry we can easily change this behavior on a query level by modifying the `staleTime` .

This behavior also allows you to implement neat tricks so that you don't have to regenerate pages on the server frequently yet show the latest data on the client. For example,, you can regenerate a page only once a day on the server but set the `staleTime` to an hour so that if the page is older than an hour, it would fetch the data in the background on the client and update the cache showing the latest data to the end-user.

For our case, since we know that the data will never change, I have already set `staleTime` to `Infinity`, which means that as long as we have already fetched data in the cache, it would never refetch in the background.
{% endcallout %}

You can checkout the final result below ([live URL](https://csb-stl70.vercel.app/)):

<iframe src="https://csb-stl70.vercel.app/"
     style="width:100%; height:525px; border:0; border-radius: 4px; overflow:hidden;"
     title="Pokedex final"
     loading="lazy"
   ></iframe>


[💻 Checkout the final sandbox here](https://codesandbox.io/s/fetching-data-on-server-final-stl70?file=/pages/pokemon/%5Bid%5D.tsx)




{% headingWithLink "Conclusion" %}

To summarize in this article we saw how React Query simplifies data fetching and caching for you, how you can easily fetch data on the client and the server-side with it, and how it works in tandem with the existing Next.js pre-rendering methods. 

Although there is a whole another area of things like mutation and cache manipulation, infinite loading etc. which we didn't even touch, but is an important part of this library. I would recommend you to [checkout the docs](https://react-query.tanstack.com/overview) if you're interested in learning more about it.

I hope this post helps you in making an informed decision regarding whether use this library is suited your project. If you feel that I missed anything or if something could have been explained better feel free to add it to the comments section below.

