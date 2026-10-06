<template>
<div class="max-w-[1100px] mx-auto px-4 sm:px-8 py-10 lg:py-14" v-if="o">
  <router-link to="/orders" class="flex items-center gap-2 text-[12px] uppercase tracking-[.14em] link-u mb-6"><UiIcon name="arrowL" :size="14"/>{{$t('orders')}}</router-link>
  <div class="flex flex-wrap items-center gap-4">
    <h1 class="display text-[clamp(22px,4vw,32px)] font-semibold mono-num">{{o.id}}</h1><StatusBadge :status="o.status"/>
    <span class="text-[13px] muted ml-auto mono-num">{{o.date}}</span>
  </div>
  <div class="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 mt-8">
    <div class="space-y-6 min-w-0">
      <div class="card overflow-hidden">
        <p class="eyebrow p-5 pb-0">Items</p>
        <div v-for="(it,i) in o.items" :key="i" class="flex gap-4 p-5 hair-b last:border-0">
          <img :src="it.image" class="w-16 h-20 object-cover"/>
          <div class="flex-1">
            <router-link :to="'/product/'+it.pid" class="text-[14px] font-medium hover:opacity-60">{{it.name}}</router-link>
            <p class="text-[12px] muted mt-1">{{it.size}} · {{it.color}} · ×{{it.qty}}</p>
          </div>
          <span class="font-medium mono-num">{{$money(it.price*it.qty)}}</span>
        </div>
      </div>
      <div class="card p-5">
        <p class="eyebrow mb-4">Timeline</p>
        <div v-for="(tl,i) in o.timeline" :key="i" class="flex gap-4 pb-5 last:pb-0 relative">
          <span class="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style="background:var(--text)"></span>
          <span v-if="i<o.timeline.length-1" class="absolute left-[4.5px] top-5 bottom-0 w-px" style="background:var(--line)"></span>
          <div><p class="text-[13.5px] font-medium">{{tl.label}}</p><p class="text-[12px] muted-2 mono-num">{{o.date}} · {{tl.at}}</p></div>
        </div>
      </div>
    </div>
    <div class="space-y-4 sticky-col">
      <div class="card p-5">
        <p class="eyebrow mb-3">{{$t('shippingAddress')}}</p>
        <p class="text-[13.5px] font-medium">{{o.customer}}</p>
        <p class="text-[13px] muted mt-1.5 leading-relaxed">{{o.address.line}}<br/>{{o.address.city}}, {{o.address.province}} {{o.address.postal}}</p>
        <p class="text-[13px] muted mt-2">{{o.phone}}</p>
      </div>
      <div class="card p-5 space-y-2.5 text-[13.5px]">
        <p class="eyebrow mb-3">{{$t('orderSummary')}}</p>
        <div class="flex justify-between"><span class="muted">{{$t('subtotal')}}</span><span class="mono-num">{{$money(o.subtotal)}}</span></div>
        <div class="flex justify-between"><span class="muted">{{$t('discount')}}</span><span class="accent mono-num">−{{$money(o.discount)}}</span></div>
        <div class="flex justify-between"><span class="muted">{{$t('shipping')}}</span><span class="mono-num">{{o.shipping?$money(o.shipping):$t('free')}}</span></div>
        <div class="flex justify-between pt-3 hair-t font-semibold text-[15px]"><span>{{$t('total')}}</span><span class="mono-num">{{$money(o.total)}}</span></div>
        <p class="text-[12px] muted-2 pt-2 uppercase">{{$t('paymentMethod')}}: {{o.payment==='qr'?'KHQR':o.payment}}</p>
      </div>
      <div v-if="o.payment==='qr' && o.status==='pending'" class="flex justify-center">
        <KhqrPanel :amount="o.total" :bill="o.id.replace('#','')" compact @paid="markPaid"/>
      </div>
      <UiButton block variant="secondary" @click="receipt=true" icon="fileText">{{$t('viewReceipt')}}</UiButton>
    </div>
  </div>
  <ReceiptModal v-model="receipt" :order="o"/>
</div>
<div v-else class="max-w-md mx-auto py-24"><EmptyState :title="$t('noOrders')" action-to="/orders" :action-label="$t('orders')"/></div>
</template>

<script>
import { toast } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'OrderDetailView',
  data: () => ({ receipt: false }),
  computed: { o () { return this.$s.orders.find(x => x.id === decodeURIComponent(this.$route.params.id)) } },
  methods: { markPaid () { this.o.status = 'confirmed'; toast(t('paymentConfirmed')) } }
}
</script>
