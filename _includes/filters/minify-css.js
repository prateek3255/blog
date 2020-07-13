/**
 * @file Defines a filter to minify CSS inline
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 */

/*
 * Import Jakup Pawlowicz’s Clean-CSS module
 * @see {@link https://github.com/jakubpawlowicz/clean-css GitHub}
 */
var CleanCSS = require('clean-css')

/**
 * An Eleventy filter for minifying CSS inline
 * @module _includes/filters/minify-css
 * @param {Object} eleventyConfig 11ty’s Config API
 * @see {@link https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions JavaScript template functions in 11ty}
 */
module.exports = eleventyConfig =>

  /**
   * Minifies CSS
   * @param {String} stylesheet A raw stylesheet
   * @return {String} The minified stylesheet
   * @example `${this.minifyCSS($this.fileToString('css/inline.css'))}`
   * @see {@link https://github.com/jakubpawlowicz/clean-css#minify-method clean-css on GitHub}
   * @see {@link https://www.11ty.dev/docs/data-js/#example-exposing-environment-variables Environment variables in 11ty}
   */
  eleventyConfig.addFilter('minifyCSS', stylesheet => {
    // Only minify stylesheets for production
    if(process.env.ELEVENTY_ENV === 'production') {
      minified = new CleanCSS({}).minify(stylesheet).styles
      return minified
    }
    
    return stylesheet
  })
