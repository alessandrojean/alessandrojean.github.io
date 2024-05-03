import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createResolver } from 'nuxt/kit'
import ogs from 'open-graph-scraper'
import RSS from 'rss'

import type { Nuxt } from '@nuxt/schema'
import type { PrerenderRoute } from 'nitropack'
import type { ModuleOptions } from '../types'

interface GenerateFeedArgs {
  nuxt: Nuxt;
  prerenderedRoutes: PrerenderRoute[];
  options: ModuleOptions;
  title: string;
  description: string;
  url: string;
}

export async function generateFeed(args: GenerateFeedArgs) {
  const { nuxt, prerenderedRoutes, options, title, url, description } = args

  const resolver = createResolver(import.meta.url)
  const publicDir = nuxt.options.dir.public
  const outputDir = resolver.resolve('..', '..', '..', '..', '.output', publicDir)
  const feedFile = join(outputDir, options.fileName)

  const feed = new RSS({
    title: `${title} - Artigos`,
    description: description,
    site_url: url,
    feed_url: `${url}/feed.xml`,
    language: 'pt-BR',
    copyright: '© 2022-presente Alessandro Jean',
    custom_namespaces: {
      content: 'http://purl.org/rss/1.0/modules/content/',
      dc: 'http://purl.org/dc/elements/1.1/',
      sy: 'http://purl.org/rss/1.0/modules/syndication/'
    }
  })

  for (const route of prerenderedRoutes) {
    if (!route.route.startsWith('/pt/post/') || route.route.endsWith('.json')) {
      continue
    }

    const postFile = join(outputDir, ...route.route.substring(1).split('/'), 'index.html')
    const html = (await readFile(postFile)).toString()
    
    const { result: openGraph } = await ogs({
      html,
      url: undefined ,
      customMetaTags: [{
        multiple: false,
        property: 'og:slug',
        fieldName: 'ogSlug'
      }]
    })

    const { 
      success, 
      ogTitle, 
      ogLocale, 
      ogDescription, 
      articlePublishedTime,
      articleSection,
    } = openGraph
    // @ts-ignore
    const ogSlug: string = openGraph.ogSlug

    if (!success || !ogTitle || !ogLocale || !ogDescription || !articlePublishedTime || !articleSection) {
      continue
    }

    // const root = parse(html)
    // const postContent = root.getElementById('post-content')

    // if (!postContent) {
    //   continue
    // }

    feed.item({
      title: ogTitle,
      guid: `${url}/pt/post/${ogSlug}`,
      url: `${url}/pt/post/${ogSlug}`,
      description: ogDescription,
      date: new Date(articlePublishedTime),
      categories: [articleSection],
      custom_elements: [
        // { 'content:encoded': { _cdata: postContent.innerHTML } },
        { 'dc:creator': { _cdata: title } },
      ]
    })
  }

  const feedStr = feed.xml()
  await writeFile(feedFile, feedStr)
}
