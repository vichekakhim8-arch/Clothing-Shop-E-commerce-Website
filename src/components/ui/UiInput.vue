<template>
  <label class="block w-full">
    <span v-if="label" class="lbl">{{ label }}<span v-if="required" class="accent"> *</span></span>
    <span class="relative block">
      <UiIcon v-if="icon" :name="icon" :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 muted-2 pointer-events-none" />
      <input :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        :class="['field', icon ? 'has-icon' : '', error ? 'is-error' : '', valid && !error ? 'is-ok' : '']" />
    </span>
    <span v-if="error" class="text-[11.5px] mt-1.5 block" style="color:#D92D20">{{ error }}</span>
    <span v-else-if="hint" class="text-[11.5px] mt-1.5 block muted-2">{{ hint }}</span>
  </label>
</template>

<script>
export default {
  name: 'UiInput',
  props: {
    modelValue: [String, Number], label: String, icon: String, type: { default: 'text' },
    placeholder: String, error: String, hint: String, valid: Boolean, disabled: Boolean, required: Boolean
  },
  emits: ['update:modelValue']
}
</script>
