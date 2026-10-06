<template>
<div class="max-w-[1100px] mx-auto px-4 sm:px-8 py-10 lg:py-14">
  <h1 class="display text-[clamp(26px,5vw,38px)] font-semibold uppercase">{{$t('orderHistory')}}</h1>
  <div class="flex flex-wrap gap-2 mt-6">
    <button class="chip" :class="!filter?'on':''" @click="filter=''">{{$t('all')}}</button>
    <button v-for="s in statuses" :key="s" class="chip capitalize" :class="filter===s?'on':''" @click="filter=s">{{s}}</button>
  </div>
  <LoadingState v-if="loading" class="card mt-6"/>
  <div v-else-if="list.length" class="space-y-4 mt-6">
    <router-link v-for="o in list" :key="o.id" :to="'/order/'+encodeURIComponent(o.id)" class="card p-5 flex flex-wrap items-center gap-4 hover:shadow-md transition">
      <div class="flex -space-x-3"><img v-for="(it,i) in o.items.slice(0,3)" :key="i" :src="it.image" class="w-12 h-16 object-cover hair" style="background:var(--soft)"/></div>
      <div class="flex-1 min-w-[160px]">
        <p class="display text-[14px] font-semibold mono-num">{{o.id}}</p>
        <p class="text-[12.5px] muted mt-1">{{o.date}} · {{o.itemCount}} items</p>
      </div>
      <StatusBadge :status="o.status"/>
      <p class="font-semibold mono-num">{{$money(o.total)}}</p>
      <UiIcon name="chevronR" :size="16" class="muted-2"/>
    </router-link>
  </div>
  <div v-else class="card mt-6"><EmptyState icon="box" :title="$t('noOrders')" text="When you place an order it will appear here." :action-label="$t('shopNow')" action-to="/shop"/></div>
</div>
</template>

<script>
import { STATUSES } from '@/utils/data'

export default {
  name: 'OrdersView',
  data: () => ({ loading: true, filter: '', statuses: STATUSES }),
  computed: { list () { return this.$s.orders.filter(o => !this.filter || o.status === this.filter) } },
  mounted () { setTimeout(() => { this.loading = false }, 400) }
}
</script>
