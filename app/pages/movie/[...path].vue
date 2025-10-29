<template>
  <article
    v-if="movie"
    class="w-full max-w-2xl mx-auto py-20"
  >
    <PostHeader>
      <PostHeaderBlogLink to="/movies">
        Movies
      </PostHeaderBlogLink>
      <PostHeaderTitle>{{ movie.title }}</PostHeaderTitle>

      <PostHeaderInfo class="-mt-2">
        <PostHeaderInfoDate
          locale="pt-BR"
          :time="movie.created_at"
        />
        <PostHeaderInfoSeparator />
        <PostHeaderInfoAuthor />
      </PostHeaderInfo>
    </PostHeader>

    <div class="mt-10">
      <MovieCard
        :title="movie.title"
        :cover="movie.cover"
        :directors="movie.director"
        :writers="movie.writer"
        :copyright="movie.copyright"
        :tmdb="movie.tmdb!"
      />

      <ContentRenderer
        class="typography mt-6"
        :value="movie"
      />
    </div>

    <PostFooter class="mt-12">
      <PostFooterNotByAiBadge />
      <PostFooterCopyright />
    </PostFooter>
  </article>
</template>

<script lang="ts" setup>
import type { UserReview } from 'schema-dts';

const path = useRoute().params.path as string[];
const { data: movie } = await useAsyncData(`movie-${path.join('-')}`, () => {
  return queryCollection('movies')
    .path(`/movies/${path.join('/')}`)
    .first();
});

const { socialMedia } = useAppConfig();

useSeoMeta({
  title: () => movie.value?.title,
  ogTitle: () => movie.value?.title,
  ogUrl: () => `https://alessandrojean.github.io/movie/${path.join('/')}`,
  ogType: 'article',
  ogLocale: 'pt-BR',
  ogImage: () => movie.value?.cover,
  twitterCard: 'summary_large_image',
  twitterSite: `@${socialMedia.twitter}`,
  twitterCreator: `@${socialMedia.twitter}`,
  twitterTitle: () => movie.value?.title,
  twitterImage: () => movie.value?.cover,
});

useSchemaOrg(() => [{
  '@type': 'UserReview',
  'itemReviewed': {
    '@type': 'Movie',
    'name': movie.value?.title,
    'director': movie.value?.director.map(name => ({
      '@type': 'Person',
      name,
    })),
    'author': movie.value?.writer.map(name => ({
      '@type': 'Person',
      name,
    })),
    'image': movie.value?.cover,
    'sameAs': movie.value?.tmdb ? [movie.value.tmdb] : undefined,
    'copyrightNotice': movie.value?.copyright,
  },
  'author': {
    '@id': 'https://alessandrojean.github.io/#identity',
    'name': 'Alessandro Jean',
    'url': 'https://alessandrojean.github.io',
  },
  'datePublished': movie.value?.created_at,
  'dateModified': movie.value?.updated_at,
  'inLanguage': 'pt-BR',
} satisfies UserReview]);

useHead({
  meta: [{ name: 'fediverse:creator', content: `@${socialMedia.mastodon}` }],
});
</script>
