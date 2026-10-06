<template>
  <component :is="to ? 'router-link' : 'button'" :to="to" :type="to ? null : type" :disabled="disabled"
    :class="['btn focus-ring', 'btn-' + size, 'btn-' + variant, block ? 'w-full' : '']">
    <UiIcon v-if="icon" :name="icon" :size="size === 'sm' ? 15 : 17" /><slot />
  </component>
</template>

<script>
export default {
  name: 'UiButton',
  props: {
    variant: { default: 'primary' }, size: { default: 'md' }, to: null,
    icon: String, block: Boolean, disabled: Boolean, type: { default: 'button' }
  }
}
</script>
