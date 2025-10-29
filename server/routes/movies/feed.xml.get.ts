import { queryCollection } from '@nuxt/content/server';
import RSS from 'rss';

export default defineEventHandler(async (event) => {
  const movies = await queryCollection(event, 'movies')
    .order('created_at', 'DESC')
    .limit(10)
    .all();
  const url = 'https://alessandrojean.github.io';

  const feed = new RSS({
    title: 'Alessandro Jean\'s Movie Comments',
    description: 'Just a personal movie blog.',
    site_url: url,
    feed_url: `${url}/movies/feed.xml`,
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

  const list = new Intl.ListFormat('pt-BR', { type: 'conjunction' });

  for (const movie of movies) {
    const path = movie.path.replace('/movies/', '/movie/');

    feed.item({
      title: `${movie.title} (${movie.year})`,
      guid: `${url}/${path}`,
      url: `${url}/${path}`,
      description: `Direção: ${list.format(movie.director)} / Roteiro: ${list.format(movie.writer)}`,
      date: new Date(movie.created_at),
      enclosure: {
        url: movie.cover,
      },
      custom_elements: [
        { 'dc:creator': { _cdata: 'Alessandro Jean' } },
        // { 'content:encoded': { _cdata: parseMovieToHtml(movie, content[idx]) } },
      ],
    });
  }

  setResponseHeader(event, 'Content-Type', 'text/xml');
  return feed.xml();
});
