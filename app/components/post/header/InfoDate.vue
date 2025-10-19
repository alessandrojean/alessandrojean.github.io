<template>
  <NuxtTime
    :datetime="time"
    :locale
    date-style="medium"
    time-zone="UTC"
  />
</template>

<script lang="ts" setup>
const { time, locale = 'en-US' } = defineProps<{
  time: string;
  locale?: string;
}>();
</script>
