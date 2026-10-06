<template>
<div v-if="o">
  <AdminHead :title="o.id" :subtitle="o.date+' · '+o.itemCount+' items'">
    <UiButton variant="ghost" size="sm" to="/admin/orders" icon="arrowL">{{$t('orders')}}</UiButton>
    <select v-model="o.status" class="field h-9 w-auto text-[13px] capitalize" @change="$toast('Status → '+o.status)">
      <option v-for="s in statuses" :key="s" :value="s">{{s}}</option></select>
    <ExportMenu :title="'Invoice '+o.id" :filename="'invoice-'+o.id.replace('#','')" :headers="exHeaders" :rows="exRows" :meta="exMeta"/>
  </AdminHead>
  <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
    <div class="space-y-4 min-w-0">
      <AdminCard :title="$t('products')" :pad="false">
        <div v-for="(it,i) in o.items" :key="i" class="flex items-center gap-4 p-4 hair-b last:border-0">
          <img :src="it.image" class="w-12 h-16 object-cover"/>
          <div class="flex-1 min-w-0"><p class="text-[13.5px] font-medium">{{it.name}}</p>
            <p class="text-[12px] muted-2 mt-0.5">{{it.size}} · {{it.color}}</p></div>
          <span class="text-[13px] mono-num muted">×{{it.qty}}</span>
          <span class="text-[13.5px] font-medium mono-num w-20 text-right">{{$money(it.price*it.qty)}}</span>
        </div>
        <div class="p-5 space-y-2.5 text-[13.5px]" style="background:var(--panel-2)">
          <div class="flex justify-between"><span class="muted">{{$t('subtotal')}}</span><span class="mono-num">{{$money(o.subtotal)}}</span></div>
          <div class="flex justify-between"><span class="muted">{{$t('discount')}}</span><span class="accent mono-num">−{{$money(o.discount)}}</span></div>
          <div class="flex justify-between"><span class="muted">{{$t('shipping')}}</span><span class="mono-num">{{o.shipping? $money(o.shipping):$t('free')}}</span></div>
          <div class="flex justify-between pt-3 hair-t font-semibold text-[15px]"><span>{{$t('total')}}</span><span class="mono-num">{{$money(o.total)}}</span></div>
        </div>
      </AdminCard>
      <AdminCard :title="$t('orderTimeline')">
        <div class="flex gap-4 pb-5 last:pb-0 relative" v-for="(tl,i) in o.timeline" :key="i">
          <span class="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style="background:var(--text)"></span>
          <span v-if="i<o.timeline.length-1" class="absolute left-[4.5px] top-5 bottom-0 w-px" style="background:var(--line)"></span>
          <div><p class="text-[13.5px] font-medium">{{tl.label}}</p><p class="text-[12px] muted-2 mono-num">{{o.date}} · {{tl.at}}</p></div>
        </div>
        <div class="flex gap-2 mt-2">
          <input v-model="note" class="field" :placeholder="$t('addNote')" @keyup.enter="addNote"/>
          <UiButton size="md" variant="secondary" @click="addNote"><UiIcon name="plus" :size="15"/></UiButton>
        </div>
      </AdminCard>
    </div>
    <div class="space-y-4">
      <AdminCard :title="$t('customerInformation')">
        <p class="text-[13.5px] font-medium">{{o.customer}}</p>
        <p class="text-[13px] muted mt-1">{{o.email}}</p><p class="text-[13px] muted">{{o.phone}}</p>
        <router-link v-if="o.customerId" to="/admin/customers" class="text-[12px] link-u accent mt-3 inline-block">{{$t('seeDetails')}}</router-link>
      </AdminCard>
      <AdminCard :title="$t('shippingAddress')">
        <p class="text-[13px] muted leading-relaxed">{{o.address.line}}<br/>{{o.address.city}}, {{o.address.province}}<br/>{{o.address.postal}}</p>
      </AdminCard>
      <AdminCard :title="$t('paymentMethod')">
        <div class="flex items-center gap-3"><UiIcon name="card" :size="18"/>
          <div><p class="text-[13.5px] font-medium uppercase">{{o.payment==='qr'?'KHQR':o.payment}}</p>
            <p class="text-[12px] muted-2">{{o.status==='delivered'?'Paid':'Awaiting settlement'}}</p></div></div>
        <div v-if="o.payment==='qr'" class="mt-4 pt-4 hair-t flex justify-center">
          <KhqrCode :amount="o.total" :bill="o.id.replace('#','')" :size="168"/></div>
      </AdminCard>
      <UiButton block variant="secondary" icon="fileText" @click="receipt=true">{{$t('viewReceipt')}}</UiButton>
      <UiButton block variant="danger" icon="x" @click="confirm=true">{{$t('cancelOrder')}}</UiButton>
    </div>
  </div>
  <ReceiptModal v-model="receipt" :order="o"/>
  <ConfirmModal v-model="confirm" :message="'Cancel order '+o.id+'?'" :confirm-text="$t('cancelOrder')" @confirm="o.status='cancelled'; $toast('Order cancelled','info')"/>
</div>
<div v-else class="card"><EmptyState :title="$t('noOrders')" action-to="/admin/orders" :action-label="$t('orders')"/></div>
</template>

<script>
import { STATUSES } from '@/utils/data'
import { toast, money } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'AdminOrderDetailView',
  data: () => ({ statuses: STATUSES, note: '', confirm: false, receipt: false }),
  computed: {
    o () { return this.$s.orders.find(x => x.id === decodeURIComponent(this.$route.params.id)) },
    exHeaders () { return ['Product', 'Size', 'Colour', 'Qty', 'Unit price', 'Line total'] },
    exRows () { return this.o ? this.o.items.map(i => [i.name, i.size, i.color, i.qty, i.price.toFixed(2), (i.price * i.qty).toFixed(2)]) : [] },
    exMeta () {
      const o = this.o; if (!o) return []
      return [
        'Order: ' + o.id, 'Customer: ' + o.customer, o.email + ' · ' + o.phone,
        o.address.line + ', ' + o.address.city, t('date') + ': ' + o.date,
        t('subtotal') + ': ' + money(o.subtotal), t('discount') + ': −' + money(o.discount),
        t('shipping') + ': ' + money(o.shipping), t('total') + ': ' + money(o.total)
      ]
    }
  },
  methods: {
    addNote () {
      if (!this.note) return
      this.o.timeline.push({ label: this.note, at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
      this.note = ''; toast('Timeline updated')
    }
  }
}
</script>
