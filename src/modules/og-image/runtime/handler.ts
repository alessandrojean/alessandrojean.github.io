import { getQuery } from 'h3'
import sharp from 'sharp'
import { createOgImage } from './satori'

import type { H3Event } from 'h3'
import type { Resolver } from '@nuxt/kit'
import type { FontOptions, ModuleOptions } from '../types'

type OgImageEventHandler = { 
  event: H3Event;
  fonts: FontOptions[];
  avatar: string;
  options: ModuleOptions;
  resolver: Resolver;
}

export async function devMiddleware(args: OgImageEventHandler) {
  const { event, fonts, avatar, options } = args
  const query = getQuery(event)

  if (!query.title || !query.description) {
    throw new Error('Missing title or description')
  }

  const svg = await createOgImage({
    title: query.title as string,
    description: query.description as string,
    section: query.section as string | undefined,
    publishedTime: query.publishedTime as string | undefined,
    avatar,
    fonts,
    options,
  })

  const webp = await sharp(Buffer.from(svg)).webp({ lossless: true }).toBuffer()

  event.res.setHeader('Content-Type', 'image/webp')
  event.res.write(webp)

  return event.res.end()
}
