<template>
<div class="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
  <div class="text-center max-w-xl mx-auto no-print">
    <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style="background:var(--ok-soft); color:var(--ok)"><UiIcon name="check" :size="26" :sw="2"/></div>
    <h1 class="display text-[clamp(24px,5vw,36px)] font-semibold uppercase mt-6">{{$t('orderSuccess')}}</h1>
    <p class="text-[14px] muted mt-3">{{$t('thankYou')}}. We sent a confirmation email with your receipt and tracking details.</p>
  </div>
  <div v-if="order" class="grid lg:grid-cols-[1fr_420px] gap-8 mt-10 items-start">
    <div class="space-y-4 no-print order-2 lg:order-1">
      <div class="card p-5 sm:p-6">
        <p class="eyebrow mb-4">{{$t('orderSummary')}}</p>
        <div class="flex justify-between py-2 text-[13.5px] gap-3"><span class="muted">{{$t('orderRef')}}</span><span class="font-semibold mono-num">{{order.id}}</span></div>
        <div class="flex justify-between py-2 text-[13.5px] gap-3"><span class="muted">{{$t('date')}}</span><span class="mono-num">{{order.date}}</span></div>
        <div class="flex justify-between py-2 text-[13.5px] gap-3"><span class="muted">{{$t('paymentMethod')}}</span><span class="uppercase">{{payLabel}}</span></div>
        <div class="flex justify-between py-2 text-[13.5px] gap-3"><span class="muted">{{$t('status')}}</span><StatusBadge :status="order.status"/></div>
        <div class="flex justify-between py-2 text-[15px] font-semibold hair-t mt-2 pt-3"><span>{{$t('total')}}</span><span class="mono-num">{{$money(order.total)}}</span></div>
      </div>
      <div v-if="order.payment==='qr' && order.status==='pending'" class="flex justify-center sm:justify-start">
        <KhqrPanel :amount="order.total" :bill="order.id.replace('#','')" @paid="markPaid"/>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <UiButton :to="'/order/'+encodeURIComponent(order.id)" size="lg" class="flex-1">{{$t('orderDetail')}}</UiButton>
        <UiButton variant="secondary" size="lg" to="/shop" class="flex-1">{{$t('continueShopping')}}</UiButton>
      </div>
    </div>
    <div class="order-1 lg:order-2"><OrderReceipt :order="order"/></div>
  </div>
</div>
</template>

<script>
import { toast } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'OrderSuccessView',
  computed: {
    order () { return this.$s.orders.find(o => o.id === this.$route.query.id) || this.$s.orders[0] },
    payLabel () { return { cod: t('cod'), bank: t('bank'), qr: 'KHQR' }[this.order.payment] || this.order.payment }
  },
  methods: { markPaid () { this.order.status = 'confirmed'; toast(t('paymentConfirmed')) } }
}
</script>
