<template>
  <div class="group relative">
    <div class="relative overflow-hidden" style="background:var(--soft)">
      <router-link :to="'/product/' + product.id" class="block ratio-p img-zoom relative">
        <img :src="hover && product.images[1] ? product.images[1] : product.images[0]" :alt="product.name" loading="lazy"
          class="w-full h-full object-cover transition-opacity duration-500" @mouseenter="hover = true" @mouseleave="hover = false" />
      </router-link>
      <div class="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
        <UiBadge v-if="p.has" tone="accent">−{{ p.percent }}%</UiBadge>
        <UiBadge v-if="product.tags.includes('new')" tone="dark">New</UiBadge>
        <UiBadge v-if="product.stock === 0" tone="neutral">{{ $t('outOfStock') }}</UiBadge>
      </div>
      <button class="absolute top-2.5 right-2.5 w-9 h-9 flex items-center justify-center transition-all" style="background:var(--panel)"
        :style="{ color: wished ? 'var(--accent)' : 'var(--text-2)' }" @click.stop="$toggleWish(product.id)" :aria-label="$t('wishlist')">
        <svg width="16" height="16" viewBox="0 0 24 24" :fill="wished ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.6"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      </button>
      <div class="absolute inset-x-0 bottom-0 p-2.5 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100 max-sm:hidden">
        <button class="btn btn-sm btn-primary flex-1" @click="quick = true">{{ $t('quickView') }}</button>
        <button class="btn btn-sm btn-icon" style="background:var(--panel); width:34px" @click="add" :disabled="product.stock === 0"><UiIcon name="bag" :size="15" /></button>
      </div>
    </div>
    <div class="pt-3 flex flex-col gap-1">
      <p class="eyebrow">{{ $catName(product.category) }}</p>
      <router-link :to="'/product/' + product.id" class="display text-[14px] font-medium leading-snug hover:opacity-60 transition">{{ product.name }}</router-link>
      <StarRating :value="product.rating" :count="product.reviewCount" :size="11" />
      <PriceTag :product="product" hide-badge class="mt-0.5" />
      <button class="btn btn-sm btn-secondary mt-2 sm:hidden" @click="add" :disabled="product.stock === 0">{{ $t('addToCart') }}</button>
    </div>
    <QuickView v-model="quick" :product="product" />
  </div>
</template>

<script>
import { priceOf, addToCart } from '@/utils/helpers'
import { store } from '@/stores'

export default {
  name: 'ProductCard',
  props: { product: Object },
  data: () => ({ hover: false, quick: false }),
  computed: {
    p () { return priceOf(this.product) },
    wished () { return store.wishlist.includes(this.product.id) }
  },
  methods: { add () { addToCart(this.product) } }
}
</script>
