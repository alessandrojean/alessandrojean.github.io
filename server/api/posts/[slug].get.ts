import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc'
import formatISO from 'date-fns/formatISO'
import parseISO from 'date-fns/parseISO'

import {
  fetchTable,
  fetchBlocks,
  getTextContent,
  PageObjectResponse
} from '@/lib/notion'

export default defineEventHandler(async (event) => {
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

  const post = table.results[0] as PageObjectResponse
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
})
