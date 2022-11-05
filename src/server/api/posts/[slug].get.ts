import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc'
import formatISO from 'date-fns/formatISO'
import parseISO from 'date-fns/parseISO'

import { defineExtractorEventHandler, fileNameFromUrl } from '#media-extractor'

import { fetchTable, fetchBlocks, getTextContent } from '@/lib/notion'
import type { NotionApi } from '@/lib/notion'

export default defineExtractorEventHandler({
  async handler(event) {
    const { notionPostsTable } = useRuntimeConfig()

    const publicFilter = {
      property: 'Public',
      checkbox: { equals: true }
    }

    const slugFilter = {
      property: 'Slug',
      rich_text: { equals: event.context.params.slug }
    }

    const table = await fetchTable({
      tableId: notionPostsTable,
      filter: !process.env ? { and: [publicFilter, slugFilter] } : slugFilter
    })

    if (table.results.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
        message: 'Post não encontrado'
      })
    }

    const post = table.results[0] as NotionApi.PageObjectResponse
    const blockMap = await fetchBlocks({ page: post })

    return {
      id: post.id,
      title: getTextContent(post.properties['Name']['title']),
      description: getTextContent(post.properties['Description']['rich_text']),
      slug: getTextContent(post.properties['Slug']['rich_text']),
      area: post.properties['Area']['select'].name,
      tags: post.properties['Tags']['multi_select'].map((tag) => tag.name),
      createdAt: formatISO(
        zonedTimeToUtc(
          post.properties['Created at']['date'].start,
          'America/Sao_Paulo'
        )
      ),
      updatedAt: formatISO(parseISO(post.last_edited_time)),
      isPublic: post.properties['Public']['checkbox'],
      blocks: blockMap
    }
  },

  async extract({ slug, blocks }) {
    type HostedImage = NotionApi.ImageBlockObjectResponse & { image: { type: 'file' } }
    type HostedVideo = NotionApi.VideoBlockObjectResponse & { video: { type: 'file' } }

    const mediaBlocks = Object.values(blocks).filter((block) => {
      return (block.type === 'image' && block.image.type === 'file') ||
        (block.type === 'video' && block.video.type === 'file')
    }) as (HostedImage | HostedVideo)[]

    return {
      destination: `posts/${slug}`,
      medias: mediaBlocks.map((block) => ({ 
        url: block.type === 'image' ? block.image.file.url : block.video.file.url,
        fileName: block.type === 'image' ? postMapImageUrl(block) : postMapVideoUrl(block)
      }))
    }    
  }
})

export function postMapImageUrl(block: NotionApi.ImageBlockObjectResponse) {
  const hash = parseISO(block.last_edited_time).getTime().toString(16)

  return `${block.id}-${hash}.avif`
}

export function postMapVideoUrl(block: NotionApi.VideoBlockObjectResponse) { 
  const url = block.video.type === 'external'
    ? block.video.external.url
    : block.video.file.url

  const extension = fileNameFromUrl(url).extension
  const hash = parseISO(block.last_edited_time).getTime().toString(16)

  return `${block.id}-${hash}.${extension}` 
}
