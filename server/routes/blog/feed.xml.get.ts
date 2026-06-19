export default defineEventHandler(async (event) => {
  const posts = await listPosts(event);
  const feed = await buildXmlFeed(event, posts);

  setResponseHeader(event, 'Content-Type', 'text/xml');

  return feed;
});
