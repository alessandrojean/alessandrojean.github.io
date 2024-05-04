<script setup lang="ts">
import type { NotionApi } from '@/lib/notion';

type Icon = NonNullable<NotionApi.CalloutBlockObjectResponse['callout']['icon']>

defineProps<{ icon: Icon }>()
</script>

<template>
  <span 
    v-if="icon.type === 'emoji'"
    class="notion-icon size-5 text-xl inline-flex items-center justify-center font-emoji m-0 mt-1"
  >
    {{ icon.emoji }}
  </span>
  <NuxtImg
    v-if="icon.type === 'external'"
    class="notion-icon size-5 m-0 mt-1"
    :src="icon.external.url"
  />
</template>
