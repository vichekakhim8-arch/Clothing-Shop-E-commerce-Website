<template>
<div class="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 lg:py-14">
  <h1 class="display text-[clamp(26px,5vw,42px)] font-semibold uppercase">Checkout</h1>
  <div v-if="lines.length" class="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-10 mt-10">
    <form class="space-y-6 sm:space-y-8 min-w-0" @submit.prevent="submit">
      <section class="card p-6">
        <div class="flex items-center gap-3 mb-5"><span class="w-6 h-6 rounded-full accent-bg text-[11px] flex items-center justify-center font-semibold mono-num">1</span>
          <h3 class="display text-[14px] uppercase tracking-[.14em] font-semibold">{{$t('customerInformation')}}</h3></div>
        <div class="grid sm:grid-cols-2 gap-4">
          <UiInput v-model="f.name" :label="$t('name')" icon="user" required :error="err.name"/>
          <UiInput v-model="f.phone" :label="$t('phone')" icon="phone" required :error="err.phone"/>
          <UiInput v-model="f.email" :label="$t('email')" icon="mail" type="email" class="sm:col-span-2" required :error="err.email"/></div>
      </section>
      <section class="card p-6">
        <div class="flex items-center gap-3 mb-5"><span class="w-6 h-6 rounded-full accent-bg text-[11px] flex items-center justify-center font-semibold mono-num">2</span>
          <h3 class="display text-[14px] uppercase tracking-[.14em] font-semibold">{{$t('shippingAddress')}}</h3></div>
        <div class="grid sm:grid-cols-2 gap-4">
          <UiInput v-model="f.address" :label="$t('address')" icon="pin" class="sm:col-span-2" required :error="err.address"/>
          <UiInput v-model="f.city" :label="$t('city')" required :error="err.city"/>
          <UiSelect v-model="f.province" :label="$t('province')" :options="provinces"/>
          <UiInput v-model="f.postal" :label="$t('postalCode')"/>
          <UiInput v-model="f.note" :label="$t('notes')"/></div>
      </section>
      <section class="card p-6">
        <div class="flex items-center gap-3 mb-5"><span class="w-6 h-6 rounded-full accent-bg text-[11px] flex items-center justify-center font-semibold mono-num">3</span>
          <h3 class="display text-[14px] uppercase tracking-[.14em] font-semibold">{{$t('shippingMethod')}}</h3></div>
        <label v-for="m in methods2" :key="m.k" class="flex items-center gap-4 p-4 hair mb-2.5 cursor-pointer transition" :style="{borderColor: f.ship===m.k?'var(--text)':'var(--line)'}">
          <input type="radio" :value="m.k" v-model="f.ship" style="accent-color:var(--text)" class="w-4 h-4"/>
          <UiIcon :name="m.i" :size="18"/>
          <div class="flex-1"><p class="text-[13.5px] font-medium">{{m.t}}</p><p class="text-[12px] muted-2">{{m.d}}</p></div>
          <span class="text-[13.5px] mono-num">{{m.p? $money(m.p):$t('free')}}</span></label>
      </section>
      <section class="card p-6">
        <div class="flex items-center gap-3 mb-5"><span class="w-6 h-6 rounded-full accent-bg text-[11px] flex items-center justify-center font-semibold mono-num">4</span>
          <h3 class="display text-[14px] uppercase tracking-[.14em] font-semibold">{{$t('paymentMethod')}}</h3></div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button v-for="pm in payments" :key="pm.k" type="button" class="p-4 hair text-left transition rounded-[3px] min-w-0" :style="{borderColor: f.pay===pm.k?'var(--text)':'var(--line)'}" @click="f.pay=pm.k">
            <div class="flex items-center justify-between"><UiIcon :name="pm.i" :size="19"/><UiIcon v-if="f.pay===pm.k" name="check" :size="15"/></div>
            <p class="text-[13px] font-medium mt-2.5">{{pm.t}}</p>
            <p class="text-[11.5px] muted-2 mt-1">{{pm.d}}</p></button></div>
        <div v-if="f.pay==='bank'" class="mt-4 p-4 soft text-[13px] space-y-1">
          <p class="font-medium">ABA Bank · 000 123 456</p><p class="muted">Account name: SHADXW CO., LTD</p>
          <p class="muted-2 text-[12px]">Upload the transfer slip after placing the order.</p></div>
        <div v-if="f.pay==='qr'" class="mt-4 grid sm:grid-cols-[auto_minmax(0,1fr)] gap-5 items-start justify-items-center sm:justify-items-start">
          <KhqrPanel :key="qrSeed" :amount="total" :bill="draftRef" compact @paid="qrPaid=true"/>
          <div class="text-[13px] min-w-0 w-full flex flex-col gap-2.5">
            <div v-if="qrPaid" class="flex items-center gap-2 p-3 rounded-[6px]" style="background:var(--ok-soft); color:var(--ok)">
              <UiIcon name="check" :size="15" :sw="2.2"/><span class="text-[12.5px] font-medium">{{$t('paymentConfirmed')}}</span></div>
            <div v-else class="flex items-center gap-2 p-3 rounded-[6px]" style="background:var(--warn-soft); color:var(--warn)">
              <UiIcon name="clock" :size="15"/><span class="text-[12.5px]">{{$t('paymentPending')}}</span></div>
            <div class="flex items-center gap-2 p-3 rounded-[6px]" style="background:var(--soft)">
              <UiIcon name="lock" :size="14" class="muted-2 shrink-0"/>
              <span class="text-[12px] muted leading-snug">{{$t('couponLocked')}}</span></div>
            <p class="muted text-[12.5px] leading-relaxed">{{$t('khqrHint')}}</p>
            <p class="muted-2 text-[11.5px] leading-relaxed">{{$t('supportedBanks')}}</p>
          </div></div>
      </section>
      <UiButton type="submit" size="lg" block :disabled="placing" class="break-anywhere">{{ placing? $t('loading')+'…' : $t('placeOrder')+' · '+$money(total) }}</UiButton>
    </form>
    <div class="space-y-4 sticky-col">
      <div class="card overflow-hidden">
        <button type="button" class="w-full flex items-center justify-between px-5 py-3.5 lg:cursor-default" @click="openItems = !openItems">
          <span class="eyebrow">{{lines.length}} items · {{count}} {{$t('qty2')}}</span>
          <UiIcon name="chevronD" :size="15" class="lg:hidden transition-transform" :style="{transform: openItems?'rotate(180deg)':''}"/></button>
        <div v-show="openItems" class="px-5 pb-4 max-h-[260px] overflow-y-auto scroll-thin">
          <div v-for="l in lines" :key="l.key" class="flex gap-3 py-2.5">
            <div class="relative shrink-0"><img :src="l.product.images[0]" class="w-12 h-16 object-cover"/>
              <span class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] flex items-center justify-center mono-num" style="background:var(--text); color:var(--bg)">{{l.qty}}</span></div>
            <div class="flex-1 min-w-0"><p class="text-[13px] font-medium truncate">{{l.product.name}}</p>
              <p class="text-[11.5px] muted-2 truncate">{{l.size}} · {{l.color}}</p>
              <p class="text-[11.5px] mono-num mt-0.5">
                <span v-if="l.off" class="muted-2 line-through mr-1.5">{{$money(l.base)}}</span>
                <span class="muted">{{$money(l.unit)}} × {{l.qty}}</span></p></div>
            <span class="text-[13px] mono-num shrink-0 font-medium">{{$money(l.line)}}</span></div>
        </div>
      </div>
      <OrderSummary :show-coupon="true" :locked="qrLocked"/>
    </div>
  </div>
  <div v-else class="card mt-10"><EmptyState icon="bag" :title="$t('emptyCart')" :action-label="$t('shopNow')" action-to="/shop"/></div>
</div>
</template>

<script>
import { cartLines, cartCount, cartSubtotal, cartDiscount, couponValue, shipFee, cartTotal, round2, toast } from '@/utils/helpers'
import { store } from '@/stores'
import { t } from '@/utils/i18n'

export default {
  name: 'CheckoutView',
  data () {
    const u = store.user
    return {
      placing: false, qrPaid: false, qrSeed: 0, openItems: window.innerWidth >= 1024,
      draftRef: 'SHX' + String(Date.now()).slice(-8),
      f: { name: u ? u.name : '', phone: u ? u.phone : '', email: u ? u.email : '', address: '', city: 'Phnom Penh', province: 'Phnom Penh', postal: '', note: '', ship: 'standard', pay: 'cod' },
      err: {},
      provinces: ['Phnom Penh', 'Siem Reap', 'Battambang', 'Kampot', 'Sihanoukville', 'Kandal', 'Takeo'],
      methods2: [
        { k: 'standard', i: 'truck', t: 'Standard Delivery', d: '3–5 business days', p: 0 },
        { k: 'express', i: 'sparkle', t: 'Express Delivery', d: '1–2 business days', p: 7 },
        { k: 'pickup', i: 'store', t: 'Store Pickup', d: 'Ready in 3 hours · Street 310', p: 0 }
      ]
    }
  },
  computed: {
    lines () { return cartLines.value },
    count () { return cartCount.value },
    /* coupon is locked while a KHQR is live so the scanned amount can never drift */
    qrLocked () { return this.f.pay === 'qr' },
    total () { return round2(cartTotal.value + (this.f.ship === 'express' ? 7 : 0)) },
    payments () {
      return [
        { k: 'cod', i: 'truck', t: t('cod'), d: 'Pay when it arrives' },
        { k: 'bank', i: 'card', t: t('bank'), d: 'ABA / Wing transfer' },
        { k: 'qr', i: 'grid', t: 'KHQR', d: t('scanToPay') }
      ]
    }
  },
  watch: {
    /* regenerate the QR whenever the payable amount changes */
    total () { if (this.f.pay === 'qr') { this.qrSeed++; this.qrPaid = false } },
    'f.pay' (v) { if (v === 'qr') this.qrSeed++; this.qrPaid = false }
  },
  methods: {
    validate () {
      const e = {}, f = this.f
      if (!f.name) e.name = 'Name is required'
      if (!f.phone || f.phone.length < 6) e.phone = 'Valid phone required'
      if (!f.email || !/.+@.+\..+/.test(f.email)) e.email = 'Valid email required'
      if (!f.address) e.address = 'Address is required'
      if (!f.city) e.city = 'City is required'
      this.err = e
      return !Object.keys(e).length
    },
    submit () {
      if (!this.validate()) return toast('Please complete the required fields', 'error')
      this.placing = true
      setTimeout(() => {
        const id = '#SHX-' + (2500 + this.$s.orders.length)
        const items = this.lines.map(l => ({ pid: l.pid, name: l.product.name, image: l.product.images[0], size: l.size, color: l.color, qty: l.qty, price: l.base }))
        this.$s.orders.unshift({
          id, customer: this.f.name, customerId: 0, email: this.f.email, phone: this.f.phone,
          date: new Date().toISOString().slice(0, 10), items, itemCount: items.reduce((s, i) => s + i.qty, 0),
          subtotal: cartSubtotal.value, discount: round2(cartDiscount.value + couponValue.value),
          shipping: round2(shipFee.value + (this.f.ship === 'express' ? 7 : 0)),
          total: this.total, payment: this.f.pay,
          status: (this.f.pay === 'qr' && this.qrPaid) ? 'confirmed' : 'pending',
          address: { line: this.f.address, city: this.f.city, province: this.f.province, postal: this.f.postal },
          timeline: [{ label: 'Order placed', at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
        })
        this.$s.cart.splice(0); this.$s.coupon = null; this.placing = false
        this.$router.push('/order-success?id=' + encodeURIComponent(id))
      }, 900)
    }
  }
}
</script>
