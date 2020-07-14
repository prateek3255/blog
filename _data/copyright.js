/**
 * @file Contains global copyright data
 * @author Prateek Surana
 */



/**
 * Global copyright data module
 * @module _data/copyright
 * @see {@link https://www.11ty.dev/docs/data-global/ Global data files in 11ty}
 * @see {@link https://creativecommons.org/ Creative Commons}
 */
module.exports = {
  // Use current year
  year: new Date().getFullYear(),
  holder: '<a href=\"https://twitter.com/psuranas\">Prateek Surana</a>',
  license: {
    abbr: 'CC BY-SA',
    name: 'Creative Commons Attribution-ShareAlike 4.0 International license',
  },
  url: 'https://creativecommons.org/licenses/by-sa/4.0/'
}
