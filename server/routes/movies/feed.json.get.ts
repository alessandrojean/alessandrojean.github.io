import { Client } from '@notionhq/client';

export default defineEventHandler(async (event) => {
  const movies = await getNotionMovies(event, { pageSize: 10 });
  const url = 'https://alessandrojean.github.io';

  setResponseHeader(event, 'Content-Type', 'application/feed+json');

  const list = new Intl.ListFormat('pt-BR', { type: 'conjunction' });
  const content: BlockWithChildren[][] = [];

  const config = useRuntimeConfig(event);
  const notion = new Client({ auth: config.notion.apiKey });

  for (const movie of movies) {
    const blocks = await getNotionBlocks(notion, movie.id);
    content.push(blocks);
  }

  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Alessandro Jean\'s Movie Comments',
    description: 'Just a personal movie blog.',
    authors: [{ name: 'Alessandro Jean' }],
    language: 'pt-BR',
    home_page_url: url,
    feed_url: `${url}/blog/feed.json`,
    icon: `${url}/img/apple-touch-icon.png`,
    items: movies.map((m, idx) => ({
      id: `${m.movieId}/${m.slug}`,
      url: `${url}/movie/${m.movieId}/${m.slug}`,
      title: `${m.title} (${m.year})`,
      summary: `Direção: ${list.format(m.director)} / Roteiro: ${list.format(m.writer)}`,
      content_html: parseMovieToHtml(m, content[idx]),
      date_published: new Date(m.published_at).toISOString(),
      date_modified: new Date(m.updated_at).toISOString(),
      language: 'pt-BR',
      image: m.cover,
    })),
  };
});
