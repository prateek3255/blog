/**
 * @file Contains global data for configuring the site
 * @author Prateek Surana
 */



/**
 * Global site data module
 * @module _data/site
 * @see {@link https://www.11ty.dev/docs/data-global/ Global data files in 11ty}
 */
module.exports = {
  // The root for the site domain (without a trailing slash)
  baseUrl: process.env.BASE_URL,
  // Uses this locale when one is not set in content/content.11tydata.js
  defaultLocale: 'en-US',
  // Localized strings and other options for English
  // To add a language, copy this object, then change the values
  en: {
    // English as used in the Unite States
    locale: 'en-US',
    title: 'Prateek\'s Blog',
    // The subtitle, slogan, or catchphrase for your site,
    // used in _includes/shortcodes/site-header
    tagline: 'The Times of a JavaScript developer',
    // Puncuation between a title and subtitle,
    // used in _includes/shortcodes/title-tag
    separator: ' ',
    // The link text for skip-to-content lins, used by screen readers
    skipToContent: 'Skip to main content',
    // The link text to invite users to edit a page in the project Git repository
    // Link path stored in package.json
    editThisPage: '📝 Edit this page',
    // The paged navigation for larger archives of content
    // used in _includes/shortcodes/pagination-nav
    pagination: {
      // The aria-label for a pagination navigation
      navLabel: 'Pagination',
      // The aria-label for pages within a pagination navigation
      pageLabel: 'Page',
      // The link text for the first page within a pagination navigation
      first: '1',
      // The aria-label for the first page within a pagination navigation
      firstLabel: '1',
      // The link text for the previous page within a pagination navigation
      previous: 'Previous',
      // The link text for the next page within a pagination navigation
      next: 'Next',
      // The link text for the last page within a pagination navigation
      last: 'End',
      // The aria-label for the last page within a pagination navigation
      lastLabel: 'Last page'
    },
    // Options for your archive of posts,
    // used in _includes/layout/archive.11ty.js
    postsArchive: {
      // Heading for your most recent posts, used on home page
      headline: 'Latest posts',
      // Invite the user to visit your archive of posts, used on home page
      prompt: '… peruse your blog archives 👀',
      // The landing page for your archive of posts
      url: '/'
    },
    /*
     * Options for displaying dates in this locale
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString `toLocaleDateString()` on MDN}
     */
    dateOptions: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    },
    // Options for navigation elements
    nav: {
      // The `aria-label` to apply to the primary navigation
      primary: 'primary navigation'
    }
  }
}
