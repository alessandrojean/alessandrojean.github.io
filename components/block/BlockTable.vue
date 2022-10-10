<script setup lang="ts">
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { format, value, pass } = useNotionParser(props)

const hasHeaderColumn = computed(() => {
  return format.value?.table_block_column_header
})

const columns = computed(() => {
  return format.value?.table_block_column_order
})

const headerRow = computed(() => {
  return props.blockMap[value.value.content[0]].value
})

function header(columnId: string) {
  return headerRow.value?.properties?.[columnId] ?? [[' ', false]]
}
</script>

<template>
  <div class="notion-simple-table-wrapper">
    <table class="notion-simple-table">
      <thead v-if="hasHeaderColumn">
        <tr>
          <th
            v-for="(columnId, columnIndex) in columns"
            :key="columnIndex"
            class="notion-simple-table-header"
          >
            <BlockTextRenderer :text="header(columnId)" v-bind="pass" />
          </th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>