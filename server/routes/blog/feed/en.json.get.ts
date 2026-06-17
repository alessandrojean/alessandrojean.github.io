export default defineEventHandler(async (event) => {
  const posts = await listPosts(event, 'en-US');
  const feed = await buildJsonFeed(posts, 'en-US');

  setResponseHeader(event, 'Content-Type', 'application/feed+json');

  return feed;
});
