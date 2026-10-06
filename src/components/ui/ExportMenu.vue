<template>
  <div class="relative" ref="root">
    <button :class="['btn', 'btn-' + size, 'btn-' + variant]" @click.stop="open = !open" :aria-expanded="open">
      <UiIcon name="download" :size="15" />{{ $t('export') }}
      <UiIcon name="chevronD" :size="13" class="transition-transform" :style="{ transform: open ? 'rotate(180deg)' : '' }" />
    </button>
    <transition name="pop">
      <div v-if="open" class="absolute right-0 top-full mt-2 w-[min(208px,calc(100vw-2rem))] card-soft overflow-hidden" style="z-index:60">
        <p class="eyebrow px-3.5 pt-3 pb-2">{{ $t('export') }} · <span class="mono-num">{{ rows.length }}</span> {{ $t('rows') }}</p>
        <div class="p-1.5 pt-0">
          <button v-for="o in opts" :key="o.k" @click="go(o.k)" class="flex items-center gap-3 w-full px-2.5 h-9 rounded-[3px] text-[13px] btn-ghost">
            <UiIcon :name="o.i" :size="15" /><span class="flex-1 text-left">{{ o.l }}</span>
            <span class="text-[10px] muted-2 uppercase">{{ o.x }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { t } from '@/utils/i18n'
import { runExport } from '@/utils/exporter'

export default {
  name: 'ExportMenu',
  props: {
    title: String, filename: String, headers: { type: Array, default: () => [] },
    rows: { type: Array, default: () => [] }, meta: { type: Array, default: () => [] },
    size: { default: 'sm' }, variant: { default: 'secondary' }
  },
  data: () => ({ open: false }),
  computed: {
    opts () {
      return [
        { k: 'excel', i: 'sheet', l: t('excel'), x: 'xls' },
        { k: 'csv', i: 'fileText', l: t('csv'), x: 'csv' },
        { k: 'pdf', i: 'filePdf', l: t('pdf'), x: 'pdf' },
        { k: 'print', i: 'printer', l: t('printDoc'), x: '' }
      ]
    }
  },
  mounted () {
    this.h = e => { if (this.open && this.$refs.root && !this.$refs.root.contains(e.target)) this.open = false }
    document.addEventListener('click', this.h)
  },
  unmounted () { document.removeEventListener('click', this.h) },
  methods: {
    go (kind) {
      this.open = false
      runExport(kind, {
        title: this.title || 'Report', filename: this.filename || this.title,
        headers: this.headers, rows: this.rows,
        meta: [t('generated') + ': ' + new Date().toLocaleString(), ...this.meta]
      })
    }
  }
}
</script>
