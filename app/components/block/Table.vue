<template>
  <div data-slot="table">
    <table>
      <thead v-if="hasHeaderColumn">
        <tr>
          <th
            v-for="(cell, idx) in headerRow.table_row.cells"
            :key="idx"
            data-slot="table-header"
          >
            <BlockTextRenderer :rich-text="cell" :id-map />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in dataRows" :key="row.id">
          <component
            :is="hasHeaderRow && idx == 0 ? 'th' : 'td'"
            v-for="(cell, idx) in row.table_row.cells"
            :key="idx"
            :data-slot="hasHeaderRow && idx == 0 ? 'table-header' : 'table-data'"
          >
            <BlockTextRenderer :rich-text="cell" :id-map />
          </component>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { TableBlockObjectResponse, TableRowBlockObjectResponse } from '@notionhq/client'
import type { WithChildren } from '~~/shared/types/notion'

type TableBlock = WithChildren<TableBlockObjectResponse>;

const { block, idMap } = defineProps<{ 
  block: TableBlock;
  idMap: Record<string, string>;
}>();

const hasHeaderColumn = computed(() => block.table.has_column_header);
const hasHeaderRow = computed(() => block.table.has_row_header);

const headerRow = computed(() => block.children![0] as TableRowBlockObjectResponse);
const dataRows = computed(() => {
  const rows = (block.children ?? []) as TableRowBlockObjectResponse[];
  return hasHeaderColumn.value ? rows.slice(1) : rows;
})
</script>
