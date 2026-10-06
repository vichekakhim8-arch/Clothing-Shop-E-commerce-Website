<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="$s.cartOpen" class="fixed inset-0 z-[1100]" style="background:rgba(10,10,12,.5)" @click.self="$s.cartOpen = false">
        <transition name="slide-r" appear>
          <aside class="absolute right-0 top-0 h-full w-full sm:w-[420px] flex flex-col" style="background:var(--bg)">
            <div class="h-16 px-5 flex items-center justify-between hair-b">
              <h3 class="display text-[14px] uppercase tracking-[.14em] font-semibold">{{ $t('cart') }} <span class="muted-2 mono-num">({{ count }})</span></h3>
              <button class="btn-icon" @click="$s.cartOpen = false"><UiIcon name="x" :size="19" /></button>
            </div>
            <div v-if="lines.length" class="flex-1 overflow-y-auto scroll-thin divide-y" style="border-color:var(--line)">
              <div v-for="l in lines" :key="l.key" class="flex gap-4 p-5" style="border-color:var(--line)">
                <router-link :to="'/product/' + l.pid" @click="$s.cartOpen = false" class="shrink-0">
                  <img :src="l.product.images[0]" class="w-20 h-[104px] object-cover" />
                </router-link>
                <div class="flex-1 min-w-0">
                  <p class="text-[13.5px] font-medium leading-snug">{{ l.product.name }}</p>
                  <p class="text-[11.5px] muted-2 mt-1">{{ l.size }} · {{ l.color }}</p>
                  <div class="flex items-center justify-between mt-3">
                    <div class="flex items-center hair h-8">
                      <button class="w-8 h-full flex items-center justify-center" @click.stop="decreaseQty(l)"><UiIcon name="minus" :size="13" /></button>
                      <span class="w-7 text-center text-[13px] mono-num">{{ l.qty }}</span>
                      <button class="w-8 h-full flex items-center justify-center" @click.stop="increaseQty(l)"><UiIcon name="plus" :size="13" /></button>
                    </div>
                    <div class="text-right">
                      <p class="text-[13.5px] font-semibold mono-num">{{ $money(l.line) }}</p>
                      <s v-if="l.off" class="text-[11px] muted-2 mono-num">{{ $money(l.base * l.qty) }}</s>
                    </div>
                  </div>
                </div>
                <button class="btn-icon self-start" @click="rm(l)"><UiIcon name="x" :size="15" /></button>
              </div>
            </div>
            <EmptyState v-else class="flex-1" icon="bag" :title="$t('emptyCart')" text="Add something you love to get started." :action-label="$t('shopNow')" action-to="/shop" @action="$s.cartOpen = false" />
            <div v-if="lines.length" class="p-5 hair-t space-y-3" style="background:var(--panel-2)">
              <div class="flex justify-between text-[13px]"><span class="muted">{{ $t('subtotal') }}</span><span class="mono-num">{{ $money(sub) }}</span></div>
              <div v-if="disc" class="flex justify-between text-[13px]"><span class="muted">{{ $t('discount') }}</span><span class="accent mono-num">−{{ $money(disc) }}</span></div>
              <div class="flex justify-between text-[15px] font-semibold hair-t pt-3"><span>{{ $t('total') }}</span><span class="mono-num">{{ $money(total) }}</span></div>
              <UiButton block size="lg" @click="goCheckout">{{ $t('proceedToCheckout') }}</UiButton>
              <UiButton block variant="ghost" size="sm" to="/cart" @click="$s.cartOpen = false">{{ $t('view') }} {{ $t('cart') }}</UiButton>
            </div>
          </aside>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { cartLines, cartCount, cartSubtotal, cartDiscount, cartTotal, requireAuth, lockScroll } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'CartDrawer',
  computed: {
    lines () { return cartLines.value }, count () { return cartCount.value },
    sub () { return cartSubtotal.value }, disc () { return cartDiscount.value }, total () { return cartTotal.value },
    cartSubtotal () {
      return cartSubtotal.value
    },
    cartTotal () {
      return Math.max(0, this.sub - this.disc)
    }
  },
  watch: { '$s.cartOpen': { immediate: true, handler (v) { lockScroll(v) } } },
  unmounted () { lockScroll(false) },
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
    dec (l) { this.decreaseQty(l) },
    rm (l) { const i = this.$s.cart.findIndex(x => x.key === l.key); if (i > -1) this.$s.cart.splice(i, 1) },
    goCheckout () {
      this.$s.cartOpen = false
      this.$s.authNext = '/checkout'
      if (requireAuth(t('loginToCheckout'))) { this.$s.authNext = ''; this.$router.push('/checkout') }
    }
  }
}
</script>
