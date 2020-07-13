/**
 * @file Defines a filter to minify HTML template files
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 */

/*
 * Import Juriy Zaytsev’s HTMLMinifier module
 * @see {@link https://github.com/kangax/html-minifier GitHub}
 */
var htmlmin = require('html-minifier')

/**
 * An Eleventy transform for minifying HTML template files
 * @module _includes/transforms/minify-html
 * @param {Object} eleventyConfig 11ty’s Config API
 * @see {@link https://www.11ty.dev/docs/config/#transforms 11ty docs}
 */
module.exports = eleventyConfig =>

  /**
   * Minifies HTML
   * @param {String} content An HTML document
   * @param {String} outputPath Where Eleventy should output the content
   * @return {String} The minified content
   * @see {@link https://www.11ty.dev/docs/data-js/#example-exposing-environment-variables Environment variables in 11ty}
   */
  eleventyConfig.addTransform('minifyHTML', (content, outputPath) => {
    // Only minify HTML for production
    if(process.env.ELEVENTY_ENV === 'production' &&
      (outputPath !== false && outputPath.endsWith('.html'))) {
      var minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      })
      return minified
    }

    return content
  })
