<script setup lang="ts">
import type { NotionApi } from '@/lib/notion'

const props = defineProps<{ icon: NotionApi.CalloutBlockObjectResponse['callout']['icon'] }>()

const { twemojiUrl } = useEmoji()
</script>

<template>
  <img
    v-if="icon.type === 'emoji'"
    class="notion-page-icon w-5 h-5 m-0 mt-1"
    :src="twemojiUrl(icon.emoji)"
    :alt="icon.emoji"
    :aria-label="icon.emoji"
  />
</template>