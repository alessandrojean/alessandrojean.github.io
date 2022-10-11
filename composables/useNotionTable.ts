import { Ref } from 'vue'
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc'

export interface NotionPage {
  id: string;
  slug?: string;
  public: boolean;
  createdAt?: Date;
  tags: string[];
  title: string;
  description: string;
  area?: string;
  original: ApiNotionPage
}

export type ApiNotionPage = Record<string, any>

interface UseNotionTableArgs {
  tableId: string,
  sort?: (a: NotionPage, b: NotionPage) => number
}

export default async function useNotionTable({ tableId, sort }: UseNotionTableArgs): Promise<Ref<NotionPage[]>> {
  const { data: table, error } = await useAsyncData<NotionPage[]>(`table-${tableId}`, async () => {
    const apiUrl = `https://notion-api.splitbee.io/v1/table/${tableId}`
    
    const table = await $fetch<ApiNotionPage[]>(apiUrl)

    if (!table) {
      throw createError({
        statusCode: 500,
        message: 'Falha ao obter os itens'
      })
    }

    const formatted = table
      .map(badFormat => ({
        id: badFormat.id,
        slug: badFormat.Slug,
        public: badFormat.Public,
        createdAt: badFormat['Created at'] 
          ? zonedTimeToUtc(badFormat['Created at'], 'America/Sao_Paulo')
          : null,
        tags: badFormat.Tags,
        title: badFormat.Name,
        description: badFormat.Description,
        area: badFormat.Area ?? badFormat.Category,
        original: badFormat
      }))
      .filter((post) => process.dev || post.public)
    
    return sort ? formatted.sort(sort) : formatted
  })

  if (error.value && error.value instanceof Error) {
    throw error.value
  }
  
  return table
}
