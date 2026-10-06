<template>
  <span class="inline-flex items-baseline gap-2 flex-wrap">
    <span class="font-semibold mono-num" :class="size === 'lg' ? 'text-[30px]' : size === 'sm' ? 'text-[13.5px]' : 'text-[15px]'">{{ $money(p.final) }}</span>
    <template v-if="p.has">
      <s class="muted-2 mono-num" :class="size === 'lg' ? 'text-[15px]' : 'text-[12.5px]'">{{ $money(p.base) }}</s>
      <span v-if="!hideBadge" class="accent text-[11px] font-semibold tracking-wide">−{{ p.percent }}% {{ $t('off') }}</span>
    </template>
  </span>
</template>

<script>
import { priceOf } from '@/utils/helpers'
export default {
  name: 'PriceTag',
  props: { product: Object, size: { default: 'md' }, hideBadge: Boolean },
  computed: { p () { return priceOf(this.product) } }
}
</script>
