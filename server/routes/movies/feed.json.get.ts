export default defineEventHandler(async (event) => {
  const movies = await getNotionMovies(event);
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
    items: movies.map(m => ({
      id: `${m.movieId}/${m.slug}`,
      url: `${url}/movie/${m.movieId}/${m.slug}`,
      title: `${m.title} (${m.year})`,
      summary: `Direção: ${list.format(m.director)} / Roteiro: ${list.format(m.writer)}`,
      content_html: `<p>Leia o conteúdo completo <a href="${url}/movies/${m.movieId}/${m.slug}">no site</a>.</p>`,
      date_published: new Date(m.published_at).toISOString(),
      date_modified: new Date(m.updated_at).toISOString(),
      language: 'pt-BR',
      image: m.cover,
    })),
  };
});
