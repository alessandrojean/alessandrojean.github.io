<template>
  <figure data-type="image">
    <NuxtImg
      :alt="title"
      :src="cover"
      densities="x1"
      placeholder
      format="webp"
      loading="lazy"
    />

    <figcaption>
      Direção: {{ directors.join(', ') }}
      / Roteiro: {{ writersText }}
      / <NuxtLink external :href="tmdb" target="_blank">TMDB</NuxtLink>
      <br >
      Copyright {{ copyright }}.
    </figcaption>
  </figure>
</template>

<script lang="ts" setup>
const { writers } = defineProps<{
  title: string;
  cover: string;
  directors: string[];
  writers: string[];
  tmdb: string;
  copyright: string;
}>();

const writersText = computed(() => {
  if (writers.length <= 2) {
    return writers.join(' e ');
  }

  return `${writers[0]} e outros`;
});
</script>
