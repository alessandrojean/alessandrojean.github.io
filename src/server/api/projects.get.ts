import type { ProjectObjectResponse } from '@/lib/notion';
import { fetchTable, getTextContent } from '@/lib/notion';

export interface ProjectCategory {
  name: Record<string, string>;
  projects: Project[]
}

export interface Project {
  id: string;
  name: string;
  description: Record<string, string>;
  slug: string;
  category: Record<string, string>;
  url: string;
  isPublic: boolean;
}

export default defineEventHandler<ProjectCategory[]>(async () => {
  const { notionProjectsTable } = useRuntimeConfig()

  const publicFilter = {
    property: 'Public',
    checkbox: { equals: true }
  }

  const response = await fetchTable({
    tableId: notionProjectsTable,
    filter: !process.env ? publicFilter : undefined,
    sorts: [
      { property: 'Category', direction: 'ascending' },
      { property: 'Name', direction: 'ascending' }
    ]
  })

  const projects = response.results as ProjectObjectResponse[]

  const categories: Record<string, Project[]> = projects
    .map(({ id, properties }) => ({
      id: id,
      name: getTextContent(properties['Name']['title']),
      description: {
        pt: getTextContent(properties['Description']['rich_text']),
        en: getTextContent(properties['English Description']['rich_text']),
      },
      slug: getTextContent(properties['Slug']['rich_text']),
      category: {
        pt: properties['Category']['select']?.name ?? '',
        en: properties['English Category']['select']?.name ?? '',
      },
      url: properties['URL']['url'] ?? '',
      isPublic: properties['Public']['checkbox']
    }) satisfies Project)
    .reduce((acm, crr) => {
      if (acm[crr.category.en]) {
        acm[crr.category.en].push(crr)
      } else {
        acm[crr.category.en] = [crr]
      }

      return acm
    }, {} as Record<string, Project[]>)

  return Object.entries(categories)
    .map(([category, projects]) => ({
      name: {
        en: category,
        pt: projects[0].category.pt
      },
      projects
    }))
})
