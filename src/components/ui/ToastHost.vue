<template>
  <teleport to="body">
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[1400] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
      <transition-group name="toast">
        <div v-for="tt in $s.toasts" :key="tt.id" class="card-soft px-4 py-3 flex items-center gap-3 pointer-events-auto">
          <span class="w-6 h-6 rounded-full flex items-center justify-center shrink-0" :style="tone(tt.type)">
            <UiIcon :name="tt.type === 'error' ? 'alert' : tt.type === 'info' ? 'bell' : 'check'" :size="13" :sw="2.2" />
          </span>
          <span class="text-[13.5px] flex-1 leading-snug">{{ tt.message }}</span>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'ToastHost',
  methods: {
    tone (ty) {
      const m = { success: ['var(--ok-soft)', 'var(--ok)'], error: ['rgba(217,45,32,.12)', '#D92D20'], info: ['var(--info-soft)', 'var(--info)'] }
      const c = m[ty] || m.success
      return { background: c[0], color: c[1] }
    }
  }
}
</script>
