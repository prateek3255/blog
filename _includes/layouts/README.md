# eleventy-dot-js-blog/\_includes/layouts

In Eleventy, [layouts](https://www.11ty.dev/docs/layouts/) are reusable templates that can also be used to wrap other content.

You can access layouts in templates ([and chain them with other layouts](https://www.11ty.dev/docs/layout-chaining/)) via the `layout` property in Eleventy’s `data` object.

Eleventy supports a number of different [template languages](https://www.11ty.dev/docs/languages/). This project specifically leverages [JavaScript templates](https://www.11ty.dev/docs/languages/javascript/) (files ending in the `*.11ty.js` extension). Not only do JavaScript templates process the fastest, they are also the most flexible. Using `*.11ty.js` templates opens up the wider world of JavaScript and the Node.js ecosystem to your presentational layer. If you can imagine doing something on a website with JavaScript, you can probably achieve it with Eleventy!

Other template languages may do the job. Some folks find them attractive because of their (sometimes) shorter syntax and because there are (at the time of this writing) more plentiful code samples in those languages floating around the Web.

But template languages come at a cost. They inherently carry higher techinical debt—in addition to a basic understanding of JavaScript, you also have to become familiar with _that_ template language. Worse, you are often limited by what that template language is designed to do. In other words, using that template language makes you subject to the scope, opinions, and priorities of the maintainers for that language. By using `*.11ty.js` as often as possible, we can simultaneously lower that barrier to entry and reduce the overall cognitive overload when building and maintaining a project. It’s a way of showing kindness to yourself as well as to whomever may come to the codebase after you.

Although humans have been using JavaScript to create these other template languages for “quite a while” (as far as measuring time in the computer-age is concerned), writing templates in vanilla JavaScript is still a rather novel concept. In fact, Eleventy—launched in December 2017—is at the frontier of this new–old way of creating content for the Web.

A number of JavaScript frameworks (like React or Vue.js, among others) advertise writing templates in vanilla JavaScript as a major selling point. But Eleventy is unique: vanilla JavaScript templating works out of the box _without weighing down your codebase_ and _without burdening your users with any client-side JavaScript_. Eleventy is _just JavaScript_: clean, simple, fast, flexible, and limited only by your imagination.
