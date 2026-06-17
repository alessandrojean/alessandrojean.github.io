import { queryCollection } from '@nuxt/content/server';
import RSS from 'rss';

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'blog')
    .order('created_at', 'DESC')
    .limit(10)
    .all();
  const url = 'https://alessandrojean.github.io';

  const feed = new RSS({
    title: 'Alessandro Jean\'s Blog',
    description: 'Just a personal blog.',
    site_url: url,
    feed_url: `${url}/blog/feed.xml`,
    language: 'pt-BR',
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

  setResponseHeader(event, 'Content-Type', 'text/xml');
  return feed.xml();
});
