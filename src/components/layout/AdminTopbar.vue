<template>
  <header class="h-[60px] shrink-0 hair-b flex items-center gap-2 sm:gap-3 px-4 sm:px-6" style="background:var(--panel)">
    <button class="btn-icon lg:hidden" @click="$emit('menu')" aria-label="Menu"><UiIcon name="menu" :size="19" /></button>
    <button class="btn-icon hidden lg:inline-flex" @click="$emit('toggle')" :title="collapsed ? $t('expand') : $t('collapse')"><UiIcon name="sidebar" :size="17" /></button>
    <div class="relative max-w-xs w-full hidden sm:block">
      <UiIcon name="search" :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 muted-2" />
      <input v-model="q" class="field has-icon h-9" :placeholder="$t('search') + '…'" @keyup.enter="go" />
    </div>
    <div class="flex items-center gap-1 ml-auto">
      <div class="relative" ref="notifEl">
        <button class="btn-icon" @click="notif = !notif">
          <UiIcon name="bell" :size="17" /><span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full accent-bg"></span>
        </button>
        <transition name="pop">
          <div v-if="notif" class="absolute right-0 top-full mt-2 w-[min(300px,calc(100vw-2rem))] card-soft z-50 overflow-hidden">
            <p class="eyebrow px-4 py-3 hair-b">{{ $t('notifications') }}</p>
            <div v-for="(n, i) in notifs" :key="i" class="px-4 py-3 hair-b last:border-0 flex gap-3">
              <UiIcon :name="n.i" :size="15" class="mt-0.5 muted" />
              <div><p class="text-[13px]">{{ n.t }}</p><p class="text-[11.5px] muted-2 mt-0.5">{{ n.d }}</p></div>
            </div>
          </div>
        </transition>
      </div>
      <button class="btn-icon" @click="$toggleLang()"><span class="text-[11px] font-semibold tracking-wider">{{ $s.lang === 'en' ? 'EN' : 'ខ្មែរ' }}</span></button>
      <button class="btn-icon" @click="$s.theme = $s.theme === 'dark' ? 'light' : 'dark'"><UiIcon :name="$s.theme === 'dark' ? 'sun' : 'moon'" :size="17" /></button>
      <select v-model="$s.admin.role" class="field h-9 w-auto text-[12.5px] ml-1"><option>Owner</option><option>Admin</option><option>Staff</option></select>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AdminTopbar',
  props: { collapsed: Boolean },
  emits: ['menu', 'toggle'],
  data: () => ({
    q: '', notif: false,
    notifs: [
      { i: 'truck', t: 'New order #SHX-2436 placed', d: '2 minutes ago' },
      { i: 'alert', t: 'Utility Vest 02 is out of stock', d: '1 hour ago' },
      { i: 'star', t: '3 reviews awaiting approval', d: 'Today' },
      { i: 'users', t: '5 new customers this week', d: 'Yesterday' }
    ]
  }),
  mounted () {
    this.h = e => { if (this.notif && this.$refs.notifEl && !this.$refs.notifEl.contains(e.target)) this.notif = false }
    document.addEventListener('click', this.h)
  },
  unmounted () { document.removeEventListener('click', this.h) },
  methods: { go () { if (this.q) { this.$router.push('/admin/products?q=' + encodeURIComponent(this.q)); this.q = '' } } }
}
</script>
