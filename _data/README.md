# eleventy-dot-js-blog/\_data

In Eleventy, the [data directory](https://www.11ty.dev/docs/config/#directory-for-global-data-files) is meant for [global data](https://www.11ty.dev/docs/data-global/), making them available to all templates via Eleventy’s `data` object.

_See the Eleventy documentation for more information about the [data cascade](https://www.11ty.dev/docs/data-cascade/)._

This directory shows _one way_ to organize global data into modular files, like a typical blog. The [`site.js`](https://gitlab.com/reubenlillie/eleventy-dot-js-blog/-/blob/master/_data/site.js) file here defines, among other items, a `defaultLocale` property as well as an `en` object which contains strings of text and other options specific to English-language content. You can edit the values for these properties to fit your site.

To change the main locale for your content, rename the `en` object key to another [ISO language code](https://www.loc.gov/standards/iso639-2/php/code_list.php) **and make the same change to the `locale` property in [`../content/content.11tydata.js`](https://gitlab.com/reubenlillie/eleventy-dot-js-blog/-/blob/master/content/content.11tydata.js).**.

To add support for multiple content languages:

1. Copy and paste the `en` object within `site.js`
1. Renaming the copied object key to whatever ISO language code you choose, e.g., `es` for Spanish)
1. Translate the values for each of the properties

_See [`../content/README.md`](https://gitlab.com/reubenlillie/eleventy-dot-js-blog/-/blob/master/content/README.md) to help you decide how to organize your multilingual content._

You don´t have to store all the global translation strings in `site.js` either. Instead, you could follow the pattern of assigning translation strings to language-code objects and create any number of JavaScript or JSON files in this directory.

**Warning:** Use camelCase to name new global data files. Don’t use hyphens (`-`). That way you can access their properties from the `data` object using JavaScript dot notation.

For example, you could create a file in this directory named `siteFooter.js` to store translation strings (along with any other data you like) that you want to target in a specific way in the [`../_includes/shortcodes/site-footer.js`](https://gitlab.com/reubenlillie/eleventy-dot-js-blog/-/blob/master/_includes/shortcodes/site-footer.js) shortcode. Or, you could create a file named `branding.js` to store localized references to your branding assets.
