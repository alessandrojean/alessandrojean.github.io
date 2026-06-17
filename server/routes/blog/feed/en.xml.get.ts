export default defineEventHandler(async (event) => {
  const posts = await listPosts(event, 'en-US');
  const feed = await buildXmlFeed(posts, 'en-US');

  setResponseHeader(event, 'Content-Type', 'text/xml');

  return feed;
});
