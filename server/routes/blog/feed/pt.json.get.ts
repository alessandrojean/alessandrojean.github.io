export default defineEventHandler(async (event) => {
  const posts = await listPosts(event, 'pt-BR');
  const feed = await buildJsonFeed(posts, 'pt-BR');

  setResponseHeader(event, 'Content-Type', 'application/feed+json');

  return feed;
});
