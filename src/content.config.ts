import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be "YYYY-MM-DD" (with quotes)')
  .refine((val) => {
    // 日历回验：拦下 2026-13-45 这类溢出日期
    const [y, m, d] = val.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return (
      dt.getUTCFullYear() === y &&
      dt.getUTCMonth() === m - 1 &&
      dt.getUTCDate() === d
    );
  }, 'date is not a valid calendar date')
  .transform((val) => new Date(val + 'T00:00:00+08:00'));

const posts = defineCollection({
  loader: glob({
    pattern: '**/index.{md,mdx}',
    base: './src/content/posts',
    generateId: ({ entry }) => {
      // hello-world/index.md -> hello-world
      return entry.replace(/\/index\.(md|mdx)$/, '').replace(/\\index\.(md|mdx)$/, '');
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
