import { getNotionPosts } from '~~/server/utils/notion';

export default defineEventHandler(async (event) => {
  const posts = await getNotionPosts(event);
  const url = 'https://alessandrojean.github.io';

  setResponseHeader(event, 'Content-Type', 'application/feed+json');

  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Alessandro Jean\'s Blog',
    description: 'Just a personal blog.',
    authors: [{ name: 'Alessandro Jean' }],
    language: 'pt-BR',
    home_page_url: url,
    feed_url: `${url}/blog/feed.json`,
    items: posts.map(p => ({
      id: p.slug,
      url: `${url}/post/${p.slug}`,
      title: p.title,
      content_html: `<p>Leia o conteúdo completo <a href="${url}/post/${p.slug}">no site</a>.</p>`,
      date_published: new Date(p.published_at).toISOString(),
      date_modified: new Date(p.updated_at).toISOString(),
      tags: [p.category],
      language: p.language,
    })),
  };
});
