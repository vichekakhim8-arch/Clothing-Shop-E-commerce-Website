<template>
  <svg ref="bc" class="block w-full" :style="{ maxWidth: '100%' }"></svg>
</template>

<script>
import JsBarcode from 'jsbarcode'

export default {
  name: 'BarCode',
  props: { value: String, height: { default: 52 }, width: { default: 1.7 }, showText: { default: true } },
  watch: { value () { this.render() } },
  mounted () { this.render() },
  methods: {
    render () {
      const el = this.$refs.bc
      if (!el || !this.value) return
      const txt = String(this.value).replace(/[^A-Za-z0-9\-]/g, '')
      try {
        JsBarcode(el, txt, {
          format: 'CODE128', height: this.height, width: this.width,
          displayValue: this.showText, fontSize: 12, font: 'Inter, sans-serif', textMargin: 6,
          margin: 0, background: 'transparent', lineColor: '#000000'
        })
      } catch (e) { /* invalid value — leave blank */ }
    }
  }
}
</script>
