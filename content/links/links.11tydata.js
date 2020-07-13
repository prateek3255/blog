/**
 * @file Contains data common to all links, to reduce repetition
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 */

/**
 * Directory data module for links
 * @module content/links
 * @see {@link https://www.11ty.dev/docs/data-template-dir/ Template and directory data files in 11ty}
 * @see {@link https://www.11ty.dev/docs/permalinks/#permalink-false `permalink: false` in 11ty}
 * @see {@link  https://www.11ty.dev/docs/permalinks/ Permalinks in 11ty}
 */
module.exports = {
  // Setting permalink to false means Eleventy will not create an output file,
  // but the content will still be available in collections and so forth
  permalink: false,
  tags: [
    'links'
  ]
}
