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
  title: 'Getting Started with 🍦.11ty.js, Part II: Using Your Terminal',
  date: '2020-04-13',
  permalink: '/blog/terminal/',
  templateEngineOverride: '11ty.js,md',
  description: 'Learn the basics of the command line interface that comes preinstalled with your operating system.'
}

/**
 * The content of the blog post
 * @method
 * @name render()
 * @param {Object} data 11ty’s data object
 * @return {String} The rendered template
 */
exports.render = data =>
`_This is the second post in a five-part series on [“Getting Started with 🍦.11ty.js”](/blog/getting-started/)_

### Accessing Your Terminal

Every operating system (Windows, macOS, Linux, etc.) comes with a text-based command line interface (CLI, console, or terminal) to enter commands you want your computer to run. The CLI is a powerful tool for interacting with your personal workstation beyond the graphical user interface (GUI) with which you may be more familiar. Of course, if you’ve ever used a computer without a mouse or touchpad, then you might feel right at home in the command line.

Intead of “pointing and clicking” with a mouse or touchpad 🖱️, you can “talk” to your computer from your keyboard ⌨️.

No doubt, pointing and other gestures come in handy sometimes, but they sound rather impolite in many cultural contexts when you think about it. Granted, keyboard _commands_ are still rather bossy (that’s just the nature of the human–computer relationship at the moment). In any case, keyboard commands are a really expressive and efficient way to accomplish a lot of tasks that are often outside the reach of the GUI.

Here’s a list of the command line tools that come preinstalled with some of the most popular operating systems:

* On 🐧 Ubuntu Linux (my prefered operating system), the default console is called [Terminal](https://ubuntu.com/tutorials/command-line-for-beginners).
* On 🍏 macOS, the default console is called [Terminal.app](https://support.apple.com/guide/terminal/welcome/mac).
* On 🏢 Windows, the default console has been [Command Prompt](https://support.microsoft.com/en-us/help/4027690/windows-powershell-is-replacing-command-prompt) for ages, but since Windows 10, you can now use a Linux-based tool called [Windows Terminal](https://devblogs.microsoft.com/commandline/introducing-windows-terminal/).

_If you’re on Windows, then I’ll assume you’re able to access the newer Linux-based Windows Terminal for entering commands._

### Entering Commands

Now that you have an idea of how useful your terminal is and how to access it, you can start learning your way around the command line interface.

Some of the most important skills to learn involve listing the contents of a folder or “directory” and moving from one directory to another. Many commands depend on the directory in which you happen to be working at the time.

You can use the <code>ls</code> command to _list_ the files in the current “working directory.”

Likewise, you can use the <code>cd</code> command the _change_ from one directory to another:

Typing only <code>cd</code> will change to the top-level directory in your directory tree (often referred to as your _home_ 🏡 directory).

To go _down_ ⬇️ 📂 from the current directory to one inside it, you can type <code>cd</code> followed by the name of the directory you want to open. For example, <code>cd Downloads</code>.

To go _up_ ⬆️ 📂 from the current directory to another one outside it, you can type <code>cd ../</code>. This command will go up one level from the current directory, for example, from <code>Downloads</code> back up to the directory from which you just came.

You can repeat the sequence <code>../</code> as many times as you need. Say you wanted to go up two levels: you could type <code>cd ../../</code>.

Once you’re comfortable listing a directory’s contents and moving from one directory to another, you have all the basic command line skills you’ll need to start setting up your [local development environment](/blog/getting-started/).`
