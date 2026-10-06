<template>
  <UiModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :title="$t('receipt')" size="sm">
    <OrderReceipt v-if="order" :order="order" />
  </UiModal>
</template>

<script>
export default {
  name: 'ReceiptModal',
  props: { modelValue: Boolean, order: Object },
  emits: ['update:modelValue']
}
</script>
