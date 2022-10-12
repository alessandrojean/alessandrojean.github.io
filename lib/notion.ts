import { Client } from '@notionhq/client'
import type {
  BlockObjectResponse,
  PageObjectResponse,
  QueryDatabaseParameters
} from '@notionhq/client/build/src/api-endpoints'
export type { TextRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

export type { PageObjectResponse, QueryDatabaseParameters }

export interface FetchTableArgs {
  tableId: string;
  sorts?: QueryDatabaseParameters['sorts'];
  filter?: QueryDatabaseParameters['filter'];
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

export interface FetchBlocksArgs {
  page: PageObjectResponse;
}

export async function fetchBlocks({ page }: FetchBlocksArgs) {
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

  // Fetch one level deep.
  const blocksWithChildren = [...blocks.entries()]
    .filter(([_, block]) => block['has_children'])

  for (let [i, block] of blocksWithChildren) {
    const { results: children } = await notion.blocks.children.list({
      block_id: block.id
    })

    blocks.push(...children)
    blocks[i]['content'] = children.map((child) => child.id)
  }

  const allBlocks = [
    { ...page, type: 'page', content: blocks.map((block) => block.id) },
    ...(blocks as BlockObjectResponse[])
  ]

  return Object.fromEntries(allBlocks.map((b) => [b.id, b]))
}

export type BlockMap = Awaited<ReturnType<typeof fetchBlocks>>
export type BlockNode = BlockMap[string]
