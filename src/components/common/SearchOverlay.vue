<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="$s.searchOpen" class="fixed inset-0 z-[1200] flex items-start justify-center pt-[12vh] px-4"
        style="background:rgba(10,10,12,.55); backdrop-filter:blur(4px)" @click.self="close">
        <transition name="pop" appear>
          <div class="card-soft w-full max-w-2xl overflow-hidden">
            <div class="flex items-center gap-3 px-5 h-16 hair-b">
              <UiIcon name="search" :size="19" class="muted-2" />
              <input ref="inp" v-model="q" :placeholder="$t('search') + ' products…'" class="flex-1 bg-transparent outline-none text-[15px]" @keyup.enter="goAll" />
              <button class="btn-icon" @click="close"><UiIcon name="x" :size="18" /></button>
            </div>
            <div class="max-h-[50vh] overflow-y-auto scroll-thin">
              <div v-if="!q" class="p-5">
                <p class="eyebrow mb-3">Trending</p>
                <div class="flex flex-wrap gap-2"><button v-for="s in ['Windbreaker', 'Sneaker', 'Cap', 'Chain', 'Cargo']" :key="s" class="chip" @click="q = s">{{ s }}</button></div>
              </div>
              <template v-else>
                <router-link v-for="p in results" :key="p.id" :to="'/product/' + p.id" @click="close" class="flex items-center gap-4 px-5 py-3 hair-b">
                  <img :src="p.images[0]" class="w-12 h-16 object-cover" />
                  <div class="flex-1 min-w-0">
                    <p class="text-[13.5px] font-medium truncate">{{ p.name }}</p>
                    <p class="eyebrow mt-1">{{ $catName(p.category) }}</p>
                  </div>
                  <PriceTag :product="p" size="sm" />
                </router-link>
                <EmptyState v-if="!results.length" icon="search" :title="$t('noProducts')" :text="'No match for: ' + q" />
              </template>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { nextTick } from 'vue'

export default {
  name: 'SearchOverlay',
  data: () => ({ q: '' }),
  computed: {
    results () {
      const q = this.q.toLowerCase()
      return this.$s.products.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q)).slice(0, 6)
    }
  },
  watch: { '$s.searchOpen' (v) { if (v) nextTick(() => this.$refs.inp && this.$refs.inp.focus()) } },
  methods: {
    close () { this.$s.searchOpen = false; this.q = '' },
    goAll () { if (!this.q) return; this.$router.push('/shop?q=' + encodeURIComponent(this.q)); this.close() }
  }
}
</script>
