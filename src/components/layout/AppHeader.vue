<template>
  <!-- announcement : scrolls away naturally, OUTSIDE the sticky header (prevents scroll jitter) -->
  <div class="overflow-hidden" style="background:var(--text); color:var(--bg)">
    <div class="max-w-[1440px] mx-auto px-6 sm:px-10 h-10 flex items-center justify-center relative">
      <transition name="ann" mode="out-in">
        <p :key="ann" class="text-[11px] sm:text-[11.5px] tracking-[.22em] uppercase font-medium text-center truncate px-4">{{ announcements[ann] }}</p>
      </transition>
      <div class="absolute right-6 sm:right-10 hidden sm:flex items-center gap-1.5">
        <button v-for="(a, i) in announcements" :key="i" @click="ann = i" :aria-label="'Announcement ' + (i + 1)"
          class="w-1.5 h-1.5 rounded-full transition-opacity" style="background:currentColor" :style="{ opacity: ann === i ? .95 : .3 }"></button>
      </div>
    </div>
  </div>

  <header class="sticky top-0 hair-b" style="z-index:1000; transition:box-shadow .3s ease, background .3s ease"
    :style="{ background: scrolled ? 'var(--nav-bg)' : 'var(--bg)',
              backdropFilter: scrolled ? 'blur(8px)' : 'none', WebkitBackdropFilter: scrolled ? 'blur(8px)' : 'none',
              boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,.05)' : 'none' }">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center gap-4" style="transition:height .3s ease"
      :class="scrolled ? 'h-[58px] lg:h-[64px]' : 'h-16 lg:h-[76px]'">
      <button class="btn-icon lg:hidden -ml-2" @click="menu = true" aria-label="Menu"><UiIcon name="menu" :size="20" /></button>
      <router-link to="/" class="display text-[19px] sm:text-[22px] font-bold tracking-[.22em] shrink-0">SHADXW</router-link>

      <nav class="hidden lg:flex items-center gap-7 ml-10 text-[13px]">
        <router-link to="/shop" class="link-u">{{ $t('shop') }}</router-link>
        <div class="relative" @mouseenter="cats = true" @mouseleave="cats = false">
          <button class="link-u flex items-center gap-1">{{ $t('categories') }} <UiIcon name="chevronD" :size="13" /></button>
          <transition name="pop">
            <div v-if="cats" class="absolute left-0 top-full pt-4 w-[min(520px,calc(100vw-4rem))]">
              <div class="card-soft p-2 grid grid-cols-2">
                <router-link v-for="c in $s.categories" :key="c.id" :to="'/category/' + c.slug" class="flex items-center gap-3 p-2.5 transition hover:opacity-80">
                  <img :src="c.image" class="w-11 h-14 object-cover" />
                  <span>
                    <span class="block text-[13px] font-medium">{{ $s.lang === 'km' ? c.nameKm : c.name }}</span>
                    <span class="block text-[11.5px] muted-2 mt-0.5">{{ count(c.slug) }} {{ $t('products') }}</span>
                  </span>
                </router-link>
              </div>
            </div>
          </transition>
        </div>
        <router-link to="/shop?tag=new" class="link-u">{{ $t('newArrivals') }}</router-link>
        <router-link to="/shop?tag=best" class="link-u">{{ $t('bestSellers') }}</router-link>
        <router-link to="/shop?sale=1" class="link-u accent">{{ $t('sale') }}</router-link>
      </nav>

      <div class="flex items-center gap-0.5 sm:gap-1 ml-auto">
        <button class="btn-icon" @click="$s.searchOpen = true" :aria-label="$t('search')"><UiIcon name="search" :size="18" /></button>
        <div class="relative hidden sm:block" ref="lang">
          <button class="btn-icon" @click="langOpen = !langOpen" :aria-label="$t('language')">
            <span class="text-[11px] font-semibold tracking-wider">{{ $s.lang === 'en' ? 'EN' : 'ខ្មែរ' }}</span>
          </button>
          <transition name="pop">
            <div v-if="langOpen" class="absolute right-0 top-full mt-2 w-[152px] card-soft overflow-hidden p-1.5">
              <button v-for="l in langs" :key="l.k" @click="pickLang(l.k)" class="flex items-center gap-2.5 w-full px-2.5 h-9 rounded-[3px] text-[13px] btn-ghost">
                <UiIcon name="globe" :size="14" /><span class="flex-1 text-left">{{ l.label }}</span>
                <UiIcon v-if="$s.lang === l.k" name="check" :size="14" />
              </button>
            </div>
          </transition>
        </div>
        <button class="btn-icon" @click="$s.theme = $s.theme === 'dark' ? 'light' : 'dark'" aria-label="Theme">
          <UiIcon :name="$s.theme === 'dark' ? 'sun' : 'moon'" :size="17" />
        </button>
        <router-link to="/wishlist" class="btn-icon relative" :aria-label="$t('wishlist')">
          <UiIcon name="heart" :size="18" />
          <span v-if="$s.wishlist.length" class="absolute top-1 right-1 w-[15px] h-[15px] text-[9px] rounded-full flex items-center justify-center accent-bg mono-num">{{ $s.wishlist.length }}</span>
        </router-link>
        <button class="btn-icon relative" @click="$s.cartOpen = true" :aria-label="$t('cart')">
          <UiIcon name="bag" :size="18" />
          <span v-if="count2" class="absolute top-1 right-1 w-[15px] h-[15px] text-[9px] rounded-full flex items-center justify-center accent-bg mono-num">{{ count2 }}</span>
        </button>
        <!-- account menu (no login link in the navbar itself) -->
        <div class="relative" ref="acctEl">
          <button class="btn-icon" @click="acct = !acct" :aria-label="$t('account')"><UiIcon name="user" :size="18" /></button>
          <transition name="pop">
            <div v-if="acct" class="absolute right-0 top-full mt-2 w-[min(240px,calc(100vw-2rem))] card-soft overflow-hidden">
              <div v-if="$s.user" class="px-4 py-3.5 hair-b flex items-center gap-3">
                <span class="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold" style="background:var(--soft)">{{ initials }}</span>
                <div class="min-w-0">
                  <p class="text-[13px] font-medium truncate">{{ $s.user.name }}</p>
                  <p class="text-[11.5px] muted-2 truncate">{{ $s.user.email }}</p>
                </div>
              </div>
              <div v-else class="px-4 py-4 hair-b">
                <p class="display text-[13px] uppercase tracking-[.12em] font-semibold">{{ $t('myAccount') }}</p>
                <p class="text-[12px] muted mt-1.5 leading-relaxed">{{ $t('welcomeBack') }} — {{ $t('signIn') }} for faster checkout.</p>
                <UiButton block size="sm" class="mt-3" @click="openAuth('login')">{{ $t('signIn') }}</UiButton>
                <UiButton block size="sm" variant="secondary" class="mt-2" @click="openAuth('register')">{{ $t('createAccount') }}</UiButton>
              </div>
              <div class="p-1.5">
                <router-link v-for="m in acctMenu" :key="m.to" :to="m.to" @click="acct = false" class="flex items-center gap-3 px-2.5 h-9 rounded-[3px] text-[13px] btn-ghost">
                  <UiIcon :name="m.i" :size="15" />{{ m.l }}
                </router-link>
                <button v-if="$s.user" class="flex items-center gap-3 px-2.5 h-9 rounded-[3px] text-[13px] btn-ghost w-full" @click="logout">
                  <UiIcon name="logout" :size="15" />{{ $t('logout') }}
                </button>
              </div>
              <router-link to="/admin" @click="acct = false" class="flex items-center gap-3 px-4 h-10 text-[12.5px] muted hair-t"><UiIcon name="shield" :size="15" />{{ $t('adminPanel') }}</router-link>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>

  <!-- mobile drawer -->
  <teleport to="body">
    <transition name="fade">
      <div v-if="menu" class="fixed inset-0 z-[1100] lg:hidden" style="background:rgba(10,10,12,.5)" @click.self="menu = false">
        <transition name="slide-l" appear>
          <aside class="w-[85%] max-w-xs h-full flex flex-col" style="background:var(--bg)">
            <div class="h-16 px-5 flex items-center justify-between hair-b">
              <span class="display font-bold tracking-[.2em]">SHADXW</span>
              <button class="btn-icon" @click="menu = false"><UiIcon name="x" :size="19" /></button>
            </div>
            <nav class="flex-1 overflow-y-auto p-5 flex flex-col gap-1">
              <router-link v-for="l in links" :key="l.to" :to="l.to" @click="menu = false" class="py-3 display text-[17px] uppercase font-medium hair-b">{{ l.label }}</router-link>
              <p class="eyebrow mt-6 mb-2">{{ $t('categories') }}</p>
              <router-link v-for="c in $s.categories" :key="c.id" :to="'/category/' + c.slug" @click="menu = false" class="py-2 text-[14px] muted">{{ $s.lang === 'km' ? c.nameKm : c.name }}</router-link>
              <div class="mt-6 pt-5 hair-t">
                <p class="eyebrow mb-3">{{ $t('myAccount') }}</p>
                <template v-if="$s.user">
                  <router-link to="/account" @click="menu = false" class="flex items-center gap-3 py-2 text-[14px]"><UiIcon name="user" :size="16" />{{ $s.user.name }}</router-link>
                  <router-link to="/orders" @click="menu = false" class="flex items-center gap-3 py-2 text-[14px] muted"><UiIcon name="box" :size="16" />{{ $t('orderHistory') }}</router-link>
                  <button class="flex items-center gap-3 py-2 text-[14px] muted" @click="logout"><UiIcon name="logout" :size="16" />{{ $t('logout') }}</button>
                </template>
                <template v-else>
                  <UiButton block size="sm" @click="menu = false; openAuth('login')">{{ $t('signIn') }}</UiButton>
                  <UiButton block size="sm" variant="secondary" class="mt-2" @click="menu = false; openAuth('register')">{{ $t('createAccount') }}</UiButton>
                </template>
              </div>
            </nav>
            <div class="p-5 hair-t flex items-center gap-2">
              <UiButton size="sm" variant="secondary" @click="$toggleLang()" icon="globe">{{ $s.lang === 'en' ? 'ខ្មែរ' : 'English' }}</UiButton>
              <UiButton size="sm" variant="ghost" @click="$s.theme = $s.theme === 'dark' ? 'light' : 'dark'" :icon="$s.theme === 'dark' ? 'sun' : 'moon'" />
              <UiButton size="sm" variant="ghost" to="/admin" @click="menu = false" icon="shield" />
            </div>
          </aside>
        </transition>
      </div>
    </transition>
  </teleport>
  <SearchOverlay />
</template>

<script>
import { cartCount, toast, money } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'AppHeader',
  data: () => ({
    menu: false, cats: false, scrolled: false, acct: false, langOpen: false, ann: 0, annTimer: null,
    langs: [{ k: 'en', label: 'English' }, { k: 'km', label: 'ខ្មែរ' }]
  }),
  computed: {
    count2 () { return cartCount.value },
    announcements () { return [t('freeShipOver') + ' ' + money(this.$s.settings.freeShipOver), t('dropLive')] },
    initials () { const u = this.$s.user; return (u && u.name || 'U').split(' ').map(x => x[0]).join('').slice(0, 2) },
    acctMenu () {
      const m = [{ to: '/orders', i: 'box', l: t('orderHistory') }, { to: '/wishlist', i: 'heart', l: t('wishlist') }]
      if (this.$s.user) m.unshift({ to: '/account', i: 'user', l: t('myAccount') })
      return m
    },
    links () {
      return [
        { to: '/', label: t('home') }, { to: '/shop', label: t('shop') }, { to: '/shop?tag=new', label: t('newArrivals') },
        { to: '/shop?tag=best', label: t('bestSellers') }, { to: '/shop?sale=1', label: t('sale') }, { to: '/wishlist', label: t('wishlist') }
      ]
    }
  },
  watch: { $route () { this.menu = false; this.acct = false; this.langOpen = false } },
  mounted () {
    /* hysteresis: shrink past 140px, restore under 60px — prevents oscillation at the threshold */
    this.onScroll = () => {
      const y = window.scrollY
      if (!this.scrolled && y > 140) this.scrolled = true
      else if (this.scrolled && y < 60) this.scrolled = false
      document.documentElement.classList.toggle('nav-small', this.scrolled)
    }
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.onScroll()
    this.annTimer = setInterval(() => { this.ann = (this.ann + 1) % this.announcements.length }, 4800)
    this.onClick = e => {
      if (this.acct && this.$refs.acctEl && !this.$refs.acctEl.contains(e.target)) this.acct = false
      if (this.langOpen && this.$refs.lang && !this.$refs.lang.contains(e.target)) this.langOpen = false
    }
    document.addEventListener('click', this.onClick)
  },
  unmounted () {
    window.removeEventListener('scroll', this.onScroll)
    document.removeEventListener('click', this.onClick)
    clearInterval(this.annTimer)
  },
  methods: {
    count (slug) { return this.$s.products.filter(p => p.category === slug).length },
    pickLang (k) { this.langOpen = false; this.$setLang(k) },
    openAuth (tab) { this.acct = false; this.$s.authTab = tab; this.$s.authOpen = true },
    logout () { this.$s.user = null; this.acct = false; toast('Signed out', 'info'); this.$router.push('/') }
  }
}
</script>
