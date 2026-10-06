<template>
<div>
  <AdminHead :title="$t('orders')" :subtitle="$s.orders.length+' orders · '+pending+' pending'">
    <DateRangeMenu v-model="range"/>
    <ExportMenu :title="$t('orders')" filename="orders" :headers="exHeaders" :rows="exRows" :meta="[$t('dateRange')+': '+range.from+' → '+range.to]"/>
  </AdminHead>
  <div class="flex gap-2 overflow-x-auto no-bar mb-4">
    <button class="chip" :class="!status?'on':''" @click="status=''">{{$t('all')}} ({{$s.orders.length}})</button>
    <button v-for="s in statuses" :key="s" class="chip capitalize" :class="status===s?'on':''" @click="status=s">{{s}} ({{cnt(s)}})</button>
  </div>
  <div class="card p-3 sm:p-4 mb-4 grid gap-3 grid-cols-1 sm:grid-cols-3">
    <UiInput v-model="q" icon="search" :placeholder="$t('search')+'…'"/>
    <UiSelect v-model="pay" :options="[{value:'',label:$t('all')+' '+$t('paymentMethod')},{value:'cod',label:$t('cod')},{value:'bank',label:$t('bank')},{value:'qr',label:'KHQR'}]"/>
    <UiSelect v-model="sort" :options="[{value:'new',label:$t('newest')},{value:'high',label:$t('priceHighLow')},{value:'low',label:$t('priceLowHigh')}]"/>
  </div>
  <DataTable :columns="cols" :rows="paged" :loading="loading" :empty-title="$t('noOrders')">
    <template #row="{row}">
      <td><router-link :to="'/admin/orders/'+encodeURIComponent(row.id)" class="font-medium mono-num link-u">{{row.id}}</router-link></td>
      <td><p class="font-medium">{{row.customer}}</p><p class="text-[11.5px] muted-2">{{row.email}}</p></td>
      <td class="mono-num muted">{{row.date}}</td>
      <td class="mono-num">{{row.itemCount}}</td>
      <td class="mono-num font-medium">{{$money(row.total)}}</td>
      <td class="uppercase text-[12px] muted">{{row.payment==='qr'?'KHQR':row.payment}}</td>
      <td><select v-model="row.status" class="field h-8 w-auto text-[12px] capitalize" @change="$toast('Order '+row.id+' → '+row.status)">
        <option v-for="s in statuses" :key="s" :value="s" class="capitalize">{{s}}</option></select></td>
      <td><div class="flex gap-0.5 justify-end">
        <router-link :to="'/admin/orders/'+encodeURIComponent(row.id)" class="btn-icon"><UiIcon name="eye" :size="15"/></router-link>
        <button class="btn-icon" @click="$toast('Invoice printed')"><UiIcon name="download" :size="15"/></button></div></td>
    </template>
  </DataTable>
  <UiPagination v-if="filtered.length>perPage" class="card mt-3" :page="page" :total="filtered.length" :per-page="perPage" @update:page="p=>page=p"/>
</div>
</template>

<script>
import { STATUSES } from '@/utils/data'
import { resolveRange, inDateRange } from '@/utils/dates'
import { t } from '@/utils/i18n'

export default {
  name: 'AdminOrdersView',
  data: () => ({ loading: true, q: '', status: '', pay: '', sort: 'new', page: 1, perPage: 10, statuses: STATUSES, range: resolveRange('thisYear') }),
  computed: {
    pending () { return this.cnt('pending') },
    exHeaders () { return ['Order ID','Customer','Email','Phone','Date','Items','Payment','Status','Subtotal','Discount','Shipping','Total'] },
    exRows () { return this.filtered.map(o => [o.id,o.customer,o.email,o.phone,o.date,o.itemCount,o.payment.toUpperCase(),o.status,o.subtotal.toFixed(2),o.discount.toFixed(2),o.shipping.toFixed(2),o.total.toFixed(2)]) },
    cols () {
      return [
        {key:'id',label:'Order ID'},{key:'c',label:'Customer'},{key:'d',label:t('date')},{key:'i',label:'Items'},
        {key:'t',label:t('total')},{key:'p',label:'Payment'},{key:'s',label:t('status')},{key:'a',label:t('actions'),align:'right'}
      ]
    },
    filtered () {
      const q = this.q.toLowerCase()
      let l = this.$s.orders.filter(o => (!q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)) &&
        (!this.status || o.status === this.status) && (!this.pay || o.payment === this.pay) && inDateRange(o.date, this.range))
      if (this.sort === 'high') l = [...l].sort((a, b) => b.total - a.total)
      else if (this.sort === 'low') l = [...l].sort((a, b) => a.total - b.total)
      return l
    },
    paged () { const s = (this.page - 1) * this.perPage; return this.filtered.slice(s, s + this.perPage) }
  },
  mounted () { setTimeout(() => { this.loading = false }, 400) },
  methods: { cnt (s) { return this.$s.orders.filter(o => o.status === s).length } }
}
</script>
