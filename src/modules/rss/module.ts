import { defineNuxtModule, useLogger, useNitro } from '@nuxt/kit'

import { generateFeed } from './runtime/generator'

import type { ModuleOptions } from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'rss',
    configKey: 'rss',
    compatibility: {
      nuxt: '^3.11.2'
    }
  },

  defaults: () => ({ 
    fileName: 'feed.xml',
    title: 'Alessandro Jean',
    author: 'Alessandro Jean',
    description: 'Apenas mais um site hospedado no GitHub Pages.',
    url: 'https://alessandrojean.github.io'
  }),

  async setup(options, nuxt) {
    nuxt.hook('ready', async () => {
      const nitro = useNitro()
      const logger = useLogger('rss')

      nitro.hooks.hook('prerender:done', async ({ prerenderedRoutes }) => {        
        await generateFeed({ 
          nuxt, 
          prerenderedRoutes, 
          options,
          title: options.title,
          description: options.description,
          url: options.url,
        })

        logger.success('Generated the RSS feed')
      })
    })
  }
})
