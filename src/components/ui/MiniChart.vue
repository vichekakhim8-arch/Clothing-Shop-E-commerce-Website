<template>
  <div class="w-full">
    <!-- compact sparkline -->
    <div v-if="!axes" :style="{ height: height + 'px' }">
      <svg :viewBox="'0 0 320 ' + height" preserveAspectRatio="none" class="w-full h-full">
        <template v-if="type === 'line'">
          <polygon :points="area" :fill="stroke" opacity=".07" />
          <polyline :points="pts" fill="none" :stroke="stroke" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" />
        </template>
        <template v-else>
          <rect v-for="(p, i) in coords" :key="i" :x="p.x - bw / 2" :y="p.y" :width="bw" :height="Math.max(2, plotH - p.y)" :fill="stroke" opacity=".85" rx="1" />
        </template>
      </svg>
      <div v-if="labels.length" class="flex justify-between mt-2 text-[10.5px] muted-2 tracking-wide">
        <span v-for="(l, i) in labels" :key="i">{{ l }}</span>
      </div>
    </div>
    <!-- full chart with X + Y axes -->
    <svg v-else :viewBox="'0 0 ' + VW + ' ' + VH" class="w-full block" preserveAspectRatio="xMidYMid meet" :style="{ maxHeight: (height + 40) + 'px' }">
      <g v-for="(tk, i) in ticks" :key="'g' + i">
        <line :x1="PL" :x2="VW - PR" :y1="tk.y" :y2="tk.y" stroke="var(--line)" stroke-width="1" :stroke-dasharray="i === ticks.length - 1 ? '0' : '3 4'" />
        <text :x="PL - 10" :y="tk.y + 3.5" text-anchor="end" fill="var(--text-3)" style="font-size:10.5px;font-family:Inter,sans-serif;font-variant-numeric:tabular-nums">{{ tk.label }}</text>
      </g>
      <line :x1="PL" :x2="PL" :y1="PT" :y2="VH - PB" stroke="var(--line)" stroke-width="1" />
      <template v-if="type === 'line'">
        <polygon :points="area" :fill="stroke" opacity=".07" />
        <polyline :points="pts" fill="none" :stroke="stroke" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
        <circle v-for="(p, i) in coords" :key="'d' + i" :cx="p.x" :cy="p.y" r="3.2" fill="var(--panel)" :stroke="stroke" stroke-width="1.8" />
      </template>
      <template v-else>
        <rect v-for="(p, i) in coords" :key="'b' + i" :x="p.x - bw / 2" :y="p.y" :width="bw" :height="Math.max(2, (VH - PB) - p.y)" :fill="stroke" opacity=".88" rx="2" />
      </template>
      <text v-for="(l, i) in labels" :key="'x' + i" :x="xLabelPos(i)" :y="VH - 6" text-anchor="middle" fill="var(--text-3)" style="font-size:10.5px;font-family:Inter,sans-serif">{{ l }}</text>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'MiniChart',
  props: {
    data: Array, labels: { type: Array, default: () => [] }, type: { default: 'line' },
    height: { default: 180 }, accent: Boolean, axes: Boolean, format: { default: 'num' }
  },
  data: () => ({ VW: 640, PL: 52, PR: 14, PT: 14, PB: 26 }),
  computed: {
    VH () { return this.axes ? 230 : this.height },
    plotH () { return this.height - 4 },
    stroke () { return this.accent ? 'var(--accent)' : 'var(--text)' },
    niceMax () {
      const raw = Math.max(...this.data, 1)
      const pow = Math.pow(10, Math.floor(Math.log10(raw)))
      const n = raw / pow
      const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10
      return step * pow
    },
    ticks () {
      const steps = 4, top = this.VH - this.PB, bot = this.PT, out = []
      for (let i = 0; i <= steps; i++) {
        const v = this.niceMax * (1 - i / steps)
        out.push({ y: bot + (top - bot) * (i / steps), label: this.fmt(v) })
      }
      return out
    },
    coords () {
      const n = this.data.length
      if (this.axes) {
        const top = this.VH - this.PB, bot = this.PT, w = this.VW - this.PL - this.PR
        const slot = w / n
        return this.data.map((v, i) => ({
          x: this.type === 'bar' ? this.PL + slot * i + slot / 2 : this.PL + (n === 1 ? w / 2 : (w / (n - 1)) * i),
          y: top - (v / this.niceMax) * (top - bot)
        }))
      }
      const h = this.plotH
      return this.data.map((v, i) => ({ x: n === 1 ? 160 : i * (320 / (n - 1)), y: h - (v / (Math.max(...this.data, 1) * 1.15)) * h + 2 }))
    },
    pts () { return this.coords.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ') },
    area () {
      const c = this.coords; if (!c.length) return ''
      const base = this.axes ? this.VH - this.PB : this.plotH
      return c[0].x + ',' + base + ' ' + this.pts + ' ' + c[c.length - 1].x + ',' + base
    },
    bw () {
      const w = this.axes ? (this.VW - this.PL - this.PR) : 320
      return Math.max(3, Math.min(this.axes ? 30 : 26, (w / this.data.length) * 0.55))
    }
  },
  methods: {
    xLabelPos (i) {
      const n = this.labels.length, w = this.VW - this.PL - this.PR
      if (this.type === 'bar' || n !== this.data.length) { const slot = w / n; return this.PL + slot * i + slot / 2 }
      return this.PL + (n === 1 ? w / 2 : (w / (n - 1)) * i)
    },
    fmt (v) {
      if (this.format === 'money') {
        if (v >= 1000000) return '$' + (v / 1000000).toFixed(v % 1000000 ? 1 : 0) + 'm'
        if (v >= 1000) return '$' + (v / 1000).toFixed(v % 1000 ? 1 : 0) + 'k'
        return '$' + Math.round(v)
      }
      if (v >= 1000) return (v / 1000).toFixed(v % 1000 ? 1 : 0) + 'k'
      return String(Math.round(v))
    }
  }
}
</script>
