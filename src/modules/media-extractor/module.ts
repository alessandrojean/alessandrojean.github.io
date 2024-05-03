import {
  addImports,
  addTemplate,
  createResolver,
  defineNuxtModule,
  useLogger,
  useNitro
} from '@nuxt/kit'

import { saveMedias } from './runtime/extractor'
import type { ExtractorResult, ModuleOptions } from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'media-extractor',
    configKey: 'mediaExtractor',
    compatibility: {
      nuxt: '^3.11.2'
    }
  },

  defaults: (nuxt) => ({
    dir: nuxt.options.dir.public,
    imgDir: 'notion-img',
    videoDir: 'video'
  }),

  async setup(options, nuxt) {
    global.mediaExtractorQueue = [] as ExtractorResult[]

    const resolver = createResolver(import.meta.url)
    const logger = useLogger('media-extractor')

    const runtimeDir = resolver.resolve('./runtime')
    nuxt.options.alias['#media-extractor'] = runtimeDir
    nuxt.options.build.transpile.push(runtimeDir)

    const dir = options.dir ?? nuxt.options.dir.public
    const outputDir = resolver.resolve('..', '..', '..', '.output', dir)
    const tempImgOutputDir = resolver.resolve('..', '..', dir)
    
    nuxt.hook('ready', async () => {
      const nitro = useNitro()

      nitro.hooks.hook('prerender:generate', async () => {
        await saveMedias({ 
          logger, 
          imgOutputDir: tempImgOutputDir,
          videoOutputDir: outputDir,
          options
        })
      })

      // if (!process.env.CI) {
      //   nitro.hooks.hook('prerender:done', () => {
      //     rmSync(join(tempImgOutputDir, options.imgDir), { recursive: true })
      //   })
      // }
    })

    addImports({
      name: 'useMediaExtractor',
      from: resolver.resolve('runtime/composables')
    })

    addImports({
      name: 'fileNameFromUrl',
      from: resolver.resolve('runtime/utils')
    })

    addImports({
      name: 'defineExtractorEventHandler',
      from: resolver.resolve('runtime/handler'),
    })

    addTemplate({
      filename: 'media-extractor-options.mjs',
      getContents() {
        return `
export const mediaExtractorOptions = ${JSON.stringify(options, null, 2)}
        `
      },
    })
  }
})
