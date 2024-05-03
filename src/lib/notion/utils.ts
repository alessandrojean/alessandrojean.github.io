import { parseISO } from 'date-fns/parseISO'
import { v4 as uuid } from 'uuid'

import { fileNameFromUrl } from '#media-extractor'

import type * as NotionApi from '@notionhq/client/build/src/api-endpoints'
import type { BlockMap, BlockNode, Language } from './types'

export function getTextContent(text: (NotionApi.TextRichTextItemResponse | NotionApi.RichTextItemResponse)[]): string {
  return text.reduce((prev, current) => prev + current.plain_text, '')
}

function takeWhile<T>(array: T[], predicate: (item: T, i: number) => boolean): T[] {
  const index = array.findIndex((el, i) => !predicate(el, i))

  return index >= 0 ? array.slice(0, index) : array;
}

export function groupItems(blockMap: BlockMap, types: NotionApi.BlockObjectResponse['type'][]): BlockMap {
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

export interface CodeReplacement {
  blockLang: NotionApi.CodeBlockObjectResponse['code']['language'][],
  match: RegExp,
  lang: Language
}

export function fixCode(blockMap: BlockMap, replacements: CodeReplacement[]): BlockMap {  
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

export function postMapVideoUrl(block: NotionApi.VideoBlockObjectResponse) { 
  const url = block.video.type === 'external'
    ? block.video.external.url
    : block.video.file.url

  const extension = fileNameFromUrl(url).extension
  const hash = parseISO(block.last_edited_time).getTime().toString(16)

  return `${block.id}-${hash}.${extension}` 
}

export function postMapImageUrl(block: NotionApi.ImageBlockObjectResponse) {
  const url = block.image.type === 'external'
    ? block.image.external.url
    : block.image.file.url

  const hash = parseISO(block.last_edited_time).getTime().toString(16)
  const extension = fileNameFromUrl(url).extension

  return `${block.id}-${hash}.${extension}`
}
