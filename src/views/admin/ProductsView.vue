<template>
<div>
  <AdminHead :title="$t('products')" :subtitle="$s.products.length+' '+$t('productsSubtitle')+' · '+active+' '+$t('activeLower')">
    <ExportMenu :title="$t('productCatalogue')" filename="products" :headers="exHeaders" :rows="exRows" :meta="[filtered.length+' / '+$s.products.length]"/>
    <UiButton size="sm" icon="plus" to="/admin/products/create">{{$t('addProduct')}}</UiButton>
  </AdminHead>
  <div class="card p-3 sm:p-4 mb-4 grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
    <UiInput v-model="q" icon="search" :placeholder="$t('search')+'…'"/>
    <UiSelect v-model="cat" :options="catOpts"/>
    <UiSelect v-model="status" :options="[{value:'',label:$t('all')+' '+$t('status')},{value:'active',label:$t('active')},{value:'archived',label:'Archived'}]"/>
    <UiSelect v-model="sort" :options="[{value:'new',label:$t('newest')},{value:'name',label:$t('name')},{value:'price',label:$t('price')},{value:'stock',label:$t('stock')}]"/>
  </div>
  <DataTable :columns="cols" :rows="paged" :loading="loading" :empty-title="$t('noProducts')" :empty-text="$t('tryAnother')">
    <template #row="{row}">
      <td><div class="flex items-center gap-3"><img :src="row.images[0]" class="w-10 h-[52px] object-cover shrink-0"/>
        <div class="min-w-0"><p class="font-medium truncate max-w-[200px]">{{row.name}}</p>
          <p class="text-[11.5px] muted-2">{{row.sizes.length}} sizes · {{row.colors.length}} colours</p></div></div></td>
      <td class="mono-num muted">{{row.sku}}</td>
      <td>{{$catName(row.category)}}</td>
      <td class="mono-num">{{$money(row.price)}}</td>
      <td><span v-if="$price(row).has" class="accent text-[12px]">−{{$price(row).percent}}%</span><span v-else class="muted-2">—</span></td>
      <td class="mono-num font-medium">{{$money($price(row).final)}}</td>
      <td><span class="mono-num" :style="{color: row.stock===0?'#D92D20': row.stock<=10?'var(--warn)':''}">{{row.stock}}</span></td>
      <td><StatusBadge :status="row.status"/></td>
      <td class="mono-num muted-2">{{row.createdAt}}</td>
      <td><div class="flex items-center gap-0.5 justify-end">
        <router-link :to="'/product/'+row.id" class="btn-icon" :title="$t('view')"><UiIcon name="eye" :size="15"/></router-link>
        <router-link :to="'/admin/products/'+row.id+'/edit'" class="btn-icon" :title="$t('edit')"><UiIcon name="edit" :size="15"/></router-link>
        <button class="btn-icon" :title="$t('duplicate')" @click="dup(row)"><UiIcon name="copy" :size="15"/></button>
        <button class="btn-icon" :title="$t('archive')" @click="arch(row)"><UiIcon name="archive" :size="15"/></button>
        <button class="btn-icon" :title="$t('delete')" @click="ask(row)" style="color:#D92D20"><UiIcon name="trash" :size="15"/></button></div></td>
    </template>
  </DataTable>
  <UiPagination v-if="filtered.length>perPage" class="card mt-3" :page="page" :total="filtered.length" :per-page="perPage" @update:page="p=>page=p"/>
  <ConfirmModal v-model="confirm" :message="'Delete '+(target&&target.name)+'?'" @confirm="del"/>
</div>
</template>

<script>
import { priceOf, catName, toast } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'ProductsView',
  data: () => ({ loading: true, q: '', cat: '', status: '', sort: 'new', page: 1, perPage: 8, confirm: false, target: null }),
  computed: {
    active () { return this.$s.products.filter(p => p.status === 'active').length },
    exHeaders () { return ['Name','SKU','Category','Price','Discount','Final price','Stock','Status','Created'] },
    exRows () {
      return this.filtered.map(p => {
        const pr = priceOf(p)
        return [p.name, p.sku, catName(p.category), p.price.toFixed(2), pr.has ? pr.percent + '%' : '—', pr.final.toFixed(2), p.stock, p.status, p.createdAt]
      })
    },
    catOpts () { return [{ value: '', label: t('all') + ' ' + t('categories') }].concat(this.$s.categories.map(c => ({ value: c.slug, label: c.name }))) },
    cols () {
      return [
        {key:'p',label:t('products')},{key:'sku',label:t('sku')},{key:'c',label:t('category')},{key:'pr',label:t('price')},
        {key:'d',label:t('discount')},{key:'f',label:t('finalPrice')},{key:'s',label:t('stock')},{key:'st',label:t('status')},
        {key:'cr',label:t('created')},{key:'a',label:t('actions'),align:'right'}
      ]
    },
    filtered () {
      const q = this.q.toLowerCase()
      let l = this.$s.products.filter(p => (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
        (!this.cat || p.category === this.cat) && (!this.status || p.status === this.status))
      const s = this.sort
      if (s === 'name') l = [...l].sort((a, b) => a.name.localeCompare(b.name))
      else if (s === 'price') l = [...l].sort((a, b) => b.price - a.price)
      else if (s === 'stock') l = [...l].sort((a, b) => a.stock - b.stock)
      else l = [...l].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      return l
    },
    paged () { const s = (this.page - 1) * this.perPage; return this.filtered.slice(s, s + this.perPage) }
  },
  watch: { filtered () { if ((this.page - 1) * this.perPage >= this.filtered.length) this.page = 1 } },
  mounted () {
    if (this.$route.query.q) this.q = this.$route.query.q
    setTimeout(() => { this.loading = false }, 400)
  },
  methods: {
    dup (p) {
      const c = { ...p, id: Math.max(...this.$s.products.map(x => x.id)) + 1, name: p.name + ' (Copy)', sku: p.sku + '-C' }
      this.$s.products.unshift(c); toast('Product duplicated')
    },
    arch (p) { p.status = p.status === 'active' ? 'archived' : 'active'; toast('Status updated to ' + p.status, 'info') },
    ask (p) { this.target = p; this.confirm = true },
    del () { const i = this.$s.products.findIndex(x => x.id === this.target.id); if (i > -1) { this.$s.products.splice(i, 1); toast('Product deleted') } }
  }
}
</script>
