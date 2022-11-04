import { Client } from '@notionhq/client'
import type * as NotionApi from '@notionhq/client/build/src/api-endpoints'

export interface FetchPageArgs {
  pageId: string;
}

export async function fetchPage({ pageId }: FetchPageArgs) {
  const { notionApiKey } = useRuntimeConfig()
  const notion = new Client({ auth: notionApiKey })

  return await notion.pages.retrieve({ page_id: pageId }) as NotionApi.PageObjectResponse
}
