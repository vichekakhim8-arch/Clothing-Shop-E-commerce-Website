<template>
  <div class="flex flex-col min-h-screen min-w-0">
    <AppHeader v-if="!bare" />
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in"><component :is="Component" /></transition>
      </router-view>
    </main>
    <AppFooter v-if="!bare" />
    <CartDrawer v-if="!bare" />
    <AuthModal v-if="!bare" />
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CartDrawer from '@/components/common/CartDrawer.vue'
import AuthModal from '@/components/common/AuthModal.vue'

export default {
  name: 'PublicLayout',
  components: { AppHeader, AppFooter, CartDrawer, AuthModal },
  computed: { bare () { return ['/login', '/register'].includes(this.$route.path) } }
}
</script>
