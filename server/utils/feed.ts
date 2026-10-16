import type { BlogCollectionItem } from '@nuxt/content';
import type { JsonFeed, RssFeed } from 'feedsmith';
import { generateJsonFeed, generateRssFeed } from 'feedsmith';
import type { H3Event } from 'h3';

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

export async function buildJsonFeed(event: H3Event, posts: BlogCollectionItem[], language?: Language): Promise<JsonFeed.Feed<Date>> {
  const items: JsonFeed.Item<Date>[] = [];
  const { url } = getSiteConfig(event);

  for (const post of posts) {
    const [, _, fileName] = post.path.slice(1).split('/');
    const slug = fileName!.slice(11);

    items.push({
      id: slug,
      url: `${url}/post/${slug}`,
      title: post.title,
      summary: post.description,
      content_html: await markdownToHtml(post.path),
      date_published: new Date(post.created_at),
      date_modified: new Date(post.updated_at ?? post.created_at),
      tags: [post.category],
      language: post.language ?? 'pt-BR',
    });
  }

  return generateJsonFeed({
    title: 'Alessandro Jean\'s Blog',
    description: 'Just a personal blog.',
    authors: [{
      name: 'Alessandro Jean',
      avatar: `${url}/img/avatar-okabe-small.webp`,
    }],
    language: language ?? 'pt-BR',
    home_page_url: `${url}/blog`,
    feed_url: `${url}/blog/feed.json`,
    icon: `${url}/img/apple-touch-icon.png`,
    items,
  }) as JsonFeed.Feed<Date>;
}

export async function buildXmlFeed(event: H3Event, posts: BlogCollectionItem[], language?: Language): Promise<string> {
  const { url } = getSiteConfig(event);
  const items: RssFeed.Item<Date>[] = [];

  for (const post of posts) {
    const [, _, fileName] = post.path.slice(1).split('/');
    const slug = fileName!.slice(11);

    items.push({
      title: post.title,
      guid: { value: `${url}/post/${slug}` },
      link: `${url}/post/${slug}`,
      description: post.description,
      pubDate: new Date(post.created_at),
      categories: post.category ? [{ name: post.category }] : undefined,
      dc: { creators: ['Alessandro Jean'] },
      content: {
        encoded: await markdownToHtml(post.path),
      },
    });
  }

  return generateRssFeed({
    title: 'Alessandro Jean\'s Blog',
    description: 'Just a personal blog.',
    link: url,
    language: language ?? 'pt-BR',
    copyright: `Copyright © 2018–${new Date().getFullYear()} Alessandro Jean`,
    atom: { icon: `${url}/img/apple-touch-icon.png` },
    items,
  });
}
