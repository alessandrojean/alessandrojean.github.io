<template>
  <div>
    <SiteHeader />

    <article
      v-if="post"
      class="py-20"
      :lang="post.language"
    >
      <PostHeader>
        <PostHeaderTitle>{{ post.title }}</PostHeaderTitle>

        <PostHeaderInfo class="-mt-2">
          <PostHeaderInfoDate
            :locale="post.language"
            :time="post.created_at"
          />
          <PostHeaderInfoSeparator />
          <PostHeaderInfoAuthor />
        </PostHeaderInfo>
      </PostHeader>

      <div class="mt-10">
        <ContentRenderer
          class="typography"
          :value="post"
        />
      </div>

      <PostFooter class="mt-12">
        <PostFooterDisclaimerNotByAi />
        <PostFooterCdPreviousDirectory />
        <PostFooterCopyright />
      </PostFooter>
    </article>
  </div>
</template>

<script lang="ts" setup>
import 'katex/dist/katex.min.css';

import type { ResolvableLink } from '@unhead/vue';

const slug = useRoute().params.slug as string;

const { data: post } = await useAsyncData(`post-${slug}`, () => {
  return queryCollection('blog')
    .where('path', 'LIKE', `%${slug}`)
    .first();
});

if (!post.value) {
  throw createError({
    status: 404,
    statusText: 'Page Not Found',
    message: `Page not found: /post/${slug}`,
  });
}

const language = computed(() => post.value?.language ?? 'pt-BR');
provide('language', language);

const { socialMedia } = useAppConfig();

function postSlug(path: string) {
  const [, _, fileName] = path.slice(1).split('/');
  return fileName!.slice(11);
}

function postLink(path?: string) {
  return path ? `/post/${postSlug(path)}` : '';
}

const { url } = useSiteConfig();

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.description,
  ogTitle: () => post.value?.title,
  ogUrl: () => url + postLink(post.value?.path).slice(1),
  ogType: 'article',
  ogDescription: () => post.value?.description,
  ogLocale: () => post.value?.language,
  twitterCard: 'summary_large_image',
  twitterTitle: () => post.value?.title,
  twitterDescription: () => post.value?.description,
  articleSection: () => post.value?.category,
  articleTag: () => post.value?.tags,
  articlePublishedTime: () => post.value?.created_at,
  articleModifiedTime: () => post.value?.updated_at,
  articleAuthor: [url],
});

defineOgImage(
  'BlogPost.takumi',
  {
    title: () => post.value?.title,
    category: () => post.value?.category,
    author: 'Alessandro Jean',
    avatar: url + '/img/avatar-okabe-small.webp',
    date: () => post.value?.created_at,
    language: () => post.value?.language,
  },
  post.value?.ogImage,
);

useSchemaOrg([
  defineArticle(() => ({
    '@type': 'BlogPosting',
    'headline': post.value?.title,
    'description': post.value?.description,
    'datePublished': post.value?.created_at,
    'dateModified': post.value?.updated_at,
    'keywords': post.value?.tags,
    'inLanguage': post.value?.language,
    'author': [{
      '@id': `${url}#identity`,
      'name': 'Alessandro Jean',
      'url': url,
    }],
  })),
]);

useHead({
  meta: [{ name: 'fediverse:creator', content: `@${socialMedia.mastodon}` }],
  link: () => {
    const links: ResolvableLink[] = [
      {
        rel: 'alternate',
        type: 'text/markdown',
        title: 'Markdown',
        href: `https://raw.githubusercontent.com/alessandrojean/alessandrojean.github.io/refs/heads/master/content${post.value?.path}.md`,
      },
    ];

    if (post.value?.alternate) {
      const postLanguage = post.value.language ?? 'pt-BR';
      const hreflang = postLanguage === 'pt-BR' ? 'en-US' : 'pt-BR';

      links.push({
        rel: 'alternate',
        hreflang,
        href: `${url}post/${post.value.alternate}`,
      });
    }

    return links;
  },
  htmlAttrs: {
    lang: () => post.value?.language,
  },
});
</script>
