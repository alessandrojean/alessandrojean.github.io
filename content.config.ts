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
        language: z.enum(['pt-BR', 'en-US']).optional().default('pt-BR'),
        alternate: z.string().optional(),
        ogImage: z
          .object({
            url: z.string(),
            width: z.int(),
            height: z.int(),
          })
          .optional(),
      }),
    }),
  },
});
