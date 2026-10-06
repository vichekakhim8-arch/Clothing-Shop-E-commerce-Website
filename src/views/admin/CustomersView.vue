<template>
<div>
  <AdminHead :title="$t('customers')" :subtitle="$s.customers.length+' registered customers'">
    <ExportMenu :title="$t('customers')" filename="customers" :headers="exHeaders" :rows="exRows"/>
  </AdminHead>
  <div class="card p-3 sm:p-4 mb-4 grid gap-3 grid-cols-1 sm:grid-cols-3">
    <UiInput v-model="q" icon="search" :placeholder="$t('search')+'…'"/>
    <UiSelect v-model="status" :options="[{value:'',label:$t('all')+' '+$t('status')},{value:'active',label:$t('active')},{value:'inactive',label:$t('inactive')}]"/>
    <UiSelect v-model="sort" :options="[{value:'spent',label:'Top spending'},{value:'orders',label:'Most orders'},{value:'new',label:$t('newest')}]"/>
  </div>
  <DataTable :columns="cols" :rows="paged" :loading="loading" :empty-title="$t('noCustomers')">
    <template #row="{row}">
      <td><div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold" style="background:var(--soft)">{{ini(row.name)}}</span>
        <span class="font-medium">{{row.name}}</span></div></td>
      <td class="muted">{{row.email}}</td><td class="mono-num muted">{{row.phone}}</td>
      <td class="mono-num">{{row.orders}}</td><td class="mono-num font-medium">{{$money(row.spent)}}</td>
      <td><StatusBadge :status="row.status"/></td><td class="mono-num muted-2">{{row.joined}}</td>
      <td class="text-right"><button class="btn-icon" @click="sel=row"><UiIcon name="eye" :size="15"/></button></td>
    </template>
  </DataTable>
  <UiPagination v-if="filtered.length>perPage" class="card mt-3" :page="page" :total="filtered.length" :per-page="perPage" @update:page="p=>page=p"/>
  <UiModal :model-value="!!sel" @update:model-value="sel=null" :title="sel? sel.name : ''" size="lg">
    <div v-if="sel" class="space-y-5">
      <div class="flex items-center gap-4">
        <span class="w-14 h-14 rounded-full flex items-center justify-center display text-[16px] font-semibold" style="background:var(--soft)">{{ini(sel.name)}}</span>
        <div><p class="display text-[16px] font-semibold">{{sel.name}}</p><p class="text-[13px] muted">{{sel.email}} · {{sel.phone}}</p></div>
        <StatusBadge class="ml-auto" :status="sel.status"/>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="card p-4"><p class="eyebrow">{{$t('orders')}}</p><p class="display text-[20px] font-semibold mono-num mt-1.5">{{sel.orders}}</p></div>
        <div class="card p-4"><p class="eyebrow">{{$t('totalSpent')}}</p><p class="display text-[20px] font-semibold mono-num mt-1.5">{{$money(sel.spent)}}</p></div>
        <div class="card p-4"><p class="eyebrow">{{$t('avgOrder')}}</p><p class="display text-[20px] font-semibold mono-num mt-1.5">{{$money(sel.spent/sel.orders)}}</p></div>
      </div>
      <div><p class="eyebrow mb-3">{{$t('orderHistory')}}</p>
        <div v-if="custOrders.length" class="space-y-2">
          <router-link v-for="o in custOrders" :key="o.id" :to="'/admin/orders/'+encodeURIComponent(o.id)" @click="sel=null" class="flex items-center gap-3 p-3 hair rounded-[3px]">
            <span class="text-[13px] font-medium mono-num">{{o.id}}</span><span class="text-[12px] muted mono-num">{{o.date}}</span>
            <StatusBadge class="ml-auto" :status="o.status"/><span class="text-[13px] font-medium mono-num">{{$money(o.total)}}</span></router-link>
        </div>
        <EmptyState v-else :title="$t('noOrders')"/>
      </div>
      <div><p class="eyebrow mb-3">{{$t('addresses')}}</p>
        <p class="text-[13px] muted">{{sel.address.line}}, {{sel.address.city}}, {{sel.address.province}} {{sel.address.postal}}</p></div>
      <div><p class="eyebrow mb-3">{{$t('reviews')}}</p>
        <div v-if="custReviews.length" class="space-y-2"><div v-for="r in custReviews" :key="r.id" class="p-3 hair rounded-[3px]">
          <div class="flex justify-between"><span class="text-[13px] font-medium">{{r.product}}</span><StarRating :value="r.rating" :size="11"/></div>
          <p class="text-[12.5px] muted mt-1.5">{{r.text}}</p></div></div>
        <p v-else class="text-[13px] muted-2">{{$t('noReviews')}}</p></div>
    </div>
  </UiModal>
</div>
</template>

<script>
import { t } from '@/utils/i18n'

export default {
  name: 'CustomersView',
  data: () => ({ loading: true, q: '', status: '', sort: 'spent', page: 1, perPage: 10, sel: null }),
  computed: {
    exHeaders () { return ['Name','Email','Phone','Orders','Total spent','Status','Registered','City'] },
    exRows () { return this.filtered.map(c => [c.name, c.email, c.phone, c.orders, c.spent.toFixed(2), c.status, c.joined, c.address.city]) },
    cols () {
      return [
        {key:'n',label:t('name')},{key:'e',label:t('email')},{key:'p',label:t('phone')},{key:'o',label:t('orders')},
        {key:'s',label:t('totalSpent')},{key:'st',label:t('status')},{key:'j',label:t('registered')},{key:'a',label:'',align:'right'}
      ]
    },
    filtered () {
      const q = this.q.toLowerCase()
      let l = this.$s.customers.filter(c => (!q || c.name.toLowerCase().includes(q) || c.email.includes(q)) && (!this.status || c.status === this.status))
      if (this.sort === 'spent') l = [...l].sort((a, b) => b.spent - a.spent)
      else if (this.sort === 'orders') l = [...l].sort((a, b) => b.orders - a.orders)
      else l = [...l].sort((a, b) => new Date(b.joined) - new Date(a.joined))
      return l
    },
    paged () { const s = (this.page - 1) * this.perPage; return this.filtered.slice(s, s + this.perPage) },
    custOrders () { return this.sel ? this.$s.orders.filter(o => o.customerId === this.sel.id).slice(0, 5) : [] },
    custReviews () { return this.sel ? this.$s.reviews.filter(r => r.customerId === this.sel.id).slice(0, 3) : [] }
  },
  mounted () { setTimeout(() => { this.loading = false }, 400) },
  methods: { ini (n) { return n.split(' ').map(x => x[0]).join('').slice(0, 2) } }
}
</script>
