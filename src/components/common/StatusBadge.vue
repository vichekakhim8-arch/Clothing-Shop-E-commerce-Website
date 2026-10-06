<template>
  <UiBadge :tone="tone" dot><span class="capitalize">{{ status }}</span></UiBadge>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: { status: String },
  computed: {
    tone () {
      return {
        pending: 'warn', confirmed: 'info', processing: 'info', shipped: 'info',
        delivered: 'ok', cancelled: 'danger', refunded: 'neutral', active: 'ok', inactive: 'neutral',
        approved: 'ok', hidden: 'neutral', archived: 'neutral', draft: 'warn'
      }[this.status] || 'neutral'
    }
  }
}
</script>
