export default defineEventHandler(async (event) => {
  const posts = await listPosts(event, 'en-US');
  const feed = await buildJsonFeed(event, posts, 'en-US');

  setResponseHeader(event, 'Content-Type', 'application/feed+json');

  return feed;
});
