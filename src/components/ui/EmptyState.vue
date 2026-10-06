<template>
  <div class="flex flex-col items-center justify-center text-center py-16 px-6">
    <div class="w-14 h-14 rounded-full flex items-center justify-center mb-4" style="background:var(--soft); color:var(--text-3)">
      <UiIcon :name="icon" :size="22" />
    </div>
    <h4 class="display text-[15px] font-semibold uppercase tracking-wide">{{ title || $t('noData') }}</h4>
    <p v-if="text" class="text-[13.5px] muted mt-1.5 max-w-xs">{{ text }}</p>
    <UiButton v-if="actionLabel" class="mt-5" size="sm" variant="secondary" :to="actionTo" @click="$emit('action')">{{ actionLabel }}</UiButton>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: { icon: { default: 'box' }, title: String, text: String, actionLabel: String, actionTo: null },
  emits: ['action']
}
</script>
