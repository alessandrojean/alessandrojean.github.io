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
      <PostFooterNotByAiBadge />
      <PostFooterCopyright />
    </PostFooter>
  </article>
</template>

<script lang="ts" setup>
import 'katex/dist/katex.min.css';

const slug = useRoute().params.slug as string;

const { data: post } = await useAsyncData(`post-${slug}`, () => {
  return queryCollection('blog')
    .where('path', 'LIKE', `%${slug}`)
    .first();
});

const { socialMedia } = useAppConfig();

function postSlug(path: string) {
  const [, _, fileName] = path.slice(1).split('/');
  return fileName!.slice(11);
}

function postLink(path?: string) {
  return path ? `/post/${postSlug(path)}` : '';
}

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.description,
  ogTitle: () => post.value?.title,
  ogUrl: () => `https://alessandrojean.github.io/${postLink(post.value?.path)}`,
  ogType: 'article',
  ogDescription: () => post.value?.description,
  ogLocale: () => post.value?.language,
  twitterCard: 'summary_large_image',
  twitterTitle: () => post.value?.title,
  twitterDescription: () => post.value?.description,
});

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
      '@id': 'https://alessandrojean.github.io/#identity',
      'name': 'Alessandro Jean',
      'url': 'https://alessandrojean.github.io',
    }],
  })),
]);

useHead({
  meta: [{ name: 'fediverse:creator', content: `@${socialMedia.mastodon}` }],
});
</script>
