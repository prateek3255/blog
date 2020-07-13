/**
 * @file Imports transforms and configures them with 11ty (.eleventy.js)
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 */

// Import transforms to include
var minifyHTML = require('./minify-html')

/**
 * A loader module for transforms
 * @module _includes/transforms
 * @param {Object} eleventyConfig 11ty’s Config API
 * @see {@link https://www.11ty.dev/docs/config/ Configuring 11ty}
 * @see {@link https://www.11ty.dev/docs/config/#transforms Transforms in 11ty}
 */
module.exports = eleventyConfig => {

  // Function calls to transforms to include
  minifyHTML(eleventyConfig)

  return

}
