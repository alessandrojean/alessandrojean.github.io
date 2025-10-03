import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client';
import { getNotionBlocks, groupNotionBlocks, processImages } from '~~/server/utils/notion';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id || id.length == 0) {
    throw createError({ statusCode: 400 });
  }

  const config = useRuntimeConfig(event);
  const notion = new Client({ auth: config.notion.apiKey });

  const publicFilter = { property: 'Public', checkbox: { equals: true } };
  const idFilter = { property: 'ID', unique_id: { equals: Number.parseInt(id, 10) } };

  const publicOnly = process.env.CI || !import.meta.dev || import.meta.prerender;

  const movies = await notion.dataSources.query({
    data_source_id: config.notion.moviesDataSourceId,
    filter: publicOnly ? { and: [publicFilter, idFilter] } : idFilter,
  });

  if (movies.results.length === 0) {
    throw createError({ statusCode: 404 });
  }

  const movie = movies.results[0] as PageObjectResponse;
  const properties = parseMovieProperties(movie);
  const blocks = await getNotionBlocks(notion, properties.id);

  if (process.env.CI || !import.meta.dev || import.meta.prerender) {
    await processImages(blocks);
  }

  return {
    ...properties,
    blocks: groupNotionBlocks(blocks),
    movies: {},
  };
})
