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
          :time="movie.published_at"
        />
        <PostHeaderInfoSeparator />
        <PostHeaderInfoAuthor />
      </PostHeaderInfo>
    </PostHeader>

    <BlockRenderer
      class="mt-10"
      :blocks="blocks"
      :id-map="movie.movies"
    >
      <template #before>
        <MovieCard
          :title="movie.title"
          :cover="movie.cover"
          :directors="movie.director"
          :writers="movie.writer"
          :copyright="movie.copyright"
          :tmdb="movie.tmdb!"
        />
      </template>

      <!-- <template #after>
        <MovieGrid
          :poster="movie.poster"
          :grid="movie.grid"
          :copyright="movie.copyright"
        />
      </template> -->
    </BlockRenderer>

    <PostFooter class="mt-12">
      <PostFooterNotByAiBadge />
      <PostFooterCopyright />
    </PostFooter>
  </article>
</template>

<script lang="ts" setup>
import 'katex/dist/katex.min.css';

import type { UserReview } from 'schema-dts';

import type { BlockWithChildren } from '~~/shared/types/notion';

const route = useRoute();
const { data: movie } = await useFetch(() => `/api/movies/${route.params.id}`);
const blocks = computed(() => movie.value?.blocks as BlockWithChildren[]);

const { socialMedia } = useAppConfig();

useSeoMeta({
  title: () => movie.value?.title,
  ogTitle: () => movie.value?.title,
  ogUrl: () => `https://alessandrojean.github.io/movie/${movie.value?.movieId}/${movie.value?.slug}`,
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
  'datePublished': movie.value?.published_at,
  'dateModified': movie.value?.updated_at,
  'inLanguage': 'pt-BR',
} satisfies UserReview]);

useHead({
  meta: [{ name: 'fediverse:creator', content: `@${socialMedia.mastodon}` }],
});
</script>
