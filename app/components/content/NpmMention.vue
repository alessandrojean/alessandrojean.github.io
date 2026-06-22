<template>
  <ContentMention
    :href="href"
    icon="simple-icons:npm"
  >
    {{ pkg }}
  </ContentMention>
</template>

<script lang="ts" setup>
import ContentMention from './Mention.vue';

const { pkg } = defineProps<{
  pkg: string;
}>();

const href = computed(() => `https://npmjs.com/package/${pkg}`);
</script>
