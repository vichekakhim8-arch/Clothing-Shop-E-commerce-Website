<template>
<div>
  <!-- hero -->
  <section class="relative hair-b">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 lg:py-16 grid lg:grid-cols-[330px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)] gap-8 lg:gap-12 items-center">
      <div class="order-2 lg:order-1 flex flex-col gap-5">
        <p class="eyebrow">{{$t('heroEyebrow')}}</p>
        <h1 class="hero-title">{{hero.name}}</h1>
        <StarRating :value="hero.rating" :count="hero.reviewCount"/>
        <p class="text-[15px] muted max-w-sm" style="line-height:1.75">{{$t('heroDesc')}}</p>
        <div class="flex flex-col gap-5 mt-1">
          <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span class="lbl w-16 mb-0 shrink-0">{{$t('size')}}</span>
            <div class="flex flex-wrap gap-2.5"><button v-for="s in hero.sizes" :key="s" class="size-box" :class="hSize===s?'on':''" @click="hSize=s">{{s}}</button></div>
          </div>
          <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span class="lbl w-16 mb-0 shrink-0">{{$t('colour')}}</span>
            <div class="flex flex-wrap items-center gap-4">
              <button v-for="c in hero.colors" :key="c" class="flex items-center gap-2.5 text-[13px]" @click="hColor=c">
                <i class="sw" :class="hColor===c?'on':''" :style="{background:swatch(c)}"></i>
                <span :class="hColor===c?'font-medium':'muted'">{{c}}</span></button>
            </div>
          </div>
        </div>
        <PriceTag :product="hero" size="lg" class="mt-2"/>
        <div class="flex flex-wrap gap-3 mt-1">
          <UiButton size="lg" to="/shop">{{$t('shopNow')}}</UiButton>
          <UiButton size="lg" variant="secondary" :to="'/product/'+hero.id">{{$t('exploreCollection')}}</UiButton>
        </div>
        <div class="flex flex-wrap gap-x-12 gap-y-5 mt-5 pt-8 hair-t">
          <div v-for="s in stats" :key="s.k"><p class="display text-[25px] font-semibold mono-num leading-none">{{s.v}}</p>
            <p class="eyebrow mt-2.5">{{s.l}}</p></div>
        </div>
      </div>
      <div class="order-1 lg:order-2"><ProductShowcase :images="hero.images" :alt="hero.name" size="lg"/></div>
    </div>
  </section>

  <!-- categories -->
  <section class="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 lg:py-24">
    <SectionHead eyebrow="01 / Collections" :title="$t('categories')" link="/shop"/>
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <router-link v-for="(c,i) in $s.categories" :key="c.id" :to="'/category/'+c.slug"
        :class="['relative overflow-hidden img-zoom group', i===0?'lg:col-span-2':'']" style="background:var(--soft)">
        <div :class="i===0?'aspect-[16/11]':'aspect-[4/3]'"><img :src="c.image" class="w-full h-full object-cover"/></div>
        <div class="absolute inset-0 flex items-end p-5" style="background:linear-gradient(to top,rgba(0,0,0,.6),transparent 55%)">
          <div><p class="display text-white text-[clamp(15px,2.4vw,22px)] font-semibold uppercase">{{$s.lang==='km'?c.nameKm:c.name}}</p>
            <p class="text-white/70 text-[11.5px] mt-1">{{count(c.slug)}} {{$t('products')}}</p></div>
        </div>
      </router-link>
    </div>
  </section>

  <!-- new arrivals -->
  <section class="max-w-[1440px] mx-auto px-4 sm:px-8 pb-16 lg:pb-24">
    <SectionHead eyebrow="02 / Fresh" :title="$t('newArrivals')" link="/shop?tag=new"/>
    <ProductGrid :products="newest" :loading="loading"/>
  </section>

  <!-- sale banner -->
  <section class="hair-t hair-b" style="background:var(--text); color:var(--bg)">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <p class="text-[11px] tracking-[.22em] uppercase opacity-60 mb-4">Limited time</p>
        <h2 class="display text-[clamp(32px,6vw,58px)] font-bold uppercase leading-[.95]">Summer flash<br/>sale — 10% off</h2>
        <p class="text-[14px] opacity-70 mt-5 max-w-md">Applied automatically to every product sitewide. Stack with coupon <b>SHX25</b> on orders over $150.</p>
        <UiButton size="lg" to="/shop?sale=1" class="mt-8" style="background:var(--bg); color:var(--text)">{{$t('shopNow')}}</UiButton>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div v-for="p in saleItems" :key="p.id" class="relative overflow-hidden">
          <router-link :to="'/product/'+p.id" class="block ratio-p img-zoom"><img :src="p.images[0]" class="w-full h-full object-cover"/></router-link>
          <span class="absolute top-2 left-2 accent-bg text-[10px] px-1.5 py-0.5 font-semibold">−{{$price(p).percent}}%</span>
        </div>
      </div>
    </div>
  </section>

  <!-- best sellers -->
  <section class="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 lg:py-24">
    <SectionHead eyebrow="03 / Proven" :title="$t('bestSellers')" link="/shop?tag=best"/>
    <ProductGrid :products="best" :loading="loading"/>
  </section>

  <!-- brand story -->
  <section class="hair-t" style="background:var(--panel)">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
      <div class="grid grid-cols-2 gap-4">
        <div class="ratio-p overflow-hidden img-zoom"><img :src="story[0]" class="w-full h-full object-cover"/></div>
        <div class="ratio-p overflow-hidden img-zoom mt-10"><img :src="story[1]" class="w-full h-full object-cover"/></div>
      </div>
      <div>
        <p class="eyebrow mb-4">04 / {{$t('brandStory')}}</p>
        <h2 class="display text-[clamp(26px,4.5vw,42px)] font-semibold uppercase leading-[1.05]">Built quiet.<br/>Worn loud.</h2>
        <p class="text-[14.5px] muted mt-6 leading-relaxed">SHADXW began in a two-room studio in Phnom Penh with a single idea: technical clothing should disappear into daily life, not shout from it. Every garment is prototyped three times before production and released in numbered runs.</p>
        <div class="grid sm:grid-cols-3 gap-6 mt-10">
          <div v-for="v in values" :key="v.t"><UiIcon :name="v.i" :size="20"/><p class="display text-[13px] font-semibold uppercase mt-3">{{v.t}}</p>
            <p class="text-[12.5px] muted mt-1.5 leading-relaxed">{{v.d}}</p></div>
        </div>
      </div>
    </div>
  </section>

  <!-- reviews -->
  <section class="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 lg:py-24">
    <SectionHead eyebrow="05 / Voices" :title="$t('customerReviews')"/>
    <div class="grid md:grid-cols-3 gap-4">
      <div v-for="r in topReviews" :key="r.id" class="card p-6">
        <StarRating :value="r.rating"/>
        <p class="text-[14px] mt-4 leading-relaxed">“{{r.text}}”</p>
        <div class="flex items-center gap-3 mt-6 pt-5 hair-t">
          <span class="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold" style="background:var(--soft)">{{r.customer[0]}}</span>
          <div><p class="text-[13px] font-medium">{{r.customer}}</p><p class="text-[11.5px] muted-2">{{r.product}}</p></div>
        </div>
      </div>
    </div>
  </section>

  <!-- newsletter -->
  <section class="hair-t hair-b" style="background:var(--panel)">
    <div class="max-w-2xl mx-auto px-4 py-16 lg:py-20 text-center">
      <p class="eyebrow mb-4">06 / {{$t('newsletter')}}</p>
      <h2 class="display text-[clamp(24px,4vw,36px)] font-semibold uppercase leading-tight">Get the drop first</h2>
      <p class="text-[14px] muted mt-4">No noise. Two emails a month, release dates and private sales only.</p>
      <form class="flex max-w-md mx-auto mt-8" @submit.prevent="sub">
        <input v-model="email" type="email" required placeholder="you@email.com" class="field" style="border-radius:3px 0 0 3px"/>
        <button class="btn btn-md btn-primary px-6" style="border-radius:0 3px 3px 0">{{$t('apply')}}</button>
      </form>
    </div>
  </section>
</div>
</template>

<script>
import { priceOf, toast, swatch } from '@/utils/helpers'
import { t } from '@/utils/i18n'
import { M } from '@/utils/data'

export default {
  name: 'HomeView',
  data () {
    return {
      loading: true, email: '', hSize: null, hColor: null,
      values: [
        { i: 'layers', t: 'Materials', d: 'Japanese ripstop and recycled technical poly.' },
        { i: 'shield', t: 'Durability', d: 'Reinforced stress points, 2-year repair promise.' },
        { i: 'truck', t: 'Delivery', d: 'Dispatched in 24h, worldwide tracked shipping.' }
      ]
    }
  },
  computed: {
    hero () { return this.$s.products[0] },
    newest () { return [...this.$s.products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4) },
    best () { return [...this.$s.products].sort((a, b) => b.sold - a.sold).slice(0, 4) },
    saleItems () { return this.$s.products.filter(p => priceOf(p).has).slice(0, 3) },
    story () { return [M.c, M.s] },
    topReviews () { return this.$s.reviews.filter(r => r.status === 'approved' && r.rating >= 4).slice(0, 3) },
    stats () { return [{ k: 'u', v: '300', l: t('limitedUnits') }, { k: 'r', v: '4.8', l: t('avgRating') }, { k: 'd', v: '24H', l: t('dispatch') }] }
  },
  mounted () {
    setTimeout(() => { this.loading = false }, 450)
    this.hSize = this.hero.sizes[0]; this.hColor = this.hero.colors[0]
  },
  methods: {
    swatch,
    count (slug) { return this.$s.products.filter(p => p.category === slug).length },
    sub () { toast('Subscribed — welcome to the list'); this.email = '' }
  }
}
</script>
