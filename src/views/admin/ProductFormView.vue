<template>
<div>
  <AdminHead :title="isEdit? $t('edit')+' '+$t('products') : $t('addProduct')" :subtitle="isEdit? f.sku : 'Create a new product in your catalogue'">
    <UiButton variant="ghost" size="sm" to="/admin/products">{{$t('cancel')}}</UiButton>
    <UiButton size="sm" icon="check" @click="save">{{isEdit? $t('update'):$t('create')}}</UiButton>
  </AdminHead>
  <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] min-w-0">
    <div class="space-y-4 min-w-0">
      <AdminCard :title="$t('general')">
        <div class="grid sm:grid-cols-2 gap-4">
          <UiInput v-model="f.name" :label="$t('name')" class="sm:col-span-2" required :error="err.name"/>
          <UiInput v-model="f.sku" :label="$t('sku')" icon="tag" required :error="err.sku"/>
          <UiSelect v-model="f.category" :label="$t('category')" :options="catOpts"/>
          <UiTextarea v-model="f.description" :label="$t('description')" class="sm:col-span-2" :rows="5"/></div>
      </AdminCard>
      <AdminCard :title="$t('images')" :subtitle="$t('coverHint')">
        <div class="grid grid-cols-3 sm:grid-cols-5 gap-3">
          <div v-for="(im,i) in f.images" :key="i" class="relative ratio-p overflow-hidden hair">
            <img :src="im" class="w-full h-full object-cover"/>
            <button class="absolute top-1 right-1 btn-icon w-7 h-7" style="background:var(--panel)" @click="f.images.splice(i,1)"><UiIcon name="x" :size="13"/></button>
            <span v-if="i===0" class="absolute bottom-1 left-1 text-[9.5px] px-1.5 py-0.5" style="background:var(--text); color:var(--bg)">COVER</span></div>
          <button class="ratio-p hair flex flex-col items-center justify-center gap-1.5 muted-2" style="border-style:dashed" @click="addImage">
            <UiIcon name="image" :size="18"/><span class="text-[11px]">Add</span></button></div>
      </AdminCard>
      <AdminCard :title="$t('price')+' & '+$t('discount')">
        <div class="grid sm:grid-cols-2 gap-4">
          <UiInput v-model="f.price" :label="$t('price')" type="number" required :error="err.price"/>
          <UiInput v-model="f.stock" :label="$t('stock')" type="number"/>
          <UiSelect v-model="disc.type" :label="$t('discountType')" :options="[{value:'none',label:$t('noDiscount')},{value:'percent',label:$t('percentage')},{value:'fixed',label:$t('fixedAmount')}]"/>
          <UiInput v-model="disc.value" :label="$t('discountValue')" type="number" :disabled="disc.type==='none'"/>
          <UiInput v-model="disc.start" :label="$t('startDate')" type="date" :disabled="disc.type==='none'"/>
          <UiInput v-model="disc.end" :label="$t('endDate')" type="date" :disabled="disc.type==='none'"/>
          <div class="sm:col-span-2 flex flex-wrap gap-4 items-center justify-between p-4 soft rounded-[6px]">
            <div><p class="eyebrow">{{$t('preview')}}</p>
              <p class="mt-2 flex items-baseline gap-2.5"><span class="display text-[22px] font-semibold mono-num">{{$money(preview.final)}}</span>
                <s v-if="preview.off" class="muted-2 mono-num text-[13px]">{{$money(preview.base)}}</s>
                <span v-if="preview.off" class="accent text-[12px] font-semibold">−{{preview.percent}}% {{$t('off')}}</span></p></div>
            <UiSwitch v-model="disc.active" :label="$t('discountActive')"/></div></div>
      </AdminCard>
      <AdminCard :title="$t('variants')">
        <div class="grid sm:grid-cols-2 gap-5">
          <div><p class="lbl">{{$t('size')}}</p>
            <div class="flex flex-wrap gap-1.5 mb-2"><span v-for="(s,i) in f.sizes" :key="s" class="chip on">{{s}}<UiIcon name="x" :size="12" @click="f.sizes.splice(i,1)"/></span></div>
            <div class="flex"><input v-model="newSize" class="field" placeholder="e.g. XL" style="border-radius:3px 0 0 3px" @keyup.enter="addSize"/>
              <button class="btn btn-md btn-secondary" style="border-radius:0 3px 3px 0" @click="addSize"><UiIcon name="plus" :size="15"/></button></div></div>
          <div><p class="lbl">{{$t('colour')}}</p>
            <div class="flex flex-wrap gap-1.5 mb-2"><span v-for="(c,i) in f.colors" :key="c" class="chip on">{{c}}<UiIcon name="x" :size="12" @click="f.colors.splice(i,1)"/></span></div>
            <div class="flex"><input v-model="newColor" class="field" placeholder="e.g. Black" style="border-radius:3px 0 0 3px" @keyup.enter="addColor"/>
              <button class="btn btn-md btn-secondary" style="border-radius:0 3px 3px 0" @click="addColor"><UiIcon name="plus" :size="15"/></button></div></div></div>
        <div class="mt-5 overflow-x-auto scroll-thin"><table class="dt w-full text-[13px] min-w-[420px]">
          <thead><tr><th>Variant</th><th>{{$t('sku')}}</th><th>{{$t('stock')}}</th><th class="text-right">{{$t('price')}}</th></tr></thead>
          <tbody><tr v-for="v in variants" :key="v.k"><td>{{v.k}}</td><td class="mono-num muted">{{f.sku}}-{{v.s}}</td>
            <td class="mono-num">{{v.stock}}</td><td class="text-right mono-num">{{$money(preview.final)}}</td></tr></tbody></table></div>
      </AdminCard>
    </div>
    <div class="space-y-4">
      <AdminCard :title="$t('status')">
        <UiSelect v-model="f.status" :options="[{value:'active',label:$t('active')},{value:'draft',label:'Draft'},{value:'archived',label:'Archived'}]"/>
        <div class="mt-4 space-y-3">
          <UiSwitch v-model="tagNew" :label="$t('markNew')"/>
          <UiSwitch v-model="tagBest" :label="$t('markBest')"/>
          <UiSwitch v-model="tagFeat" :label="$t('markFeatured')"/></div>
      </AdminCard>
      <AdminCard :title="$t('livePreview')" :pad="false">
        <div class="p-5"><div class="ratio-p overflow-hidden mb-3" style="background:var(--soft)">
          <img v-if="f.images[0]" :src="f.images[0]" class="w-full h-full object-cover"/></div>
          <p class="eyebrow">{{$catName(f.category)}}</p>
          <p class="display text-[14px] font-medium mt-1">{{f.name||'Product name'}}</p>
          <p class="mt-1.5 flex items-baseline gap-2"><span class="font-semibold mono-num">{{$money(preview.final)}}</span>
            <s v-if="preview.off" class="text-[12px] muted-2 mono-num">{{$money(preview.base)}}</s></p></div>
      </AdminCard>
      <UiButton block icon="check" @click="save">{{isEdit? $t('update'):$t('create')}}</UiButton>
      <UiButton v-if="isEdit" block variant="danger" icon="trash" @click="confirm=true">{{$t('delete')}}</UiButton>
    </div>
  </div>
  <ConfirmModal v-model="confirm" :message="'Delete '+f.name+'?'" @confirm="del"/>
</div>
</template>

<script>
import { prodById, round2, toast } from '@/utils/helpers'
import { M } from '@/utils/data'

export default {
  name: 'ProductFormView',
  data () {
    const id = this.$route.params.id
    const ex = id ? prodById(id) : null
    const base = ex ? JSON.parse(JSON.stringify(ex)) : {
      name: '', sku: 'SHX-' + Math.floor(1000 + Math.random() * 9000), category: 'clothing',
      description: '', images: [], price: 0, stock: 0, sizes: ['S', 'M', 'L'], colors: ['Black'], status: 'active',
      tags: [], rating: 0, reviewCount: 0, sold: 0, createdAt: new Date().toISOString().slice(0, 10),
      specs: [['Material', '—']], outOfStockSizes: []
    }
    const d = base.discount || { type: 'none', value: 0, start: '', end: '', active: false }
    return {
      f: base, disc: { type: d.type || 'none', value: d.value || 0, start: d.start || '', end: d.end || '', active: !!d.active },
      err: {}, newSize: '', newColor: '', confirm: false,
      tagNew: base.tags.includes('new'), tagBest: base.tags.includes('best'), tagFeat: base.tags.includes('featured'),
      pool: [M.a, M.c, M.g, M.i, M.m, M.k, M.u, M.j, M.s, M.l]
    }
  },
  computed: {
    isEdit () { return !!this.$route.params.id },
    catOpts () { return this.$s.categories.map(c => ({ value: c.slug, label: c.name })) },
    preview () {
      const base = +this.f.price || 0
      let off = 0
      if (this.disc.type !== 'none' && this.disc.active) off = this.disc.type === 'percent' ? base * (+this.disc.value) / 100 : Math.min(+this.disc.value, base)
      return { base, off: round2(off), final: round2(base - off), percent: base ? Math.round(off / base * 100) : 0 }
    },
    variants () {
      const out = []
      this.f.sizes.forEach(s => this.f.colors.forEach(c => out.push({
        k: s + ' / ' + c, s: s + c[0],
        stock: Math.max(0, Math.round((+this.f.stock || 0) / Math.max(1, this.f.sizes.length * this.f.colors.length)))
      })))
      return out.slice(0, 8)
    }
  },
  methods: {
    addImage () { this.f.images.push(this.pool[this.f.images.length % this.pool.length]) },
    addSize () { if (this.newSize && !this.f.sizes.includes(this.newSize)) { this.f.sizes.push(this.newSize); this.newSize = '' } },
    addColor () { if (this.newColor && !this.f.colors.includes(this.newColor)) { this.f.colors.push(this.newColor); this.newColor = '' } },
    save () {
      const e = {}
      if (!this.f.name) e.name = 'Product name is required'
      if (!this.f.sku) e.sku = 'SKU is required'
      if (!this.f.price || +this.f.price <= 0) e.price = 'Enter a valid price'
      this.err = e
      if (Object.keys(e).length) return toast('Please fix the highlighted fields', 'error')
      const tags = []
      if (this.tagNew) tags.push('new'); if (this.tagBest) tags.push('best'); if (this.tagFeat) tags.push('featured')
      const payload = {
        ...this.f, price: +this.f.price, stock: +this.f.stock, tags,
        images: this.f.images.length ? this.f.images : [this.pool[0]],
        discount: this.disc.type === 'none' ? null : { type: this.disc.type, value: +this.disc.value, active: this.disc.active, start: this.disc.start || '2020-01-01', end: this.disc.end || '2030-12-31' }
      }
      if (this.isEdit) {
        const i = this.$s.products.findIndex(p => p.id === payload.id)
        this.$s.products[i] = { ...payload }; toast('Product updated')
      } else {
        payload.id = Math.max(0, ...this.$s.products.map(p => p.id)) + 1
        this.$s.products.unshift(payload); toast('Product created')
      }
      this.$router.push('/admin/products')
    },
    del () {
      const i = this.$s.products.findIndex(p => p.id === this.f.id)
      if (i > -1) this.$s.products.splice(i, 1)
      toast('Product deleted'); this.$router.push('/admin/products')
    }
  }
}
</script>
