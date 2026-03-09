// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import { transformerMetaHighlight } from '@shikijs/transformers';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Build a slug → lastmod map from MDX frontmatter at config time.
// Uses updatedAt if present, otherwise date.
function buildLastmodMap() {
  const blogDir = path.resolve(__dirname, 'src/content/blog');
  const map = {};
  for (const slug of fs.readdirSync(blogDir)) {
    const mdxPath = path.join(blogDir, slug, 'index.mdx');
    if (!fs.existsSync(mdxPath)) continue;
    const content = fs.readFileSync(mdxPath, 'utf-8');
    const updatedAt = content.match(/^updatedAt:\s*"([^"]+)"/m)?.[1];
    const date = content.match(/^date:\s*"([^"]+)"/m)?.[1];
    const lastmod = updatedAt ?? date;
    if (lastmod) map[slug] = new Date(lastmod).toISOString();
  }
  return map;
}

const lastmodMap = buildLastmodMap();

export default defineConfig({
  site: 'https://prateeksurana.me',
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        // Extract slug from blog post URLs: /blog/{slug}/
        const match = item.url.match(/\/blog\/([^/]+)\/$/);
        if (match) {
          const slug = match[1];
          if (lastmodMap[slug]) {
            item.lastmod = lastmodMap[slug];
          }
        }
        return item;
      },
    }),
  ],
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      transformers: [transformerMetaHighlight()],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
});
