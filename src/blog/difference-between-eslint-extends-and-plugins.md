---
title: What is the difference between extends and plugins in ESLint config
date: 2021-09-11
updatedAt: 2021-09-11
permalink: /blog/difference-between-eslint-extends-and-plugins/
templateEngineOverride: njk,md
description: Learn how ESLint works, what are the role of plugins and extends keys in your ESLint config and how they make ESLint an extremely configurable and versatile JavaScript Linter.
thumbnail: difference-between-eslint-extends-and-plugins.png
author: Prateek Surana
tags:
  - javascript
  - eslint
---

When setting up ESLint in my projects, I often used to get confused about the difference between `eslint-plugin-xxx` and `eslint-config-xxx` npm modules, and why some ask you to add something to the `plugins` key in your project's ESLint config while others ask you to modify the `extends` key. If you have also gone through the same confusion or if you want to learn about how ESLint works then this article is for you.




{% headingWithLink "What is ESLint?" %}

Now I know if you searched for the difference than you probably already know what ESLint is and what it does. But let's take a quick look anyways just so we're on the same page.

ESLint is an open-source JavaScript Linting utility. Its job is to statically analyze and fix problematic patterns in your JavaScript code or code that doesn't adhere to some style guidelines that you would want to be followed throughout your whole project. The project owner can choose the rules they want to enforce via a configuration file `.eslintrc.{js,yml,json}` in the root directory of their project.

What makes it so special is that apart from having some really good built-in rules it also allows developers to create their own linting rules and have those rules completely pluggable. So developers can add any number of these pluggable rules and enforce them according to their needs, via the ESLint config file in their project.





{% headingWithLink "Plugins" %}

Although ESLint ships with [some good set of rules](https://eslint.org/docs/rules/), usually they are not enough to cover all the needs for your project, especially if you're building with libraries and frameworks like React, Vue, etc. ESLint plugins allow you to add custom rules according to the needs of your project. Plugins are published as npm modules with names in the format of `eslint-plugin-<plugin-name>`.

To use the plugin, you need to first install it via npm, and then you can add it to your `eslintrc` configuration via the plugins key. For example, if you want to use a plugin called `eslint-plugin-my-awesome-plugin`, you can add it to your configuration file like this -

```json
// .eslintrc

{
	"plugins": ["my-awesome-plugin"] // The "eslint-plugin" suffix 
    // can be ommited
}
```

Keep in mind that, adding a plugin does not mean that all the rules for the plugins will be applied automatically, you still need to individually apply each and every rule you would want to use with that plugin, with the rules object in your config file -

```json
// .eslintrc

{
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
    }
}
```
{% callout %}
I am not covering how rules work in ESLint because that would be slightly out of scope of this article, if you're interested in how to configure rules you can checkout this [awesome explanation in the ESLint docs.](https://eslint.org/docs/user-guide/configuring/rules)
{% endcallout %}

But configuring each and every rule you want to use would be gruesome, wouldn't it be nice if you could just use some of the recommended set of rules by the plugin owner or the by the framework you are using. Well that's where our next section comes in.





{% headingWithLink "Shareable configs" %}

The ESLint configs we create for our project are an important part of our project and more often than not we have multiple projects that need more or less the same configs. So ESLint lets you share your config by [allowing you to publish it to npm](https://eslint.org/docs/developer-guide/shareable-configs#publishing-a-shareable-config). Similar to plugins shareable configs are also published with names in the format of `eslint-config-<config-name>`.

To use the shareable config, you need to install it from npm similar to what we saw with plugins and then you can extend the ESLint config of your project with the `extends` key, so if you have installed a config called `eslint-config-awesome`  then you can use it in your config like this -

```json
// .eslintrc

{
	"extends": ["awesome"] // The "eslint-config" suffix 
    // can be omitted here as well
}
```

And yes you can extend from multiple configs by adding them to the array, and if the configs modify same rules then the rules of the preceding config would be overwritten by the succeeding one, so the order does matter in these cases.

Note that shareable configs aren't just meant for sharing rulesets, they can be full fledged configs with their own plugins, formatters etc. and can also even extend from other configs.

You might already be extending some popular configs in your project like the [`eslint-config-airbnb`](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) which includes plugins like `eslint-plugin-react` , `eslint-plugin-import` etc. and enforce rules based on the Airbnb JavaScript style guide. Although you still need to install the plugins via npm because they are a [peer dependency](https://flaviocopes.com/npm-peer-dependencies/) of `eslint-config-aribnb` .





{% headingWithLink "Plugins with configs", "h3" %}

We saw earlier how plugins allow you to add more rules for linting your project, and how you need to add the rules you want to use in your config or extend from some other shareable config that has the rules.

Guess what plugins can also come with different sets of shareable configs and you can any of them according to your needs in your project. 

You can use these configs that come with your plugins by with the `plugin:` prefix. For instance let's say you are using a plugin called `eslint-plugin-my-awesome-plugin` and it comes with a config called `recommended-config` . You can then add `plugin:my-awesome-plugin/recommended-config` to the `extends` key in your config to extend from that shareable config.

Let's also take the example of [`eslint-plugin-react`](https://github.com/yannickcr/eslint-plugin-react). If you see the [`configs` key in its code](https://github.com/yannickcr/eslint-plugin-react/blob/master/index.js#L118-L179), you'll find that it has three configs available `recommended` , `all` and `jsx-runtime` .

Now suppose I just want to use the [`recommended`](https://github.com/yannickcr/eslint-plugin-react/blob/9c1aee5eab8776b94d9d46cbcfa4bb53a8b4e175/index.js#L119-L152) config of this plugin, which enforces the rules recommend for React good practices, this is all that I need to add in my project's ESLint config -

```json
// .eslintrc

{
  "extends": ["plugin:react/recommended"]
}
```

Notice how you don't even need to add the `plugins` key with `eslint-plugin-react` in it because it is already included in the recommended config.

{% callout %}
The above example is just to demonstrate how you can use shareable configs that come with the plugin, if you are actually using this plugin than you should include `eslint:recommended` config as well for best results as mentioned in the [project's README](https://eslint.org/docs/user-guide/configuring/configuration-files#extending-configuration-files).
{% endcallout %}





{% headingWithLink "Conclusion" %}

So to summarize in this article we saw a brief overview of what ESLInt is and how ESLint plugins provide you with custom rules that you can individually apply according to your needs, and how the `extends` key in your configs lets you extend from other shareable configs. We also saw that how you can load the configuration files that may be provided by the plugin to apply the rules that the authors think are logically grouped or recommended by the community.
