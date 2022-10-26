import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import ogs from 'open-graph-scraper'
import sharp from 'sharp'
import { createResolver } from '@nuxt/kit'
import { withoutLeadingSlash } from 'ufo'

import type { Consola } from 'consola'
import type { Nitro, PrerenderGenerateRoute } from 'nitropack'
import type { Nuxt } from '@nuxt/schema'
import type { FontOptions, ModuleOptions } from '../types'

import { createOgImage } from './satori'

interface GenerateOgImageArgs {
  route: PrerenderGenerateRoute;
  logger: Consola;
  nuxt: Nuxt;
  nitro: Nitro;
  options: ModuleOptions;
  fonts: FontOptions[];
  avatar: string;
}

export async function generateOgImage(args: GenerateOgImageArgs) {
  const { route, logger, options, nuxt } = args

  // Skip other files
  if (route.route.lastIndexOf('.') !== -1) {
    return
  }

  const resolver = createResolver(import.meta.url)
  const publicDir = nuxt.options.dir.public
  const ogImageDir = process.dev
    ? resolver.resolve('..', '..', '..', publicDir, options.dir)
    : resolver.resolve('..', '..', '..', '..', '.output', publicDir, options.dir)

  const fileName = route.route !== '/'
    ? withoutLeadingSlash(route.route).replace(/\//g, '-') + '.png'
    : 'index.png'
  const filePath = join(ogImageDir, fileName)

  const logPath = filePath.substring(filePath.indexOf(publicDir) + publicDir.length)

  const startTime = process.hrtime()

  const html = Buffer.from(route.data).toString('utf-8')
  const { result: openGraph } = await ogs({
    html,
    url: undefined,
    customMetaTags: [{
      multiple: false,
      property: 'og-image:skip',
      fieldName: 'ogImageSkip'
    }]
  })

  if (!openGraph.success || !openGraph.ogTitle || !openGraph.ogDescription || openGraph.ogImageSkip === 'true') {
    return
  }

  try {
    const svg = await createOgImage({
      title: openGraph.ogTitle,
      description: openGraph.ogDescription,
      section: openGraph.articleSection,
      publishedTime: openGraph.articlePublishedTime,
      fonts: args.fonts,
      avatar: args.avatar,
      options: args.options,
    })

    
    if (!existsSync(ogImageDir)) {
      await mkdir(ogImageDir, { recursive: true })
    }

    const image = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer()
    await writeFile(filePath, image)

    const endTime = process.hrtime(startTime)
    const duration = (endTime[1] / 1_000_000).toFixed(0)

    logger.log(gray(`  ├─ ${logPath} (${duration}ms)`))
  } catch (error) {
    const endTime = process.hrtime(startTime)
    const duration = (endTime[1] / 1_000_000).toFixed(0)

    logger.log(yellow(`  ├─ ${logPath} (${duration}ms) (${error.toString()})`))
  }
}

// Implement the color directly as chalk produces import errors.
function gray(text: string) {
  return '\u001B[90m' + text + '\u001B[39m'
}

function yellow(text: string) {
  return '\u001B[33m' + text + '\u001B[39m'
}
