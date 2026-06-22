<template>
  <NuxtLink
    external
    :href="href"
    target="_blank"
    rel="noopener noreferrer external"
    data-slot="inline-mention"
  >
    <Icon :name="icon" />
    <span class="leading-none">
      <slot />
    </span>
  </NuxtLink>
</template>

<script lang="ts" setup>
const { icon = 'lucide:at-sign' } = defineProps<{
  icon?: string;
  href: string;
}>();
</script>
