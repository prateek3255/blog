import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context) {
  const posts = await getCollection('blog');
  const sorted = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
  return rss({
    title: 'Prateek Surana',
    description: 'Articles on web development, developer experience, and design systems.',
    site: context.site,
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      pubDate: new Date(post.data.date),
    })),
  });
}
