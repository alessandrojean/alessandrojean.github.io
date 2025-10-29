import { queryCollection } from '@nuxt/content/server';

export default defineEventHandler(async (event) => {
  const movies = await queryCollection(event, 'movies')
    .order('created_at', 'DESC')
    .limit(10)
    .all();
  const url = 'https://alessandrojean.github.io';

  setResponseHeader(event, 'Content-Type', 'application/feed+json');

  const list = new Intl.ListFormat('pt-BR', { type: 'conjunction' });

  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Alessandro Jean\'s Movie Comments',
    description: 'Just a personal movie blog.',
    authors: [{ name: 'Alessandro Jean' }],
    language: 'pt-BR',
    home_page_url: url,
    feed_url: `${url}/blog/feed.json`,
    icon: `${url}/img/apple-touch-icon.png`,
    items: movies.map((m) => {
      const path = m.path.replace('/movies/', '/movie/');

      return ({
        id: path,
        url: `${url}/${path}`,
        title: `${m.title} (${m.year})`,
        summary: `Direção: ${list.format(m.director)} / Roteiro: ${list.format(m.writer)}`,
        // content_html: parseMovieToHtml(m, content[idx]),
        date_published: new Date(m.created_at).toISOString(),
        date_modified: m.updated_at ? new Date(m.updated_at).toISOString() : undefined,
        language: 'pt-BR',
        image: m.cover,
      });
    }),
  };
});
