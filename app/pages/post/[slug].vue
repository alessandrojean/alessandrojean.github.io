<template>
  <article
    v-if="post"
    class="w-full max-w-2xl mx-auto py-20"
    :lang="post.language"
  >
    <PostHeader>
      <PostHeaderBlogLink />
      <PostHeaderTitle>{{ post.title }}</PostHeaderTitle>

      <PostHeaderInfo class="-mt-2">
        <PostHeaderInfoDate :locale="post.language" :time="post.published_at" />
        <PostHeaderInfoSeparator />
        <PostHeaderInfoAuthor />
      </PostHeaderInfo>
    </PostHeader>
    
    <BlockRenderer
      class="mt-10"
      :blocks="post.blocks as BlockWithChildren[]"
      :id-map="post.posts"
    />

    <PostFooter class="mt-12">
      <PostFooterNotByAiBadge />
      <PostFooterCopyright />
    </PostFooter>
  </article>
</template>

<script lang="ts" setup>
import 'katex/dist/katex.min.css';
import type { BlogPosting, WithContext } from 'schema-dts'
import type { BlockWithChildren } from '~~/shared/types/notion'

const route = useRoute();
const { data: post } = await useFetch(() => `/api/posts/${route.params.slug}`);

const { socialMedia } = useAppConfig();

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.description,
  ogTitle: () => post.value?.title,
  ogUrl: () => `https://alessandrojean.github.io/post/${post.value?.slug}`,
  ogType: 'article',
  ogDescription: () => post.value?.description,
  ogLocale: () => post.value?.language,
  twitterCard: 'summary_large_image',
  twitterSite: `@${socialMedia.twitter}`,
  twitterCreator: `@${socialMedia.twitter}`,
  twitterTitle: () => post.value?.title,
  twitterDescription: () => post.value?.description,
});

const jsonLdPerson = useJsonLdPerson();
const jsonLdBlog = useJsonLdBlog();

const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  '@id': `https://alessandrojean.github.io/post/${post.value?.slug}`,
  'mainEntityOfPage': `https://alessandrojean.github.io/post/${post.value?.slug}`,
  'url': `https://alessandrojean.github.io/post/${post.value?.slug}`,
  'name': post.value?.title,
  'description': post.value?.description,
  'datePublished': post.value?.published_at,
  'dateModified': post.value?.updated_at,
  'author': jsonLdPerson,
  'isPartOf': jsonLdBlog,
  'keywords': post.value?.tags,
  'inLanguage': post.value?.language,
} satisfies WithContext<BlogPosting>));

useHead({
  meta: [{ name: 'fediverse:creator', content: `@${socialMedia.mastodon}` }],
  script: () => [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd.value) }],
});
</script>
