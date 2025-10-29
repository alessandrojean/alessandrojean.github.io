<template>
  <div class="pb-20">
    <PageHeader>
      <PageHeaderTitle>Filmes</PageHeaderTitle>
      <PageHeaderDescription>
        Minhas impressões sobre filmes que assisti.
      </PageHeaderDescription>
    </PageHeader>

    <section
      v-for="({ movies, yearMonth }) in moviesByMonth"
      :key="yearMonth"
      class="mt-12 first-of-type:mt-0"
    >
      <h2 class="text-gray-500 dark:text-gray-400 text-sm">
        {{ yearMonth }}
      </h2>

      <ul>
        <li
          v-for="movie in movies"
          :key="movie.id"
          class="text-xl my-3"
        >
          <NuxtLink
            :to="movieLink(movie.path)"
            :aria-labelledby="`${movie.id}-title`"
            class="opacity-80 hover:opacity-100 transition-opacity flex flex-col md:flex-row md:items-center gap-1 md:gap-2"
          >
            <span :id="`${movie.id}-title`">
              {{ movie.title }} ({{ movie.year }})
            </span>
            <span class="text-base text-gray-500 dark:text-gray-400">
              <NuxtTime
                :datetime="movie.created_at"
                :time-zone="movie.created_at.includes('T') ? undefined : 'UTC'"
                locale="pt-BR"
                day="numeric"
                month="short"
              />
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts" setup>
// import type { Blog, BlogPosting, WithContext } from 'schema-dts'

const { data } = await useAsyncData('movies', () => {
  return queryCollection('movies')
    .select('title', 'year', 'created_at', 'path', 'id')
    .order('created_at', 'DESC')
    .all();
});

const formatter = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' });

const moviesByMonth = computed(() => {
  if (!data.value) {
    return undefined;
  }

  const byYear = Object.groupBy(data.value, movie => movie.created_at.slice(0, 7));

  return Object.entries(byYear).map(([ym, ps]) => {
    const formatted = formatter.format(new Date(`${ym}-02`))!;

    return ({
      yearMonth: formatted[0]!.toUpperCase() + formatted.substring(1),
      movies: ps,
    });
  });
});

function movieLink(path: string) {
  const [, date, slug] = path.slice(1).split('/');
  return `/movie/${date}/${slug}`;
}

useSchemaOrg([
  defineWebPage(() => ({
    '@type': 'CollectionPage',
  })),
]);

useSeoMeta({ title: 'Filmes' });

useHead({
  link: [
    { rel: 'alternate', type: 'application/rss+xml', title: 'Feed (RSS)', href: '/movies/feed.xml' },
    { rel: 'alternate', type: 'application/feed+json', title: 'Feed (JSON)', href: '/movies/feed.json' },
  ],
});
</script>
