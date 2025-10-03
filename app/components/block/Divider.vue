<template>
  <hr data-slot="divider">
</template>

<script lang="ts" setup>
import type { DividerBlockObjectResponse } from '@notionhq/client';

defineProps<{ block: DividerBlockObjectResponse }>();
</script>
