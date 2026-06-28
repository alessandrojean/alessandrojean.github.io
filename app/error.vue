<template>
  <NuxtLayout
    name="page"
    :title="error?.status?.toString(10) ?? '500'"
    :description="error?.message ?? error?.statusText"
  />
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{ error: NuxtError }>();
</script>
