<template>
<div>
  <AdminHead :title="$t('inventory')" :subtitle="'Stock levels across '+$s.products.length+' products'">
    <ExportMenu :title="$t('inventory')" filename="inventory" :headers="exHeaders" :rows="exRows" :meta="[counts.in+' in · '+counts.low+' low · '+counts.out+' out']"/>
  </AdminHead>
  <div class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3 mb-4">
    <StatCard :label="$t('inStock')" :value="String(counts.in)" icon="check"/>
    <StatCard :label="$t('lowStock')" :value="String(counts.low)" icon="alert"/>
    <StatCard :label="$t('outOfStock')" :value="String(counts.out)" icon="box"/>
  </div>
  <div class="card p-3 sm:p-4 mb-4 grid gap-3 grid-cols-1 sm:grid-cols-2">
    <UiInput v-model="q" icon="search" :placeholder="$t('search')+'…'"/>
    <UiSelect v-model="st" :options="[{value:'',label:$t('all')},{value:'in',label:$t('inStock')},{value:'low',label:$t('lowStock')},{value:'out',label:$t('outOfStock')}]"/>
  </div>
  <DataTable :columns="cols" :rows="paged" :empty-title="$t('noProducts')">
    <template #row="{row}">
      <td><div class="flex items-center gap-3"><img :src="row.images[0]" class="w-9 h-12 object-cover"/><span class="font-medium">{{row.name}}</span></div></td>
      <td class="mono-num muted">{{row.sku}}</td><td>{{$catName(row.category)}}</td>
      <td class="mono-num font-medium">{{row.stock}}</td>
      <td><UiBadge :tone="tone(row)" dot>{{label(row)}}</UiBadge></td>
      <td class="text-right"><UiButton size="sm" variant="secondary" @click="adjust(row)">{{$t('adjustStock')}}</UiButton></td>
    </template>
  </DataTable>
  <UiPagination v-if="filtered.length>perPage" class="card mt-3" :page="page" :total="filtered.length" :per-page="perPage" @update:page="p=>page=p"/>
  <AdminCard class="mt-4" :title="$t('stockHistory')" :pad="false">
    <DataTable :columns="hcols" :rows="$s.stockHistory" :empty-title="$t('noStockMoves')">
      <template #row="{row}">
        <td class="mono-num muted">{{row.date}}</td><td class="mono-num">{{row.sku}}</td>
        <td><span class="mono-num font-medium" :style="{color: row.change>0?'var(--ok)':'#D92D20'}">{{row.change>0?'+':''}}{{row.change}}</span></td>
        <td class="muted">{{row.reason}}</td><td class="text-right muted-2">{{row.by}}</td>
      </template>
    </DataTable>
  </AdminCard>
  <UiModal v-model="modal" :title="$t('adjustStock')" size="sm">
    <div v-if="sel" class="space-y-4">
      <div class="flex items-center gap-3"><img :src="sel.images[0]" class="w-12 h-16 object-cover"/>
        <div><p class="text-[13.5px] font-medium">{{sel.name}}</p><p class="text-[12px] muted-2 mono-num">{{sel.sku}} · {{sel.stock}}</p></div></div>
      <UiInput v-model="amount" :label="$t('adjustment')" type="number"/>
      <UiInput v-model="reason" :label="$t('reason')" placeholder="Restock, damage, correction…"/>
      <p class="text-[13px] muted">{{$t('newLevel')}}: <b class="mono-num">{{Math.max(0, sel.stock + (+amount||0))}}</b></p>
    </div>
    <template #footer>
      <UiButton variant="ghost" size="sm" @click="modal=false">{{$t('cancel')}}</UiButton>
      <UiButton size="sm" @click="applyAdjust">{{$t('save')}}</UiButton>
    </template>
  </UiModal>
</div>
</template>

<script>
import { stockState, catName, toast } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'InventoryView',
  data: () => ({ q: '', st: '', page: 1, perPage: 10, modal: false, sel: null, amount: 0, reason: '' }),
  computed: {
    exHeaders () { return ['Product', 'SKU', 'Category', 'Stock', 'Status'] },
    exRows () { return this.filtered.map(p => [p.name, p.sku, catName(p.category), p.stock, this.label(p)]) },
    cols () {
      return [
        {key:'p',label:t('products')},{key:'s',label:t('sku')},{key:'c',label:t('category')},
        {key:'st',label:t('stock')},{key:'ss',label:t('status')},{key:'a',label:t('actions'),align:'right'}
      ]
    },
    hcols () { return [{key:'d',label:t('date')},{key:'s',label:t('sku')},{key:'c',label:t('change')},{key:'r',label:t('reason')},{key:'b',label:t('by'),align:'right'}] },
    counts () {
      const p = this.$s.products
      return { in: p.filter(x => stockState(x) === 'in').length, low: p.filter(x => stockState(x) === 'low').length, out: p.filter(x => stockState(x) === 'out').length }
    },
    filtered () {
      const q = this.q.toLowerCase()
      return this.$s.products.filter(p => (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) && (!this.st || stockState(p) === this.st))
    },
    paged () { const s = (this.page - 1) * this.perPage; return this.filtered.slice(s, s + this.perPage) }
  },
  methods: {
    tone (p) { return { in: 'ok', low: 'warn', out: 'danger' }[stockState(p)] },
    label (p) { return { in: t('inStock'), low: t('lowStock'), out: t('outOfStock') }[stockState(p)] },
    adjust (p) { this.sel = p; this.amount = 0; this.reason = ''; this.modal = true },
    applyAdjust () {
      const a = +this.amount || 0
      this.sel.stock = Math.max(0, this.sel.stock + a)
      this.sel.status = this.sel.stock === 0 ? 'archived' : 'active'
      this.$s.stockHistory.unshift({ date: new Date().toISOString().slice(0, 10), sku: this.sel.sku, change: a, reason: this.reason || 'Manual adjustment', by: this.$s.admin.name })
      toast('Stock updated'); this.modal = false
    }
  }
}
</script>
