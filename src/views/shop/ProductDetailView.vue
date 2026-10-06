<template>
<div v-if="p">
  <section class="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6 pb-16">
    <div class="flex items-center justify-between text-[12px] mb-6">
      <button class="flex items-center gap-2 uppercase tracking-[.14em] link-u" @click="$router.back()"><UiIcon name="arrowL" :size="14"/>{{$catName(p.category)}}</button>
      <button class="flex items-center gap-2 uppercase tracking-[.14em] link-u muted" @click="scrollTo('specs')"><UiIcon name="plus" :size="13"/>{{$t('specifications')}}</button>
    </div>

    <div class="grid lg:grid-cols-[330px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)] gap-8 lg:gap-12 items-center">
      <!-- info -->
      <div class="order-2 lg:order-1 self-center flex flex-col gap-5">
        <h1 class="hero-title">{{p.name}}</h1>
        <div class="flex items-center gap-3"><StarRating :value="p.rating" :count="p.reviewCount"/>
          <span class="text-[12px] muted-2 mono-num">· {{p.sold}} {{$t('soldUnits')}}</span></div>
        <p class="text-[15px] muted max-w-sm" style="line-height:1.75">{{p.description}}</p>

        <div class="flex flex-col gap-5 mt-1">
          <div class="flex flex-wrap items-center gap-x-6 gap-y-3"><span class="lbl w-16 mb-0 shrink-0">{{$t('size')}}</span>
            <div class="flex flex-wrap gap-2.5">
              <button v-for="s in p.sizes" :key="s" :disabled="p.outOfStockSizes.includes(s)"
                class="size-box" :class="[size===s?'on':'', p.outOfStockSizes.includes(s)?'off':'']" @click="size=s">{{s}}</button></div></div>
          <div class="flex flex-wrap items-center gap-x-6 gap-y-3"><span class="lbl w-16 mb-0 shrink-0">{{$t('colour')}}</span>
            <div class="flex flex-wrap items-center gap-4">
              <button v-for="c in p.colors" :key="c" class="flex items-center gap-2.5 text-[13px]" @click="color=c">
                <i class="sw" :class="color===c?'on':''" :style="{background:swatch(c)}"></i>
                <span :class="color===c?'font-medium':'muted'">{{c}}</span></button></div></div>
          <div class="flex flex-wrap items-center gap-x-6 gap-y-3"><span class="lbl w-16 mb-0 shrink-0">{{$t('qty')}}</span>
            <div class="flex items-center hair h-11" style="border-radius:3px">
              <button class="w-11 h-full flex items-center justify-center" @click.stop="decreaseQty"><UiIcon name="minus" :size="14"/></button>
              <span class="w-10 text-center text-[14px] mono-num">{{qty}}</span>
              <button class="w-11 h-full flex items-center justify-center" @click.stop="increaseQty"><UiIcon name="plus" :size="14"/></button></div>
            <span class="text-[12.5px]" :style="{color: st==='out'?'#D92D20': st==='low'?'var(--warn)':'var(--ok)'}">
              {{ st==='out'?$t('outOfStock') : st==='low'? $t('lowStock')+' · '+p.stock : $t('inStock') }}</span></div>
        </div>

        <div class="flex items-center gap-5 mt-4">
          <button @click="add" :disabled="st==='out'" class="relative w-[108px] h-[108px] shrink-0 flex items-center justify-center transition hover:scale-[1.03] disabled:opacity-40"
            style="clip-path:polygon(50% 0,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%); background:var(--soft)">
            <span class="absolute inset-[1.5px] flex items-center justify-center" style="clip-path:polygon(50% 0,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%); background:var(--bg)">
              <UiIcon name="arrowUR" :size="22"/></span></button>
          <div><p class="eyebrow">{{$t('addToBag')}}</p>
            <PriceTag :product="p" size="lg" class="mt-1.5"/>
            <p v-if="pr.has" class="text-[11.5px] muted-2 mt-1.5">{{pr.discount.label}} · {{$t('discount')}} applied</p></div>
        </div>
        <div class="flex flex-wrap gap-3">
          <UiButton variant="secondary" size="lg" @click="buyNow" :disabled="st==='out'" class="flex-1 min-w-[150px]">{{$t('buyNow')}}</UiButton>
          <UiButton variant="ghost" size="lg" @click="$toggleWish(p.id)" icon="heart" :style="{color: wished?'var(--accent)':''}">{{$t('wishlist')}}</UiButton>
        </div>
        <p v-if="!$s.user" class="flex items-center gap-2 text-[12px] muted-2 -mt-1"><UiIcon name="lock" :size="12"/>{{$t('loginToBuy')}}</p>
        <div class="grid grid-cols-3 gap-4 mt-4 pt-8 hair-t">
          <div v-for="b in badges" :key="b.t" class="text-center"><UiIcon :name="b.i" :size="18" class="mx-auto muted"/>
            <p class="text-[11.5px] muted-2 mt-2.5 leading-snug">{{b.t}}</p></div>
        </div>
      </div>
      <!-- centre image + horizontal thumbnail rail + 01 — 04 indicator -->
      <div class="order-1 lg:order-2"><ProductShowcase :key="p.id" :images="p.images" :alt="p.name" size="lg"/></div>
    </div>
  </section>

  <!-- tabs -->
  <section id="specs" class="hair-t" style="background:var(--panel)">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-8 py-14">
      <div class="flex gap-7 overflow-x-auto no-bar hair-b mb-8">
        <button v-for="tb in tabs" :key="tb.k" class="tab" :class="tab===tb.k?'active':''" @click="tab=tb.k">{{tb.l}}</button>
      </div>
      <div v-if="tab==='desc'" class="grid lg:grid-cols-2 gap-10">
        <div><p class="text-[14.5px] leading-relaxed muted">{{p.description}}</p>
          <p class="text-[14.5px] leading-relaxed muted mt-4">Constructed with a three-layer membrane and fully taped seams. Adjustable storm hood, magnetic placket, and two sealed cargo pockets. Fits true to size with room for a mid-layer.</p></div>
        <ul class="space-y-3"><li v-for="h in highlights" :key="h" class="flex gap-3 text-[14px]"><UiIcon name="check" :size="16" class="mt-0.5"/><span>{{h}}</span></li></ul>
      </div>
      <div v-else-if="tab==='spec'" class="max-w-2xl">
        <div v-for="s in p.specs" :key="s[0]" class="flex justify-between py-3.5 hair-b text-[14px]">
          <span class="muted">{{s[0]}}</span><span class="font-medium">{{s[1]}}</span></div>
        <div class="flex justify-between py-3.5 hair-b text-[14px]"><span class="muted">{{$t('sku')}}</span><span class="font-medium mono-num">{{p.sku}}</span></div>
      </div>
      <div v-else-if="tab==='ship'" class="grid sm:grid-cols-3 gap-6 max-w-4xl">
        <div v-for="s in shipInfo" :key="s.t" class="card p-5"><UiIcon :name="s.i" :size="19"/>
          <p class="display text-[13px] font-semibold uppercase mt-3">{{s.t}}</p>
          <p class="text-[13px] muted mt-2 leading-relaxed">{{s.d}}</p></div>
      </div>
      <div v-else class="grid lg:grid-cols-[280px_1fr] gap-10">
        <div class="card p-6 h-max text-center">
          <p class="display text-[42px] font-bold mono-num">{{p.rating}}</p>
          <StarRating :value="p.rating" :size="15" class="justify-center"/>
          <p class="text-[12.5px] muted mt-2">{{p.reviewCount}} {{$t('reviews')}}</p>
          <div class="mt-5 space-y-1.5"><div v-for="n in [5,4,3,2,1]" :key="n" class="flex items-center gap-2">
            <span class="text-[11px] muted-2 w-3 mono-num">{{n}}</span>
            <span class="flex-1 h-1 rounded" style="background:var(--line)"><span class="block h-1 rounded" style="background:var(--text)" :style="{width:(n===5?70:n===4?20:n===3?7:2)+'%'}"></span></span></div></div>
        </div>
        <div>
          <div v-if="prodReviews.length" class="space-y-5">
            <div v-for="r in prodReviews" :key="r.id" class="card p-5">
              <div class="flex items-center justify-between"><div class="flex items-center gap-3">
                <span class="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold" style="background:var(--soft)">{{r.customer[0]}}</span>
                <div><p class="text-[13.5px] font-medium">{{r.customer}}</p><StarRating :value="r.rating" :size="11"/></div></div>
                <span class="text-[11.5px] muted-2 mono-num">{{r.date}}</span></div>
              <p class="text-[14px] mt-4 leading-relaxed">{{r.text}}</p></div>
          </div>
          <EmptyState v-else icon="star" :title="$t('noReviews')" text="Be the first to review this product."/>
        </div>
      </div>
    </div>
  </section>

  <section class="max-w-[1440px] mx-auto px-4 sm:px-8 py-16">
    <SectionHead eyebrow="Related" :title="$t('relatedProducts')" link="/shop"/>
    <ProductGrid :products="related"/>
  </section>
</div>
<div v-else class="max-w-md mx-auto py-24"><EmptyState icon="box" title="Product not found" :action-label="$t('shop')" action-to="/shop"/></div>
</template>

<script>
import { prodById, priceOf, stockState, addToCart, swatch } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'ProductDetailView',
  data: () => ({
    qty: 1, size: null, color: null, tab: 'desc',
    highlights: ['3-layer waterproof membrane, 10k/10k rating', 'Fully taped seams and storm placket', 'Reflective kanji detail on sleeve', 'YKK AquaGuard hardware', 'Numbered limited run of 300'],
    shipInfo: [
      { i: 'truck', t: 'Free Shipping', d: 'Free standard delivery on all orders above $150. Dispatched within 24 hours.' },
      { i: 'refresh', t: '30-Day Returns', d: 'Unworn items with tags can be returned within 30 days for a full refund.' },
      { i: 'shield', t: '2-Year Warranty', d: 'Covered against manufacturing defects with free repair service.' }
    ],
    badges: [{ i: 'truck', t: 'Free over $150' }, { i: 'refresh', t: '30-day returns' }, { i: 'shield', t: '2-year warranty' }]
  }),
  computed: {
    p () { return prodById(this.$route.params.id) },
    pr () { return priceOf(this.p) },
    st () { return stockState(this.p) },
    wished () { return this.$s.wishlist.includes(this.p.id) },
    prodReviews () { return this.$s.reviews.filter(r => r.productId === this.p.id && r.status === 'approved') },
    related () { return this.$s.products.filter(x => x.category === this.p.category && x.id !== this.p.id).slice(0, 4) },
    tabs () { return [{ k: 'desc', l: t('description') }, { k: 'spec', l: t('specifications') }, { k: 'ship', l: t('shippingInfo') }, { k: 'rev', l: t('reviews') }] }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler () {
        const p = this.p
        if (p) { this.qty = 1; this.size = p.sizes.find(s => !p.outOfStockSizes.includes(s)); this.color = p.colors[0]; this.tab = 'desc' }
      }
    }
  },
  methods: {
    increaseQty (item) {
      if (item && typeof item === 'object') {
        item.qty = parseInt(item.qty, 10) || 1
        item.quantity = Number(item.qty || 1) + 1
        item.qty = item.quantity
        this.$forceUpdate()
        return
      }
      this.qty = parseInt(this.qty, 10) || 1
      this.qty = Number(this.qty || 1) + 1
      this.$forceUpdate()
    },
    decreaseQty (item) {
      if (item && typeof item === 'object') {
        item.qty = parseInt(item.qty, 10) || 1
        if (item.qty > 1) {
          item.qty = Math.max(1, item.qty - 1)
        } else if (item.quantity !== undefined) {
          item.quantity = Math.max(1, (parseInt(item.quantity, 10) || 1) - 1)
          item.qty = item.quantity
        }
        this.$forceUpdate()
        return
      }
      if (this.qty > 1) {
        this.qty = parseInt(this.qty, 10) || 1
        this.qty = Math.max(1, this.qty - 1)
      }
      this.$forceUpdate()
    },
    swatch,
    add () { if (addToCart(this.p, this.size, this.color, this.qty)) this.$s.cartOpen = true },
    buyNow () {
      this.$s.authNext = '/checkout'
      if (addToCart(this.p, this.size, this.color, this.qty)) { this.$s.authNext = ''; this.$router.push('/checkout') }
    },
    scrollTo (id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }) }
  }
}
</script>
