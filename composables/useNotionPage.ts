import { ApiNotionPage } from '@/composables/useNotionTable'

export type NotionNodeMap = Record<string, NotionNode>

export interface NotionNode {
  role: string;
  value: NotionBlock;
}

export interface NotionBlock extends Record<string, any> {
  id: string;
  type: string;
  content: string[];
  properties?: Record<string, any>;
  created_time: number;
  last_edited_time: number;
  parent_id?: string;
  parent_table?: string;
}

export interface NotionPage {
  nodeMap: NotionNodeMap;
  linkMap: Record<string, string>;
}

function takeWhile<T>(array: T[], predicate: (item: T, i: number) => boolean): T[] {
  const index = array.findIndex((el, i) => !predicate(el, i))

  return index >= 0 ? array.slice(0, index) : array;
}

function fixList(nodeMap: NotionNodeMap, types: string[]): NotionNodeMap {
  let newNodeMap = nodeMap

  for (let type of types) {
    const root = Object.values(newNodeMap)[0]
    const content = root.value.content
    const visited: string[] = []

    for (let [index, id] of content.entries()) {
      const node = nodeMap[id]
      const nodeType = node.value.type

      if (visited.includes(id) || type !== nodeType) {
        continue
      }

      const next = takeWhile(content.slice(index + 1), (id) => {
        return nodeMap[id].value.type === type
      })

      if (next.length === 0) {
        continue
      }

      visited.push(...next)

      newNodeMap[id].value = {
        ...newNodeMap[id].value,
        type: type + '_group',
        properties: {
          ...newNodeMap[id].value.properties,
          content: next
        }
      }
    }

    newNodeMap[root.value.id].value.content = content.filter((contentId) => {
      return !visited.includes(contentId)
    })
  }

  return newNodeMap
}

function fixCode(nodeMap: NotionNodeMap): NotionNodeMap {
  // Originally from https://github.com/oovm/vscode-subtitles/blob/master/syntax/ass.YAML-tmLanguage
  const assFn = /(\\)(s|u|i|b|k|K|an|be|bord|blur|fa[xyz]|fs|fsc|fsp|fsv|fscx|fscy|fr[xyz]|fe|shad|ko|kf|[xy]bord|[xy]shad|rnd|rnd[xyz])([0-9+\-.]+)/g
  
  Object.values(nodeMap)
    .filter(({ value: block }) => {
      return block.type === 'code' &&
        block.properties?.language?.[0]?.[0] === 'Plain Text' &&
        assFn.test(block.properties?.title?.[0]?.[0])
    })
    .forEach((node) => {
      nodeMap[node.value.id] = {
        ...node,
        value: {
          ...node.value,
          properties: {
            ...node.value.properties,
            language: [['ASS']]
          }
        }
      }
    })

  return nodeMap
}

export default async function useNotionPage(pageSlug: string): Promise<NotionPage> {
  const { data, error } = await useAsyncData<NotionPage>(`page-${pageSlug}`, async () => {
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

    if (!page || (!process.dev && !page.Public)) {
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

    return {
      linkMap,
      nodeMap: fixCode(fixList(nodeMap, ['bulleted_list', 'to_do']))
    }
  })

  if (error.value && error.value instanceof Error) {
    throw error.value
  }
  
  return data.value
}
