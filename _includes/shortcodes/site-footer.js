/**
 * @file Defines a shortcode for the page footer markup
 * @author Prateek Surana
 * @see {@link https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions JavaScript template functions in 11ty}
 */

/**
 * A JavaScript Template module for the page footer
 * @module _includes/shortcodes/site-footer
 * @param {Object} eleventyConfig 11ty’s Config API
 */
module.exports = eleventyConfig =>

  /**
   * The page footer markup
   * @method
   * @name siteFooter
   * @param {Object} data 11ty’s data object
   * @return {String} The rendered shortcode
   * @example `${this.siteFooter(data)}`
   * @see {@link https://www.11ty.dev/docs/data/ Using data in 11ty}
   */
  eleventyConfig.addShortcode('siteFooter', function (data) {
    return `<footer id="site_footer">
        <div>
        <p>${this.editThisPage(data)}</p>
        <p>${this.copyrightNotice(data)}</p>
        </div>
        
        <div class="social">
        <ul>
        <li>
            <a href="${data.author.twitter}" target="_blank"><i class="fa fa-twitter" aria-hidden="true"></i></a>
        </li>
                        <li>
                            <a href="${data.author.github}" target="_blank"><i class="fa fa-github" aria-hidden="true"></i></a>
                        </li>
                        <li>
                            <a href="${data.author.stackOverflow}" target="_blank"><i class="fa fa-stack-overflow" aria-hidden="true"></i></a>
                        </li>
                        <li>
                            <a href="${data.author.medium}" target="_blank"><i class="fa fa-medium" aria-hidden="true"></i></a>
                        </li>
                        <li>
                            <a href="${data.author.quora}" target="_blank"><i class="fa fa-quora" aria-hidden="true"></i></a>
                        </li>
                        <li>
                                <a href="${data.author.linkedIn}" target="_blank"><i class="fa fa-linkedin" aria-hidden="true"></i></a>
                        </li>
                    </ul>
        </div>
      </footer>`
  })
