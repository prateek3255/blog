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
  title: 'Welcome to 🍦.11ty.js',
  date: '2020-04-10',
  permalink: '/blog/welcome/',
  templateEngineOverride: '11ty.js,md',
  description: 'Not only is this first blog post meant to be inviting and informative, you can get a taste of how quirky Reuben’s writing gets when he tries to be playful with his prose.'
}

/**
 * The content of the blog post
 * @method
 * @name render()
 * @param {Object} data 11ty’s data object
 * @return {String} The rendered template
 */
exports.render = data =>
`This blog isn’t just some nonsensical chunk of sample content—it occassionally rises to the level of being helpful (well, … hopefully).
  
The posts in this sample blog are meant to guide you through how to install 🍦.11ty.js and spin up your own site with this starter project. You don’t need web development experience to follow along. All you need is a willingness to learn! You can work at your own pace and skip around if you like.

> <p><strong>😰 Stuck?</strong></p>
> <p>Try <a href="${data.pkg.bugs.url}">submitting an issue on GitLab</a> where friendly folks can try to help.</p>

### Why 🍦?

You mean besides the opportunity to overuse the vanilla icecream emoji?

🍦.11ty.js is designed for [a myriad of reasons outlined on the About page](/about/), but one in particular bears repeating here:

_We need to lower the barrier to entry for web development._

The [Web is for everyone](https://www.w3.org/Consortium/mission)—it’s literally the mission statement of the World Wide Web Consortium (W3C), the international standards organization for the Internet. As liberating is this ideal truly is, the inherently open canvas of the Web can leave newcomers and not-so-techinically-inclined folks feeling lost and deserted 🏝️. Not all content is actually beneficial or trustworthy. And learning is hard enough when you have a clear set of directions to follow.

This project is designed to give you a solid foundation from which to build a fast, accessible, lightweight, secure, user-friendly, developer-friendly site. As far as possible, 🍦.11ty.js aspires to follow current standards and best practices.`
