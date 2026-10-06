<template>
  <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hair-t">
    <p class="text-[12.5px] muted-2 mono-num order-2 sm:order-1">{{ from }}–{{ to }} {{ $t('of') }} {{ total }}</p>
    <div class="flex items-center gap-1 order-1 sm:order-2 w-full sm:w-auto justify-center">
      <button class="btn-icon" :disabled="page <= 1" @click="go(page - 1)" :style="{ opacity: page <= 1 ? .35 : 1 }"><UiIcon name="chevronL" :size="16" /></button>
      <button v-for="p in pages" :key="p" @click="p !== '…' && go(p)"
        :class="['h-9 min-w-9 px-2 text-[13px] rounded-[4px] transition mono-num', p === page ? 'btn-primary' : 'btn-ghost']">{{ p }}</button>
      <button class="btn-icon" :disabled="page >= last" @click="go(page + 1)" :style="{ opacity: page >= last ? .35 : 1 }"><UiIcon name="chevronR" :size="16" /></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiPagination',
  props: { page: Number, total: Number, perPage: Number },
  emits: ['update:page'],
  computed: {
    last () { return Math.max(1, Math.ceil(this.total / this.perPage)) },
    from () { return this.total ? (this.page - 1) * this.perPage + 1 : 0 },
    to () { return Math.min(this.total, this.page * this.perPage) },
    pages () {
      const l = this.last, p = this.page, out = []
      if (l <= 7) { for (let i = 1; i <= l; i++) out.push(i); return out }
      out.push(1); if (p > 3) out.push('…')
      for (let i = Math.max(2, p - 1); i <= Math.min(l - 1, p + 1); i++) out.push(i)
      if (p < l - 2) out.push('…'); out.push(l)
      return out
    }
  },
  methods: { go (p) { if (p >= 1 && p <= this.last) this.$emit('update:page', p) } }
}
</script>
