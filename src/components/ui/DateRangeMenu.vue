<template>
  <div class="relative" ref="root">
    <button class="btn btn-sm btn-secondary min-w-[190px] justify-between" @click.stop="open = !open">
      <span class="flex items-center gap-2 truncate"><UiIcon name="calendar" :size="15" />{{ label }}</span>
      <UiIcon name="chevronD" :size="13" class="transition-transform" :style="{ transform: open ? 'rotate(180deg)' : '' }" />
    </button>
    <transition name="pop">
      <div v-if="open" class="absolute right-0 top-full mt-2 w-[min(236px,calc(100vw-2rem))] card-soft overflow-hidden" style="z-index:60">
        <p class="eyebrow px-3.5 pt-3 pb-1.5">{{ $t('quickSelect') }}</p>
        <div class="p-1.5 pt-0 max-h-[320px] overflow-y-auto scroll-thin">
          <template v-for="(p, i) in presets" :key="i">
            <div v-if="p === '—'" class="my-1.5 mx-2 h-px" style="background:var(--line)"></div>
            <button v-else @click="pick(p)" class="flex items-center gap-2 w-full px-2.5 h-9 rounded-[3px] text-[13px]" :class="val.key === p ? 'btn-primary' : 'btn-ghost'">
              <span class="flex-1 text-left">{{ $t(p) }}</span>
              <UiIcon v-if="val.key === p" name="check" :size="14" />
            </button>
          </template>
        </div>
        <div v-if="val.key === 'customRange'" class="p-3 hair-t space-y-2.5" style="background:var(--panel-2)">
          <label class="block"><span class="lbl">{{ $t('from') }}</span><input type="date" v-model="c.from" class="field h-9 text-[12.5px]" /></label>
          <label class="block"><span class="lbl">{{ $t('to') }}</span><input type="date" v-model="c.to" class="field h-9 text-[12.5px]" /></label>
          <UiButton block size="sm" @click="applyCustom">{{ $t('applyRange') }}</UiButton>
        </div>
        <p v-else class="px-3.5 py-2.5 hair-t text-[11.5px] muted-2 mono-num" style="background:var(--panel-2)">{{ val.from }} → {{ val.to }}</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { RANGE_PRESETS, resolveRange } from '@/utils/dates'
import { toast } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'DateRangeMenu',
  props: { modelValue: Object },
  emits: ['update:modelValue'],
  data () {
    const v = this.modelValue || resolveRange('thisMonth')
    return { open: false, presets: RANGE_PRESETS, c: { from: v.from, to: v.to } }
  },
  computed: {
    val () { return this.modelValue || resolveRange('thisMonth') },
    label () { return this.val.key === 'customRange' ? this.val.from + ' → ' + this.val.to : t(this.val.key) }
  },
  mounted () {
    this.h = e => { if (this.open && this.$refs.root && !this.$refs.root.contains(e.target)) this.open = false }
    document.addEventListener('click', this.h)
  },
  unmounted () { document.removeEventListener('click', this.h) },
  methods: {
    pick (k) {
      const r = resolveRange(k, this.c)
      this.$emit('update:modelValue', r)
      this.c = { from: r.from, to: r.to }
      if (k !== 'customRange') this.open = false
    },
    applyCustom () {
      if (this.c.from > this.c.to) return toast('Start date must be before end date', 'error')
      this.$emit('update:modelValue', { key: 'customRange', from: this.c.from, to: this.c.to })
      this.open = false
    }
  }
}
</script>
