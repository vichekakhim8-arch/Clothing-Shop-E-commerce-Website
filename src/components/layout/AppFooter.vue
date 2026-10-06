<template>
  <footer class="hair-t mt-24" style="background:var(--panel)">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-8 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <p class="display text-[20px] font-bold tracking-[.22em]">SHADXW</p>
        <p class="text-[13px] muted mt-4 leading-relaxed max-w-xs">{{ $s.settings.tagline }}. Limited runs, engineered details, designed in Phnom Penh.</p>
        <div class="flex gap-2 mt-5">
          <a v-for="s in ['instagram', 'facebook', 'tiktok']" :key="s" href="#" class="btn-icon hair">
            <UiIcon :name="s === 'instagram' ? 'image' : s === 'facebook' ? 'users' : 'sparkle'" :size="15" />
          </a>
        </div>
      </div>
      <div>
        <p class="eyebrow mb-4">{{ $t('shop') }}</p>
        <router-link v-for="c in $s.categories" :key="c.id" :to="'/category/' + c.slug" class="block text-[13px] muted py-1.5 hover:opacity-60">{{ $s.lang === 'km' ? c.nameKm : c.name }}</router-link>
      </div>
      <div>
        <p class="eyebrow mb-4">{{ $t('account') }}</p>
        <router-link v-for="l in links" :key="l.to" :to="l.to" class="block text-[13px] muted py-1.5 hover:opacity-60">{{ l.label }}</router-link>
      </div>
      <div>
        <p class="eyebrow mb-4">{{ $t('newsletter') }}</p>
        <p class="text-[13px] muted mb-3">Early access to drops and private sales.</p>
        <form class="flex" @submit.prevent="sub">
          <input v-model="email" type="email" required class="field" style="border-radius:3px 0 0 3px" placeholder="you@email.com" />
          <button class="btn btn-md btn-primary" style="border-radius:0 3px 3px 0"><UiIcon name="arrowR" :size="16" /></button>
        </form>
        <div class="flex items-center gap-4 mt-6 muted-2">
          <UiIcon name="card" :size="22" /><UiIcon name="truck" :size="22" /><UiIcon name="shield" :size="20" />
        </div>
      </div>
    </div>
    <div class="hair-t">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row gap-2 justify-between text-[12px] muted-2">
        <p>© 2026 SHADXW. All rights reserved.</p>
        <div class="flex gap-5">
          <a href="#" class="hover:opacity-60">Privacy</a><a href="#" class="hover:opacity-60">Terms</a>
          <router-link to="/admin" class="hover:opacity-60">{{ $t('adminPanel') }}</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { toast } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'AppFooter',
  data: () => ({ email: '' }),
  computed: {
    links () {
      return [
        { to: '/account', label: t('profile') }, { to: '/orders', label: t('orderHistory') },
        { to: '/wishlist', label: t('wishlist') }, { to: '/cart', label: t('cart') }, { to: '/shop', label: t('trackOrder') }
      ]
    }
  },
  methods: { sub () { toast('Subscribed — welcome to the list'); this.email = '' } }
}
</script>
