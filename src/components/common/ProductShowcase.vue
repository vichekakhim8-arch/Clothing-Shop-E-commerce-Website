<template>
  <!-- Centre image + horizontal thumbnail rail + 01 — 04 slider indicator -->
  <div class="grid lg:grid-cols-[minmax(0,1fr)_200px] xl:grid-cols-[minmax(0,1fr)_264px] gap-5 xl:gap-7 items-center">
    <div class="relative overflow-hidden select-none ratio-p sm:aspect-[4/5]" style="background:var(--soft)"
      @touchstart.passive="tStart" @touchend.passive="tEnd">
      <transition name="fade" mode="out-in">
        <img :key="idx" :src="images[idx]" :alt="alt" class="w-full h-full object-cover" />
      </transition>
      <span v-if="badge" class="absolute top-4 left-4 accent-bg px-2 py-1 text-[11px] font-semibold tracking-wide">{{ badge }}</span>
      <button class="absolute left-3 top-1/2 -translate-y-1/2 btn-icon" style="background:var(--panel)" @click="prev" aria-label="Previous"><UiIcon name="chevronL" :size="17" /></button>
      <button class="absolute right-3 top-1/2 -translate-y-1/2 btn-icon" style="background:var(--panel)" @click="next" aria-label="Next"><UiIcon name="chevronR" :size="17" /></button>
    </div>
    <div class="min-w-0">
      <p class="eyebrow mb-3 hidden lg:block">{{ $t('gallery') }}</p>
      <div class="flex gap-2.5 lg:gap-3 overflow-x-auto no-bar pb-1 lg:-mr-4 xl:-mr-8 lg:pr-4 xl:pr-8">
        <button v-for="(im, i) in images" :key="i" @click="idx = i" :aria-label="'View image ' + (i + 1)"
          class="shrink-0 w-[72px] lg:w-[124px] xl:w-[148px] aspect-[3/4] overflow-hidden img-zoom transition-opacity duration-300"
          :style="{ opacity: i === idx ? 1 : .42 }"><img :src="im" class="w-full h-full object-cover" /></button>
      </div>
      <div class="flex items-center gap-3 mt-3 lg:mt-5 text-[11.5px] mono-num muted-2">
        <span :style="{ color: 'var(--text)' }">{{ pad(idx + 1) }}</span>
        <span class="flex-1 h-px relative" style="background:var(--line)">
          <span class="absolute top-0 h-px transition-all duration-500" style="background:var(--text)" :style="bar"></span>
        </span>
        <span>{{ pad(images.length) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductShowcase',
  props: { images: { type: Array, default: () => [] }, alt: String, badge: String, size: { default: 'md' } },
  data: () => ({ idx: 0, tx: null }),
  computed: { bar () { const n = this.images.length || 1; return { left: (this.idx / n * 100) + '%', width: (100 / n) + '%' } } },
  watch: { images () { this.idx = 0 } },
  methods: {
    pad (n) { return String(n).padStart(2, '0') },
    next () { this.idx = (this.idx + 1) % this.images.length },
    prev () { this.idx = (this.idx - 1 + this.images.length) % this.images.length },
    tStart (e) { this.tx = e.changedTouches[0].clientX },
    tEnd (e) { const d = e.changedTouches[0].clientX - (this.tx || 0); if (Math.abs(d) > 45) d < 0 ? this.next() : this.prev() }
  }
}
</script>
