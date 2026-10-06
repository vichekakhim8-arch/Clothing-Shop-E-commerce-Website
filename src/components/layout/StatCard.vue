<template>
  <div class="card px-5 pt-5 pb-6 flex flex-col">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="eyebrow">{{ label }}</p>
        <p class="stat-num mt-2.5">{{ value }}</p>
        <p v-if="delta !== undefined" class="text-[12px] mt-2 flex items-center gap-1" :style="{ color: delta >= 0 ? 'var(--ok)' : '#D92D20' }">
          <UiIcon :name="delta >= 0 ? 'chevronU' : 'chevronD'" :size="12" />
          <span class="mono-num">{{ Math.abs(delta) }}%</span>
          <span class="muted-2">{{ $t('vsLastMonth') }}</span>
        </p>
      </div>
      <span class="w-9 h-9 flex items-center justify-center rounded-[3px] shrink-0" style="background:var(--soft)"><UiIcon :name="icon" :size="17" /></span>
    </div>
    <div v-if="data" class="mt-5 pt-1"><MiniChart :data="data" :height="34" /></div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: { label: String, value: String, delta: Number, icon: String, data: Array }
}
</script>
