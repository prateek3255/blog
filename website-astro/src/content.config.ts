import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    views: z.string().optional(),
    featured: z.boolean().optional(),
    archived: z.boolean().optional(),
    externalUrl: z.string().optional(),
  }),
});

export const collections = { blog };
