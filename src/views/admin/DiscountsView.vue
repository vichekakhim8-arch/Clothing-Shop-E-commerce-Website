<template>
<div>
  <AdminHead :title="$t('discounts')" :subtitle="$t('discountsSubtitle')">
    <UiButton size="sm" icon="plus" @click="open()">{{$t('createDiscount')}}</UiButton>
  </AdminHead>
  <div class="flex gap-6 hair-b mb-5 overflow-x-auto no-bar">
    <button v-for="tb in tabs" :key="tb.k" class="tab" :class="tab===tb.k?'active':''" @click="tab=tb.k">{{tb.l}} ({{cnt(tb.k)}})</button>
  </div>
  <div class="grid gap-4 lg:grid-cols-3 mb-4">
    <div v-for="d in list" :key="d.id" class="card p-5">
      <div class="flex items-start justify-between">
        <div><p class="eyebrow">{{scopeLabel(d)}}</p>
          <p class="display text-[15px] font-semibold uppercase mt-1.5">{{d.name}}</p></div>
        <StatusBadge :status="d.status"/>
      </div>
      <p class="display text-[30px] font-bold mt-4 accent mono-num">{{d.type==='percent'? d.value+'%' : $money(d.value)}} <span class="text-[13px] muted-2 font-medium">{{$t('off')}}</span></p>
      <p class="text-[12.5px] muted mt-2">{{targetText(d)}}</p>
      <p class="text-[12px] muted-2 mt-1 mono-num">{{d.start}} → {{d.end}}</p>
      <div class="flex items-center gap-2 mt-4 pt-4 hair-t">
        <UiSwitch :model-value="d.status==='active'" @update:model-value="v=>{ d.status = v?'active':'inactive'; $toast('Discount '+d.status) }"/>
        <button class="btn-icon ml-auto" @click="open(d)"><UiIcon name="edit" :size="15"/></button>
        <button class="btn-icon" style="color:#D92D20" @click="ask(d)"><UiIcon name="trash" :size="15"/></button>
      </div>
    </div>
    <button class="card p-5 flex flex-col items-center justify-center gap-2 muted-2 min-h-[200px]" style="border-style:dashed" @click="open()">
      <UiIcon name="plus" :size="22"/><span class="text-[13px]">{{$t('createDiscount')}}</span></button>
  </div>
  <AdminCard :title="$t('productLevelDiscounts')" :subtitle="$t('setInsideProduct')" :pad="false">
    <DataTable :columns="pcols" :rows="prodDisc" :empty-title="$t('noProductDiscounts')">
      <template #row="{row}">
        <td><div class="flex items-center gap-3"><img :src="row.images[0]" class="w-9 h-12 object-cover"/><span class="font-medium">{{row.name}}</span></div></td>
        <td>{{$catName(row.category)}}</td>
        <td class="mono-num">{{$money(row.price)}}</td>
        <td class="accent">{{row.discount.type==='percent'? row.discount.value+'%' : $money(row.discount.value)}}</td>
        <td class="mono-num font-medium">{{$money($price(row).final)}}</td>
        <td><StatusBadge :status="row.discount.active?'active':'inactive'"/></td>
        <td class="text-right"><router-link :to="'/admin/products/'+row.id+'/edit'" class="btn-icon"><UiIcon name="edit" :size="15"/></router-link></td>
      </template>
    </DataTable>
  </AdminCard>
  <UiModal v-model="modal" :title="editing? $t('editDiscount'):$t('createDiscount')">
    <div class="space-y-4">
      <UiInput v-model="f.name" :label="$t('discountName')" placeholder="Summer Sale"/>
      <div class="grid grid-cols-2 gap-4">
        <UiSelect v-model="f.type" :label="$t('discountType')" :options="[{value:'percent',label:$t('percentage')},{value:'fixed',label:$t('fixedAmount')}]"/>
        <UiInput v-model="f.value" :label="$t('value')" type="number"/></div>
      <UiSelect v-model="f.scope" :label="$t('applyTo')" :options="[{value:'all',label:$t('allProducts')},{value:'category',label:$t('category')},{value:'products',label:$t('selectedProducts')}]"/>
      <div v-if="f.scope==='category'"><p class="lbl">{{$t('categories')}}</p>
        <div class="flex flex-wrap gap-1.5"><button v-for="c in $s.categories" :key="c.id" class="chip" :class="f.targets.includes(c.slug)?'on':''" @click="tog(c.slug)">{{c.name}}</button></div></div>
      <div v-if="f.scope==='products'"><p class="lbl">{{$t('products')}}</p>
        <div class="max-h-44 overflow-y-auto scroll-thin hair rounded-[3px] p-2">
          <label v-for="p in $s.products" :key="p.id" class="flex items-center gap-3 py-1.5 text-[13px] cursor-pointer">
            <input type="checkbox" :checked="f.targets.includes(p.id)" @change="tog(p.id)" style="accent-color:var(--text)" class="w-4 h-4"/>
            <img :src="p.images[0]" class="w-6 h-8 object-cover"/><span class="flex-1 truncate">{{p.name}}</span>
            <span class="mono-num muted-2">{{$money(p.price)}}</span></label></div></div>
      <div class="grid grid-cols-2 gap-4">
        <UiInput v-model="f.start" :label="$t('startDate')" type="date"/>
        <UiInput v-model="f.end" :label="$t('endDate')" type="date"/></div>
      <div class="flex flex-wrap gap-3 items-center justify-between p-4 soft rounded-[6px]">
        <div><p class="eyebrow">{{$t('preview')}}</p>
          <p class="display text-[16px] font-semibold uppercase mt-1.5">{{f.name||$t('discountName')}}</p>
          <p class="text-[13px] accent font-semibold mt-1">{{f.type==='percent'? f.value+'%' : $money(f.value||0)}} {{$t('off')}} · {{targetText(f)}}</p></div>
        <UiSwitch v-model="activeSwitch" :label="activeSwitch? $t('active'):$t('inactive')"/>
      </div>
    </div>
    <template #footer>
      <UiButton variant="ghost" size="sm" @click="modal=false">{{$t('cancel')}}</UiButton>
      <UiButton size="sm" @click="save">{{$t('save')}}</UiButton>
    </template>
  </UiModal>
  <ConfirmModal v-model="confirm" :message="'Delete discount '+(target&&target.name)+'?'" @confirm="del"/>
</div>
</template>

<script>
import { catName, toast } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'DiscountsView',
  data: () => ({
    tab: 'all', modal: false, confirm: false, editing: null, target: null, activeSwitch: true,
    f: { name: '', type: 'percent', value: 10, scope: 'all', targets: [], start: '', end: '' }
  }),
  computed: {
    tabs () { return [{k:'all',l:t('allDiscounts')},{k:'global',l:t('global')},{k:'category',l:t('category')},{k:'products',l:t('products')}] },
    list () { return this.$s.discounts.filter(d => this.tab === 'all' ? true : this.tab === 'global' ? d.scope === 'all' : d.scope === this.tab) },
    prodDisc () { return this.$s.products.filter(p => p.discount) },
    pcols () {
      return [
        {key:'p',label:t('products')},{key:'c',label:t('category')},{key:'pr',label:t('price')},
        {key:'d',label:t('discount')},{key:'f',label:t('finalPrice')},{key:'s',label:t('status')},{key:'a',label:'',align:'right'}
      ]
    }
  },
  methods: {
    cnt (k) { return this.$s.discounts.filter(d => k === 'all' ? true : k === 'global' ? d.scope === 'all' : d.scope === k).length },
    scopeLabel (d) { return d.scope === 'all' ? t('globalDiscount') : d.scope === 'category' ? t('categoryDiscount') : t('productDiscount') },
    targetText (d) {
      if (d.scope === 'all') return t('allProducts')
      if (d.scope === 'category') return t('categories') + ': ' + (d.targets.map(x => catName(x)).join(', ') || '—')
      return (d.targets.length || 0) + ' ' + t('selectedProducts')
    },
    tog (v) { const i = this.f.targets.indexOf(v); i > -1 ? this.f.targets.splice(i, 1) : this.f.targets.push(v) },
    open (d) {
      this.editing = d || null
      this.activeSwitch = d ? d.status === 'active' : true
      this.f = d ? JSON.parse(JSON.stringify(d)) : { name: '', type: 'percent', value: 10, scope: 'all', targets: [], start: new Date().toISOString().slice(0, 10), end: '2026-12-31' }
      this.modal = true
    },
    save () {
      if (!this.f.name) return toast('Discount name is required', 'error')
      const payload = { ...this.f, value: +this.f.value, status: this.activeSwitch ? 'active' : 'inactive' }
      if (this.editing) Object.assign(this.editing, payload)
      else this.$s.discounts.push({ ...payload, id: Date.now() })
      toast('Discount saved'); this.modal = false
    },
    ask (d) { this.target = d; this.confirm = true },
    del () { const i = this.$s.discounts.findIndex(d => d.id === this.target.id); if (i > -1) { this.$s.discounts.splice(i, 1); toast('Discount deleted') } }
  }
}
</script>
