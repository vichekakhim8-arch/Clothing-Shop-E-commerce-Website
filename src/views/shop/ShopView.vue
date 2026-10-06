<template>
<div class="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 lg:py-12">
  <nav class="flex items-center gap-2 text-[12px] muted-2 mb-6">
    <router-link to="/" class="hover:opacity-60">{{$t('home')}}</router-link><UiIcon name="chevronR" :size="12"/>
    <span style="color:var(--text)">{{title}}</span>
  </nav>
  <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
    <div>
      <h1 class="display text-[clamp(26px,5vw,42px)] font-semibold uppercase leading-none">{{title}}</h1>
      <p class="text-[13px] muted mt-3 mono-num">{{filtered.length}} {{$t('results')}}</p>
    </div>
    <div class="flex items-center gap-2 ml-auto">
      <button class="btn btn-md btn-secondary lg:hidden" @click="drawer=true"><UiIcon name="filter" :size="15"/>{{$t('filters')}}</button>
      <select v-model="sort" class="field w-auto min-w-[190px]">
        <option value="featured">{{$t('sortBy')}}: {{$t('featured')}}</option><option value="new">{{$t('newest')}}</option>
        <option value="plh">{{$t('priceLowHigh')}}</option><option value="phl">{{$t('priceHighLow')}}</option>
        <option value="best">{{$t('bestSelling')}}</option><option value="rate">{{$t('highestRated')}}</option>
      </select>
    </div>
  </div>
  <div class="shop-layout">
    <aside class="filter-sidebar scroll-thin hidden lg:block"><ProductFilters v-model="f" :reset="reset"/></aside>
    <div class="min-w-0">
      <div v-if="activeChips.length" class="flex flex-wrap gap-2 mb-6">
        <span v-for="c in activeChips" :key="c.k" class="chip on" @click="c.clear()">{{c.l}} <UiIcon name="x" :size="12"/></span>
        <button class="chip-clear" @click="reset()"><UiIcon name="x" :size="12"/>{{$t('clearAll')}}</button>
      </div>
      <ProductGrid :products="paged" :loading="loading"/>
      <UiPagination v-if="filtered.length>perPage" :page="page" :total="filtered.length" :per-page="perPage" @update:page="p=>{page=p; scrollTop()}" class="mt-8 card"/>
    </div>
  </div>
  <teleport to="body">
    <transition name="fade">
      <div v-if="drawer" class="fixed inset-0 z-[1100] lg:hidden" style="background:rgba(10,10,12,.5)" @click.self="drawer=false">
        <transition name="slide-l" appear>
          <aside class="w-[86%] max-w-xs h-full overflow-y-auto scroll-thin p-5" style="background:var(--bg)">
            <div class="flex items-center justify-between mb-6">
              <h3 class="display text-[14px] uppercase tracking-wider font-semibold">{{$t('filters')}}</h3>
              <button class="btn-icon" @click="drawer=false"><UiIcon name="x" :size="18"/></button>
            </div>
            <ProductFilters v-model="f" :reset="reset"/>
            <UiButton block class="mt-6" @click="drawer=false">{{$t('apply')}} ({{filtered.length}})</UiButton>
          </aside>
        </transition>
      </div>
    </transition>
  </teleport>
</div>
</template>

<script>
import { priceOf, catName } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'ShopView',
  data: () => ({
    loading: true, drawer: false, page: 1, perPage: 12, sort: 'featured',
    f: { q: '', cats: [], min: null, max: null, sizes: [], colors: [], rating: 0, avail: '' }
  }),
  computed: {
    slug () { return this.$route.params.slug },
    title () {
      if (this.slug) return catName(this.slug)
      if (this.$route.query.tag === 'new') return t('newArrivals')
      if (this.$route.query.tag === 'best') return t('bestSellers')
      if (this.$route.query.sale) return t('sale')
      return t('shop')
    },
    filtered () {
      const q = (this.f.q || this.$route.query.q || '').toLowerCase()
      const tag = this.$route.query.tag, sale = this.$route.query.sale
      let list = this.$s.products.filter(p => {
        if (this.slug && p.category !== this.slug) return false
        if (tag && !p.tags.includes(tag)) return false
        if (sale && !priceOf(p).has) return false
        if (q && !(p.name.toLowerCase().includes(q) || p.category.includes(q))) return false
        if (this.f.cats.length && !this.f.cats.includes(p.category)) return false
        const pr = priceOf(p).final
        if (this.f.min != null && this.f.min !== '' && pr < +this.f.min) return false
        if (this.f.max != null && this.f.max !== '' && pr > +this.f.max) return false
        if (this.f.sizes.length && !this.f.sizes.some(s => p.sizes.includes(s))) return false
        if (this.f.colors.length && !this.f.colors.some(c => p.colors.includes(c))) return false
        if (this.f.rating && p.rating < this.f.rating) return false
        if (this.f.avail === 'in' && p.stock === 0) return false
        if (this.f.avail === 'out' && p.stock > 0) return false
        return true
      })
      const s = this.sort
      if (s === 'plh') list = [...list].sort((a, b) => priceOf(a).final - priceOf(b).final)
      else if (s === 'phl') list = [...list].sort((a, b) => priceOf(b).final - priceOf(a).final)
      else if (s === 'new') list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      else if (s === 'best') list = [...list].sort((a, b) => b.sold - a.sold)
      else if (s === 'rate') list = [...list].sort((a, b) => b.rating - a.rating)
      else list = [...list].sort((a, b) => (b.tags.includes('featured') ? 1 : 0) - (a.tags.includes('featured') ? 1 : 0))
      return list
    },
    paged () { const s = (this.page - 1) * this.perPage; return this.filtered.slice(s, s + this.perPage) },
    activeChips () {
      const out = [], f = this.f
      if (f.q) out.push({ k: 'q', l: '“' + f.q + '”', clear: () => { f.q = '' } })
      f.cats.forEach(c => out.push({ k: 'c' + c, l: catName(c), clear: () => f.cats.splice(f.cats.indexOf(c), 1) }))
      f.sizes.forEach(s => out.push({ k: 's' + s, l: t('size') + ' ' + s, clear: () => f.sizes.splice(f.sizes.indexOf(s), 1) }))
      f.colors.forEach(c => out.push({ k: 'cl' + c, l: c, clear: () => f.colors.splice(f.colors.indexOf(c), 1) }))
      if (f.rating) out.push({ k: 'r', l: f.rating + '★ +', clear: () => { f.rating = 0 } })
      if (f.avail) out.push({ k: 'a', l: f.avail === 'in' ? t('inStock') : t('outOfStock'), clear: () => { f.avail = '' } })
      if (f.min || f.max) out.push({ k: 'p', l: (f.min || 0) + ' – ' + (f.max || '∞'), clear: () => { f.min = null; f.max = null } })
      return out
    }
  },
  watch: {
    filtered () { this.page = 1 },
    $route () { this.loading = true; setTimeout(() => { this.loading = false }, 300) }
  },
  mounted () {
    if (this.$route.query.q) this.f.q = this.$route.query.q
    setTimeout(() => { this.loading = false }, 400)
  },
  methods: {
    reset () { this.f = { q: '', cats: [], min: null, max: null, sizes: [], colors: [], rating: 0, avail: '' } },
    scrollTop () { window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }
}
</script>
