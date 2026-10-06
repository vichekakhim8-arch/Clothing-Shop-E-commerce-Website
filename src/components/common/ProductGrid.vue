<template>
  <div>
    <div v-if="loading" class="grid gap-x-4 gap-y-8 grid-cols-2 md:grid-cols-3" :class="cols === 4 ? 'xl:grid-cols-4' : ''">
      <div v-for="i in 8" :key="i">
        <div class="sk ratio-p"></div><div class="sk h-3 mt-3 w-1/3"></div>
        <div class="sk h-3.5 mt-2 w-3/4"></div><div class="sk h-3 mt-2 w-1/4"></div>
      </div>
    </div>
    <div v-else-if="products.length" class="grid gap-x-4 gap-y-10 grid-cols-2 md:grid-cols-3" :class="cols === 4 ? 'xl:grid-cols-4' : ''">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
    <EmptyState v-else icon="search" :title="$t('noProducts')" text="Try adjusting your filters or search keywords." />
  </div>
</template>

<script>
export default {
  name: 'ProductGrid',
  props: { products: Array, loading: Boolean, cols: { default: 4 } }
}
</script>
