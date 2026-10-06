<template>
  <UiModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :title="title || $t('confirm')" size="sm">
    <div class="flex gap-4">
      <div class="w-10 h-10 flex items-center justify-center shrink-0 rounded-full"
        :style="{ background: danger ? 'rgba(217,45,32,.1)' : 'var(--soft)', color: danger ? '#D92D20' : 'var(--text)' }">
        <UiIcon name="alert" :size="18" />
      </div>
      <div>
        <p class="text-[14px] font-medium">{{ message || $t('confirmDelete') }}</p>
        <p class="text-[13px] muted mt-1">{{ $t('irreversible') }}</p>
      </div>
    </div>
    <template #footer>
      <UiButton variant="ghost" size="sm" @click="$emit('update:modelValue', false)">{{ $t('cancel') }}</UiButton>
      <UiButton :variant="danger ? 'danger' : 'primary'" size="sm" @click="$emit('confirm'); $emit('update:modelValue', false)">{{ confirmText || $t('delete') }}</UiButton>
    </template>
  </UiModal>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: { modelValue: Boolean, title: String, message: String, danger: { default: true }, confirmText: String },
  emits: ['update:modelValue', 'confirm']
}
</script>
