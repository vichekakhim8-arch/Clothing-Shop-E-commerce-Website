<template>
<div>
  <AdminHead :title="$t('reports')" :subtitle="$t('reportsSubtitle')">
    <DateRangeMenu v-model="range"/>
    <ExportMenu :title="reportTitle" filename="sales-report" :headers="exHeaders" :rows="exRows" :meta="exMeta"/>
  </AdminHead>
  <div class="flex flex-wrap items-center gap-2 mb-4">
    <button v-for="k in quick" :key="k" class="chip" :class="range.key===k?'on':''" @click="range=resolve(k)">{{$t(k)}}</button>
    <span class="text-[12px] muted-2 mono-num ml-auto">{{range.from}} → {{range.to}} · {{orders.length}} {{$t('orders')}}</span>
  </div>
  <div class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
    <StatCard :label="$t('grossSales')" :value="$money(sum)" :delta="14.2" icon="chart"/>
    <StatCard :label="$t('netRevenue')" :value="$money(sum*0.88)" :delta="9.7" icon="card"/>
    <StatCard :label="$t('totalOrders')" :value="String(orders.length)" :delta="6.3" icon="truck"/>
    <StatCard :label="$t('avgOrderValue')" :value="$money(orders.length? sum/orders.length:0)" :delta="-2.1" icon="tag"/>
  </div>
  <AdminCard class="mt-4" :title="$t('ordersReport')" :subtitle="label" :pad="false">
    <DataTable :columns="ocols" :rows="orders.slice(0,8)" :empty-title="$t('noOrders')" :empty-text="'No orders between '+range.from+' and '+range.to">
      <template #row="{row}">
        <td><router-link :to="'/admin/orders/'+encodeURIComponent(row.id)" class="font-medium mono-num link-u">{{row.id}}</router-link></td>
        <td>{{row.customer}}</td><td class="mono-num muted">{{row.date}}</td>
        <td><StatusBadge :status="row.status"/></td>
        <td class="text-right mono-num font-medium">{{$money(row.total)}}</td>
      </template>
    </DataTable>
  </AdminCard>
  <div class="grid gap-4 lg:grid-cols-2 mt-4">
    <AdminCard :title="$t('revenueReport')" :subtitle="label"><MiniChart axes format="money" :data="series" :labels="labels" :height="210"/></AdminCard>
    <AdminCard :title="$t('ordersOverview')" :subtitle="label"><MiniChart axes type="bar" :data="series2" :labels="labels" :height="210" accent/></AdminCard>
  </div>
  <div class="grid gap-4 lg:grid-cols-2 mt-4">
    <AdminCard :title="$t('productReport')" :pad="false">
      <DataTable :columns="[{key:'p',label:$t('products')},{key:'s',label:$t('sold')},{key:'r',label:$t('revenue'),align:'right'}]" :rows="topProducts">
        <template #row="{row}">
          <td><div class="flex items-center gap-3"><img :src="row.images[0]" class="w-8 h-10 object-cover"/><span class="font-medium">{{row.name}}</span></div></td>
          <td class="mono-num">{{row.sold}}</td>
          <td class="text-right mono-num font-medium">{{$money(row.sold*$price(row).final)}}</td>
        </template>
      </DataTable>
    </AdminCard>
    <AdminCard :title="$t('customerReport')" :pad="false">
      <DataTable :columns="[{key:'c',label:$t('customers')},{key:'o',label:$t('orders')},{key:'s',label:$t('totalSpent'),align:'right'}]" :rows="topCustomers">
        <template #row="{row}">
          <td class="font-medium">{{row.name}}</td><td class="mono-num">{{row.orders}}</td>
          <td class="text-right mono-num font-medium">{{$money(row.spent)}}</td>
        </template>
      </DataTable>
    </AdminCard>
  </div>
</div>
</template>

<script>
import { resolveRange, inDateRange } from '@/utils/dates'
import { money } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'ReportsView',
  data: () => ({ range: resolveRange('thisMonth'), quick: ['today', 'thisWeek', 'thisMonth', 'last30Days', 'thisQuarter', 'thisYear'] }),
  computed: {
    orders () { return this.$s.orders.filter(o => inDateRange(o.date, this.range)) },
    sum () { return this.orders.reduce((s, o) => s + o.total, 0) },
    label () { return this.range.key === 'customRange' ? this.range.from + ' → ' + this.range.to : t(this.range.key) },
    reportTitle () { return t('salesReport') + ' — ' + this.label },
    ocols () { return [{key:'id',label:'Order ID'},{key:'c',label:'Customer'},{key:'d',label:t('date')},{key:'s',label:t('status')},{key:'t',label:t('total'),align:'right'}] },
    exHeaders () { return ['Order ID','Customer','Email','Date','Items','Payment','Status','Total'] },
    exRows () { return this.orders.map(o => [o.id,o.customer,o.email,o.date,o.itemCount,o.payment.toUpperCase(),o.status,o.total.toFixed(2)]) },
    exMeta () { return [t('dateRange')+': '+this.range.from+' → '+this.range.to, t('grossSales')+': '+money(this.sum), t('totalOrders')+': '+this.orders.length] },
    labels () {
      const k = this.range.key
      return k === 'today' || k === 'yesterday' ? ['00','04','08','12','16','20','24']
        : k === 'thisWeek' || k === 'lastWeek' || k === 'last7Days' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
        : k === 'thisYear' || k === 'lastYear' ? ['J','F','M','A','M','J','J','A','S','O','N','D']
        : ['W1','W2','W3','W4','W5']
    },
    series () { const n = this.labels.length; return Array.from({ length: n }, (_, i) => Math.round(1800 + Math.sin(i * 1.2) * 700 + i * 340)) },
    series2 () { const n = this.labels.length; return Array.from({ length: n }, (_, i) => Math.round(22 + Math.cos(i) * 8 + i * 5)) },
    topProducts () { return [...this.$s.products].sort((a, b) => b.sold - a.sold).slice(0, 6) },
    topCustomers () { return [...this.$s.customers].sort((a, b) => b.spent - a.spent).slice(0, 6) }
  },
  methods: { resolve (k) { return resolveRange(k) } }
}
</script>
