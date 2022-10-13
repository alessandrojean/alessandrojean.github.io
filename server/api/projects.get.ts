import { fetchTable, getTextContent, PageObjectResponse } from '@/lib/notion'

export interface ProjectCategory {
  name: string;
  projects: Project[]
}

export interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  category: string;
  url: string;
  isPublic: boolean;
}

export default defineEventHandler<ProjectCategory[]>(async () => {
  const { notionProjectsTable } = useRuntimeConfig()

  const publicFilter = {
    property: 'Public',
    checkbox: { equals: true }
  }

  const projects = await fetchTable({
    tableId: notionProjectsTable,
    filter: !process.env ? publicFilter : undefined,
    sorts: [{ property: 'Name', direction: 'ascending' }]
  })

  const categories: Record<string, Project[]> = (projects.results || [])
    .map(({ id, properties }: PageObjectResponse) => ({
      id: id,
      name: getTextContent(properties['Name']['title']),
      description: getTextContent(properties['Description']['rich_text']),
      slug: getTextContent(properties['Slug']['rich_text']),
      category: properties['Category']['select'].name,
      url: properties['URL']['url'],
      isPublic: properties['Public']['checkbox']
    }))
    .reduce((acm, crr) => {
      if (acm[crr.category]) {
        acm[crr.category].push(crr)
      } else {
        acm[crr.category] = [crr]
      }

      return acm
    }, {})

  return Object.entries(categories)
    .map(([category, projects]) => ({ name: category, projects }))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
})
