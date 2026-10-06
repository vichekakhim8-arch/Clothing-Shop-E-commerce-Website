<template>
  <!-- KHQR payment ticket : authentic NBC / Bakong card layout -->
  <div class="khqr-card">
    <div class="khqr-head">
      <span class="khqr-logo">KHQR</span>
      <span class="khqr-head-sub">{{ $t('scanToPay') }}</span>
    </div>
    <div class="px-5 pt-3 pb-4 text-center">
      <p class="text-[11.5px] font-medium tracking-wide truncate" style="color:#6B6B72">{{ $s.settings.storeName }}</p>
      <div class="flex items-baseline justify-center gap-1.5 mt-1.5">
        <span class="khqr-amt">{{ amtMain }}</span>
        <span class="text-[13px] font-semibold" style="color:#6B6B72">{{ curr }}</span>
      </div>
    </div>
    <div class="khqr-perf"><span class="khqr-notch left"></span><span class="khqr-notch right"></span></div>
    <div class="px-5 pt-5 pb-4 flex flex-col items-center">
      <div class="khqr-frame"><i class="kc1"></i><i class="kc2"></i>
        <KhqrCode :amount="amount" :bill="bill" :key="seed" :size="188" />
        <div v-if="expired" class="absolute inset-0 flex flex-col items-center justify-center gap-2.5 rounded-[10px]" style="background:rgba(255,255,255,.96)">
          <UiIcon name="clock" :size="20" style="color:#D92D20" />
          <p class="text-[12.5px] font-medium" style="color:#111">{{ $t('khqrExpired') }}</p>
          <button class="btn btn-sm btn-primary" @click="refresh"><UiIcon name="refresh" :size="14" />{{ $t('refreshQr') }}</button>
        </div>
      </div>
      <div class="flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full text-[11.5px]"
        :style="expired ? { background: 'rgba(217,45,32,.1)', color: '#D92D20' } : { background: '#F4F4F2', color: '#5A5A60' }">
        <UiIcon name="clock" :size="12" /><span>{{ $t('expiresIn') }}</span><span class="mono-num font-semibold">{{ mmss }}</span>
      </div>
    </div>
    <div class="mx-5 px-4 py-3.5 rounded-[8px] space-y-2 text-[11.5px]" style="background:#F8F8F6">
      <div class="flex justify-between gap-3"><span style="color:#82828A">{{ $t('merchant') }}</span>
        <span class="font-medium truncate flex items-center gap-1" style="color:#1A1A1A">{{ $s.settings.storeName }}
          <UiIcon name="check" :size="11" :sw="3" style="color:#1A8754" /></span></div>
      <div class="flex justify-between gap-3"><span style="color:#82828A">{{ $t('orderRef') }}</span>
        <span class="mono-num truncate" style="color:#1A1A1A">{{ bill }}</span></div>
      <div class="flex justify-between gap-3"><span style="color:#82828A">{{ $t('transactionId') }}</span>
        <span class="mono-num truncate" style="color:#1A1A1A">{{ ref }}</span></div>
    </div>
    <div class="px-5 pt-4 pb-5">
      <button class="khqr-btn" :disabled="expired || verifying" @click="confirm">
        <span v-if="verifying" class="khqr-spin"></span>
        <UiIcon v-else name="check" :size="16" />{{ verifying ? $t('verifying') + '…' : $t('simulatePaid') }}
      </button>
      <p v-if="!compact" class="text-[11.5px] mt-3 leading-relaxed text-center" style="color:#82828A">{{ $t('khqrHint') }}</p>
      <div class="flex items-center justify-center gap-1.5 mt-4 pt-3.5 text-[9px] tracking-[.1em] text-center leading-tight"
        style="border-top:1px solid #ECECEA; color:#A0A0A8">
        <UiIcon name="lock" :size="9" />POWERED BY BAKONG · NBC
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/stores'
import { toast } from '@/utils/helpers'

export default {
  name: 'KhqrPanel',
  props: { amount: { default: 0 }, bill: String, compact: Boolean },
  emits: ['paid'],
  data: () => ({ left: 300, seed: 0, timer: null, verifying: false }),
  computed: {
    expired () { return this.left <= 0 },
    curr () { return store.settings.currency || 'USD' },
    amtMain () { return Number(this.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    ref () { return 'TXN' + String(this.bill || '').replace(/\D/g, '').slice(-6).padStart(6, '0') },
    mmss () {
      const m = Math.max(0, Math.floor(this.left / 60)), s = Math.max(0, this.left % 60)
      return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
    }
  },
  mounted () { this.timer = setInterval(() => { if (this.left > 0) this.left-- }, 1000) },
  unmounted () { clearInterval(this.timer) },
  methods: {
    refresh () { this.left = 300; this.seed++; toast('New KHQR generated') },
    confirm () { this.verifying = true; setTimeout(() => { this.verifying = false; this.$emit('paid') }, 1100) }
  }
}
</script>
