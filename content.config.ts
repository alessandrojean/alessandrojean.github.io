import { defineCollection, defineContentConfig } from '@nuxt/content';
import { z } from 'zod';

export default defineContentConfig({
  collections: {
    movies: defineCollection({
      type: 'page',
      source: 'movies/**/*.md',
      schema: z.object({
        created_at: z.iso.datetime(),
        updated_at: z.iso.datetime().optional(),
        director: z.string().nonempty().array(),
        writer: z.string().nonempty().array(),
        year: z.number().int(),
        copyright: z.string().nonempty(),
        cover: z.url(),
        tmdb: z.url(),
      }),
    }),
  },
});
