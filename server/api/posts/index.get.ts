import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc'
import formatISO from 'date-fns/formatISO'

import { fetchTable, PageObjectResponse } from '@/lib/notion'

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

export default defineEventHandler<Post[]>(async () => {
  const { notionPostsTable } = useRuntimeConfig()

  const publicFilter = {
    property: 'Public',
    checkbox: { equals: true }
  }

  const posts = await fetchTable({
    tableId: notionPostsTable,
    filter: !process.env ? publicFilter : undefined,
    sorts: [{
      property: 'Created at',
      direction: 'descending'
    }]
  })

  return (posts.results || [])
    .map(({ id, properties }: PageObjectResponse) => ({
      id: id,
      title: properties['Name']['title']
        .reduce((acm, crr) => acm + crr.plain_text, ''),
      description: properties['Description']['rich_text']
        .reduce((acm, crr) => acm + crr.plain_text, ''),
      slug: properties['Slug']['rich_text']
        .reduce((acm, crr) => acm + crr.plain_text, ''),
      area: properties['Area']['select'].name,
      tags: properties['Tags']['multi_select'].map((tag) => tag.name),
      createdAt: formatISO(
        zonedTimeToUtc(
          properties['Created at']['date'].start,
          'America/Sao_Paulo'
        )
      ),
      isPublic: properties['Public']['checkbox']
    }))
})
