<template>
  <span class="inline-flex items-center gap-[3px]">
    <span v-for="i in 5" :key="i"
      :style="{ color: i <= Math.round(value) ? 'var(--text)' : 'var(--line)', cursor: interactive ? 'pointer' : 'default' }"
      @click="interactive && $emit('select', i)">
      <svg :width="size" :height="size" viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.6l1.1-6L3.4 9.4l6-.8z"/></svg>
    </span>
    <span v-if="count !== undefined" class="text-[12px] muted-2 ml-1.5 mono-num">({{ count }})</span>
  </span>
</template>

<script>
export default {
  name: 'StarRating',
  props: { value: { default: 0 }, size: { default: 13 }, count: Number, interactive: Boolean },
  emits: ['select']
}
</script>
