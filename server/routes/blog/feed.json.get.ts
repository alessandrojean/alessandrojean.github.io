import { queryCollection } from '@nuxt/content/server';

type Item = {
  id: string;
  url: string;
  title: string;
  content_html: string;
  date_published: string;
  date_modified: string;
  tags: string[];
  language: string;
};

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'blog')
    .order('created_at', 'DESC')
    .limit(10)
    .all();
  const url = 'https://alessandrojean.github.io';

  setResponseHeader(event, 'Content-Type', 'application/feed+json');

  const items: Item[] = [];

  for (const post of posts) {
    const [, _, fileName] = post.path.slice(1).split('/');
    const slug = fileName!.slice(11);

    items.push({
      id: slug,
      url: `${url}/post/${slug}`,
      title: post.title,
      content_html: await markdownToHtml(post.path),
      date_published: new Date(post.created_at).toISOString(),
      date_modified: post.updated_at
        ? new Date(post.updated_at).toISOString()
        : new Date(post.created_at).toISOString(),
      tags: [post.category],
      language: post.language ?? 'pt-BR',
    });
  }

  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Alessandro Jean\'s Blog',
    description: 'Just a personal blog.',
    authors: [{ name: 'Alessandro Jean' }],
    language: 'pt-BR',
    home_page_url: `${url}/blog`,
    feed_url: `${url}/blog/feed.json`,
    icon: `${url}/img/apple-touch-icon.png`,
    items,
  };
});
