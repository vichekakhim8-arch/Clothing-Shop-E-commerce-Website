<template>
  <div class="flex h-screen overflow-hidden" style="background:var(--soft)">
    <div class="hidden lg:block h-full"><AdminSidebar :collapsed="collapsed" @toggle="toggle" /></div>
    <teleport to="body">
      <transition name="fade">
        <div v-if="drawer" class="fixed inset-0 z-[1100] lg:hidden" style="background:rgba(10,10,12,.5)" @click.self="drawer = false">
          <transition name="slide-l" appear>
            <div class="h-full w-[248px]"><AdminSidebar drawer @close="drawer = false" /></div>
          </transition>
        </div>
      </transition>
    </teleport>
    <div class="flex-1 flex flex-col min-w-0">
      <AdminTopbar :collapsed="collapsed" @menu="drawer = true" @toggle="toggle" />
      <main class="flex-1 overflow-y-auto overflow-x-hidden scroll-thin">
        <div class="p-4 sm:p-5 lg:p-8 max-w-[1500px] mx-auto min-w-0">
          <NoAccess v-if="!allowed" />
          <router-view v-else v-slot="{ Component }">
            <transition name="page" mode="out-in"><component :is="Component" /></transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from '@/components/layout/AdminSidebar.vue'
import AdminTopbar from '@/components/layout/AdminTopbar.vue'
import NoAccess from '@/components/layout/NoAccess.vue'
import { routeAllowed } from '@/utils/permissions'

export default {
  name: 'AdminLayout',
  components: { AdminSidebar, AdminTopbar, NoAccess },
  data: () => ({ drawer: false, collapsed: localStorage.getItem('shx-sb') === '1' }),
  computed: { allowed () { return routeAllowed(this.$route.path) } },
  watch: { $route () { this.drawer = false } },
  methods: { toggle () { this.collapsed = !this.collapsed; localStorage.setItem('shx-sb', this.collapsed ? '1' : '0') } }
}
</script>
