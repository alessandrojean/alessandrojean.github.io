export interface NotionPage {
  id: string;
  slug: string;
  public: boolean;
  createdAt: Date;
  tags: string[];
  title: string;
  description: string;
}

export type ApiNotionPage = Record<string, any>

export default async function useNotionTable(): Promise<NotionPage[]> {
  const { data: table, error } = await useAsyncData<NotionPage[]>('table', async () => {
    const { notionTableId } = useAppConfig()
    const apiUrl = `https://notion-api.splitbee.io/v1/table/${notionTableId}`
    
    const table = await $fetch<ApiNotionPage[]>(apiUrl)

    if (!table) {
      throw createError({
        statusCode: 500,
        message: 'Falha ao obter os artigos'
      })
    }

    return table
      .map(badFormat => ({
        id: badFormat.id,
        slug: badFormat.Slug,
        public: badFormat.Public,
        createdAt: new Date(badFormat['Created at']),
        tags: badFormat.Tags,
        title: badFormat.Title,
        description: badFormat.Description
      }))
      .filter((post) => process.dev || post.public)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  })

  if (error.value && error.value instanceof Error) {
    throw error.value
  }
  
  return table.value
}
