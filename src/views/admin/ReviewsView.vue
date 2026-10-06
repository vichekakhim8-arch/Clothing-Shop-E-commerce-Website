<template>
<div>
  <AdminHead :title="$t('reviews')" :subtitle="$s.reviews.length+' reviews · '+pending+' pending'"/>
  <div class="flex gap-2 mb-4 overflow-x-auto no-bar">
    <button class="chip" :class="!st?'on':''" @click="st=''">{{$t('all')}}</button>
    <button v-for="s in ['approved','pending','hidden']" :key="s" class="chip capitalize" :class="st===s?'on':''" @click="st=s">{{s}}</button>
  </div>
  <DataTable :columns="cols" :rows="paged" :empty-title="$t('noReviews')">
    <template #row="{row}">
      <td><div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold" style="background:var(--soft)">{{row.customer[0]}}</span>
        <span class="font-medium">{{row.customer}}</span></div></td>
      <td><router-link :to="'/product/'+row.productId" class="link-u">{{row.product}}</router-link></td>
      <td><StarRating :value="row.rating" :size="12"/></td>
      <td class="muted max-w-[300px]"><p class="line-clamp-2">{{row.text}}</p></td>
      <td class="mono-num muted-2">{{row.date}}</td>
      <td><StatusBadge :status="row.status"/></td>
      <td><div class="flex gap-0.5 justify-end">
        <button class="btn-icon" @click="set(row,'approved')"><UiIcon name="check" :size="15"/></button>
        <button class="btn-icon" @click="set(row,'hidden')"><UiIcon name="eye" :size="15"/></button>
        <button class="btn-icon" style="color:#D92D20" @click="ask(row)"><UiIcon name="trash" :size="15"/></button></div></td>
    </template>
  </DataTable>
  <UiPagination v-if="filtered.length>perPage" class="card mt-3" :page="page" :total="filtered.length" :per-page="perPage" @update:page="p=>page=p"/>
  <ConfirmModal v-model="confirm" message="Delete this review?" @confirm="del"/>
</div>
</template>

<script>
import { toast } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'ReviewsView',
  data: () => ({ st: '', page: 1, perPage: 10, confirm: false, target: null }),
  computed: {
    cols () {
      return [
        {key:'c',label:t('customers')},{key:'p',label:t('products')},{key:'r',label:t('rating')},
        {key:'t',label:t('reviews')},{key:'d',label:t('date')},{key:'s',label:t('status')},{key:'a',label:t('actions'),align:'right'}
      ]
    },
    pending () { return this.$s.reviews.filter(r => r.status === 'pending').length },
    filtered () { return this.$s.reviews.filter(r => !this.st || r.status === this.st) },
    paged () { const s = (this.page - 1) * this.perPage; return this.filtered.slice(s, s + this.perPage) }
  },
  methods: {
    set (r, s) { r.status = s; toast('Review ' + s) },
    ask (r) { this.target = r; this.confirm = true },
    del () { const i = this.$s.reviews.findIndex(r => r.id === this.target.id); if (i > -1) { this.$s.reviews.splice(i, 1); toast('Review deleted') } }
  }
}
</script>
