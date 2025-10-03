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
      <h2 class="text-gray-500 dark:text-gray-400 text-sm">{{ year }}</h2>

      <ul>
        <li
          v-for="post in posts"
          :key="post.id"
          class="text-xl my-3"
        >
          <NuxtLink
            :to="`/post/${post.slug}`"
            :lang="post.language"
            :aria-labelledby="`${post.id}-title`"
            class="opacity-80 hover:opacity-100 transition-opacity flex flex-col md:flex-row md:items-center gap-1 md:gap-2"
          >
            <span v-if="!post.is_public" class="text-sm hidden md:inline-flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 w-12 h-5 -ml-14">
              Private
            </span>
            <span :id="`${post.id}-title`">
              {{ post.title }}
            </span>
            <span class="text-base text-gray-500 dark:text-gray-400">
              <NuxtTime :datetime="post.published_at" locale="en-US" day="numeric" month="short" time-zone="UTC" />
              <template v-if="post.category">
                <span class="text-gray-400 dark:text-gray-500"> · </span>
                <span>{{ post.category.name }}</span>
              </template>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { Blog, BlogPosting, WithContext } from 'schema-dts'

const { data: posts } = await useFetch('/api/posts');

const postsByYear = computed(() => {
  if (!posts.value) {
    return undefined;
  }

  const byYear = Object.groupBy(posts.value, (post) => post.published_at.slice(0, 4));

  return Object.entries(byYear)
    .map(([y, ps]) => ({ year: y, posts: ps }))
    .reverse();
});

const jsonLdBlog = useJsonLdBlog();
const jsonLdPerson = useJsonLdSimplePerson();

const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  ...jsonLdBlog,
  'author': jsonLdPerson,
  'blogPost': (posts.value ?? []).map(p => ({
    '@type': 'BlogPosting',
    '@id': `https://alessandrojean.github.io/post/${p.slug}`,
    'mainEntityOfPage': `https://alessandrojean.github.io/post/${p.slug}`,
    'url': `https://alessandrojean.github.io/post/${p.slug}`,
    'name': p.title,
    'description': p.description,
    'datePublished': p.published_at,
    'dateModified': p.updated_at,
    'author': jsonLdPerson,
    'keywords': p.tags,
    'inLanguage': p.language,
  } satisfies BlogPosting)),
} satisfies WithContext<Blog>));

useSeoMeta({ title: 'Blog' });
useHead({
  link: [
    { rel: 'alternate', type: 'application/rss+xml', title: 'RSS', href: '/blog/feed.rss' },
    { rel: 'alternate', type: 'application/feed+json', title: 'RSS', href: '/blog/feed.json' },
  ],
  script: () => [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd.value) }],
})
</script>
