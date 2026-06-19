import type { BlogCollectionItem } from '@nuxt/content';
import RSS from 'rss';

import type { H3Event } from '#imports';

type Language = 'pt-BR' | 'en-US';

export async function listPosts(event: H3Event, language?: Language) {
  let query = queryCollection(event, 'blog');

  if (language) {
    query = query.where('language', '=', language);
  }

  return await query
    .order('created_at', 'DESC')
    .limit(10)
    .all();
}

type JsonFeed = {
  version: 'https://jsonfeed.org/version/1.1';
  title: string;
  description: string;
  authors: { name: string }[];
  language: string;
  home_page_url: string;
  feed_url: string;
  icon: string;
  items: JsonFeedItem[];
};

type JsonFeedItem = {
  id: string;
  url: string;
  title: string;
  content_html: string;
  date_published: string;
  date_modified: string;
  tags: string[];
  language: string;
};

export async function buildJsonFeed(event: H3Event, posts: BlogCollectionItem[], language?: Language): Promise<JsonFeed> {
  const items: JsonFeedItem[] = [];
  const { url } = getSiteConfig(event);

  for (const post of posts) {
    const [, _, fileName] = post.path.slice(1).split('/');
    const slug = fileName!.slice(11);

    items.push({
      id: slug,
      url: `${url}/post/${slug}`,
      title: post.title,
      content_html: await markdownToHtml(post.path),
      date_published: new Date(post.created_at).toISOString(),
      date_modified: post.updated_at
        ? new Date(post.updated_at).toISOString()
        : new Date(post.created_at).toISOString(),
      tags: [post.category],
      language: post.language ?? 'pt-BR',
    });
  }

  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Alessandro Jean\'s Blog',
    description: 'Just a personal blog.',
    authors: [{ name: 'Alessandro Jean' }],
    language: language ?? 'pt-BR',
    home_page_url: `${url}/blog`,
    feed_url: `${url}/blog/feed.json`,
    icon: `${url}/img/apple-touch-icon.png`,
    items,
  };
}

export async function buildXmlFeed(event: H3Event, posts: BlogCollectionItem[], language?: Language): Promise<string> {
  const { url } = getSiteConfig(event);

  const feed = new RSS({
    title: 'Alessandro Jean\'s Blog',
    description: 'Just a personal blog.',
    site_url: url,
    feed_url: `${url}/blog/feed.xml`,
    language: language ?? 'pt-BR',
    copyright: `Alessandro Jean © 2022–${new Date().getFullYear()}`,
    custom_elements: [
      { icon: `${url}/img/apple-touch-icon.png` },
    ],
    custom_namespaces: {
      content: 'http://purl.org/rss/1.0/modules/content/',
      dc: 'http://purl.org/dc/elements/1.1/',
      sy: 'http://purl.org/rss/1.0/modules/syndication/',
    },
  });

  for (const post of posts) {
    const [, _, fileName] = post.path.slice(1).split('/');
    const slug = fileName!.slice(11);

    feed.item({
      title: post.title,
      guid: `${url}/post/${slug}`,
      url: `${url}/post/${slug}`,
      description: post.description,
      date: new Date(post.created_at),
      categories: post.category ? [post.category] : undefined,
      custom_elements: [
        { 'dc:creator': { _cdata: 'Alessandro Jean' } },
        { 'content:encoded': { _cdata: await markdownToHtml(post.path) } },
      ],
    });
  }

  return feed.xml();
}
