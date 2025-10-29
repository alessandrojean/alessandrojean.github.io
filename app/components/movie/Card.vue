<template>
  <div class="typography">
    <figure data-type="image">
      <NuxtImg
        :alt="title"
        :src="cover"
        densities="x1"
        placeholder
        format="webp"
        loading="lazy"
        preload
      />

      <figcaption>
        Direção: {{ list.format(directors) }}
        / Roteiro: {{ writersText }}
        / <NuxtLink
          external
          :href="tmdb"
          target="_blank"
        >TMDB</NuxtLink>
        <br>
        Copyright {{ copyright }}.
      </figcaption>
    </figure>
  </div>
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

const list = new Intl.ListFormat('pt-BR', { type: 'conjunction' });

const writersText = computed(() => {
  if (writers.length <= 2) {
    return list.format(writers);
  }

  return `${writers[0]} e outros`;
});
</script>
