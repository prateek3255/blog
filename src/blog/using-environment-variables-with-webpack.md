---
title: Using environment variables with Webpack
date: 2020-11-09
permalink: /using-environment-variables-with-webpack/
templateEngineOverride: 11ty.js,md
description: A guide for setting up and using environment variables with Webpack and handling different values for Production and Development environments.
thumbnail: using-environment-variables-with-webpack.png
author: Prateek Surana
tags:
  - webpack
  - tutorial
---

When building for the web, we often have to deal with some sensitive data (like API keys), which cannot be pushed to source control or some things that are supposed to be different for development and production environments (like sending error logs to sentry only in a production environment). That's where environment variables come in as they let us store this kind of data with a breeze.

Now there are two ways of using environment variables -

- Storing those variables in the system environment, via the [Terminal in Mac/Linux](https://medium.com/@youngstone89/setting-up-environment-variables-in-mac-os-28e5941c771c) or using the [GUI in Windows](https://docs.oracle.com/en/database/oracle/r-enterprise/1.5.1/oread/creating-and-modifying-environment-variables-on-windows.html).
- Storing and accessing those variables from a `.env` file in the project's root folder, which is ignored from version control.

This post will cover the second method and show you how to inject environment variables from a `.env` file to your application via Webpack's `dotenv-webpack` plugin via discussing the following steps -

1. [The .env file](#the-dot-env-file)
2. [Accessing environment variables via Webpack](#accessing-environment-variables-via-webpack)
3. [Using different .env files for production and development environments](#using-different-env-for-production-and-development)

<h2 id="the-dot-env-file">The .env file</h2>

I prefer creating a `.env` file with all the environment variables in the project root and [adding a line that references this file to your `.gitignore`](https://www.atlassian.com/git/tutorials/saving-changes/gitignore)  so that they are not pushed to source control. This way, whenever someone new is cloning your repository, they wouldn't need to add these variables to their system environment (which can be really painful in operating systems like Windows).

Since we are not adding the `.env` file to the source control, it is good practice to create a `.env.example` file, which is added to source control and contains the value of the variables for the development environment or contains comments on how to obtain them. 

For instance, the `.env` file for your production environment could be like -

```bash
API_ROOT=https://myawesomeAPIRoot.com/
NODE_ENV=production
SOME_IMPORTANT_API_KEY=th1s181mpo97@n7
```

And the corresponding `.env.example` will be - 

```bash
# The base API endpoint to which requests are made
API_ROOT=http://localhost:5000/

# Whether we are using a production or development environment
NODE_ENV=development

# API key fetching some important things, get the key for your 
# development environment at https://somerandomthings.com/important-keys 
SOME_IMPORTANT_API_KEY=
```

This way, someone new cloning your repo can create `.env` and add all the required variables accordingly.

<h2 id="accessing-environment-variables-via-webpack">Accessing environment variables via Webpack</h2>

Now let's read these variables in our code. To do that, we would be using the [`dotenv-webpack` plugin](https://www.npmjs.com/package/dotenv-webpack). Install this plugin as a dev dependency -

```bash
yarn install dotenv-webpack --dev

OR

npm install dotenv-webpack --save-dev
```

This plugin is to read the environment variables from the `.env` file **securely by only exposing the variables used in the code.**

Add it to the plugins in your webpack config file -

```jsx
// webpack.config.js
const Dotenv = require('dotenv-webpack');
 
module.exports = {
  ...
  plugins: [
    new Dotenv(),
    ...
  ]
  ...
};
```

Now you can use the variables in your code using the `process.env` syntax anywhere in your code and then webpack will replace them with the corresponding values in the `.env` file.

> Use [`systemVars: true` flag](https://www.npmjs.com/package/dotenv-webpack#properties) in the Dotenv plugin to load the system variables as well, which comes in handy when deploying to Netlify or any other CI where you can't add the `.env` file due to source control restrictions. 

For example -

```jsx
const requestMyAwesomeService = () => {
	const data = await fetch(`${process.env.API_ROOT}awesome`)
	...
}
```

On a sidenote a slightly cleaner approach would be store these variables in a separate file and export them from that file.

```jsx
// constants/envrionment.js

const API_ROOT = process.env.API_ROOT;
const NODE_ENV = process.env.NODE_ENV;
const SOME_IMPORTANT_API_KEY = process.env.SOME_IMPORTANT_API_KEY

export {
	API_ROOT,
	NODE_ENV,
	SOME_IMPORTANT_API_KEY
};
```

And if you are using [webpack aliases](https://webpack.js.org/configuration/resolve/) for your folders, you could consume these constants in any file like this -

```jsx
import { API_ROOT } from 'constants/environment';

const requestMyAwesomeService = () => {
	const data = await fetch(`${API_ROOT}awesome_route`)
	...
}
```

This way, linters like [ESLint](https://eslint.org/) or compilers like [TypeScript](https://www.typescriptlang.org/) would prevent you from spelling mistakes, and you would get [nifty auto-complete while importing these variables with editors like VSCode](https://code.visualstudio.com/docs/editor/intellisense).

<h2 id="using-different-env-for-production-and-development">Using different .env files for production and development environments</h2>

When using environment variables, you might need to use different values for some keys depending on whether you are in a development or production environment.

For example, `SOME_IMPORTANT_API_KEY` could have some domain restrictions for the production environment, which would not work on the development `localhost` domains, so we need a way to have separate values for our environment variables in development and production environments.

So we would need to create two files here, namely `.env.production` and `.env.development`, which would contain the variables for the production and development environments, respectively.

To read these `.env` files, we would need to pass [environment variables via the CLI](https://webpack.js.org/guides/environment-variables/) to our scripts in the `package.json` to read them in our `webpack.config.js` file. Assuming you are using [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/) for your development environment, your scripts would look something like this -

```json
// package.json

{
	...
	scripts: {
	  "build": "webpack --env production --mode production",
	  "dev": "webpack-dev-server --env development --mode development",
	   ...
  	}
	...
}
```

Now you can read the value of environment variables you just passed in through your CLI in your webpack config, and load the appropriate `.env` file using the [`dotenv-webpack` 's path](https://github.com/mrsteele/dotenv-webpack#properties) property.

```jsx
// webpack.config.js
...

module.exports = env => ({
  ...
  plugins: [
    new Dotenv({
			path: `./.env.${env}`
		}),
    ...
  ]
  ...
});
```
And that's it. With this setup you can securely access multiple environment values for separate values for production and development environments.