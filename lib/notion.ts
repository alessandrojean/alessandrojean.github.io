import { v4 as uuid } from 'uuid'

import { Client } from '@notionhq/client'
export * from '@notionhq/client/build/src/api-endpoints'
import * as NotionApi from '@notionhq/client/build/src/api-endpoints'

export interface FetchTableArgs {
  tableId: string;
  sorts?: NotionApi.QueryDatabaseParameters['sorts'];
  filter?: NotionApi.QueryDatabaseParameters['filter'];
}

export async function fetchTable({ tableId, sorts, filter }: FetchTableArgs) {
  const { notionApiKey } = useRuntimeConfig()
  const notion = new Client({ auth: notionApiKey })

  return await notion.databases.query({
    database_id: tableId,
    sorts,
    filter
  })
}

export interface FetchPageArgs {
  pageId: string;
}

export async function fetchPage({ pageId }: FetchPageArgs) {
  const { notionApiKey } = useRuntimeConfig()
  const notion = new Client({ auth: notionApiKey })

  return await notion.pages.retrieve({ page_id: pageId }) as NotionApi.PageObjectResponse
}

function takeWhile<T>(array: T[], predicate: (item: T, i: number) => boolean): T[] {
  const index = array.findIndex((el, i) => !predicate(el, i))

  return index >= 0 ? array.slice(0, index) : array;
}

function groupItems(blockMap: BlockMap, types: NotionApi.BlockObjectResponse['type'][]): BlockMap {
  let newBlockMap = blockMap

  for (let type of types) {
    const page = Object.values(newBlockMap)[0]
    const content = page.content
    const visited: string[] = []

    for (let [index, id] of content.entries()) {
      const node = newBlockMap[id]
      const nodeType = node.type

      if (visited.includes(id) || type !== nodeType) {
        continue
      }

      const next = takeWhile(content.slice(index + 1), (id) => {
        return newBlockMap[id].type === type && 
          newBlockMap[id].parent.type === 'page_id'
      })

      if (next.length === 0) {
        continue
      }

      visited.push(id, ...next)

      const groupId = uuid()
      const groupBlock = {
        id: groupId,
        type: `${type}_group`,
        [`${type}_group`]: {},
        content: [id, ...next],
        has_children: true,
        parent: {
          type: 'page_id',
          page_id: page.id
        }
      } as BlockNode

      [id, ...next].forEach((nextId) => {
        newBlockMap[nextId].parent = {
          type: 'block_id',
          block_id: groupId
        }
      })

      let mapEntries = Object.entries(newBlockMap)

      mapEntries[0][1].content[index] = groupId
      mapEntries.splice(index, 0, [groupId, groupBlock])

      newBlockMap = Object.fromEntries(mapEntries)
    }

    newBlockMap[page.id].content = content.filter((contentId) => {
      return !visited.includes(contentId)
    })
  }

  return newBlockMap
}

interface CodeReplacement {
  blockLang: NotionApi.CodeBlockObjectResponse['code']['language'][],
  match: RegExp,
  lang: Language
}

function fixCode(blockMap: BlockMap, replacements: CodeReplacement[]): BlockMap {  
  for (let replacement of replacements) {
    Object.values(blockMap)
      .filter((block) => {
        return block.type === 'code' &&
          replacement.blockLang.includes(block.code.language) &&
          replacement.match.test(getTextContent(block.code.rich_text))
      })
      .forEach((block) => {
        blockMap[block.id]['code']['language'] = replacement.lang
      })
  }

  return blockMap
}

export interface FetchBlocksArgs {
  page: NotionApi.PageObjectResponse;
}

export type BulletedListItemGroupBlock = Omit<NotionApi.BulletedListItemBlockObjectResponse, 'type' | 'bulleted_list_item'> &
  { type: 'bulleted_list_item_group', bulleted_list_group: object }
export type ToDoGroupBlock = Omit<NotionApi.ToDoBlockObjectResponse, 'type' | 'to_do'> &
{ type: 'to_do_group', to_do_group: object }

export type BlockMap = Record<string, BlockNode>
export type BlockPageObject = NotionApi.PageObjectResponse & { type: 'page', content: string[] }
export type BlockWithContent = (NotionApi.BlockObjectResponse | BulletedListItemGroupBlock | ToDoGroupBlock) & { content?: string[] }
export type BlockNode = BlockWithContent | BlockPageObject

export type Language = NotionApi.CodeBlockObjectResponse['code']['language'] | 'ass' | 'vue-html'

export async function fetchBlocks({ page }: FetchBlocksArgs): Promise<BlockMap> {
  const { notionApiKey } = useRuntimeConfig()
  const notion = new Client({ auth: notionApiKey })

  let { results: blocks, next_cursor } = await notion.blocks.children.list({
    block_id: page.id
  })

  while (next_cursor) {
    const result = await notion.blocks.children.list({
      block_id: page.id,
      start_cursor: next_cursor
    })

    blocks.push(...result.results)
    next_cursor = result.next_cursor
  }

  const blocksWithChildren = [...blocks.entries()]
    .filter(([_, block]) => {
      return block['has_children'] && (block['content'] || []).length === 0
    })
    .map(([i, block]) => ({ i, id: block.id }))

  while (blocksWithChildren.length > 0) {
    const { i, id: current } = blocksWithChildren.shift()

    const { results: children } = await notion.blocks.children.list({
      block_id: current
    })

    const toVisit = [...children.entries()]
      .filter(([_, block]) => {
        return block['has_children'] && (block['content'] || []).length === 0
      })
      .map(([i, block]) => ({ i: blocks.length + i, id: block.id }))

    blocksWithChildren.push(...toVisit)

    blocks.push(...children)
    blocks[i]['content'] = children.map((child) => child.id)
  }

  const pageBlock: BlockPageObject = {
    ...page,
    type: 'page',
    content: blocks
      .filter((block) => block['parent']?.['type'] === 'page_id')
      .map((block) => block.id)
  }

  const allBlocks = [
    pageBlock,
    ...(blocks as BlockWithContent[])
  ]

  const blockMap: BlockMap = Object.fromEntries(allBlocks.map((b) => [b.id, b]))

  return fixCode(groupItems(blockMap, ['bulleted_list_item', 'to_do']), [
    {
      blockLang: ['plain text'],
      match: /(\\)(s|u|i|b|k|K|an|be|bord|blur|fa[xyz]|fs|fsc|fsp|fsv|fscx|fscy|fr[xyz]|fe|shad|ko|kf|[xy]bord|[xy]shad|rnd|rnd[xyz])([0-9+\-.]+)/g,
      lang: 'ass'
    },
    {
      blockLang: ['html', 'javascript'],
      match: /v-if|v-for|v-bind|v-else|v-else-if/,
      lang: 'vue-html'
    }
  ])
}

export function getTextContent(text: (NotionApi.TextRichTextItemResponse | NotionApi.RichTextItemResponse)[]): string {
  return text.reduce((prev, current) => prev + current.plain_text, '')
}
