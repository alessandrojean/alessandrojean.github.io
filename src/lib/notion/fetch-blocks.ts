import { Client } from '@notionhq/client'
import type * as NotionApi from '@notionhq/client/build/src/api-endpoints'
import type { BlockMap, BlockPageObject, BlockWithContent } from './types'

import { fixCode, groupItems } from './utils'

export interface FetchBlocksArgs {
  page: NotionApi.PageObjectResponse;
}

export async function fetchBlocks({ page }: FetchBlocksArgs): Promise<BlockMap> {
  const { notionApiKey } = useRuntimeConfig()
  const notion = new Client({ auth: notionApiKey })

  const firstPage = await notion.blocks.children.list({
    block_id: page.id
  })

  const blocks = firstPage.results as BlockWithContent[]
  let nextCursor = firstPage.next_cursor

  while (nextCursor) {
    const result = await notion.blocks.children.list({
      block_id: page.id,
      start_cursor: nextCursor
    })

    blocks.push(...(result.results as BlockWithContent[]))
    nextCursor = result.next_cursor
  }

  const blocksWithChildren = [...blocks.entries()]
    .filter(([_, block]) => block.has_children)
    .map(([i, block]) => ({ i, id: block.id }))

  while (blocksWithChildren.length > 0) {
    const { i, id: current } = blocksWithChildren.shift()

    const result = await notion.blocks.children.list({
      block_id: current
    })

    const children = result.results as BlockWithContent[]

    const toVisit = [...children.entries()]
      .filter(([_, block]) => block.has_children)
      .map(([i, block]) => ({ i: blocks.length + i, id: block.id }))

    blocksWithChildren.push(...toVisit)

    blocks.push(...children)
    blocks[i].content = children.map((child) => child.id)
  }

  const pageBlock: BlockPageObject = {
    ...page,
    type: 'page',
    content: blocks
      .filter((block) => block.parent.type === 'page_id')
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
    },
    {
      blockLang: ['typescript'],
      match: /\(\n\s+<div/m,
      lang: 'tsx'
    }
  ])
}
