import { defineCollection, defineContentConfig } from '@nuxt/content';
import { z } from 'zod';

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        created_at: z.iso.datetime(),
        updated_at: z.iso.datetime().optional(),
        description: z.string().nonempty(),
        category: z.string().nonempty(),
        tags: z.string().nonempty().array().optional(),
        language: z.string().optional(),
        alternate: z.string().optional(),
      }),
    }),
  },
});
