<template>
  <div class="space-y-7">
    <div><p class="lbl">{{ $t('search') }}</p><UiInput v-model="f.q" icon="search" :placeholder="$t('search') + '…'" /></div>
    <div>
      <p class="lbl">{{ $t('categories') }}</p>
      <label v-for="c in $s.categories" :key="c.id" class="flex items-center gap-2.5 py-1.5 cursor-pointer text-[13.5px]">
        <input type="checkbox" :value="c.slug" v-model="f.cats" class="w-4 h-4" style="accent-color:var(--text)" />
        <span class="flex-1">{{ $s.lang === 'km' ? c.nameKm : c.name }}</span>
        <span class="text-[11.5px] muted-2 mono-num">{{ cnt(c.slug) }}</span>
      </label>
    </div>
    <div>
      <p class="lbl">{{ $t('price') }}</p>
      <div class="flex items-center gap-2">
        <input v-model="f.min" type="number" placeholder="Min" class="field" /><span class="muted-2">–</span>
        <input v-model="f.max" type="number" placeholder="Max" class="field" />
      </div>
      <div class="flex flex-wrap gap-1.5 mt-2.5">
        <button v-for="r in ranges" :key="r.l" class="chip" :class="isRange(r) ? 'on' : ''" @click="f.min = r.a; f.max = r.b">{{ r.l }}</button>
      </div>
    </div>
    <div>
      <p class="lbl">{{ $t('size') }}</p>
      <div class="flex flex-wrap gap-1.5"><button v-for="s in sizes" :key="s" class="size-box" :class="f.sizes.includes(s) ? 'on' : ''" @click="tog(f.sizes, s)">{{ s }}</button></div>
    </div>
    <div>
      <p class="lbl">{{ $t('colour') }}</p>
      <div class="flex flex-wrap gap-1.5">
        <button v-for="c in colors" :key="c" class="chip" :class="f.colors.includes(c) ? 'on' : ''" @click="tog(f.colors, c)">
          <i class="w-2.5 h-2.5 rounded-full hair" :style="{ background: swatch(c) }"></i>{{ c }}
        </button>
      </div>
    </div>
    <div>
      <p class="lbl">{{ $t('rating') }}</p>
      <button v-for="r in [4, 3, 2]" :key="r" class="flex items-center gap-2 py-1.5 text-[13px] w-full" @click="f.rating = f.rating === r ? 0 : r">
        <StarRating :value="r" :size="12" /><span :class="f.rating === r ? 'font-medium' : 'muted'">&amp; up</span>
        <UiIcon v-if="f.rating === r" name="check" :size="13" class="ml-auto" />
      </button>
    </div>
    <div>
      <p class="lbl">{{ $t('availability') }}</p>
      <div class="flex flex-wrap gap-1.5">
        <button class="chip" :class="f.avail === 'in' ? 'on' : ''" @click="f.avail = f.avail === 'in' ? '' : 'in'">{{ $t('inStock') }}</button>
        <button class="chip" :class="f.avail === 'out' ? 'on' : ''" @click="f.avail = f.avail === 'out' ? '' : 'out'">{{ $t('outOfStock') }}</button>
      </div>
    </div>
    <button class="chip-clear w-full justify-center" @click="reset()"><UiIcon name="refresh" :size="13" />{{ $t('clearAll') }}</button>
  </div>
</template>

<script>
import { swatch } from '@/utils/helpers'
export default {
  name: 'ProductFilters',
  props: { modelValue: Object, reset: Function },
  emits: ['update:modelValue'],
  computed: {
    f () { return this.modelValue },
    sizes () { const s = new Set(); this.$s.products.forEach(p => p.sizes.forEach(x => s.add(x))); return [...s].slice(0, 12) },
    colors () { const s = new Set(); this.$s.products.forEach(p => p.colors.forEach(x => s.add(x))); return [...s] },
    ranges () { return [{ l: '< $50', a: 0, b: 50 }, { l: '$50–100', a: 50, b: 100 }, { l: '$100–200', a: 100, b: 200 }, { l: '$200+', a: 200, b: null }] }
  },
  methods: {
    swatch,
    tog (arr, v) { const i = arr.indexOf(v); i > -1 ? arr.splice(i, 1) : arr.push(v) },
    isRange (r) { return String(this.f.min) === String(r.a) && String(this.f.max) === String(r.b) },
    cnt (slug) { return this.$s.products.filter(p => p.category === slug).length }
  }
}
</script>
