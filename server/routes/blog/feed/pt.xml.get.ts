export default defineEventHandler(async (event) => {
  const posts = await listPosts(event, 'pt-BR');
  const feed = await buildXmlFeed(event, posts, 'pt-BR');

  setResponseHeader(event, 'Content-Type', 'text/xml');

  return feed;
});
