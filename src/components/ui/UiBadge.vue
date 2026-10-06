<template>
  <span class="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-[3px] rounded-[2px] tracking-wide uppercase" :style="style">
    <i v-if="dot" class="w-1.5 h-1.5 rounded-full" :style="{ background: 'currentColor' }"></i><slot />
  </span>
</template>

<script>
export default {
  name: 'UiBadge',
  props: { tone: { default: 'neutral' }, dot: Boolean },
  computed: {
    style () {
      const m = {
        neutral: ['var(--soft)', 'var(--text-2)'], ok: ['var(--ok-soft)', 'var(--ok)'],
        warn: ['var(--warn-soft)', 'var(--warn)'], info: ['var(--info-soft)', 'var(--info)'],
        danger: ['rgba(217,45,32,.1)', '#D92D20'], accent: ['var(--accent)', '#fff'], dark: ['var(--text)', 'var(--bg)']
      }
      const c = m[this.tone] || m.neutral
      return { background: c[0], color: c[1] }
    }
  }
}
</script>
