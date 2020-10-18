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
      <img class="footer-img" alt="Footer Emoji" src="${data.site.baseUrl}img/prateek-bitmoji.png"></img>
      </div>
    </body>
  </html>`
}
