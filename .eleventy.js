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

function projectCard(content, logo, title, buttons) {
  return `
        <div
          class="
           transform 
            relative 
            bg-white
            py-6
            px-6
            rounded-3xl
            w-full
            my-4
            shadow-xl
            flex flex-col
            items-center
            hover:shadow-2xl 
            hover:scale-105 
            transition 
            duration-500
          "
          >
          <a
          href="${buttons[0].link}"
          target="_blank"
          rel="noopener noreferrer">
              <img
                src="/img/${logo}"
                alt="${title} Logo"
                height="100"
                width="100"
                style="height:100px; width: auto;"
                class="rounded-full"
              />
          </a>
          <div class="mt-8">
            <a
            href="${buttons[0].link}"
            target="_blank"
            rel="noopener noreferrer">
              <h3 class="text-xl sm:text-2xl font-semibold my-2">${title}</h3>
            </a>
            <p class="text-base sm:text-lg mt-4 max-w-xs">
              ${content}
            </p>
            <div class="my-10 w-full flex justify-center">
              ${buttons.map((button, index) => {
                return `
                  <a
                  href="${button.link}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-secondary ${buttons.length === index + 1 ? "" : "mr-4"}">${button.title}
                  </a>
                `;
              }).join("\n")}
            </div>
          </div>
        </div>
  `;
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
        src="..${lowsrc.url}"
        width="${lowsrc.width}"
        height="${lowsrc.height}"
        alt="${alt}"
        class="${allClasses}"
        loading="lazy"
        decoding="async">
    </picture>`;
}

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Landing page shortcodes
  // -------------------------

  eleventyConfig.addPairedNunjucksShortcode("projectCard", projectCard);
  eleventyConfig.addPairedNunjucksShortcode("sectionHeader", sectionHeader);
  eleventyConfig.addNunjucksShortcode("homeLink", homeLink);

  // Add shortcode for rendering heading with link
  eleventyConfig.addNunjucksShortcode(
    "headingWithLink",
    function (heading, type = "h2") {
      const slug = stringtoSlug(heading);
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

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/favicons");

  // Copy sitemap and robots.txt to route of /_site
  eleventyConfig.addPassthroughCopy("./src/sitemap.xml");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");

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
