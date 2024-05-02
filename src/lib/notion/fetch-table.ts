import { Client } from '@notionhq/client';
import type * as NotionApi from '@notionhq/client/build/src/api-endpoints';

export interface FetchTableArgs {
  tableId: string;
  perPage?: number;
  sorts?: NotionApi.QueryDatabaseParameters['sorts'];
  filter?: NotionApi.QueryDatabaseParameters['filter'];
}

export async function fetchTable({ tableId, sorts, filter, perPage }: FetchTableArgs) {
  const { notionApiKey } = useRuntimeConfig()
  const notion = new Client({ auth: notionApiKey })

  return await notion.databases.query({
    database_id: tableId,
    sorts,
    filter,
    page_size: perPage,
  })
}
