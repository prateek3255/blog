/**
 * @file Defines a shortcode for loading external stylesheets
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 * @see {@link https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions JavaScript template functions in 11ty}
 */

/**
 * A JavaScript Template module for the external CSS `link`
 * @module _includes/shortcodes/external-css
 * @param {Object} eleventyConfig 11ty’s Config API
 */
module.exports = eleventyConfig =>

  /**
   * Create one or more `link` references
   * @method
   * @name externalCSS
   * @param {Object} data 11ty’s data object
   * @return {String} The rendered shortcode
   * @example `${this.externalCSS(data)}`
   * @see {@link https://www.11ty.dev/docs/data/ Using data in 11ty}
   */
  eleventyConfig.addShortcode('externalCSS', data => {
    var stylesheets = [
      'pages',
      'posts'
    ]
    var files = []
    var html = '';
    if (data.externalCSS !== undefined || data.tags !== undefined) {
      if (Array.isArray(data.externalCSS)) {
        files = [...data.externalCSS]
      }
      if (typeof data.externalCSS === 'string') {
        files.push(data.externalCSS)
      }
      if (stylesheets.includes(data.tags[0])) {
        files.push(data.tags[0]) 
      }
      files.map(file =>
        html += `<link href="/css/${file}.css" rel="stylesheet" media="screen">`)
    }
    return html
  })
