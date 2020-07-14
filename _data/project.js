/**
 * @file Exposes environment variables to templates
 * @author Prateek Surana
 */

/**
 * Uses Node.js’s `process.env` property 
 * @module _data/project
 * @see {@link https://www.11ty.dev/docs/data-js/#example-exposing-environment-variables Environment variables in 11ty}
 */
module.exports = {
  environment: process.env.ELEVENTY_ENV
}
