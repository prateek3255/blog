/**
 * @file Defines a shortcode to load a favicon for the user’s platform
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 */

/**
 * A JavaScript Template module for favicons
 * @module _includes/shortcode/favicon
 * @param {Object} eleventyConfig 11ty’s Config API
 * @see {@link https://www.11ty.dev/docs/filters/ 11ty docs}
 */
module.exports = eleventyConfig =>

  /**
   * Load the appropriate favicon
   * @method
   * @name favicon
   * @param {Object} data 11ty’s data object
   * @return {String} The rendered shortcode
   * @example `${this.favicon(data)}`
   * @see {@link https://css-tricks.com/emojis-as-favicons/ “Emojis as Favicons” from _CSS-Tricks_}
   * @see {@link https://realfavicongenerator.net/ Real Favicon Generator}
   * @see {@link https://www.11ty.dev/docs/data/ Using data in 11ty}
   */
  eleventyConfig.addShortcode('favicon', function (data) {
    // You can only use one of these return statements at a time
    // Comment the next line ⬇️ to disable emoji favicons 
    return `<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍦</text></svg>">`
    // Uncomment the next line ⬇️ to enable favicons via the Real Favicon Generator
    // return `${this.fileToString('favicons/html_code.html')}`
  })
