const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const htmlmin = require("html-minifier");
const Image = require("@11ty/eleventy-img");

/**
 * Converts strings to slugs
 * @reference https://gist.github.com/codeguy/6684588
 * @param {string} str The string to be slugified
 */
function stringtoSlug(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}

function sectionHeader(content, title, addTopMargin = true) {
  return `
    <h2 class="text-3xl sm:text-5xl font-bold ${addTopMargin ? 'mt-32' : ''}">${title}</h2>
    <p class="text-base sm:text-xl mt-6 max-w-3xl mx-auto">
      ${content}
    </p>
  `;
}

function homeLink(title, link) {
  return `<a href="${link}" target=“_blank” class="text-blue-600" rel=“noreferrer noopener”>
    ${title}
  </a>`;
}

function playgroundLink(link) {
  return `<div class="text-right" style="margin-top: -6px;">
<a href="${link}" 
    target="_blank" 
    rel="noopener noreferrer"
    class="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 hover:underline transition">
  <svg width="12" height="12" viewBox="-3 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>play</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-419.000000, -571.000000)" fill="currentColor"> <path d="M440.415,583.554 L421.418,571.311 C420.291,570.704 419,570.767 419,572.946 L419,597.054 C419,599.046 420.385,599.36 421.418,598.689 L440.415,586.446 C441.197,585.647 441.197,584.353 440.415,583.554" id="play" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>
  Try it in Playground
</a>
</div>`
}

function callout(content) {
  return `<aside class="bg-gray-200 text-black sm:text-xl text-base relative mt-7 callout sm:px-8 sm:py-2 px-6 py-1">
    ${content}
  </aside>`
}

async function imageShortcode(
  img,
  alt,
  classes = "",
  sizes = "(max-width: 600px) 480px, (max-width: 1024px) 768px, 1200px"
) {
  if (alt === undefined) {
    // You bet we throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on responsiveimage from: ${img}`);
  }

  let metadata = await Image(`./src/img/${img}`, {
    widths: [480, 768, 1200],
    formats: ["webp", "jpeg"],
    outputDir: "./_site/img/",
    filenameFormat: function (id, src, width, format) {
      // Get file name from path
      // ex - ./src/img/hello.png -> hello
      const path = src.split("/");
      const fileName = path[path.length - 1].split(".")[0];

      return `${fileName}-${width}.${format}`;
    },
  });

  let lowsrc = metadata.jpeg[1] || metadata.jpeg[0];

  const allClasses = classes.length > 0 ? classes : "article-img";

  // Directly return the simple img tag for gif file
  // Can be updated in future to video tag for better performance
  if (img.endsWith("gif")) {
    return `<img
        src="/img/${img}"
        width="${lowsrc.width}"
        height="${lowsrc.height}"
        alt="${alt}"
        class="${allClasses}"
        loading="lazy"
        decoding="async"></img>`;
  }

  return `<picture>
    ${Object.values(metadata)
      .map((imageFormat) => {
        return `  <source type="${
          imageFormat[0].sourceType
        }" srcset="${imageFormat
          .map((entry) => `${entry.srcset}`)
          .join(", ")}" sizes="${sizes}">`;
      })
      .join("\n")}
      <img
        src="${lowsrc.url}"
        width="${lowsrc.width}"
        height="${lowsrc.height}"
        alt="${alt}"
        class="${allClasses}"
        loading="lazy"
        decoding="async">
    </picture>`;
}

function videoShortcode(src, autoPlayWithoutControls = false, additionalAttributes = '') {
  return `<video src="/videos/${src}" ${autoPlayWithoutControls ? 'autoplay' : 'controls'} loop ${additionalAttributes}>Looks like your browser doesn't support this video you can download the video [here](/videos/${src}).</video>`
}

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Landing page shortcodes
  // -------------------------
  eleventyConfig.addPairedNunjucksShortcode("sectionHeader", sectionHeader);
  eleventyConfig.addNunjucksShortcode("homeLink", homeLink);

  // Add shortcode for rendering heading with link
  eleventyConfig.addNunjucksShortcode(
    "headingWithLink",
    function (heading, type = "h2", customSlug = null) {
      const slug = customSlug ? stringtoSlug(customSlug) : stringtoSlug(heading);
      return `<${type} class="relative">
      <a id="${slug}" href="#${slug}" class="header-anchor">
      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="absolute top-2 -left-7 opacity-0 icon" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
      ${heading}
      </a>
      </${type}>`;
    }
  );

  // Shortcode for generating image
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  // Shortcode for generating video
  eleventyConfig.addNunjucksShortcode("video", videoShortcode);

  // Shortcode for generating callout
  eleventyConfig.addPairedNunjucksShortcode("callout", callout);

  // Shortcode for generating playground link
  eleventyConfig.addNunjucksShortcode("playgroundLink", playgroundLink);

  // Creates a link from the slugified string
  eleventyConfig.addNunjucksShortcode("slugifiedLink", function (text) {
    const slug = stringtoSlug(text);
    return `[${text}](#${slug})`;
  });

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  eleventyConfig.addFilter("filterPostsWithTitle", (posts, notAllowedTitles) => {
    return posts.filter(({ data }) => !notAllowedTitles.includes(data.title));
  })

  // Plugin for generating RSS feed
  eleventyConfig.addPlugin(pluginRss);

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight, {
    trim: true,
    alwaysWrapLineHighlights: false,
  });

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
    "./node_modules/prismjs/themes/prism-tomorrow.css":
      "./css/prism-tomorrow.css",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/videos");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/favicons");

  // Copy sitemap and robots.txt to route of /_site
  eleventyConfig.addPassthroughCopy("./src/sitemap.xml");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
  eleventyConfig.addPassthroughCopy("./src/_redirects");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
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
