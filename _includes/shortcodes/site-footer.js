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
    <div id="footer_content">
        <div>
        <p>${this.editThisPage(data)}</p>
        <p>${this.copyrightNotice(data)}</p>
        </div>
        
            <div class="social">
                <ul>
                    <li>
                        <a href="${data.author.social.twitter}" aria-label="Twitter" rel="noopener" target="_blank"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                    </li>
                    <li>
                        <a href="${data.author.social.github}" aria-label="GitHub" rel="noopener" target="_blank"><i class="fa fa-github" aria-hidden="true"></i></a>
                    </li>
                    <li>
                        <a href="${data.author.social.stackOverflow}" aria-label="StackOverflow" rel="noopener" target="_blank"><i class="fa fa-stack-overflow" aria-hidden="true"></i></a>
                    </li>
                    <li>
                        <a href="${data.author.social.medium}" aria-label="Medium" rel="noopener" target="_blank"><i class="fa fa-medium" aria-hidden="true"></i></a>
                    </li>
                    <li>
                        <a href="${data.author.social.quora}" aria-label="Quora" rel="noopener" target="_blank"><i class="fa fa-quora" aria-hidden="true"></i></a>
                    </li>
                    <li>
                            <a href="${data.author.social.linkedIn}" aria-label="LinkedIn" rel="noopener" target="_blank"><i class="fa fa-linkedin" aria-hidden="true"></i></a>
                    </li>
                </ul>
            </div>
        </div>
      </footer>`
  })
