export default defineEventHandler(async (event) => {
  const posts = await listPosts(event);
  const feed = await buildJsonFeed(event, posts);

  setResponseHeader(event, 'Content-Type', 'application/feed+json');

  return feed;
});
