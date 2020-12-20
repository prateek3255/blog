/**
 * @file Defines the base template
 * @author Prateek Surana
 * @see {@link https://www.11ty.dev/docs/languages/javascript/#function JavaScript functions as templates in 11ty}
 */

/**
 * Base JavaScript Template module
 * @module _includes/layouts/base
 * @param {Object} data 11ty’s data object
 * @return {String} The rendered template
 * @see {@link https://www.11ty.dev/docs/data/ Using data in 11ty}
 * @see {@link https://www.11ty.dev/docs/shortcodes/ Shortcodes in 11ty}
 */
module.exports = function (data) {
  var l10n = data.site[data.locale]
  return `<!DOCTYPE html>
  <html lang="${data.locale ? l10n.locale : data.site.defaultLocale}">
    ${this.headTag(data)}
    <body class="grid gap no-margin body-border">  
      <main id="main" class="grid gap">
        ${data.content}
      </main>
      ${this.siteFooter(data)}
      <div class="footer-img-container">
      <a href="${data.site.baseUrl}">
      <img class="footer-img" alt="Footer Emoji" src="${data.site.baseUrl}img/prateek-bitmoji.png"></img>
      </a>
      </div>
      <script>
      function scrollToTop() {
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
      var article = document.getElementsByTagName('article')[0];
      var readTime = document.getElementsByClassName('read-time')[0];
      if(article && readTime) {
        var textContent = article.textContent;
        var str = textContent.replace(/(^\s*)|(\s*$)/gi,"");
        str = str.replace(/[ ]{2,}/gi," ");
        str = str.replace(/\\n /,"\\n");
        var wordCount = str.split(' ').filter(s=>s!=='\\n').length;
        var readingTimeInMinutes = Math.floor(wordCount / 228) + 1;
        var readingTimeAsString = readingTimeInMinutes + " min read";
        readTime.innerText = readingTimeAsString;
      }
    </script>
    </body>
  </html>`
}
