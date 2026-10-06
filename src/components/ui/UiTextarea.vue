<template>
  <label class="block w-full">
    <span v-if="label" class="lbl">{{ label }}</span>
    <textarea class="field" :rows="rows" :placeholder="placeholder" :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"></textarea>
  </label>
</template>

<script>
export default {
  name: 'UiTextarea',
  props: { modelValue: String, label: String, rows: { default: 4 }, placeholder: String },
  emits: ['update:modelValue']
}
</script>
