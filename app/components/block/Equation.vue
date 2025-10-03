<template>
  <div data-slot="equation" class="[&_.katex-display]:!my-0" v-html="equation" />
</template>

<script lang="ts" setup>
import katex from 'katex';
import type { EquationBlockObjectResponse } from '@notionhq/client';

const { block } = defineProps<{ block: EquationBlockObjectResponse }>();
const equation = computed(() => {
  return katex.renderToString(block.equation.expression, { displayMode: true });
});
</script>
