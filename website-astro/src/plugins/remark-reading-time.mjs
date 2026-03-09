import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

/**
 * Remark plugin that injects a `readTime` property (minutes, rounded up)
 * into the Astro frontmatter of every Markdown/MDX file at build time.
 */
export function remarkReadingTime() {
  return function (tree, file) {
    const textContent = toString(tree);
    const { minutes } = getReadingTime(textContent);
    file.data.astro.frontmatter.readTime = Math.ceil(minutes);
  };
}
