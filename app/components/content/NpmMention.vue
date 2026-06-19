<template>
  <a
    :href="href"
    target="_blank"
    data-slot="inline-mention"
  >
    <Icon name="simple-icons:npm" />
    <span class="leading-none">{{ pkg }}</span>
  </a>
</template>

<script lang="ts" setup>
const { pkg } = defineProps<{
  pkg: string;
}>();

const href = computed(() => `https://npmjs.com/package/${pkg}`);
</script>
