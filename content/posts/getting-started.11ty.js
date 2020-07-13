/**
 * @file Defines the chained template for the blog post
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 * @see {@link https://www.11ty.dev/docs/layouts/#layout-chaining Layout chaining in 11ty}
 */

/**
 * Acts as front matter in JavaScript templates
 * @see {@link https://www.11ty.dev/docs/languages/javascript/#optional-data-method Optional `data` in JavaScript templates in 11ty}
 */
exports.data ={
  title: 'Getting Started with 🍦.11ty.js, Part I: An Introduction to Local Development',
  date: '2020-04-11',
  permalink: '/blog/getting-started/',
  templateEngineOverride: '11ty.js,md',
  description: 'Learn about what a local development environment is and the software you’ll need to run 🍦.11ty.js on your own computer.'
}

/**
 * The content of the blog post
 * @method
 * @name render()
 * @param {Object} data 11ty’s data object
 * @return {String} The rendered template
 */
exports.render = data =>
`_This is the first post in a five-part series on “Getting Started with 🍦.11ty.js”_

### What is a _Local Development Environment_ Anyway?

Have you ever published a major typo or botched an @ mention on a social media platform or blog? I know I have ✋.

Well, wouldn’t it be great if you could preview what your post would look like before you actually published it for the World Wide Web to laugh you to scorn? That’s one of the problems a _local development environment_ is meant to address.

However, a local development environment, in software parlance, is much more than a way to preview content. A local development environment allows you to run an _exact copy_ of a project on your own computer. And, thanks to [Git](${data.pkg.homepage}), you can sync your local copy with the published copy online too.

In other words, you—and whoever else you may want to collaborate with on your project—can break your project, then fix it, then break it some more, all on your own computer. Feel free to test and tinker to your heart’s content before ever releasing the new (and hopefully improved) version to the public.

### What Software You’ll Need to Install

🍦.11ty.js uses a program called [Eleventy](https://11ty.dev/) (11ty) to build websites. Eleventy is a type of program known as a _static site generator_, which basically builds a fresh copy of your site everytime you save a change.

Both 🍦.11ty.js and Eleventy run on a program called [Node.js](https://nodejs.org/) under the hood. Node.js gives you a local _JavaScript runtime environement_, which basically means you can use software written in JavaScript (namely, 🍦.11ty.js and Eleventy) on your computer.

Before programs like Node.js, JavaScript was pretty much confined to the browser. But now, thanks to Eleventy, you can use the same progmramming language to run a server, write your content, generate your site, and interact with users. I’ve got a bunch of reasons why I think this is so nifty, some of which are listed on the [About page](/about/).

All three programs—Node.js, Eleventy, and 🍦.11ty.js—are _free and open source software_ (FOSS), meaning the code is publicly avaialble. In fact, you’re encouraged to remix your own local copy, create something new and worthwhile with it, and even suggest changes to the original source code. I’m convinced open source development is the most ethically responsible way to build software (but that’s a topic for another post).

### How to Get Started

Now that you have an idea of what a local development environment is and why they’re so useful, let’s install a copy of 🍦.11ty.js directly on your personal workstation.

To get up and running, we’ll need to become familiar with four sets of tools, each of which will be the subject of an upcoming post in this series:

1. [The _command line interface_, or _terminal_ that comes preinstalled with your operating system](/blog/terminal/)
1. [Git](/blog/intro-to-git/)
1. [Node.js](/blog/installing-nodejs-and-eleventy/) and its package manager, <abbr title="npm: Node Package Manager">npm</abbr>
1. [A text editor](/blog/text-editor/)

Stay tuned 📻.`
