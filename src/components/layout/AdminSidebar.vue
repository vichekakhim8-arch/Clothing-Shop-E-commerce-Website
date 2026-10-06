<template>
  <aside class="shrink-0 h-full flex flex-col hair-r overflow-hidden"
    style="background:var(--panel); transition:width .25s cubic-bezier(.3,.8,.3,1)" :style="{ width: mini ? '72px' : '248px' }">
    <div class="h-[60px] flex items-center hair-b shrink-0" :class="mini ? 'justify-center px-2' : 'justify-between px-5'">
      <router-link to="/admin" class="display font-bold tracking-[.2em] whitespace-nowrap" :class="mini ? 'text-[13px]' : 'text-[16px]'">{{ mini ? 'SX' : 'SHADXW' }}</router-link>
      <button v-if="!mini" class="btn-icon lg:hidden" @click="$emit('close')"><UiIcon name="x" :size="18" /></button>
      <button v-if="!mini" class="btn-icon hidden lg:inline-flex" @click="$emit('toggle')" :title="$t('collapse')"><UiIcon name="sidebar" :size="17" /></button>
    </div>
    <nav class="flex-1 overflow-y-auto overflow-x-hidden scroll-thin p-3">
      <p v-if="!mini" class="eyebrow px-2 mb-2">{{ $t('navMain') }}</p>
      <router-link v-for="n in items" :key="n.k" :to="n.to" @click="$emit('close')" :title="mini ? n.l() : ''"
        :class="['relative flex items-center h-10 rounded-[3px] text-[13.5px] mb-0.5 transition whitespace-nowrap',
                 mini ? 'justify-center px-0' : 'gap-3 px-3', active(n) ? 'btn-primary' : 'btn-ghost']">
        <UiIcon :name="n.i" :size="16" />
        <template v-if="!mini">{{ n.l() }}
          <span v-if="n.k === 'orders' && pending" class="ml-auto text-[10.5px] px-1.5 py-0.5 rounded mono-num"
            :style="active(n) ? { background: 'rgba(255,255,255,.2)' } : { background: 'var(--soft)' }">{{ pending }}</span>
        </template>
        <span v-else-if="n.k === 'orders' && pending" class="absolute top-2 right-3 w-1.5 h-1.5 rounded-full accent-bg"></span>
      </router-link>
    </nav>
    <div class="p-3 hair-t shrink-0">
      <button v-if="mini" class="flex items-center justify-center h-10 w-full rounded-[3px] btn-ghost mb-1" @click="$emit('toggle')" :title="$t('expand')">
        <UiIcon name="sidebar" :size="17" />
      </button>
      <router-link to="/" :title="mini ? $t('backToStore') : ''"
        :class="['flex items-center h-10 rounded-[3px] text-[13.5px] btn-ghost whitespace-nowrap', mini ? 'justify-center' : 'gap-3 px-3']">
        <UiIcon name="store" :size="16" /><template v-if="!mini">{{ $t('backToStore') }}</template>
      </router-link>
      <div class="flex items-center h-14 mt-1" :class="mini ? 'justify-center' : 'gap-3 px-3'">
        <span class="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0" style="background:var(--soft)">SP</span>
        <template v-if="!mini">
          <div class="min-w-0 flex-1">
            <p class="text-[13px] font-medium truncate">{{ $s.admin.name }}</p>
            <p class="text-[11px] muted-2">{{ $s.admin.role }}</p>
          </div>
          <button class="btn-icon" @click="logout" :title="$t('logout')"><UiIcon name="logout" :size="16" /></button>
        </template>
      </div>
    </div>
  </aside>
</template>

<script>
import { NAV, can } from '@/utils/permissions'
import { toast } from '@/utils/helpers'

export default {
  name: 'AdminSidebar',
  props: { collapsed: Boolean, drawer: Boolean },
  emits: ['close', 'toggle'],
  computed: {
    items () { return NAV.filter(n => can(n.k)) },
    mini () { return this.collapsed && !this.drawer },
    pending () { return this.$s.orders.filter(o => o.status === 'pending').length }
  },
  methods: {
    active (n) { return n.to === '/admin' ? this.$route.path === '/admin' : this.$route.path.startsWith(n.to) },
    logout () { toast('Signed out of admin', 'info'); this.$router.push('/') }
  }
}
</script>
