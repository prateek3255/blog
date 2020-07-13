/**
 * @file Defines the chained template for a collection archive page
 * @author Reuben L. Lillie <reubenlillie@gmail.com>
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
 * The content of the template
 * @method
 * @name render()
 * @param {Object} data 11ty’s data object
 * @return {String} The rendered template
 * @see {@link https://www.11ty.dev/docs/pagination/ Pagination in 11ty}
 */
exports.render = function (data) {
  return `<article>
    <header class="article-header">
      <h2>${data.title}</h2>
    </header>
    ${data.content}
    ${this.archive(data, data.pagination.items)}
    <footer>
      ${this.paginationNav(data)}
    </footer>
  </article>`
}
