import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import {
  addImports,
  addDevServerHandler,
  addTemplate,
  createResolver,
  defineNuxtModule,
  useLogger,
  useNitro
} from '@nuxt/kit'
import { eventHandler } from 'h3'

import type { FontOptions, FontWeight, ModuleOptions } from './types'

import { generateOgImage, devMiddleware } from './runtime'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'og-image',
    configKey: 'ogImage',
    compatibility: {
      nuxt: '^3.0.0-rc.11'
    }
  },

  defaults: () => ({
    dir: 'img/og-image',
    avatar: 'img/avatar-okabe-extra-small.png',
    routes: ['posts'],
    width: 800,
    height: 400
  }),

  async setup(options, nuxt) {
    const logger = useLogger('og-image')
    const resolver = createResolver(import.meta.url)

    const runtimeDir = resolver.resolve('./runtime')
    nuxt.options.alias['#og-image'] = runtimeDir
    nuxt.options.build.transpile.push(runtimeDir)

    addTemplate({
      filename: 'og-image-options.mjs',
      getContents() {
        return `
export const ogImageOptions = ${JSON.stringify(options, null, 2)}
        `
      },
    })

    const publicDir = nuxt.options.dir.public

    const fontsPath = resolver.resolve('./fonts')
    const weights: FontWeight[] = [400, 500, 700]
    
    const fontBuffers = await Promise.all([
      readFile(join(fontsPath, 'Inter-Regular.otf')),
      readFile(join(fontsPath, 'Inter-Medium.otf')),
      readFile(join(fontsPath, 'Inter-Bold.otf'))
    ])

    const avatarPath = resolver.resolve('..', '..', publicDir, options.avatar)
    const avatarBuffer = await readFile(avatarPath)
    const avatar = avatarBuffer.toString('base64')
    
    const fonts: FontOptions[] = fontBuffers.map((fontBuffer, i) => ({
      name: 'Inter',
      data: fontBuffer,
      weight: weights[i],
      style: 'normal'
    }))

    addImports({
      name: 'useOgImage',
      from: resolver.resolve('./runtime/composables')
    })

    addDevServerHandler({
      route: '/_og',
      handler: eventHandler(async (event) => {
        await devMiddleware({ event, fonts, avatar, options, resolver })
      })
    })

    if (!nuxt.options.dev) {
      nuxt.hook('ready', () => {
        const nitro = useNitro()

        nitro.hooks.hook('prerender:generate', async (route, nitro) => {
          await generateOgImage({
            route,
            nuxt,
            nitro,
            options,
            logger,
            fonts,
            avatar
          })
        })
      })
    }
  }
})
