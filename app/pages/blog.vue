<template>
  <div class="pb-20">
    <PageHeader>
      <PageHeaderTitle>Blog</PageHeaderTitle>
      <PageHeaderDescription>
        All posts in cronological order.
      </PageHeaderDescription>
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
              <template v-if="post.category">
                <span class="text-gray-400 dark:text-gray-500"> · </span>
                <span>{{ post.category }}</span>
              </template>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>
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

useSchemaOrg(() => [{
  '@type': 'Blog',
  'name': 'Alessandro Jean Blog',
  'author': {
    '@id': 'https://alessandrojean.github.io/#identity',
    'name': 'Alessandro Jean',
    'url': 'https://alessandrojean.github.io',
  },
  'blogPost': (data.value ?? []).map((p) => {
    const link = postLink(p.path);

    return ({
      '@type': 'BlogPosting',
      '@id': `https://alessandrojean.github.io/${link}`,
      'mainEntityOfPage': `https://alessandrojean.github.io/${link}`,
      'url': `https://alessandrojean.github.io/${link}`,
      'headline': p.title,
      'description': p.description,
      'datePublished': p.created_at,
      'dateModified': p.updated_at,
      'author': {
        '@id': 'https://alessandrojean.github.io/#identity',
        'name': 'Alessandro Jean',
        'url': 'https://alessandrojean.github.io',
      },
      'keywords': p.tags,
      'inLanguage': p.language,
    } satisfies BlogPosting);
  }),
} satisfies Blog]);

useSeoMeta({ title: 'Blog' });
useHead({
  link: [
    { rel: 'alternate', type: 'application/rss+xml', title: 'Feed (RSS)', href: '/blog/feed.xml' },
    { rel: 'alternate', type: 'application/feed+json', title: 'Feed (JSON)', href: '/blog/feed.json' },
  ],
});
</script>
