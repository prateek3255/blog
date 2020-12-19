/**
 * @file Defines the chained template for basic post content
 * @author Prateek Surana
 * @see {@link https://www.11ty.dev/docs/layouts/#layout-chaining Layout chaining in 11ty}
 */

/**
 * Acts as front matter in JavaScript templates
 * @see {@link https://www.11ty.dev/docs/languages/javascript/#optional-data-method Optional `data` in JavaScript templates in 11ty}
 */
exports.data = {
  layout: 'layouts/base'
}

/**
 * The content of the post template
 * @method
 * @name render()
 * @param {Object} data 11ty’s data object
 * @return {String} The rendered template
 */
exports.render = function (data) {
  return `<article>
    <a href="${data.site.baseUrl}" class="blog-sticky-title">
      <div>
      <div style="margin-right: 6px;">🤓 </div>
      <span>Prateek's Blog<span>
      </div>
    </a>
    <div class="top-indicator-container" aria-label="Scroll to top" style="opacity: 0;" role="button" onClick="scrollToTop()">
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="top-indicator" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M256 217.9L383 345c9.4 9.4 24.6 9.4 33.9 0 9.4-9.4 9.3-24.6 0-34L273 167c-9.1-9.1-23.7-9.3-33.1-.7L95 310.9c-4.7 4.7-7 10.9-7 17s2.3 12.3 7 17c9.4 9.4 24.6 9.4 33.9 0l127.1-127z"></path>
      </svg>
    </div>
    <header class="article-header">
      <h1 class="no-margin">${data.title}</h1>
      <time>${this.pageDate(data)}</time>
    </header>
    ${data.content}
  </article>`
}
