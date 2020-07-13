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
  title: 'Getting Started with 🍦.11ty.js, Part IV: Installing Node.js and Eleventy',
  date: '2020-04-15',
  permalink: '/blog/installing-nodejs-and-eleventy/',
  templateEngineOverride: '11ty.js,md',
  description: 'Learn about what Node.js is and how to finish installing 🍦.11ty.js and its dependencies.'
}

/**
 * The content of the blog post
 * @method
 * @name render()
 * @param {Object} data 11ty’s data object
 * @return {String} The rendered template
 */
exports.render = data =>
`_This is the fourth post in a five-part series on [“Getting Started with 🍦.11ty.js”](/blog/getting-started/)_

> **👣 Background** 
>
> By this point, you should have already:
> 1. [Installed and configured Git](/blog/intro-to-git/) on your computer
> 1. Cloned 🍦.11ty.js from [GitLab](${data.pkg.homepage}) into your preferred directory

In order to run 🍦.11ty.js in your [local development environment](/blog/getting-started/), the final tool you’ll need to have installed is a program called [Node.js][nodejs], which also comes with a handy package manager called <abbr title="npm: Node Package Manager">npm</abbr>.

### What is Node.js?

In the [first post of this series](/blog/getting-started), I briefly explained that Node.js is the _JavaScript runtime environment_ which allows you to use 🍦.11ty.js and Eleventy on your computer outside the browser.

I go into more detail on the [About page](/about/) why I think Node.js combined with Eleventy is the one of the best ways to build the web.

If I may reiterate one point, then it is that building the web with Node.js, Eleventy, and 🍦.11ty.js lowers barrier to entry 🚧.

One fewer language to write means one fewer language to learn in order to get started. The Web is for everyone, and we should build websites and applications like we actually believe that. JavaScript is and always has been the native programming language inside the browser. So, it only makes sense to use JavaScript in your local development environment too—Node.js, Eleventy, and 🍦.11ty.js make that possible.

### How Do You Install Node.js?

Like Git, there are different ways to install Node.js based on your operating system. Here are what I know to be the clearest, officially supported methods. If you’re interested, the [Node.js website][nodejs] lists a few more options.

#### On 🐧 Ubuntu Linux

Open your [terminal](/blog/terminal/) and enter the following commands.

##### 1. Check if your computer already has Node.js:

<pre><code>node --version</code></pre>

Even if you already have Node.js installed, it’s still a good idea to update your system so you can access to the latest supported software versions.

##### 2. Update your system:

I recommend running this pair of commands:

<pre><code>sudo apt update
sudo apt -y dist-upgrade</code></pre>

If you already have Node.js installed and you have at least version <code>12.16.1</code> (the latest stable release as of this writing), you can skip to [installing Eleventy](#installing-eleventy).

##### 3. Install Node.js:

I recommend installing the latest stable release (<abbr title="LTS: Long-Term Support">LTS</abbr>).

_Replace_ <code>setup_12.x</code> _with the latest major stable release (for example,_ <code>setup_13.x</code> _if you’re reading this post in the future, but not so far in the future that the latest stable release will have been newer than_ <code>13</code>_)._

<pre><code>curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt install -y nodejs
</code></pre>

All that’s left is to [install Eleventy](#installing-eleventy).

#### On 🍏 macOS

Download the [macOS Installer][installer] directly from [nodejs.org][nodejs] and follow the instructions from the installation wizard.

All that’s left is to [install Eleventy](#installing-eleventy).

#### On 🏢 Windows

Download the [Windows Installer][installer] directly from [nodejs.org][nodejs] and follow the instructions from the installation wizard.

All that’s left is to install Eleventy.

<h3 id="installing-eleventy">Installing Eleventy 🕚</h3>

Now that you have Node.js installed, you can use Node’s package manager, <abbr title="npm: Node Package Manager">npm</abbr>, to finish installing 🍦.11ty.js, Eleventy, and their _dependencies_ (that is, other smaller programs 🍦.11ty.js and Eleventy need to run).

In your [terminal](/blog/terminal/) and enter the following command:

<pre><code>npm install
</code></pre>

We’ve just gotten started with Node.js. But now that you have all the necessary software installed, we can pick up in the [final post](/blog/text-editor/) of this series with editing and creating your first content with 🍦.11ty.js.

[installer]: https://nodejs.org/en/#home-downloadhead
[nodejs]: https://nodejs.org/`
