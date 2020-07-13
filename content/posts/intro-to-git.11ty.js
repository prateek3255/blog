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
  title: 'Getting Started with 🍦.11ty.js, Part III: An Introduction to Git',
  date: '2020-04-14',
  permalink: '/blog/intro-to-git/',
  templateEngineOverride: '11ty.js,md',
  description: 'Learn about what Git is and how to install a personal copy of 🍦.11ty.js on your computer.'
}

/**
 * The content of the blog post
 * @method
 * @name render()
 * @param {Object} data 11ty’s data object
 * @return {String} The rendered template
 */
exports.render = data =>
`_This is the third post in a five-part series on [“Getting Started with 🍦.11ty.js”](/blog/getting-started/)_

### What is Git?

**Short answer:** Git gives you super powers 🏋️.

**Slightly longer answer:** Git allows you to store a personal copy of a piece of software on your computer, which you can also connect with a “master” copy on the Internet.

In tech speak, [Git](https://git-scm.com/) is a type of program known as a _distributed version-control system_, which means people around the world can work together to develop the same application 🤓.

In plain language, Git makes it possible for you to get updates (and make your own!) for a software program, namely, 🍦.11ty.js and the website you build with it 🏗️.

### 🎣 How Do You Get Git?

Technically, you don’t _need_ to install Git on your computer. If you really wanted to, you _could_ work entirely online with [GitLab](${data.pkg.homepage}). But, as I alluded to in [the first post of this series](/blog/getting-started/), you can do a lot more testing and fine tuning from your local development environment.

> <p><strong>Do You Also Need a GitLab Account? 🤔 </strong><p>
> <p><strong>Short answer:</strong> No, but it won’t hurt.</p>
> <p><strong>Slightly longer answer:</strong> You can do a lot more by having an account with an online Git hosting service like GitLab or GitHub. Having a GitLab account, in particular, allows you to submit <a href="${data.pkg.bugs.url}">issues and feature requests</a> to improve 🍦.11ty.js.</p>

There are multiple ways to install Git on your operating system. Here are what I know to be the clearest, officially supported methods. If you’re interested, the [Git website](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) lists a few more options.

#### On 🐧 Ubuntu Linux

Open your [terminal](/blog/terminal/) and enter the following commands.

##### 1. Check if your computer already has Git:

<pre><code>git --version</code></pre>

If you don’t have Git installed already, then the command line will prompt you to install it.

Even if you already have Git installed, it’s still a good idea to update your system so you can access to the latest supported version of Git.

##### 2. Update your system:

I recommend running this pair of commands:

<pre><code>sudo apt update
sudo apt -y dist-upgrade</code></pre>

If you already have Git installed, you can skip to [configuring Git](#configuring-git).

##### 3. Install Git:

<pre><code>sudo apt install git</code></pre>

All that’s left is to [configure Git](#configuring-git).

#### On 🍏 macOS

Open your [terminal](/blog/terminal/) and enter the following command:

<pre><code>git --version</code></pre>

If you don’t already have Git installed on your system, the command line will prompt you to install [Xcode](https://apps.apple.com/us/app/xcode/id497799835), Apple’s official suite of developer tools which includes Git.

All that’s left is to [configure Git](#configuring-git).

#### On 🏢 Windows

##### 1. [Download the latest version from the Git website](https://git-scm.com/download/win).

##### 2. Open the downloaded program and follow the instructions from the installation wizard.

All that’s left is to configure Git.

<h3 id="configuring-git">🔧 Configuring Git</h3>

Once you have Git installed on your workstation, you’ll need to set your username and e-mail.

In your terminal, enter the following commands, replacing the example text with your information:

<pre><code>git config --global user.name "Your Name"
git config --global user.email "example@email.com"
</code></pre>

### 📥 Downloading Your Local Copy of 🍦.11ty.js with Git

Now that you have Git installed and configured, you can [download a copy of 🍦.11ty.js from GitLab](${data.pkg.homepage}).

In your terminal, enter the following command, replacing <code>my-blog-directory-name</code> with the file path where you want to store your copy of 🍦.11ty.js on your computer (or omit the file path from the end of the command, and Git will create a directory named <code>eleventy-dot-js-blog</code> in the current directory):

<pre><code>git clone ${data.pkg.repository.url} my-blog-directory-name
</code></pre>

We’ve barely scratched the surface with Git. But now that you have Git and a local copy of 🍦.11ty.js, we can pick up in the next post of this series with [installing Node.js and Eleventy](/blog/installing-nodejs-and-eleventy/).`
