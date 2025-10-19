import type { PageObjectResponse } from '@notionhq/client';
import { Client } from '@notionhq/client';

import { getNotionBlocks, groupNotionBlocks, parsePostProperties, processImages } from '~~/server/utils/notion';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug || slug.length == 0) {
    throw createError({ statusCode: 400 });
  }

  const config = useRuntimeConfig(event);
  const notion = new Client({ auth: config.notion.apiKey });

  const publicFilter = { property: 'Public', checkbox: { equals: true } };

  const publicOnly = process.env.CI || !import.meta.dev || import.meta.prerender;

  const posts = await notion.dataSources.query({
    data_source_id: config.notion.postsDataSourceId,
    filter: publicOnly ? publicFilter : undefined,
  });

  if (posts.results.length === 0) {
    throw createError({ statusCode: 404 });
  }

  const props = (posts.results as PageObjectResponse[]).map(parsePostProperties);
  const postIdx = props.findIndex(p => p.slug === slug);

  if (postIdx == -1) {
    throw createError({ statusCode: 404 });
  }

  const post = posts.results[postIdx] as PageObjectResponse;
  const properties = parsePostProperties(post);
  const blocks = await getNotionBlocks(notion, properties.id);

  if (process.env.CI || !import.meta.dev || import.meta.prerender) {
    await processImages(blocks);
  }

  return {
    ...properties,
    blocks: groupNotionBlocks(blocks),
    posts: Object.fromEntries(props.map(p => [p.id.replaceAll('-', ''), p.slug])),
  };
});
