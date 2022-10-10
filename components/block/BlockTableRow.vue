<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { pass, parent, properties } = useNotionParser(props)

const hasHeaderColumn = computed(() => {
  return parent.value?.value?.format?.table_block_column_header
})

const hasHeaderRow = computed(() => {
  return parent.value?.value?.format?.table_block_row_header
})

const columns = computed(() => {
  return parent.value?.value?.format?.table_block_column_order
})

const isHeaderRow = computed(() => {
  return hasHeaderColumn.value && props.contentId === parent.value.value.content[0]
})

function cell(columnId: string) {
  return properties.value?.[columnId] ?? [[' ', false]]
}

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
      v-for="(columnId, columnIndex) in columns"
      :key="columnIndex"
      :is="isHeader(columnIndex) ? 'th' : 'td'"
      class="notion-simple-table-data"
    >
      <BlockTextRenderer :text="cell(columnId)" v-bind="pass" />
    </component>
  </tr>
</template>
