import type * as NotionApi from '@notionhq/client/build/src/api-endpoints'

export type BulletedListItemGroupBlock = Omit<NotionApi.BulletedListItemBlockObjectResponse, 'type' | 'bulleted_list_item'> &
  { type: 'bulleted_list_item_group', bulleted_list_group: object }
export type NumberedListItemGroupBlock = Omit<NotionApi.NumberedListItemBlockObjectResponse, 'type' | 'numbered_list_item'> &
  { type: 'numbered_list_item_group', numbered_list_group: object }
export type ToDoGroupBlock = Omit<NotionApi.ToDoBlockObjectResponse, 'type' | 'to_do'> &
  { type: 'to_do_group', to_do_group: object }

export type BlockMap = Record<string, BlockNode>
export type BlockPageObject = NotionApi.PageObjectResponse & { type: 'page', content: string[] }
export type BlockWithContent = (NotionApi.BlockObjectResponse | BulletedListItemGroupBlock | NumberedListItemGroupBlock | ToDoGroupBlock) & { content?: string[] }
export type BlockNode = BlockWithContent | BlockPageObject

export type Language = NotionApi.CodeBlockObjectResponse['code']['language'] | 'ass' | 'vue-html' | 'tsx'

export type { NotionApi }
