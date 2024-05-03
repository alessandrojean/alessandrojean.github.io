import { fromZonedTime } from 'date-fns-tz'
import { formatISO } from 'date-fns/formatISO'
import { parseISO } from 'date-fns/parseISO'

import { defineExtractorEventHandler } from '#media-extractor'

import type { NotionApi, PostObjectResponse } from '@/lib/notion'
import { fetchBlocks, fetchTable, getTextContent, postMapImageUrl, postMapVideoUrl } from '@/lib/notion'

export default defineExtractorEventHandler({
  async handler(event) {
    const { notionPostsTable } = useRuntimeConfig()

    const publicFilter = {
      property: 'Public',
      checkbox: { equals: true }
    }

    const slugFilter = {
      property: 'Slug',
      rich_text: { equals: event.context.params!!.slug }
    }

    const table = await fetchTable({
      tableId: notionPostsTable,
      filter: !process.env ? { and: [publicFilter, slugFilter] } : slugFilter
    })

    if (table.results.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
      })
    }

    const post = table.results[0] as NotionApi.PageObjectResponse
    const postFixed = post as any as PostObjectResponse
    const blockMap = await fetchBlocks({ page: post })

    return {
      id: post.id,
      title: getTextContent(postFixed.properties['Name'].title),
      description: getTextContent(postFixed.properties['Description'].rich_text),
      slug: getTextContent(postFixed.properties['Slug'].rich_text),
      area: postFixed.properties['Area'].select?.name ?? '',
      tags: postFixed.properties['Tags'].multi_select.map((tag) => tag.name),
      createdAt: formatISO(
        fromZonedTime(
          postFixed.properties['Created at'].date!!.start,
          'America/Sao_Paulo'
        )
      ),
      updatedAt: formatISO(parseISO(post.last_edited_time)),
      language: postFixed.properties['Language'].select?.name ?? 'pt-BR',
      isPublic: postFixed.properties['Public'].checkbox,
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
