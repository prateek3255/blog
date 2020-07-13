/**
 * @file Defines a shortcode for the page header
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 * @see {@link https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions JavaScript template functions in 11ty}
 */

/**
 * A JavaScript Template module for the page header
 * @module _includes/shortcodes/site-header
 * @param {Object} eleventyConfig 11ty’s Config API
 */
module.exports = eleventyConfig =>

  /**
   * The page header markup
   * @method
   * @name siteHeader
   * @param {Object} data 11ty’s data object
   * @return {String} The rendered shortcode
   * @example `${this.siteHeader(data)}`
   * @see {@link https://www.11ty.dev/docs/data/ Using data in 11ty}
   */
  eleventyConfig.addShortcode('siteHeader', function (data) {
    var l10n = data.site[data.locale]
    // Inform screen readers when the home page link is for the current page
    return `<header id="site_header">
      <a href="#main" class="screen-reader-text">${l10n.skipToContent}</a>
      <h1 class="no-margin"
        style="--font-size:${120 / l10n.title.split('').length}vw;">
        <a href="/" 
          ${data.page.url === '/' ? 'aria-current="page"' : ''}>${l10n.title}</a>
      </h1>
      <p class="no-margin">${l10n.tagline}</p>
    </header>`
  })
