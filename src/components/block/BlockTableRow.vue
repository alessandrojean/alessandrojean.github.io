<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser';
import type { NotionApi } from '@/lib/notion';

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, pass, parent } = useNotionParser<NotionApi.TableRowBlockObjectResponse>(toRefs(props))

const table = computed(() => {
  return parent.value as NotionApi.TableBlockObjectResponse & { content: string[] }
})

const hasHeaderColumn = computed(() => {
  return table.value?.table.has_column_header
})

const hasHeaderRow = computed(() => {
  return table.value?.table.has_row_header
})

const cells = computed(() => {
  return block.value.table_row.cells
})

const isHeaderRow = computed(() => {
  return hasHeaderColumn.value && props.contentId === table.value.content[0]
})

function isHeader(columnIndex: number) {
  return (
    (hasHeaderColumn.value && props.contentIndex === 0) ||
    (hasHeaderRow.value && columnIndex === 0)
  )
}
</script>

<template>
  <tr
    class="notion-simple-table-row"
    v-if="!isHeaderRow"
  >
    <component
      v-for="(cell, cellIndex) in cells"
      :key="cellIndex"
      :is="isHeader(cellIndex) ? 'th' : 'td'"
      class="notion-simple-table-data slashed-zero tabular-nums"
    >
      <BlockTextRenderer :text="cell" v-bind="pass" />
    </component>
  </tr>
</template>
