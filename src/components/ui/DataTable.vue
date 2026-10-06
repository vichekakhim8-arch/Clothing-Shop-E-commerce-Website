<template>
  <div class="card overflow-hidden">
    <div class="overflow-x-auto scroll-thin" :style="{ maxHeight: maxHeight }">
      <table class="dt w-full text-[13.5px] min-w-[680px]">
        <thead><tr><th v-for="c in columns" :key="c.key" :class="c.align === 'right' ? 'text-right' : ''" :style="c.w ? { width: c.w } : {}">{{ c.label }}</th></tr></thead>
        <tbody v-if="loading"><tr v-for="i in 6" :key="i"><td v-for="c in columns" :key="c.key"><div class="sk h-3 rounded w-4/5"></div></td></tr></tbody>
        <tbody v-else-if="rows.length"><tr v-for="(row, ri) in rows" :key="row.id || ri"><slot name="row" :row="row" :index="ri" /></tr></tbody>
      </table>
    </div>
    <EmptyState v-if="!loading && !rows.length" :title="emptyTitle" :text="emptyText" />
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: { columns: Array, rows: Array, loading: Boolean, emptyTitle: String, emptyText: String, maxHeight: { default: 'none' } }
}
</script>
