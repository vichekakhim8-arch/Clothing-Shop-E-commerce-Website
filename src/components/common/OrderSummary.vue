<template>
  <div class="card p-6 h-max">
    <h3 class="display text-[14px] uppercase tracking-[.14em] font-semibold">{{ $t('orderSummary') }}</h3>
    <div class="mt-5 space-y-3 text-[13.5px]">
      <div class="flex justify-between"><span class="muted">{{ $t('subtotal') }}</span><span class="mono-num">{{ $money(sub) }}</span></div>
      <div v-if="disc" class="flex justify-between"><span class="muted">{{ $t('discount') }}</span><span class="accent mono-num">−{{ $money(disc) }}</span></div>
      <div v-if="coupon" class="flex justify-between"><span class="muted">{{ $t('coupon') }} · {{ $s.coupon.code }}</span><span class="accent mono-num">−{{ $money(coupon) }}</span></div>
      <div class="flex justify-between"><span class="muted">{{ $t('shipping') }}</span><span class="mono-num">{{ ship ? $money(ship) : $t('free') }}</span></div>
    </div>
    <div v-if="showCoupon" class="mt-5 pt-5 hair-t">
      <div v-if="!$s.coupon" class="flex">
        <input v-model="code" :placeholder="$t('coupon') + ' code'" class="field uppercase" style="border-radius:6px 0 0 6px" :disabled="locked" />
        <button class="btn btn-md btn-secondary" style="border-radius:0 6px 6px 0" :disabled="locked" @click="applyCoupon">{{ $t('apply') }}</button>
      </div>
      <div v-else class="flex items-center justify-between hair px-3 py-2.5 rounded-[6px]" style="border-style:dashed">
        <span class="text-[13px] font-medium tracking-wide flex items-center gap-2"><UiIcon name="ticket" :size="14" />{{ $s.coupon.code }}</span>
        <button class="btn-icon" :disabled="locked" @click="$s.coupon = null"><UiIcon :name="locked ? 'lock' : 'x'" :size="14" /></button>
      </div>
      <p v-if="locked" class="text-[11.5px] mt-2 flex items-center gap-1.5" style="color:var(--warn)"><UiIcon name="lock" :size="11" />{{ $t('couponLocked') }}</p>
      <p v-else class="text-[11.5px] muted-2 mt-2">WELCOME10 · SHX25 · FREESHIP</p>
    </div>
    <div class="flex justify-between items-baseline mt-5 pt-5 hair-t">
      <span class="display text-[14px] uppercase tracking-wide font-semibold">{{ $t('total') }}</span>
      <span class="display text-[24px] font-bold mono-num">{{ $money(total) }}</span>
    </div>
    <div class="mt-5"><slot /></div>
    <div class="flex items-center gap-2 mt-4 text-[11.5px] muted-2"><UiIcon name="lock" :size="13" />Secure checkout · SSL encrypted</div>
  </div>
</template>

<script>
import { cartSubtotal, cartDiscount, couponValue, shipFee, cartTotal, toast, money } from '@/utils/helpers'

export default {
  name: 'OrderSummary',
  props: { showCoupon: Boolean, locked: Boolean },
  data: () => ({ code: '' }),
  computed: {
    sub () { return cartSubtotal.value }, disc () { return cartDiscount.value },
    coupon () { return couponValue.value }, ship () { return shipFee.value }, total () { return cartTotal.value }
  },
  methods: {
    applyCoupon () {
      const c = this.$s.coupons.find(x => x.code.toLowerCase() === this.code.trim().toLowerCase())
      if (!c) return toast('Invalid coupon code', 'error')
      if (c.status !== 'active') return toast('This coupon is not active', 'error')
      if (cartSubtotal.value < c.min) return toast('Minimum order ' + money(c.min) + ' required', 'error')
      this.$s.coupon = c; this.code = ''; toast('Coupon applied — ' + c.code)
    }
  }
}
</script>
