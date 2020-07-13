/**
 * @file Defines a shortcode for the description metadata
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 * @see {@link https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions JavaScript template functions in 11ty}
 */

/**
 * A JavaScript Template module for the description metadata
 * @module _includes/shortcodes/description
 * @param {Object} eleventyConfig 11ty’s Config API
 */
module.exports = eleventyConfig =>

  /**
   * HTML description
   * @method
   * @name description
   * @param {Object} data 11ty’s data object
   * @return {String} The rendered shortcode
   * @example `${this.description(data)}`
   * @see {@link https://www.11ty.dev/docs/data/ Using data in 11ty}
   */
  eleventyConfig.addShortcode('description', data =>
    `<meta name="description"
      content="${data.description
        ? data.description
        : data.site.description
          ? data.site.description
          : data.pkg.description}">`
  )
