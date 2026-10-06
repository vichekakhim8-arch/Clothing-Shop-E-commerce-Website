<template>
  <button type="button" @click="$emit('update:modelValue', !modelValue)" class="flex items-center gap-3 focus-ring">
    <span class="w-9 h-5 rounded-full relative transition-all" :style="{ background: modelValue ? 'var(--text)' : 'var(--line)' }">
      <span class="absolute top-[3px] w-3.5 h-3.5 rounded-full transition-all" :style="{ background: 'var(--bg)', left: modelValue ? '18px' : '3px' }"></span>
    </span>
    <span v-if="label" class="text-[13px]">{{ label }}</span>
  </button>
</template>

<script>
export default {
  name: 'UiSwitch',
  props: { modelValue: Boolean, label: String },
  emits: ['update:modelValue']
}
</script>
