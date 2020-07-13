/**
 * @file Defines a shortcode for the author metadata
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 * @see {@link https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions JavaScript template functions in 11ty}
 */

/**
 * A JavaScript Template module for the author metadata
 * @module _includes/shortcodes/author-meta
 * @param {Object} eleventyConfig 11ty’s Config API
 */
module.exports = eleventyConfig =>

  /**
   * HTML author metadata
   * @method
   * @name authorMeta
   * @param {Object} data 11ty’s data object
   * @return {String} The rendered shortcode
   * @example `${this.authorMeta(data)}`
   * @see {@link https://www.11ty.dev/docs/data/ Using data in 11ty}
   */
  eleventyConfig.addShortcode('authorMeta', data =>
    `<meta name="author"
      content="${data.author.name.fullName
        ? data.author.name.fullName
        : data.copyright.holder
          ? data.copyright.holder
          : data.site.title}">`
  )
