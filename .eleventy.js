/**
 * @file Configures preferences for Eleventy
 * @author Prateek Surana
 * @see {@link https://www.11ty.dev/docs/config/ 11ty Documentation}
 */

// Require native Node.js modules
var fs = require('fs')

/**
 * Require the includes module for the following.
 *
 * - Filters (for modifying content on input)
 * - Shortcodes (for reusable content)
 * - Transforms (for modifying a template’s output)
 *
 * Storing these modules in separate directories,
 * rather than all in this file,
 * helps keep the codebase organized—at least that’s the idea.
 */
var includes = require('./_includes/index')

/**
 * 11ty’s configuration module
 * @module .eleventy
 * @param {Object} eleventyConfig 11ty’s Config API
 * @return {Object} 11ty’s Config object optional
 * @see {@link https://www.11ty.dev/docs/config/ Configuring 11ty}
 */
module.exports = function (eleventyConfig) {

  // Pass 11ty’s Conig object to the includes module (~/_includes)
  includes(eleventyConfig)

  /**
   * Combine data in the Eleventy data cascade, rather than overwriting it
   * @see {@link https://www.11ty.dev/docs/data-deep-merge/ Data deep merge in 11ty}
   */
  eleventyConfig.setDataDeepMerge(true)

  /**
   * Copy static assets to the output directory
   * @see {@link https://www.11ty.dev/docs/copy/ Passthrough copy in 11ty}
   */
  eleventyConfig.addPassthroughCopy('css')
  eleventyConfig.addPassthroughCopy('img')

  /**
   * Have Eleventy watch the following additional files for live browsersync
   * @see @{@link https://www.11ty.dev/docs/config/#add-your-own-watch-targets Add your own watch targets in 11ty}
   */
  eleventyConfig.addWatchTarget('./**/*.css')
  eleventyConfig.addWatchTarget('./**/*.js')

  /**
   * Serve the rendered 404 page when using `eleventy --serve` locally
   * @see {@link https://www.11ty.dev/docs/quicktips/not-found/#with-serve Adding a 404 page in 11ty}
   */
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: (err, bs) => {
        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync('_site/404.html');
          // Provides the 404 content without redirect
          res.write(content_404);
          // Add 404 http status code in request header
          // res.writeHead(404, { "Content-Type": "text/html" })
          res.writeHead(404);
          res.end()
        })
      }
    }
  })

  // If you want to use an alternative file structure,
  // then you can uncomment this return statement
  // and change the values for one or more of these directories
  // (defaults shown).
  /*
  return {
    dir: {
      input: '.',
      includes: '_includes',
      data: '_data',
      output: '_site'
    },
    pathPrefix: '/',
  }
  */
}
