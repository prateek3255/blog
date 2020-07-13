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
  title: 'Getting Started with 🍦.11ty.js, Part V: Choosing a Text Editor',
  date: '2020-04-17',
  permalink: '/blog/text-editor/',
  templateEngineOverride: '11ty.js,md',
  description: 'Learn about what a text editor is and how to edit 🍦.11ty.js files.'
}

/**
 * The content of the blog post
 * @method
 * @name render()
 * @param {Object} data 11ty’s data object
 * @return {String} The rendered template
 */
exports.render = data =>
`_This is the final post in a five-part series on [“Getting Started with 🍦.11ty.js”](/blog/getting-started/)_

> **👣 Background** 
>
> By this point, you should have already:
> 1. [Installed and configured Git](/blog/intro-to-git/) on your computer
> 1. Cloned 🍦.11ty.js from [GitLab](${data.pkg.homepage}) into your prefered directory
> 1. [Installed Node.js and Eleventy](/blog/installing-nodejs-and-eleventy/)

### What is a text editor?

Not all text editors are created equal. When software folks speak about _text editors_, they’re usually distinguishing between those for plain text (namely, code) and _word processors_ for rich-text documents (like those in LibreOffice, Apple Pages, or Microsoft Office).

All the files in 🍦.11ty.js are plain-text formats. Plain text files are lighter than rich-text formats. And unlike rich-text formats, you can open and edit plain text files with the program you prefer.

Here’s a list of the text editors that come preinstalled with some of the most popular operating systems:

* On 🐧 Ubuntu Linux, the default text editor is called [Gedit](https://wiki.gnome.org/Apps/Gedit).
* On 🍏 macOS, the default text editor is called [Text Edit](https://support.apple.com/guide/textedit/welcome/mac).
* On 🏢 Windows, the default text editor is called [Notepad](https://www.microsoft.com/en-us/p/windows-notepad/9msmlrh6lzf3?activetab=pivot:overviewtab#).

While you could use the default editor for your operating system to edit files occasionally, other editors are specifically designed to help you manage larger projects. 

I use [Vim](https://www.vim.org/). It’s free, open source, not-for-profit (all proceeds assist children in Uganda through <abbr title="ICCF: International Child Care Fund">ICCF</abbr> Holand), and you can access Vim directly from the [command line](/blog/terminal/).

Now, Vim is unrivaled in its power and flexibility, but it also has a reputation for a steep learning curve. Although my I’m rather biased, I tell my students that any time and energy they dedicate to learning Vim will yield exponential returns in the long term. However, I don’t blame you one bit for wanting to reach for a different text editor while you’re getting your bearings.

There are dozens of text editors out there to suit a variety of tastes. Here’s a list of some other popular free and open source text editors that are available for all major operating systems:

* [Atom](https://atom.io/), by GitHub
* [VSCode](https://code.visualstudio.com/), by Microsoft
* [Notepad++](https://notepad-plus-plus.org/), by Don Ho

### Editing files in 🍦.11ty.js

Whichever text editor you choose, you’ll need to open the following files [in the directory where you cloned 🍦.11ty.js from Git](/blog/into-to-git/).

* 📝 Edit <code>./_data/site.json</code> with your site’s information.<br>
Don’t be scared. You can change just about any text inside single quotes without breaking anything (<code>'Safe to edit'</code>). If you get stuck, please file an [issue on GitLab](${data.pkg.bugs.url}) where someone friendly can help.
* (Optionally) 📝 Edit <code>.eleventy.js</code> with your configuration preferences (a subject for another post)
* ❌ Delete the “Getting Started” message from <code>./_includes/layouts/home.11ty.js</code> (I tried to make it obvious which lines)

In <code>./content/pages</code> and <code>./content/posts/</code>, you can edit or delete any of the files ending with the <code>.11ty.js</code> or <code>.md</code> extensions. To create a new page or post, I recommend copying and pasting one of these files to a new one until you get the hang of it.

To preview your site with Eleventy, you can enter the following command into your terminal:

<pre><code>npx eleventy --serve</code></pre>

Then open your browser and navigate to the <abbr title="URL: Universal Resource Locator">URL</abbr> Eleventy prints to your terminal (likely <code>http://localhost:8080</code>).

Use the <code>build</code> command, and Eleventy will generate a copy of your site to publish online with just about any webhost you like (for example, [Netlify](https://docs.netlify.com/)):

<pre><code>npm run build</code></pre>

🎉 You’re all set with 🍦.11ty.js! The only practical limit is your imagination.

Have fun! Make something worthwhile. And, if you feel so inclined, submit an issue, feature request, or merge request on GitLab to help make 🍦.11ty.js even better.
`
