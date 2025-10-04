import RSS from 'rss';
import { getNotionPosts } from '~~/server/utils/notion';

export default defineEventHandler(async (event) => {
  const posts = await getNotionPosts(event, { pageSize: 10 });
  const url = 'https://alessandrojean.github.io';

  const feed = new RSS({
    title: 'Alessandro Jean\'s Blog',
    description: 'Just a personal blog.',
    site_url: url,
    feed_url: `${url}/blog/feed.xml`,
    language: 'pt-BR',
    copyright: `Alessandro Jean © 2022–${new Date().getFullYear()}`,
    custom_elements: [
      { 'icon': `${url}/img/apple-touch-icon.png` },
    ],
    custom_namespaces: {
      content: 'http://purl.org/rss/1.0/modules/content/',
      dc: 'http://purl.org/dc/elements/1.1/',
      sy: 'http://purl.org/rss/1.0/modules/syndication/',
    },
  });

  for (const post of posts) {
    feed.item({
      title: post.title,
      guid: `${url}/post/${post.slug}`,
      url: `${url}/post/${post.slug}`,
      description: post.description,
      date: new Date(post.published_at),
      categories: post.category ? [post.category.name] : undefined,
      custom_elements: [
        { 'dc:creator': { _cdata: 'Alessandro Jean' } },
        { 'content:encoded': { _cdata: `<p>Leia o conteúdo completo <a href="${url}/post/${post.slug}">no site</a>.</p>` } },
      ],
    });
  }

  setResponseHeader(event, 'Content-Type', 'text/xml');
  return feed.xml();
});
