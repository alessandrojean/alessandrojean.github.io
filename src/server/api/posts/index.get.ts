import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import formatISO from 'date-fns/formatISO';

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
}

export default defineEventHandler<Post[]>(async (event) => {
  const { notionPostsTable } = useRuntimeConfig()
  const { per_page } = getQuery(event)

  const publicFilter = {
    property: 'Public',
    checkbox: { equals: true }
  }

  const perPage = typeof per_page === 'string' 
    ? Number.parseInt(per_page, 10) 
    : undefined

  const response = await fetchTable({
    tableId: notionPostsTable,
    filter: (process.env.CI || process.env.NODE_ENV === 'production') ? publicFilter : undefined,
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
        zonedTimeToUtc(
          properties['Created at']['date']!!.start,
          'America/Sao_Paulo'
        )
      ),
      isPublic: properties['Public']['checkbox']
    }) satisfies Post)
})
