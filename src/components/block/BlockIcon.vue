<script setup lang="ts">
import type { NotionApi } from '@/lib/notion';

defineProps<{ icon: NotionApi.CalloutBlockObjectResponse['callout']['icon'] }>()

const { twemojiUrl } = useEmoji()
</script>

<template>
  <NuxtImg
    v-if="icon!!.type === 'emoji'"
    class="notion-page-icon size-5 m-0 mt-1"
    :src="twemojiUrl(icon!!.emoji)"
    :alt="icon!!.emoji"
    :aria-label="icon!!.emoji"
  />
</template>
