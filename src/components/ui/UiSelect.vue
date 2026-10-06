<template>
  <label class="block w-full">
    <span v-if="label" class="lbl">{{ label }}</span>
    <select class="field" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
      <option v-for="o in norm" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
  </label>
</template>

<script>
export default {
  name: 'UiSelect',
  props: { modelValue: [String, Number], label: String, options: { type: Array, default: () => [] } },
  emits: ['update:modelValue'],
  computed: { norm () { return this.options.map(o => typeof o === 'object' ? o : { value: o, label: o }) } }
}
</script>
