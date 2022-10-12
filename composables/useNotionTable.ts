import { Ref } from 'vue'
import type {
  PageObjectResponse,
  PartialPageObjectResponse,
  QueryDatabaseParameters
} from '@notionhq/client/build/src/api-endpoints'

export type NotionPage = PageObjectResponse | PartialPageObjectResponse

export type ApiNotionPage = Record<string, any>

interface UseNotionTableArgs {
  tableId: string,
  sorts?: QueryDatabaseParameters['sorts']
}

export default async function useNotionTable({ tableId, sorts }: UseNotionTableArgs): Promise<Ref<NotionPage[]>> {
  const { data: table, error } = await useAsyncData<NotionPage[]>(`table-${tableId}`, async () => {
    const notion = useNotion()
    
    const draftFilter = {
      property: 'Public',
      checkbox: { equals: true }
    }

    const response = await notion.databases.query({
      database_id: tableId,
      filter: !process.dev ? draftFilter : undefined,
      sorts: sorts
    })

    if (response.results.length === 0) {
      throw createError({
        statusCode: 500,
        message: 'Falha ao obter os itens'
      })
    }

    return response.results
  })

  if (error.value && error.value instanceof Error) {
    throw error.value
  }
  
  return table
}
