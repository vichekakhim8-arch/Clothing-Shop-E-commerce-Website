<template>
  <div class="receipt-sheet card mx-auto w-full" style="max-width:420px">
    <div class="px-5 sm:px-7 pt-7 pb-5 text-center hair-b" style="border-style:dashed">
      <p class="display text-[19px] font-bold tracking-[.24em]">{{ $s.settings.storeName }}</p>
      <p class="text-[11.5px] muted-2 mt-1.5 leading-relaxed">{{ $s.settings.address }}<br />{{ $s.settings.phone }} · {{ $s.settings.email }}</p>
      <div class="inline-flex items-center gap-1.5 mt-4 px-2.5 py-1 rounded-[2px] text-[10.5px] font-semibold tracking-[.14em]" :style="paidStyle">
        <UiIcon :name="isPaid ? 'check' : 'clock'" :size="11" :sw="2.4" />{{ isPaid ? $t('paid') : $t('unpaid') }}
      </div>
    </div>
    <div class="px-5 sm:px-7 py-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[11.5px] hair-b" style="border-style:dashed">
      <div><p class="muted-2 uppercase tracking-[.1em] text-[9.5px]">{{ $t('orderRef') }}</p><p class="mono-num font-semibold mt-0.5">{{ order.id }}</p></div>
      <div class="text-right"><p class="muted-2 uppercase tracking-[.1em] text-[9.5px]">{{ $t('date') }}</p><p class="mono-num mt-0.5">{{ order.date }}</p></div>
      <div><p class="muted-2 uppercase tracking-[.1em] text-[9.5px]">{{ $t('transactionId') }}</p><p class="mono-num mt-0.5 break-all">{{ ref }}</p></div>
      <div class="text-right"><p class="muted-2 uppercase tracking-[.1em] text-[9.5px]">{{ $t('paidBy') }}</p><p class="uppercase mt-0.5">{{ payLabel }}</p></div>
      <div class="col-span-2">
        <p class="muted-2 uppercase tracking-[.1em] text-[9.5px]">{{ $t('issuedTo') }}</p>
        <p class="mt-0.5 font-medium">{{ order.customer }}</p>
        <p class="muted leading-relaxed">{{ order.address.line }}, {{ order.address.city }}<br />{{ order.phone }}</p>
      </div>
    </div>
    <div class="px-5 sm:px-7 py-4 hair-b" style="border-style:dashed">
      <div class="flex text-[9.5px] uppercase tracking-[.1em] muted-2 pb-2.5">
        <span class="flex-1">{{ $t('item') }}</span><span class="w-10 text-center">{{ $t('qty2') }}</span><span class="w-20 text-right">{{ $t('amount') }}</span>
      </div>
      <div v-for="(it, i) in order.items" :key="i" class="flex items-start gap-2 py-2 text-[12px]">
        <span class="flex-1 min-w-0">
          <span class="block font-medium leading-snug">{{ it.name }}</span>
          <span class="block muted-2 text-[10.5px] mt-0.5">{{ it.size }} · {{ it.color }} · {{ $money(it.price) }}</span>
        </span>
        <span class="w-10 text-center mono-num">{{ it.qty }}</span>
        <span class="w-20 text-right mono-num font-medium">{{ $money(it.price * it.qty) }}</span>
      </div>
    </div>
    <div class="px-5 sm:px-7 py-4 space-y-2 text-[12px] hair-b" style="border-style:dashed">
      <div class="flex justify-between"><span class="muted">{{ $t('subtotal') }}</span><span class="mono-num">{{ $money(order.subtotal) }}</span></div>
      <div v-if="order.discount" class="flex justify-between"><span class="muted">{{ $t('discount') }}</span><span class="accent mono-num">−{{ $money(order.discount) }}</span></div>
      <div class="flex justify-between"><span class="muted">{{ $t('shipping') }}</span><span class="mono-num">{{ order.shipping ? $money(order.shipping) : $t('free') }}</span></div>
      <div class="flex justify-between items-baseline pt-2.5 mt-1 hair-t">
        <span class="display text-[12px] uppercase tracking-[.12em] font-semibold">{{ $t('total') }}</span>
        <span class="display text-[21px] font-bold mono-num">{{ $money(order.total) }}</span>
      </div>
    </div>
    <div class="px-5 sm:px-7 py-5 text-center">
      <div class="barcode-wrap mx-auto" style="max-width:260px"><BarCode :value="barValue" /></div>
      <p class="text-[10.5px] muted-2 mt-2.5 leading-relaxed">{{ $t('scanReceipt') }}</p>
      <p class="text-[12px] font-medium mt-4">{{ $t('thankYou') }}</p>
      <p class="text-[10.5px] muted-2 mt-1">{{ $s.settings.storeName }} · {{ $s.settings.tagline }}</p>
    </div>
    <div v-if="!embedded" class="flex gap-2 px-5 sm:px-7 pb-6 no-print">
      <UiButton class="flex-1" size="sm" variant="secondary" icon="printer" @click="print">{{ $t('printReceipt') }}</UiButton>
      <UiButton class="flex-1" size="sm" variant="secondary" icon="download" @click="download">{{ $t('downloadReceipt') }}</UiButton>
    </div>
  </div>
</template>

<script>
import { txnRef } from '@/utils/khqr'
import { runExport } from '@/utils/exporter'
import { money } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'OrderReceipt',
  props: { order: Object, embedded: Boolean },
  computed: {
    isPaid () { return ['delivered', 'shipped', 'processing', 'confirmed'].includes(this.order.status) || this.order.payment !== 'cod' },
    ref () { return txnRef(this.order) },
    barValue () { return String(this.order.id).replace(/[^A-Za-z0-9]/g, '') },
    payLabel () { return { cod: t('cod'), bank: t('bank'), qr: 'KHQR' }[this.order.payment] || this.order.payment },
    paidStyle () { return this.isPaid ? { background: 'var(--ok-soft)', color: 'var(--ok)' } : { background: 'var(--warn-soft)', color: 'var(--warn)' } }
  },
  methods: {
    print () { window.print() },
    download () {
      const o = this.order
      runExport('pdf', {
        title: 'Receipt ' + o.id, filename: 'receipt-' + this.barValue,
        headers: [t('item'), t('size'), t('colour'), t('qty2'), t('unitPrice'), t('amount')],
        rows: o.items.map(i => [i.name, i.size, i.color, i.qty, money(i.price), money(i.price * i.qty)]),
        meta: [
          t('orderRef') + ': ' + o.id, t('transactionId') + ': ' + this.ref, t('date') + ': ' + o.date,
          t('issuedTo') + ': ' + o.customer, t('paidBy') + ': ' + this.payLabel,
          t('subtotal') + ': ' + money(o.subtotal), t('discount') + ': −' + money(o.discount),
          t('shipping') + ': ' + money(o.shipping), t('total') + ': ' + money(o.total)
        ]
      })
    }
  }
}
</script>
