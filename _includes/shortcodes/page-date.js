/**
 * @file Defines a shortcode for displaying a page’s date
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 * @see {@link https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions JavaScript template functions in 11ty}
 * @see {@link https://www.11ty.dev/docs/dates/}
 */

/**
 * A JavaScript Template module for the `page.date`
 * @module _includes/shortcodes/page-date
 * @param {Object} eleventyConfig 11ty’s Config API
 */
module.exports = eleventyConfig =>

  /**
   * Page date markup
   * @method
   * @name pageDate
   * @param {Object} data 11ty’s data object
   * @return {String} The rendered shortcode
   * @example `${this.pageDate(data)}`
   * @see {@link https://www.11ty.dev/docs/data/ Using data in 11ty}
   */
  eleventyConfig.addShortcode('pageDate', data => {
    var date = data.page.date
    var locale
    data.locale
      ? locale = data.page.locale
      : locale = data.site.defaultLocale
    var options = data.site[data.locale].dateOptions
    // Check that `date` is a JavaScript `Date` object.
    return Object.prototype.toString.call(date) === "[object Date]"
      ? `${date.toLocaleDateString(locale, options)}`
      : ''
  })
