import { queryCollection } from '@nuxt/content/server';

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'blog')
    .order('created_at', 'DESC')
    .limit(10)
    .all();
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
    icon: `${url}/img/apple-touch-icon.png`,
    items: posts.map((p) => {
      const [, _, fileName] = p.path.slice(1).split('/');
      const slug = fileName!.slice(11);

      return ({
        id: slug,
        url: `${url}/post/${slug}`,
        title: p.title,
        content_html: `<p>Leia o conteúdo completo <a href="${url}/post/${slug}">no site</a>.</p>`,
        date_published: new Date(p.created_at).toISOString(),
        date_modified: p.updated_at
          ? new Date(p.updated_at).toISOString()
          : new Date(p.created_at).toISOString(),
        tags: [p.category],
        language: p.language,
      });
    }),
  };
});
