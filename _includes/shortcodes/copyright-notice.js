/**
 * @file Defines a shortcode for the copyright notice markup
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 * @see {@link https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions JavaScript template functions in 11ty}
 */

/**
 * A JavaScript Template module for the copyright notice
 * @module _includes/shortcodes/copyright-notice
 * @param {Object} eleventyConfig 11ty’s Config API
 */
module.exports = eleventyConfig =>

  /**
   * Copyright notice markup
   * @method
   * @name copyrightNotice
   * @param {Object} 11ty’s data object
   * @return {String} The rendered shortcode
   * @example `${this.copyrightNotice(data)}`
   * @see {@link https://www.11ty.dev/docs/data/ Using data in 11ty}
   */
  eleventyConfig.addShortcode('copyrightNotice', data =>
    `<span id="copyright_year">&copy; ${data.copyright.year}</span>
      <span id="copyright_holder">${data.copyright.holder}.</span>
      <span id="copyright_license">
        <a href="${data.copyright.url}"><abbr title="${data.copyright.license.abbr}: ${data.copyright.license.name}">${data.copyright.license.abbr}</abbr></a>.
      </span>`
  )
