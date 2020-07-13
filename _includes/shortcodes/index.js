/**
 * @file Imports shortcodes and configures them with 11ty (.eleventy.js)
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
 */

// Import shortcodes to include
var archive = require('./archive')
var author = require('./author')
var authorMeta = require('./author-meta')
var colophon = require('./colophon')
var copyrightNotice = require('./copyright-notice')
var cssRoot = require('./css-root')
var description = require('./description')
var editThisPage = require('./edit-this-page')
var externalCSS = require('./external-css')
var favicon = require('./favicon')
var gettingStarted = require('./getting-started')
var headTag = require('./head-tag')
var inlineCSS = require('./inline-css')
var nav = require('./nav')
var pageDate = require('./page-date')
var paginationNav = require('./pagination-nav')
var siteFooter = require('./site-footer')
var siteHeader = require('./site-header')
var socialMeta = require('./social-meta')
var titleTag = require('./title-tag')

/**
 * A loader module for shortcodes
 * @module _includes/shortcodes
 * @param {Object} eleventyConfig 11ty’s Config API
 * @see {@link https://www.11ty.dev/docs/config/ Configuring 11ty}
 * @see {@link https://www.11ty.dev/docs/shortcodes/ Shortcodes in 11ty}
 */
module.exports = eleventyConfig => {

  // Function calls to shortcodes to include
  archive(eleventyConfig)
  author(eleventyConfig)
  authorMeta(eleventyConfig)
  colophon(eleventyConfig)
  copyrightNotice(eleventyConfig)
  cssRoot(eleventyConfig)
  description(eleventyConfig)
  editThisPage(eleventyConfig)
  externalCSS(eleventyConfig)
  favicon(eleventyConfig)
  gettingStarted(eleventyConfig)
  headTag(eleventyConfig)
  inlineCSS(eleventyConfig)
  nav(eleventyConfig)
  pageDate(eleventyConfig)
  paginationNav(eleventyConfig)
  siteFooter(eleventyConfig)
  siteHeader(eleventyConfig)
  socialMeta(eleventyConfig)
  titleTag(eleventyConfig)

  return

}
