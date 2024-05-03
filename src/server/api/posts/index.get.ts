import { fromZonedTime } from 'date-fns-tz';
import { formatISO } from 'date-fns/formatISO';

import type { PostObjectResponse } from '@/lib/notion';
import { fetchTable, getTextContent } from '@/lib/notion';

export interface Post {
  id: string;
  title: string;
  description: string;
  slug: string;
  area: string;
  tags: string[];
  createdAt: string;
  isPublic: boolean;
  language: string;
}

export default defineEventHandler<Promise<Post[]>>(async (event) => {
  const { app: {  } } = useRuntimeConfig()
  const { notionPostsTable } = useRuntimeConfig()
  const { per_page } = getQuery(event)

  const publicFilter = {
    property: 'Public',
    checkbox: { equals: true }
  }

  const perPage = typeof per_page === 'string' 
    ? Number.parseInt(per_page, 10) 
    : undefined

  const publicOnly = process.env.CI || !process.dev || process.prerender // (process.env.CI || process.env.NODE_ENV === 'production')

  const response = await fetchTable({
    tableId: notionPostsTable,
    filter: publicOnly ? publicFilter : undefined,
    sorts: [{
      property: 'Created at',
      direction: 'descending'
    }],
    perPage
  })

  const posts = response.results as PostObjectResponse[]

  return posts
    .filter(({ properties }) => {
      return properties['Name'].title.length > 0
    })
    .map(({ id, properties }) => ({
      id: id,
      title: getTextContent(properties['Name']['title']),
      description: getTextContent(properties['Description']['rich_text']),
      slug: getTextContent(properties['Slug']['rich_text']),
      area: properties['Area']['select']?.name ?? '',
      tags: properties['Tags']['multi_select'].map((tag) => tag.name),
      createdAt: formatISO(
        fromZonedTime(
          properties['Created at']['date']!!.start,
          'America/Sao_Paulo'
        )
      ),
      isPublic: properties['Public']['checkbox'],
      language: properties['Language'].select?.name ?? 'pt-BR'
    }) satisfies Post)
})
