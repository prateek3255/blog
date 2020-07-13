/**
 * @file Defines a filter to minify JavaScript inline
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 */

/*
 * Import Terser module
 * @see {@link https://github.com/terser-js/terser GitHub}
 */
var Terser = require('terser')

/**
 * An Eleventy filter for minifying JavaScript inline
 * @module _includes/filters/minify-js
 * @param {Object} eleventyConfig 11ty’s Config API
 * @see {@link https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions JavaScript template functions in 11ty}
 */
module.exports = eleventyConfig =>

  /**
   * Minify JavaScript
   * @param {String} script A JavaScript file’s contents
   * @return {String} The minified script
   * @example `${this.minifyJS($this.fileToString('/includes/assets/js/gratuitip.js'))}`
   * See {@link https://www.11ty.dev/docs/quicktips/inline-js/ 11ty docs}
   * @see {@link https://www.11ty.dev/docs/data-js/#example-exposing-environment-variables Environment variables in 11ty}
   */
  eleventyConfig.addFilter('minifyJS', script => {
    // Only minify scripts for production
    if(process.env.ELEVENTY_ENV === 'production') {
      var minified = Terser.minify(script)
      if(minified.error) {
        console.log('Terser error: ', minified.error)
        return script
      }

      return minified.script
    }
    
    return script
  })
