import { ApiNotionPage } from '@/composables/useNotionTable'

export type NotionNodeMap = Record<string, NotionNode>

export interface NotionNode {
  role: string;
  value: NotionBlock;
}

export interface NotionBlock extends Record<string, any> {
  type: string;
  content: string[];
}

export default async function useNotionPage(pageSlug: string): Promise<NotionNodeMap> {
  const { data: nodeMap } = await useAsyncData<NotionNodeMap>(`page-${pageSlug}`, async () => {
    const { public: { notionTableId } } = useRuntimeConfig()
    const apiUrl = `https://notion-api.splitbee.io/v1/table/${notionTableId}`
    
    const table = await $fetch<ApiNotionPage[]>(apiUrl)

    if (!table) {
      throw createError({
        statusCode: 500,
        message: 'Falha ao obter os artigos'
      })
    }

    const page = table.find((page) => page.Slug === pageSlug)

    if (!page || !page.Public) {
      throw createError({
        statusCode: 404,
        message: 'Página não encontrada'
      })
    }

    const pageUrl = `https://notion-api.splitbee.io/v1/page/${page.id}`
    const nodeMap = await $fetch<NotionNodeMap>(pageUrl)

    return nodeMap
  })
  
  return nodeMap.value
}
