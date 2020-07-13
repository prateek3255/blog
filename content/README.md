# eleventy-dot-js-blog/content

By default, [Eleventy works with your project’s existing directory structure](https://www.11ty.dev/docs/). Unlike other static site generators, Eleventy let’s you choose how to organize your content.

This directory shows _one way_ to organize content into pages and posts, like a typical blog. If you wanted to use this project to publish an e-book, you might use directories for each of the parts and chapters. Or, if you wanted to make a glossary, you might use directories for each letter of the alphabet.

The [`content.11tydata.js`](https://gitlab.com/reubenlillie/eleventy-dot-js-blog/-/blob/master/content/content.11tydata.js) file here defines [directory data](https://www.11ty.dev/docs/data-template-dir/), accessible in templates via the `data` object. For example, because `content.11tydata.js` defines a `locale` property, all the templates in this directory as well as any directories nested inside this one will inherit that `data.locale` value (i.e., `en` for English). You can override that “default” value by specifying a new `locale` value in either a [template data file](https://www.11ty.dev/docs/data-template-dir/) or the [front matter data](https://www.11ty.dev/docs/data-frontmatter/) for a given template.

_See the Eleventy documentation for more information about the [data cascade](https://www.11ty.dev/docs/data-cascade/)._

To carry the `data.locale` example further, this directory structure also allows you to add support for internationalization (i18n) and localization (l10n).

Here’s an example of one way you might go about adding Spanish-language content:

1. Make a directory named `es` inside this one (optionally, you could move all existing English-language content into a new `en` directory too)
1. Nest corresponding copies of the [`pages`](https://gitlab.com/reubenlillie/eleventy-dot-js-blog/-/tree/master/content/pages) and [`posts`] (https://gitlab.com/reubenlillie/eleventy-dot-js-blog/-/tree/master/content/posts) directories inside the newly created `es` directory (e.g., `content/es/pages` and `content/es/posts`)
1. Copy `content.11tydata.js` to  the `es` directory, and rename the copied file `es.11tydata.js`
1. Do the same for `content/es/pages/pages.11tydata.js` and `content/es/posts/posts.11tydata.js`
1. Copy `content/index.md` (the blog home page) to `content/es/index.md` and set `permalink` to `'/es/'` in the front matter data
1. Add an _identical front matter data property_ to each of the multilingual content files (_don’t translate the value_, e.g., add `translationKey: 'about'` in the front matter for both [`pages/about.md`](https://gitlab.com/reubenlillie/eleventy-dot-js-blog/-/blob/master/content/pages/about.md) and `es/pages/about.md`, or `translationKey: 'home'` inside both `contect/index.md` and `content/es/index.md`)

_See [`../_data/README.md`](https://gitlab.com/reubenlillie/eleventy-dot-js-blog/-/blob/master/_data/README.md) for instructions on how to translate [global data](https://www.11ty.dev/docs/data-global/) strings._

_For a discussion of how a multilingual setup like this might work (using Nunjucks templates), check out [Jérôme Coupé’s](https://twitter.com/jeromecoupe) pair of blog posts from 2019 on [“Multilingual Sites with Eleventy”](https://www.webstoemp.com/blog/multilingual-sites-eleventy/) and prototype for a [“Language switcher for multilingual JAMstack sites”](https://www.webstoemp.com/blog/language-switcher-multilingual-jamstack-sites/)._
