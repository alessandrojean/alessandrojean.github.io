---
title: Generating an RSS feed with Nuxt Content
category: Programming
description: My process on how to do
language: en-US
created_at: 2026-06-16
updated_at: 2026-06-17T00:09:00
tags:
  - nuxt
  - nuxt content
  - remark
  - rehype
  - rss
---

Providing an RSS feed when you're using Nuxt Content isn't really a hard task, but you may find some harsh obstacles on the way.

## Generating the feed

We will first start by creating the server route which will serve the RSS. Usually it's convenient to put the feed in the same post where you content is. For example, if your post list is at `/blog`, the path `/blog/feed.xml` seems like a good place.

In Nuxt, we can create such a route by creating the file `server/routes/blog/feed.xml.get.ts`. 

::caution
This isn't an API route, so it shouldn't be placed at `/server/api`.
::

The skeleton of the file is basically this:

```ts [feed.xml.get.ts]
import { queryCollection } from '@nuxt/content/server';

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'blog')
    .order('created_at', 'DESC')
    .limit(10)
    .all();

  return posts;
});
```

What we want to do is manipulate the posts in such a way that the route actually returns a readable RSS feed. We can use the package [rss](https://www.npmjs.com/package/rss) to help us, as it contains an RSS builder which will make things easier.

We will need to use the `RSS` class.

```ts [feed.xml.get.ts]
import RSS from 'rss';
```

To get started, we need to create the feed and provide some basic information.

```ts [feed.xml.get.ts]
const url = 'https://example.org';

const feed = new RSS({
  title: 'Example Blog',
  description: 'Just a blog.',
  site_url: url,
  feed_url: `${url}/blog/feed.xml`,
  language: 'en-US',
  custom_elements: [
    { icon: `${url}/img/apple-touch-icon.png` },
  ],
  custom_namespaces: {
    content: 'http://purl.org/rss/1.0/modules/content/',
    dc: 'http://purl.org/dc/elements/1.1/',
    sy: 'http://purl.org/rss/1.0/modules/syndication/',
  },
});
```

Some of the properties are pretty straightfoward. Other's are just complements, such as `custom_namespaces`, which allows the generated XML to have extra tags that are not in the RSS specification.

Since we have the array of posts, we can iterate over it to create each feed item.

```ts [feed.xml.get.ts]
for (const post of posts) {
  feed.item({
    title: post.title,
    guid: `${url}/post/${post.path}`,
    url: `${url}/post/${post.path}`,
    description: post.description,
    date: new Date(post.created_at),
    categories: post.category ? [post.category] : undefined,
    custom_elements: [
      { 'dc:creator': { _cdata: 'John Doe' } },
    ],
  });
}
```

Now that the feed is complete, we need to define the `Content-Type` header.

```ts [feed.xml.get.ts]
setResponseHeader(event, 'Content-Type', 'text/xml');
```

Then we can finally return the XML feed.

```ts [feed.xml.get.ts]
return feed.xml();
```

You can have a look at [this site's RSS](/blog/feed.xml){target="_blank"} for an example.

## Prerendering

If your site is deployed with an server, you're done. But if it is deployed as an static site, such when you use GitHub Pages, you need one additional step.

We need to inform Nuxt to also prerender this server route during build. This can be done by editing the `nitro` property in `nuxt.config.ts`.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/blog/feed.xml'],
    },
  },
});
```

## Informing RSS readers about the feed

You can put a link to the RSS feed in your page, but this will only work for the reader to click and copy it in their RSS reader manually. You can make things easier a bit by providing a `<link rel="alternate">` tag in your HTML `<head>`.

With this, if the reader just paste your blog URL in the RSS reader, it can get the RSS link automatically. In Nuxt, this can be done with the `useHead` composable.

```ts [blog.vue]
useHead({
  link: [{ 
    rel: 'alternate', 
    type: 'application/rss+xml', 
    title: 'Feed (RSS)', 
    href: '/blog/feed.xml',
  }],
});
```

This is not mandatory, but it is considered a good practice.

## Providing the post HTML

The current feed will work fine for all readers, but we're just providing the links, there's no body for the posts. While most sites do just that, I think it's nice to also provide the full post content, so the reader can read in their preferred environment.

This is the most tricky part to do with Nuxt Content. As in the moment of writing this article, Nuxt Content doesn't seem to have a method to return your post rendered HTML in the server context. You need to do this **manually**.

Nuxt Content uses :github-mention{repo="nuxt-content/mdc"} under the hoods, which then uses :github-mention{repo="remarkjs/remark"} and :github-mention{repo="rehypejs/rehype"}.

If you take a look into the `post.body` property, it is a Minimark AST. We could use the `minimark` package to get the Markdown string, but I faced some converting issues when doing that. It is easier if you get the Markdown source file content directly instead.

To make things reusable, we will create a server util function `markdownToHtml`.

```ts [utils/markdown.ts]
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function markdownToHtml(fileName: string) {
  const filePath = join(process.cwd(), 'content', `${fileName}.md`);
  const markdown = await readFile(filePath, 'utf-8');
}
```

The tricky part is creating a Unified pipeline to do a similar conversion that Nuxt Content does. We can get started by importing the plugins.

```ts [utils/markdown.ts]
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdc from 'remark-mdc';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
```

And then doing the pipeline.

```ts [utils/markdown.ts]
const result = await unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ['yaml'])
  .use(remarkGfm)
  .use(remarkMdc)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeStringify)
  .process(markdown);

return String(result);
```

This will parse the Markdown, generate an AST, which will then be converted to HAST and processed until it is joined to a final HTML string.

For most cases, this may do the job, but MDC supports Vue components, which is a problem. The approach I choose was to convert the components I use into simpler and equivalent ones by using just HTML existing tags.

If you have any component into your Markdown, this existing pipeline will put it in the HTML as if it is a custom element. For example, `Note.vue`, called by `::note` in your Markdown, will be outputted as `<note></note>`, which is not an existing HTML element.

We can circumvent this by using the :github-mention{repo="marekweb/rehype-components"} plugin. We will also need to install the `hastscript` package.

What this plugin does is converting custom elements into other you specify. We can put in the pipeline with the following code.

```ts [utils/markdown.ts]
.use(rehypeComponents, {
  components: {
    'note': Note,
  },
})
```

And then we create the `Note` component replacement. In this case, the `Note` element is originally a callout. The approach I choosed was to transform it into a `<div>` with a `<p><strong>Note:</strong></p>` as the first child.

The `Note` component can be defined as so:

```ts [utils/markdown.ts]
import { h } from 'hastscript';
import type { ComponentFunction } from 'rehype-components';

const Note: ComponentFunction = (_, children) => h('div', [
  h('p', h('strong', 'Note:')),
  ...children,
]);
```

For example, the following `Note` block in Markdown

```mdc
::note
This is a note
::
```

Will be transformed into the following HTML:

```html
<div>
  <p><strong>Note:</strong></p>
  <p>This is a note</p>
</div>
```

As you might have guessed, you will need to do that for each custom Vue component you use in your Markdown files.

With the function completed, we can put the result into each feed item:

```ts [feed.xml.get.ts]
feed.item({
  title: post.title,
  guid: `${url}/post/${slug}`,
  url: `${url}/post/${slug}`,
  description: post.description,
  date: new Date(post.created_at),
  categories: post.category ? [post.category] : undefined,
  custom_elements: [
    { 'dc:creator': { _cdata: 'John Doe' } },
    { 'content:encoded': { _cdata: await markdownToHtml(post.path) } }, // [!CODE ++]
  ],
});
```

Now the RSS feed is fully complete with your posts' content as well.

## Other approach I have considered

The alternative idea I had to solve this issue was using one of the Nuxt hooks after the build. You can write a custom script to parse the `/blog` generated HTML to get the links, and then parse the each post generated file to get the text part.

This will likely do the job, but depending on your custom components, you might get a dirty HTML than just parsing the Markdown. For example, some of the `<pre>` blocks I use here are customized to include a fancier window around it with the file name and also a button to copy the code content. If you don't handle these edge cases, the RSS headers might not render the content in a desirable way.

## Conclusion

Would be nice if the Nuxt team provides an easier way to do this, as RSS feeds are still very helpful and used by some people. Maybe with a potential rewrite of the module to use Comark they implement it? Who knows.
