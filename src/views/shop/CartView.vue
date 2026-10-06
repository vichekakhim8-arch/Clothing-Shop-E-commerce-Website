<template>
<div class="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 lg:py-14">
  <h1 class="display text-[clamp(26px,5vw,42px)] font-semibold uppercase">{{$t('cart')}}</h1>
  <p class="text-[13px] muted mt-2 mono-num">{{count}} items</p>
  <div v-if="lines.length" class="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-10 mt-10">
    <div class="card overflow-hidden min-w-0">
      <div v-for="l in lines" :key="l.key" class="flex gap-4 p-4 sm:p-5 hair-b last:border-0">
        <router-link :to="'/product/'+l.pid" class="shrink-0"><img :src="l.product.images[0]" class="w-[90px] h-[120px] object-cover"/></router-link>
        <div class="flex-1 min-w-0 flex flex-col">
          <div class="flex items-start justify-between gap-3">
            <div>
              <router-link :to="'/product/'+l.pid" class="display text-[15px] font-medium hover:opacity-60">{{l.product.name}}</router-link>
              <p class="eyebrow mt-1.5">{{$catName(l.product.category)}}</p>
              <p class="text-[12.5px] muted mt-1.5">{{$t('size')}}: {{l.size}} · {{$t('colour')}}: {{l.color}}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold mono-num">{{$money(l.line)}}</p>
              <s v-if="l.off" class="text-[12px] muted-2 mono-num">{{$money(l.base*l.qty)}}</s>
              <p v-if="l.off" class="text-[11px] accent">−{{$money(l.off*l.qty)}}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 mt-auto pt-4">
            <div class="flex items-center hair h-9">
              <button class="w-9 h-full flex items-center justify-center" @click.stop="decreaseQty(l)"><UiIcon name="minus" :size="13"/></button>
              <span class="w-8 text-center text-[13px] mono-num">{{l.qty}}</span>
              <button class="w-9 h-full flex items-center justify-center" @click.stop="increaseQty(l)"><UiIcon name="plus" :size="13"/></button>
            </div>
            <button class="btn btn-sm btn-ghost" @click="wish(l)"><UiIcon name="heart" :size="14"/><span class="hidden sm:inline">{{$t('wishlist')}}</span></button>
            <button class="btn btn-sm btn-ghost" @click="askRemove(l)"><UiIcon name="trash" :size="14"/><span class="hidden sm:inline">{{$t('remove')}}</span></button>
          </div>
        </div>
      </div>
      <div class="p-5 flex justify-between items-center" style="background:var(--panel-2)">
        <UiButton variant="ghost" size="sm" to="/shop" icon="arrowL">{{$t('continueShopping')}}</UiButton>
        <button class="text-[12px] uppercase tracking-[.14em] link-u muted" @click="$s.cart.splice(0)">{{$t('clearAll')}}</button>
      </div>
    </div>
    <div class="sticky-col">
      <OrderSummary :show-coupon="true">
        <UiButton block size="lg" @click="goCheckout">{{$t('proceedToCheckout')}}</UiButton>
        <p v-if="!$s.user" class="text-[11.5px] muted-2 mt-2.5 flex items-center gap-1.5 justify-center"><UiIcon name="lock" :size="11"/>{{$t('loginToCheckout')}}</p>
      </OrderSummary>
    </div>
  </div>
  <div v-else class="card mt-10"><EmptyState icon="bag" :title="$t('emptyCart')" text="Browse the collection and add your first piece." :action-label="$t('shopNow')" action-to="/shop"/></div>
  <ConfirmModal v-model="confirm" :message="'Remove '+(target&&target.product.name)+' from cart?'" :confirm-text="$t('remove')" @confirm="rm(target)"/>
</div>
</template>

<script>
import { cartLines, cartCount, toast, toggleWish, requireAuth } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'CartView',
  data: () => ({ confirm: false, target: null }),
  computed: { lines () { return cartLines.value }, count () { return cartCount.value } },
  methods: {
    increaseQty (item) {
      item.qty = parseInt(item.qty, 10) || 1
      item.quantity = item.qty
      item.quantity = Number(item.quantity || 1) + 1
      item.qty = item.quantity
    },
    decreaseQty (item) {
      item.qty = parseInt(item.qty, 10) || 1
      item.quantity = item.qty
      if (item.quantity > 1) {
        item.quantity = Math.max(1, item.quantity - 1)
        item.qty = item.quantity
      } else {
        this.rm(item)
      }
    },
    goCheckout () {
      this.$s.authNext = '/checkout'
      if (requireAuth(t('loginToCheckout'))) { this.$s.authNext = ''; this.$router.push('/checkout') }
    },
    askRemove (l) { this.target = l; this.confirm = true },
    rm (l) { const i = this.$s.cart.findIndex(x => x.key === l.key); if (i > -1) { this.$s.cart.splice(i, 1); toast('Item removed', 'info') } },
    wish (l) { if (!this.$s.wishlist.includes(l.pid)) toggleWish(l.pid); this.rm(l) }
  }
}
</script>
