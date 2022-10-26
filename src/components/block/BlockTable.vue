<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser'
import type {
  TableBlockObjectResponse,
  TableRowBlockObjectResponse
} from '@/lib/notion'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, pass } = useNotionParser<TableBlockObjectResponse>(toRefs(props))

const hasHeaderColumn = computed(() => {
  return block.value?.table.has_column_header
})

const columns = computed(() => block.value?.content)

const headerRow = computed(() => {
  return props.blockMap[columns.value[0]] as TableRowBlockObjectResponse
})

function header(columnIndex: number) {
  return headerRow.value?.table_row.cells[columnIndex]
}
</script>

<template>
  <div class="notion-simple-table-wrapper">
    <table class="notion-simple-table w-auto mx-auto">
      <thead v-if="hasHeaderColumn">
        <tr>
          <th
            v-for="(columnId, columnIndex) in columns"
            :key="columnIndex"
            class="notion-simple-table-header"
          >
            <BlockTextRenderer :text="header(columnIndex)" v-bind="pass" />
          </th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>