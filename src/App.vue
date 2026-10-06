<template>
  <div class="min-h-screen flex flex-col min-w-0" style="background:var(--bg)">
    <AdminLayout v-if="isAdmin" />
    <PublicLayout v-else />
    <ToastHost />
  </div>
</template>

<script>
import PublicLayout from '@/layouts/PublicLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

export default {
  name: 'App',
  components: { PublicLayout, AdminLayout },
  computed: { isAdmin () { return this.$route.path.startsWith('/admin') } }
}
</script>
