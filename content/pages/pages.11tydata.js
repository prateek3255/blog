/**
 * @file Contains data common to all pages, to reduce repetition
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 */

/**
 * Directory data module for pages
 * @module content/pages
 * @see {@link https://www.11ty.dev/docs/data-template-dir/ Template and directory data files in 11ty}
 * @see {@link  https://www.11ty.dev/docs/permalinks/ Permalinks in 11ty}
 */
module.exports = {
  layout: 'layouts/page',
  // Note: The permalink value uses Nunjucks/Liquid syntax;
  // a future version of 11ty may allow for JavaScript template literals
  permalink: '/{{page.fileSlug}}/index.html',
  tags: [
    'pages'
  ]
}
