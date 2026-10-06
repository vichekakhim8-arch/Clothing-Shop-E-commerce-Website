<template>
<div>
  <AdminHead :title="$t('dashboard')" :subtitle="subtitle">
    <DateRangeMenu v-model="range"/>
    <ExportMenu title="Dashboard Report" filename="dashboard" :headers="exHeaders" :rows="exRows" :meta="exMeta"/>
    <UiButton size="sm" icon="plus" to="/admin/products/create" class="max-sm:hidden">{{$t('addProduct')}}</UiButton>
  </AdminHead>
  <div class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
    <StatCard :label="$t('totalRevenue')" :value="$money(revenue)" :delta="12.4" icon="chart" :data="rev"/>
    <StatCard :label="$t('totalOrders')" :value="String(ranged.length)" :delta="8.1" icon="truck" :data="ord"/>
    <StatCard :label="$t('totalCustomers')" :value="String($s.customers.length)" :delta="4.6" icon="users" :data="cus"/>
    <StatCard :label="$t('totalProducts')" :value="String($s.products.length)" :delta="-1.2" icon="box" :data="prd"/>
  </div>
  <div class="grid gap-4 lg:grid-cols-3 mt-4">
    <AdminCard class="lg:col-span-2" :title="$t('revenueOverview')" :subtitle="$t('last12Months')">
      <MiniChart axes format="money" :data="rev12" :labels="months" :height="230"/>
    </AdminCard>
    <AdminCard :title="$t('alerts')">
      <div class="space-y-3">
        <div v-for="a in alerts" :key="a.t" class="flex items-start gap-3 p-3 rounded-[3px]" :style="{background:a.bg}">
          <UiIcon :name="a.i" :size="16" :style="{color:a.c}" class="mt-0.5"/>
          <div class="flex-1"><p class="text-[13px] font-medium">{{a.t}}</p><p class="text-[12px] muted-2 mt-0.5">{{a.d}}</p></div>
          <router-link :to="a.to" class="btn-icon"><UiIcon name="chevronR" :size="15"/></router-link>
        </div>
      </div>
    </AdminCard>
  </div>
  <div class="grid gap-4 lg:grid-cols-3 mt-4">
    <AdminCard class="lg:col-span-2" :title="$t('recentOrders')" :subtitle="rangeLabel" :pad="false">
      <template #actions><router-link to="/admin/orders" class="text-[12px] link-u">{{$t('viewAll')}}</router-link></template>
      <DataTable :columns="cols" :rows="recent" :empty-title="$t('noOrders')" :empty-text="'No orders in '+rangeLabel">
        <template #row="{row}">
          <td><router-link :to="'/admin/orders/'+encodeURIComponent(row.id)" class="font-medium mono-num link-u">{{row.id}}</router-link></td>
          <td>{{row.customer}}</td><td class="mono-num muted">{{row.date}}</td>
          <td><StatusBadge :status="row.status"/></td>
          <td class="text-right font-medium mono-num">{{$money(row.total)}}</td>
        </template>
      </DataTable>
    </AdminCard>
    <AdminCard :title="$t('bestSellingProducts')">
      <div class="space-y-4">
        <div v-for="(p,i) in bestSellers" :key="p.id" class="flex items-center gap-3">
          <span class="text-[12px] muted-2 mono-num w-4">{{i+1}}</span>
          <img :src="p.images[0]" class="w-10 h-[52px] object-cover"/>
          <div class="flex-1 min-w-0"><p class="text-[13px] font-medium truncate">{{p.name}}</p>
            <p class="text-[11.5px] muted-2 mono-num">{{p.sold}} {{$t('soldUnits')}}</p></div>
          <span class="text-[13px] font-medium mono-num">{{$money($price(p).final)}}</span>
        </div>
      </div>
    </AdminCard>
  </div>
  <AdminCard class="mt-4" :title="$t('ordersOverview')" :subtitle="$t('ordersPerMonth')">
    <MiniChart axes type="bar" :data="ord12" :labels="months" :height="200" accent/>
  </AdminCard>
</div>
</template>

<script>
import { resolveRange, inDateRange } from '@/utils/dates'
import { stockState, money } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'DashboardView',
  data: () => ({
    range: resolveRange('last30Days'),
    months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    rev12: [8.2,9.1,7.6,11.4,12.9,10.8,13.6,15.2,14.1,17.8,19.4,21.2].map(v => v * 1000),
    ord12: [42,51,38,64,72,58,80,93,86,104,118,131],
    rev: [4,6,5,8,7,10,12], ord: [3,5,4,7,6,8,9], cus: [2,3,5,4,6,7,8], prd: [9,9,10,10,11,11,12]
  }),
  computed: {
    ranged () { return this.$s.orders.filter(o => inDateRange(o.date, this.range)) },
    rangeLabel () { return this.range.key === 'customRange' ? this.range.from + ' → ' + this.range.to : t(this.range.key) },
    subtitle () { return t('welcomeAdmin') + ', ' + this.$s.admin.name.split(' ')[0] + ' · ' + this.rangeLabel + ' · ' + this.range.from + ' → ' + this.range.to },
    revenue () { return this.ranged.reduce((s, o) => s + o.total, 0) },
    recent () { return this.ranged.slice(0, 6) },
    bestSellers () { return [...this.$s.products].sort((a, b) => b.sold - a.sold).slice(0, 5) },
    cols () { return [{key:'id',label:'Order'},{key:'c',label:'Customer'},{key:'d',label:t('date')},{key:'s',label:t('status')},{key:'t',label:t('total'),align:'right'}] },
    exHeaders () { return ['Order ID','Customer','Email','Date','Items','Payment','Status','Subtotal','Discount','Shipping','Total'] },
    exRows () { return this.ranged.map(o => [o.id,o.customer,o.email,o.date,o.itemCount,o.payment.toUpperCase(),o.status,o.subtotal.toFixed(2),o.discount.toFixed(2),o.shipping.toFixed(2),o.total.toFixed(2)]) },
    exMeta () { return [t('dateRange')+': '+this.range.from+' → '+this.range.to, t('totalRevenue')+': '+money(this.revenue), t('totalOrders')+': '+this.ranged.length] },
    alerts () {
      const low = this.$s.products.filter(p => stockState(p) === 'low').length
      const out = this.$s.products.filter(p => stockState(p) === 'out').length
      const pend = this.$s.orders.filter(o => o.status === 'pending').length
      return [
        { i:'alert', t: low+' products low on stock', d:'Restock before the weekend drop', to:'/admin/inventory', bg:'var(--warn-soft)', c:'var(--warn)' },
        { i:'box', t: out+' products out of stock', d:'Currently hidden from storefront', to:'/admin/inventory', bg:'rgba(217,45,32,.08)', c:'#D92D20' },
        { i:'truck', t: pend+' orders pending', d:'Awaiting confirmation', to:'/admin/orders', bg:'var(--info-soft)', c:'var(--info)' }
      ]
    }
  }
}
</script>
