import { useQuery } from 'h3'
import sharp from 'sharp'
import { createOgImage } from './satori'

import type { IncomingMessage, ServerResponse } from 'h3'
import type { Resolver } from '@nuxt/kit'
import type { FontOptions, ModuleOptions } from '../types'

type OgImageEventHandler = { 
  req: IncomingMessage;
  res: ServerResponse;
  fonts: FontOptions[];
  avatar: string;
  options: ModuleOptions;
  resolver: Resolver;
}

export async function devMiddleware(args: OgImageEventHandler) {
  const { req, res, fonts, avatar, options, resolver } = args
  const query = useQuery(req)

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

  res.setHeader('Content-Type', 'image/webp')
  res.write(webp)

  return res.end()
}
