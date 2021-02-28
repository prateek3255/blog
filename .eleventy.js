const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");

/**
 * Converts strings to slugs
 * @reference https://gist.github.com/codeguy/6684588
 * @param {string} str The string to be slugified
 */
function stringtoSlug (str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

  return str;
}

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Add shortcode for rendering heading with link
  eleventyConfig.addNunjucksShortcode(
    "headingWithLink",
    function (heading) {
      const slug = stringtoSlug(heading);
      return `<h2 class="relative">
      <a id="${slug}" href="#${slug}" class="header-anchor">
      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="absolute top-2 -left-7 opacity-0 icon" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
      ${heading}
      </a>
      </h2>`;
    }
  );

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
        collapseWhitespace: true,
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
