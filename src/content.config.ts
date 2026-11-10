import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be "YYYY-MM-DD" (with quotes)')
  .transform((val) => new Date(val + 'T00:00:00+08:00'));

const posts = defineCollection({
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/posts',
    generateId: ({ entry }) => {
      // hello-world/index.md -> hello-world
      return entry.replace(/\/index\.md$/, '').replace(/\\index\.md$/, '');
    },
    deferRender: true,
  }),
  schema: z.object({
    title: z.string().min(1),
    date: dateSchema,
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
