<template>
  <UiModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :title="$t('quickView')" size="lg">
    <div class="grid sm:grid-cols-2 gap-6">
      <div class="ratio-p overflow-hidden" style="background:var(--soft)"><img :src="product.images[0]" class="w-full h-full object-cover" /></div>
      <div class="flex flex-col">
        <p class="eyebrow">{{ $catName(product.category) }}</p>
        <h3 class="display text-[22px] font-semibold uppercase mt-1 leading-tight">{{ product.name }}</h3>
        <StarRating :value="product.rating" :count="product.reviewCount" class="mt-2" />
        <PriceTag :product="product" size="lg" class="mt-3" />
        <p class="text-[13.5px] muted mt-3 leading-relaxed">{{ product.description }}</p>
        <div class="mt-4">
          <p class="lbl">{{ $t('size') }}</p>
          <div class="flex flex-wrap gap-2"><button v-for="s in product.sizes" :key="s" class="size-box" :class="size === s ? 'on' : ''" @click="size = s">{{ s }}</button></div>
        </div>
        <div class="mt-4">
          <p class="lbl">{{ $t('colour') }}</p>
          <div class="flex flex-wrap gap-2"><button v-for="c in product.colors" :key="c" class="chip" :class="color === c ? 'on' : ''" @click="color = c">{{ c }}</button></div>
        </div>
        <div class="flex gap-2 mt-6">
          <UiButton block @click="add" :disabled="product.stock === 0">{{ $t('addToCart') }}</UiButton>
          <UiButton variant="secondary" :to="'/product/' + product.id" @click="$emit('update:modelValue', false)" icon="arrowUR" />
        </div>
      </div>
    </div>
  </UiModal>
</template>

<script>
import { addToCart } from '@/utils/helpers'
export default {
  name: 'QuickView',
  props: { modelValue: Boolean, product: Object },
  emits: ['update:modelValue'],
  data () { return { size: this.product.sizes[0], color: this.product.colors[0] } },
  methods: { add () { addToCart(this.product, this.size, this.color); this.$emit('update:modelValue', false) } }
}
</script>
