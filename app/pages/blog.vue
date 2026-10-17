<template>
  <div>
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
            :aria-labelledby="`${postSlug(post.path)}-title`"
            class="relative opacity-80 hover:opacity-100 transition-opacity flex flex-col md:flex-row md:items-center gap-1 md:gap-2"
          >
            <span
              v-if="post.language === 'pt-BR'"
              class="hidden md:block absolute -left-2 -translate-x-full top-1/2 -translate-y-1/2 text-xs/none bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 px-1.5 py-1 rounded-sm"
            >
              <span class="sr-only">[</span>
              Português
              <span class="sr-only">]</span>
            </span>

            <span :id="`${postSlug(post.path)}-title`">
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
  </div>
</template>

<script lang="ts" setup>
import type { Blog, BlogPosting } from 'schema-dts';

const title = 'Blog';
const description = 'All posts in chronological order.';

definePageMeta({
  layout: {
    name: 'page',
    props: { title, description },
  },
});

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

  const byYear = Object.groupBy(data.value, (post) => {
    return post.created_at.slice(0, 4);
  });

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
  title,
  subtitle: description,
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
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogLocale: 'pt-BR',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
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
