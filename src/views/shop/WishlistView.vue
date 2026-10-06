<template>
<div class="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 lg:py-14">
  <h1 class="display text-[clamp(26px,5vw,38px)] font-semibold uppercase">{{$t('wishlist')}}</h1>
  <p class="text-[13px] muted mt-2 mono-num">{{items.length}} {{$t('results')}}</p>
  <div v-if="items.length" class="mt-10"><ProductGrid :products="items"/></div>
  <div v-else class="card mt-8"><EmptyState icon="heart" :title="$t('emptyWishlist')" text="Tap the heart on any product to save it here." :action-label="$t('shopNow')" action-to="/shop"/></div>
</div>
</template>

<script>
export default {
  name: 'WishlistView',
  computed: { items () { return this.$s.products.filter(p => this.$s.wishlist.includes(p.id)) } }
}
</script>
