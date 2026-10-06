<template>
  <div class="inline-flex flex-col items-center" :style="{ width: size + 'px', maxWidth: '100%' }">
    <div class="relative" style="background:#fff; width:100%">
      <canvas ref="cv" :width="size" :height="size" class="block" style="width:100%;height:auto;max-width:100%"></canvas>
      <span class="absolute inset-0 m-auto flex items-center justify-center pointer-events-none"
        :style="{ width: (size * 0.22) + 'px', height: (size * 0.22) + 'px' }">
        <span class="flex items-center justify-center w-full h-full rounded-[7px]" style="background:#E21A23; box-shadow:0 0 0 4px #fff">
          <span class="text-white font-bold" :style="{ fontSize: (size * 0.05) + 'px', letterSpacing: '.03em', fontFamily: 'Space Grotesk, sans-serif' }">KHQR</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { buildKHQR } from '@/utils/khqr'
import { store } from '@/stores'

export default {
  name: 'KhqrCode',
  props: { amount: { default: 0 }, currency: { default: 'USD' }, bill: String, size: { default: 216 } },
  emits: ['payload'],
  data: () => ({ payload: '' }),
  watch: { amount () { this.render() }, bill () { this.render() } },
  mounted () { this.render() },
  methods: {
    render () {
      const k = store.settings.khqr || {}
      this.payload = buildKHQR({
        amount: this.amount, currency: this.currency, billNumber: this.bill,
        merchantName: k.merchantName || store.settings.storeName, bakongId: k.accountId, city: k.city || 'Phnom Penh'
      })
      this.$emit('payload', this.payload)
      const cv = this.$refs.cv
      if (!cv) return
      /* High EC level so the centre KHQR emblem never breaks scannability */
      QRCode.toCanvas(cv, this.payload, {
        width: this.size, margin: 0, errorCorrectionLevel: 'H',
        color: { dark: '#0A0A0A', light: '#FFFFFF' }
      }, () => {})
    }
  }
}
</script>
