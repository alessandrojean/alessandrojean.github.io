import { Ref } from 'vue'
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
  const replacements = [
    {
      blockLang: ['Plain Text'],
      match: /(\\)(s|u|i|b|k|K|an|be|bord|blur|fa[xyz]|fs|fsc|fsp|fsv|fscx|fscy|fr[xyz]|fe|shad|ko|kf|[xy]bord|[xy]shad|rnd|rnd[xyz])([0-9+\-.]+)/g,
      lang: 'ASS'
    },
    {
      blockLang: ['HTML', 'JavaScript'],
      match: /v-if|v-for|v-bind/,
      lang: 'Vue-Html'
    }
  ]
  
  for (let replacement of replacements) {
    Object.values(nodeMap)
      .filter(({ value: block }) => {
        return block.type === 'code' &&
          replacement.blockLang.includes(block.properties?.language?.[0]?.[0]) &&
          replacement.match.test(block.properties?.title?.[0]?.[0])
      })
      .forEach((node) => {
        nodeMap[node.value.id] = {
          ...node,
          value: {
            ...node.value,
            properties: {
              ...node.value.properties,
              language: [[replacement.lang]]
            }
          }
        }
      })
  }

  return nodeMap
}

interface UseNotionPageArgs {
  tableId?: string;
  pageSlug?: string;
  pageId?: string;
}

export default async function useNotionPage({ tableId, pageSlug, pageId }: UseNotionPageArgs): Promise<Ref<NotionPage>> {
  const { data: page, error } = await useAsyncData<NotionPage>(`page-${pageSlug}`, async () => {
    let pageToFetch = pageId
    let linkMap: Record<string, string> = {}

    if (tableId && pageSlug) {
      const apiUrl = `https://notion-api.splitbee.io/v1/table/${tableId}`
      
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

      pageToFetch = page.id
      linkMap = Object.fromEntries(
        table.map((page) => [page.id.replace(/-/g, ''), page.Slug])
      )
    }

    const pageUrl = `https://notion-api.splitbee.io/v1/page/${pageToFetch}`
    const nodeMap = await $fetch<NotionNodeMap>(pageUrl)

    return {
      linkMap,
      nodeMap: fixCode(fixList(nodeMap, ['bulleted_list', 'to_do']))
    }
  })

  if (error.value && error.value instanceof Error) {
    throw error.value
  }
  
  return page
}
