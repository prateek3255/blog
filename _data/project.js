/**
 * @file Exposes environment variables to templates
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 */

/**
 * Uses Node.js’s `process.env` property 
 * @module _data/project
 * @see {@link https://www.11ty.dev/docs/data-js/#example-exposing-environment-variables Environment variables in 11ty}
 */
module.exports = {
  environment: process.env.ELEVENTY_ENV
}
