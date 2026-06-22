<template>
  <div class="pb-16">
    <SiteHeader />

    <PageHeader>
      <PageHeaderTitle>Blog</PageHeaderTitle>
      <PageHeaderDescription>
        All posts in chronological order.
      </PageHeaderDescription>

      <!-- <div class="flex items-center gap-1 -ml-2.5 mt-4">
        <PageHeaderHomeLink />
        <PageHeaderRssLink />
      </div> -->
    </PageHeader>

    <section
      v-for="({ posts, year }) in postsByYear"
      :key="year"
      class="mt-12 first-of-type:mt-0"
    >
      <h2 class="text-gray-500 dark:text-gray-400 text-sm">
        {{ year }}
      </h2>

      <ul>
        <li
          v-for="post in posts"
          :key="post.id"
          class="text-xl my-3"
        >
          <NuxtLink
            :to="postLink(post.path)"
            :lang="post.language"
            :aria-labelledby="`${post.id}-title`"
            class="opacity-80 hover:opacity-100 transition-opacity flex flex-col md:flex-row md:items-center gap-1 md:gap-2"
          >
            <span :id="`${post.id}-title`">
              {{ post.title }}
            </span>
            <span class="text-base text-gray-500 dark:text-gray-400">
              <NuxtTime
                :datetime="post.created_at"
                locale="en-US"
                day="numeric"
                month="short"
                time-zone="UTC"
              />
              <!-- <template v-if="post.category">
                <span class="text-gray-400 dark:text-gray-500"> · </span>
                <span>{{ post.category }}</span>
              </template> -->
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <PostFooter class="mt-12">
      <PostFooterCdPreviousDirectory to="/" />
      <PostFooterCopyright />
    </PostFooter>
  </div>
</template>

<script lang="ts" setup>
import type { Blog, BlogPosting } from 'schema-dts';

const { data } = await useAsyncData('posts', () => {
  return queryCollection('blog')
    .select('title', 'path', 'id', 'created_at', 'updated_at', 'category', 'language', 'description', 'tags')
    .order('created_at', 'DESC')
    .all();
});

const postsByYear = computed(() => {
  if (!data.value) {
    return undefined;
  }

  const byYear = Object.groupBy(data.value, post => post.created_at.slice(0, 4));

  return Object.entries(byYear)
    .map(([y, ps]) => ({ year: y, posts: ps }))
    .reverse();
});

function postSlug(path: string) {
  const [, _, fileName] = path.slice(1).split('/');
  return fileName!.slice(11);
}

function postLink(path: string) {
  return `/post/${postSlug(path)}`;
}

const { url } = useSiteConfig();

defineOgImage('Page.takumi', {
  title: 'Blog',
  subtitle: 'All posts in chronological order.',
  author: 'Alessandro Jean',
  avatar: url + '/img/avatar-okabe-small.webp',
  role: url,
});

useSchemaOrg(() => [{
  '@type': 'Blog',
  'name': 'Alessandro Jean Blog',
  'author': {
    '@id': `${url}#identity`,
    'name': 'Alessandro Jean',
    'url': url,
  },
  'blogPost': (data.value ?? []).map((p) => {
    const link = postLink(p.path).slice(1);

    return ({
      '@type': 'BlogPosting',
      '@id': `${url}${link}`,
      'mainEntityOfPage': `${url}/${link}`,
      'url': `${url}/${link}`,
      'headline': p.title,
      'description': p.description,
      'datePublished': p.created_at,
      'dateModified': p.updated_at,
      'author': {
        '@id': `${url}/#identity`,
        'name': 'Alessandro Jean',
        'url': url,
      },
      'keywords': p.tags,
      'inLanguage': p.language,
    } satisfies BlogPosting);
  }),
} satisfies Blog]);

useSeoMeta({
  title: 'Blog',
  description: 'All posts in chronological order.',
  ogTitle: 'Blog',
  ogDescription: 'All posts in chronological order.',
  ogType: 'article',
  ogLocale: 'pt-BR',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Blog',
  twitterDescription: 'All posts in chronological order.',
});

useHead({
  link: [
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Feed (RSS)',
      href: '/blog/feed.xml',
    },
    {
      rel: 'alternate',
      type: 'application/feed+json',
      title: 'Feed (JSON)',
      href: '/blog/feed.json',
    },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'English-only Feed (RSS)',
      href: '/blog/feed/en.xml',
    },
    {
      rel: 'alternate',
      type: 'application/feed+json',
      title: 'English-only Feed (JSON)',
      href: '/blog/feed/en.json',
    },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Portuguese-only Feed (RSS)',
      href: '/blog/feed/pt.xml',
    },
    {
      rel: 'alternate',
      type: 'application/feed+json',
      title: 'Portuguese-only Feed (JSON)',
      href: '/blog/feed/pt.json',
    },
  ],
});
</script>
