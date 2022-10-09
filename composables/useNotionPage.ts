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

export interface NotionPage {
  nodeMap: NotionNodeMap;
  linkMap: Record<string, string>;
}

function takeWhile<T>(array: T[], predicate: (item: T, i: number) => boolean): T[] {
  const index = array.findIndex((el, i) => !predicate(el, i))

  return index >= 0 ? array.slice(0, index) : array;
}

function fixLists(nodeMap: NotionNodeMap): NotionNodeMap {
  const root = Object.values(nodeMap)[0]
  const content = root.value.content
  
  let newNodeMap = nodeMap
  const visited: string[] = []

  for (let [index, id] of content.entries()) {
    const node = nodeMap[id]
    const type = node.value.type

    if (visited.includes(id) || type !== 'bulleted_list') {
      continue
    }

    const next = takeWhile(content.slice(index + 1), (id) => {
      return nodeMap[id].value.type === 'bulleted_list'
    })

    if (next.length === 0) {
      continue
    }

    visited.push(...next)

    newNodeMap[id].value = {
      ...newNodeMap[id].value,
      type: 'bulleted_list_group',
      properties: {
        ...newNodeMap[id].value.properties,
        content: next
      }
    }
  }

  newNodeMap[root.value.id].value.content = content.filter((contentId) => {
    return !visited.includes(contentId)
  })

  return newNodeMap
}

export default async function useNotionPage(pageSlug: string): Promise<NotionPage> {
  const { data } = await useAsyncData<NotionPage>(`page-${pageSlug}`, async () => {
    const { notionTableId } = useAppConfig()
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

    const linkMap = Object.fromEntries(
      table.map((page) => [page.id.replace(/-/g, ''), page.Slug])
    )

    return { linkMap, nodeMap: fixLists(nodeMap) }
  })
  
  return data.value
}
