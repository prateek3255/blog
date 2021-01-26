const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const fs = require('fs');

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );

  // Add Tailwind Output CSS as Watch Target
  eleventyConfig.addWatchTarget("./_tmp/css/style.css");

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./_tmp/css/style.css": "./css/style.css",
    "./node_modules/alpinejs/dist/alpine.js": "./js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css":
      "./css/prism-tomorrow.css",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/img");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/favicons");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  /**
   * Serve the rendered 404 page when using `eleventy --serve` locally
   * @see {@link https://www.11ty.dev/docs/quicktips/not-found/#with-serve Adding a 404 page in 11ty}
   */
  // eleventyConfig.setBrowserSyncConfig({
  //   callbacks: {
  //     ready: (err, bs) => {
  //       bs.addMiddleware("*", (req, res) => {
  //         const content_404 = fs.readFileSync('_site/404.html');
  //         // Provides the 404 content without redirect
  //         res.write(content_404);
  //         // Add 404 http status code in request header
  //         // res.writeHead(404, { "Content-Type": "text/html" })
  //         res.writeHead(404);
  //         res.end()
  //       })
  //     }
  //   }
  // })

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
