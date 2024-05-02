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

type Properties = NotionApi.PageObjectResponse['properties']
type TitleProp = Extract<Properties[string], { type: 'title' }>
type RichTextProp = Extract<Properties[string], { type: 'rich_text' }>
type SelectProp = Extract<Properties[string], { type: 'select' }>
type MultiSelectProp = Extract<Properties[string], { type: 'multi_select' }>
type DateProp = Extract<Properties[string], { type: 'date' }>
type CheckboxProp = Extract<Properties[string], { type: 'checkbox' }>
type UrlProp = Extract<Properties[string], { type: 'url' }>

export interface PostProperties {
  'Name': TitleProp;
  'Description': RichTextProp;
  'Slug': RichTextProp;
  'Area': SelectProp;
  'Tags': MultiSelectProp;
  'Created at': DateProp;
  'Public': CheckboxProp;
}

export type PostObjectResponse = Omit<NotionApi.PageObjectResponse, 'properties'>
  & { properties: PostProperties }

export interface ProjectProperties {
  'Name': TitleProp;
  'Description': RichTextProp;
  'English Description': RichTextProp;
  'Slug': RichTextProp;
  'Category': SelectProp;
  'English Category': SelectProp;
  'URL': UrlProp;
  'Public': CheckboxProp;
}

export type ProjectObjectResponse = Omit<NotionApi.PageObjectResponse, 'properties'>
  & { properties: ProjectProperties }

export type { NotionApi }
