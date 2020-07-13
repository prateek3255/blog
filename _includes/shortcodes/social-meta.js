/**
 * @file Defines a universal shortcode for social media metadata
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 * @see {@link https://www.11ty.dev/docs/shortcodes/ Shortcodes in 11ty}
 */

/**
 * A shortcode for including social media metadata in the `<head>`
 * @module _includes/shortcodes/social-meta
 * @param {Object} eleventyConfig 11ty’s Config API
 */
module.exports = eleventyConfig =>

  /**
   * OpenGraph and Twitter metadata with fallbacks (./_data/site.js)
   * @method
   * @name socialMeta
   * @param {Object} data 11ty’s data object
   * @return {String} The rendered shortcode
   * @example `${this.socialMeta()}`
   * @see {@link https://css-tricks.com/essential-meta-tags-social-media/ Adam Coti, “The Essential Meta Tags for Social Media,” _CSS-Tricks_ (updated December 21, 2016)}
   * @see {@link https://www.11ty.dev/docs/data/ Using data in 11ty}
   */
  eleventyConfig.addShortcode('socialMeta', data => {
    var meta = '';
    meta += (data.title)
      ? `<meta property="og:title" content="${data.title}">
        <meta name="twitter:title" content="${data.title}">`
      : `<meta property="og:title" content="${data.site.title}">
        <meta name="twitter:title" content="${data.site.title}">`
    meta += (data.description)
      ? `<meta property="og:description" content="${data.description}">
        <meta property="twitter:description" content="${data.description}">`
      : `<meta property="og:description" content="${data.pkg.description}">
        <meta property="twitter:description" content="${data.pkg.description}">`
    meta += (data.thumbnail)
      ? `<meta property="og:image" content="${data.site.baseUrl}/img/${data.thumbnail}">
        <meta name="twitter:image" content="${data.site.baseUrl}/img/${data.thumbnail}">
        <meta name="twitter:card" content="summary_large_image">`
        // Create a file named ./img/headshot.jpg to make the fallback work
      : `<meta property="og:image" content="${data.site.baseUrl}/img/headshot.jpg">
        <meta name="twitter:image" content="${data.site.baseUrl}/img/headshot.jpg">
        <meta name="twitter:card" content="summary_large_image">`
    meta += `<meta property="og:url" content="${data.page.url}">`
    return meta
  })
