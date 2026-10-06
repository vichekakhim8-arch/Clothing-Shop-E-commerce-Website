<template>
  <div class="py-10 px-6">
    <div class="space-y-3 max-w-xl mx-auto">
      <div v-for="i in rows" :key="i" class="sk h-3.5 rounded" :style="{ width: (100 - i * 7) + '%' }"></div>
    </div>
    <p class="text-center text-[12.5px] muted-2 mt-6">{{ text || $t('loading') }}…</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingState',
  props: { rows: { default: 4 }, text: String }
}
</script>
