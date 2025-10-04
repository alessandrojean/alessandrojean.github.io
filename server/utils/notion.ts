import { Client } from '@notionhq/client';
import { encode } from 'html-entities';
import dedent from 'dedent';
import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';

import type { H3Event, EventHandlerRequest } from 'h3';
import type { BulletedListItemBlockObjectResponse, ImageBlockObjectResponse, NumberedListItemBlockObjectResponse, PageObjectResponse, RichTextItemResponse, ToDoBlockObjectResponse } from '@notionhq/client';
import type { BulletedListBlock, NumberedListBlock, ToDoListBlock } from '~~/shared/types/notion';

type PageProperties = PageObjectResponse['properties'][string];

interface PostProperties {
  'Name': Extract<PageProperties, { type: 'title' }>;
  'Created at': Extract<PageProperties, { type: 'date' }>;
  'Public': Extract<PageProperties, { type: 'checkbox' }>;
  'Slug': Extract<PageProperties, { type: 'rich_text' }>;
  'Description': Extract<PageProperties, { type: 'rich_text' }>;
  'Area': Extract<PageProperties, { type: 'select' }>;
  'Tags': Extract<PageProperties, { type: 'multi_select' }>;
  'Language': Extract<PageProperties, { type: 'select' }>;
};

interface MovieProperties {
  'Title': Extract<PageProperties, { type: 'title' }>;
  'Year': Extract<PageProperties, { type: 'number' }>;
  'Director': Extract<PageProperties, { type: 'multi_select' }>;
  'Created at': Extract<PageProperties, { type: 'date' }>;
  'TMDB': Extract<PageProperties, { type: 'url' }>;
  'Slug': Extract<PageProperties, { type: 'rich_text' }>;
  'Public': Extract<PageProperties, { type: 'checkbox' }>;
  'Writer': Extract<PageProperties, { type: 'multi_select' }>;
  'Copyright': Extract<PageProperties, { type: 'rich_text' }>;
  'Cover': Extract<PageProperties, { type: 'files' }>;
  'Poster': Extract<PageProperties, { type: 'files' }>;
  'ID': Extract<PageProperties, { type: 'unique_id' }>;
};

export function parsePostProperties(page: PageObjectResponse) {
  const properties = page.properties as unknown as PostProperties;

  return {
    id: page.id,
    title: properties.Name.title[0].plain_text,
    published_at: properties['Created at'].date!.start,
    created_at: page.created_time,
    updated_at: page.last_edited_time,
    is_public: properties.Public.checkbox,
    slug: properties.Slug.rich_text[0].plain_text,
    description: properties.Description.rich_text[0]?.plain_text ?? '',
    category: properties.Area.select
      ? { 
          name: properties.Area.select.name,
          color: properties.Area.select.color,
        }
      : undefined,
    tags: properties.Tags.multi_select.map((tag) => tag.name),
    language: properties.Language.select?.name,
  };
}

export function parseMovieProperties(page: PageObjectResponse) {
  const properties = page.properties as unknown as MovieProperties;
  type Cover = MovieProperties['Cover']['files'][number];
  type ExternalFile = Extract<Cover, { type?: 'external' }>;

  return {
    id: page.id,
    movieId: properties.ID.unique_id.number ?? 0,
    title: properties.Title.title[0].plain_text,
    year: properties.Year.number,
    director: properties.Director.multi_select.map((director) => director.name),
    published_at: properties['Created at'].date!.start,
    created_at: page.created_time,
    updated_at: page.last_edited_time,
    tmdb: properties.TMDB.url,
    slug: properties.Slug.rich_text[0].plain_text,
    is_public: properties.Public.checkbox,
    writer: properties.Writer.multi_select.map((writer) => writer.name),
    copyright: properties.Copyright.rich_text[0].plain_text,
    cover: (properties.Cover.files[0] as ExternalFile).external.url,
    poster: (properties.Poster.files[0] as ExternalFile | undefined)?.external.url,
    grid: properties.Cover.files.slice(1).map(file => (file as ExternalFile).external.url),
  };
}

interface GetNotionPostsOptions {
  pageSize?: number;
};

export async function getNotionPosts(event: H3Event<EventHandlerRequest>, options?: GetNotionPostsOptions) {
  const config = useRuntimeConfig(event);
  const notion = new Client({ auth: config.notion.apiKey });

  const publicFilter = { property: 'Public', checkbox: { equals: true } };
  const publicOnly = process.env.CI || !import.meta.dev || import.meta.prerender;

  const response = await notion.dataSources.query({
    data_source_id: config.notion.postsDataSourceId,
    filter: publicOnly ? publicFilter : undefined,
    page_size: options?.pageSize,
    sorts: [{
      property: 'Created at',
      direction: 'descending',
    }],
  });

  return (response.results as PageObjectResponse[])
    .map((page) => parsePostProperties(page));
}

interface GetNotionMoviesOptions {
  pageSize?: number;
};

export async function getNotionMovies(event: H3Event<EventHandlerRequest>, options?: GetNotionMoviesOptions) {
  const config = useRuntimeConfig(event);
  const notion = new Client({ auth: config.notion.apiKey });

  const publicFilter = { property: 'Public', checkbox: { equals: true } };
  const publicOnly = process.env.CI || !import.meta.dev || import.meta.prerender;

  const args: Parameters<typeof notion.dataSources.query>[0] = {
    data_source_id: config.notion.moviesDataSourceId,
    filter: publicOnly ? publicFilter : undefined,
    page_size: options?.pageSize,
    sorts: [
      { property: 'Created at', direction: 'descending' },
      { property: 'ID', direction: 'descending' },
    ],
  };

  let response = await notion.dataSources.query(args);

  const results = response.results;

  while (options?.pageSize === undefined && response.next_cursor) {
    response = await notion.dataSources.query({
      ...args,
      start_cursor: response.next_cursor,
    });

    results.push(...response.results);
  }

  return (results as PageObjectResponse[])
    .map((page) => parseMovieProperties(page));
}

export async function processImages(blocks: BlockWithChildren[]) {
  const images: ImageBlockObjectResponse[] = [];
  const queue = blocks.filter(b => b.type === 'image' || b.has_children);

  while (queue.length > 0) {
    const top = queue.shift()!;

    if (top.type === 'image') {
      images.push(top);
    } else if (top.children?.length) {
      queue.push(...top.children.filter(b => b.type === 'image' || b.has_children));
    }
  }

  for (const block of images) {
    await downloadImage(block);
  }
}

async function downloadImage(block: ImageBlockObjectResponse) {
  if (block.image.type !== 'file') {
    return;
  }

  const { extension } = fileNameFromUrl(block.image.file.url);
  const fileName = `${block.id}.${extension}`;

  console.log(`Downloading image ${fileName}`);

  const res = await fetch(block.image.file.url);
  const buffer = await res.arrayBuffer();

  const fullPath = join('public/img', fileName);
  await writeFile(fullPath, Buffer.from(buffer));

  block.image.file.url = `/img/${fileName}`;
}

export async function getNotionBlocks(notion: Client, pageId: string) {
  const firstPage = await notion.blocks.children.list({ block_id: pageId });
  const blocks = firstPage.results as BlockWithChildren[];
  let nextCursor = firstPage.next_cursor;

  while (nextCursor) {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: nextCursor,
    });

    blocks.push(...(response.results as BlockWithChildren[]));
    nextCursor = response.next_cursor;
  }

  for (let i = 0; i < blocks.length; i++) {
    blocks[i].children = await fetchChildren(notion, blocks[i]);
  }

  return blocks;
}

async function fetchChildren(notion: Client, block: BlockWithChildren) {
  if (!block.has_children) {
    return [];
  }

  const response = await notion.blocks.children.list({ block_id: block.id });
  const blocks = response.results as BlockWithChildren[];

  for (let i = 0; i < blocks.length; i++) {
    blocks[i].children = await fetchChildren(notion, blocks[i]);
  }

  return blocks;
}

export function groupNotionBlocks(blocks: BlockWithChildren[]) {
  const grouped: BlockWithChildren[] = [];

  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === 'numbered_list_item') {
      const custom: NumberedListBlock = {
        type: 'numbered_list',
        id: block.id,
        children: [block],
        has_children: true,
      };

      let j = i + 1;

      while (j < blocks.length && blocks[j].type === 'numbered_list_item') {
        const item = blocks[j] as WithChildren<NumberedListItemBlockObjectResponse>;

        if (item.children?.length) {
          item.children = groupNotionBlocks(item.children);
        }

        custom.children.push(item);
        j++;
      }

      grouped.push(custom);
      i = j;
      continue;
    }

    if (block.type === 'bulleted_list_item') {
      const custom: BulletedListBlock = {
        type: 'bulleted_list',
        id: block.id,
        children: [block],
        has_children: true,
      };

      let j = i + 1;

      while (j < blocks.length && blocks[j].type === 'bulleted_list_item') {
        const item = blocks[j] as WithChildren<BulletedListItemBlockObjectResponse>;

        if (item.children?.length) {
          item.children = groupNotionBlocks(item.children);
        }

        custom.children.push(item);
        j++;
      }

      grouped.push(custom);
      i = j;
      continue;
    }

    if (block.type === 'to_do') {
      const custom: ToDoListBlock = {
        type: 'to_do_list',
        id: block.id,
        children: [block],
        has_children: true,
      };

      let j = i + 1;

      while (j < blocks.length && blocks[j].type === 'to_do') {
        custom.children.push(blocks[j] as ToDoBlockObjectResponse);
        j++;
      }

      grouped.push(custom);
      i = j;
      continue;
    }

    grouped.push(block);
    i++;
  }

  return grouped;
}

function parseDecoratorsToHtml(decorators: RichTextItemResponse[]): string {
  let html = '';

  for (const part of decorators) {
    if (part.href) {
      html += `<a href="${part.href}">`;
    }

    if (part.annotations.bold) {
      html += `<strong>`;
    }

    if (part.annotations.code) {
      html += `<code>`;
    }

    if (part.annotations.italic) {
      html += `<em>`;
    }

    html += encode(part.plain_text.trim());

    if (part.annotations.italic) {
      html += `</em>`;
    }

    if (part.annotations.code) {
      html += `</code>`;
    }

    if (part.annotations.bold) {
      html += `</strong>`;
    }

    if (part.href) {
      html += `</a>`;
    }
  }
  
  return html;
}

export function parseBlocksToHtml(blocks: BlockWithChildren[]): string {
  let html = '';

  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        html += `<p>${parseDecoratorsToHtml(block.paragraph.rich_text)}</p>`;
    }
  }

  return html;
}

type Movie = ReturnType<typeof parseMovieProperties>;

export function parseMovieToHtml(movie: Movie, blocks: BlockWithChildren[]): string {
  const list = new Intl.ListFormat('pt-BR', { type: 'conjunction' });
  const directors = list.format(movie.director.map(d => encode(d)));
  const writers = list.format(movie.writer.map(w => encode(w)));
  const tmdb = `<a href="${movie.tmdb}">TMDB</a>`;

  const figure = dedent`
    <figure>
      <img alt="${encode(movie.title)}" loading="lazy" src="${movie.cover}">
      <figcaption>
        Direção: ${directors} / Roteiro: ${writers} / ${tmdb}<br>Copyright ${encode(movie.copyright)}.
      </figcaption>
    </figure>
  `;

  return figure + parseBlocksToHtml(blocks);
}
