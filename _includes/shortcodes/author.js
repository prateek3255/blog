/**
 * @file Defines a shortcode for displaying information about an author
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 * @see {@link https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions JavaScript template functions in 11ty}
 */

/**
 * A JavaScript Template module for the content author information
 * @module _includes/shortcodes/author
 * @param {Object} eleventyConfig 11ty’s Config API
 */
module.exports = eleventyConfig =>

  /**
   * Content author markup
   * @method
   * @name author
   * @param {Object} 11ty’s data object
   * @return {String} The rendered shortcode
   * @example `${this.author(data)}`
   * @see {@link https://www.11ty.dev/docs/data/ Using data in 11ty}
   */
  eleventyConfig.addShortcode('author', data =>
    `<span id="author_name">${data.author.name.fullName}</span>`
  )
