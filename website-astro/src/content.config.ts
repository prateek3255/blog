import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    updatedAt: z.string().optional(),
    readTime: z.number().optional(),
    tags: z.array(z.string()).optional(),
    archived: z.boolean().optional(),
    externalUrl: z.string().optional(),
    canonical: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: file('./src/content/projects.json'),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().url(),
    repo: z.string().url().optional(),
    tags: z.array(z.string()),
  }),
});

const talks = defineCollection({
  loader: file('./src/content/talks.json'),
  schema: z.object({
    title: z.string(),
    event: z.string(),
    date: z.string(),
    description: z.string(),
    youtubeId: z.string(),
  }),
});

export const collections = { blog, projects, talks };
