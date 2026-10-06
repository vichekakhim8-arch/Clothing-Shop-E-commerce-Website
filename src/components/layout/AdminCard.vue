<template>
  <div class="card min-w-0">
    <div v-if="title" class="px-4 sm:px-5 py-4 hair-b flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <div class="min-w-0">
        <h3 class="display text-[13px] uppercase tracking-[.12em] font-semibold break-anywhere">{{ title }}</h3>
        <p v-if="subtitle" class="text-[12px] muted-2 mt-1 break-anywhere">{{ subtitle }}</p>
      </div>
      <slot name="actions" />
    </div>
    <div :class="pad ? 'p-4 sm:p-5' : ''" class="min-w-0"><slot /></div>
  </div>
</template>

<script>
export default {
  name: 'AdminCard',
  props: { title: String, subtitle: String, pad: { default: true } }
}
</script>
