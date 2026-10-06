<template>
<div>
  <AdminHead :title="$t('categories')" :subtitle="$s.categories.length+' categories'">
    <UiButton size="sm" icon="plus" @click="open()">{{$t('create')}}</UiButton>
  </AdminHead>
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <div v-for="c in sorted" :key="c.id" class="card overflow-hidden">
      <div class="flex gap-4 p-4">
        <img :src="c.image" class="w-20 h-24 object-cover shrink-0"/>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div><p class="display text-[14px] font-semibold">{{c.name}}</p><p class="text-[12px] muted-2 mt-0.5">{{c.nameKm}}</p></div>
            <StatusBadge :status="c.active?'active':'inactive'"/></div>
          <p class="text-[12.5px] muted mt-2 line-clamp-2">{{c.desc}}</p>
          <div class="flex items-center gap-3 mt-3 text-[12px] muted-2">
            <span class="mono-num">#{{c.order}}</span><span>·</span><span class="mono-num">{{count(c.slug)}} {{$t('products')}}</span></div>
        </div>
      </div>
      <div class="flex hair-t">
        <button class="flex-1 h-10 text-[12.5px] btn-ghost" @click="open(c)"><UiIcon name="edit" :size="14"/>{{$t('edit')}}</button>
        <button class="flex-1 h-10 text-[12.5px] btn-ghost hair-l" @click="c.active=!c.active">{{c.active? $t('inactive'):$t('active')}}</button>
        <button class="flex-1 h-10 text-[12.5px] btn-ghost hair-l" style="color:#D92D20" @click="ask(c)"><UiIcon name="trash" :size="14"/>{{$t('delete')}}</button>
      </div>
    </div>
  </div>
  <UiModal v-model="modal" :title="editing? $t('edit')+' '+$t('category') : $t('create')+' '+$t('category')">
    <div class="space-y-4">
      <UiInput v-model="f.name" :label="$t('name')+' (EN)'"/>
      <UiInput v-model="f.nameKm" :label="$t('name')+' (ខ្មែរ)'"/>
      <UiInput v-model="f.slug" label="Slug" icon="tag"/>
      <UiTextarea v-model="f.desc" :label="$t('description')" :rows="3"/>
      <div class="grid grid-cols-2 gap-4">
        <UiInput v-model="f.order" :label="$t('sortOrder')" type="number"/>
        <div><p class="lbl">{{$t('status')}}</p><UiSwitch v-model="f.active" :label="f.active? $t('active'):$t('inactive')"/></div></div>
      <div><p class="lbl">{{$t('image')}}</p><div class="flex gap-2 flex-wrap">
        <button v-for="im in pool" :key="im" class="w-14 h-[72px] overflow-hidden hair" :style="{outline: f.image===im?'2px solid var(--text)':'none'}" @click="f.image=im">
          <img :src="im" class="w-full h-full object-cover"/></button></div></div>
    </div>
    <template #footer>
      <UiButton variant="ghost" size="sm" @click="modal=false">{{$t('cancel')}}</UiButton>
      <UiButton size="sm" @click="save">{{$t('save')}}</UiButton>
    </template>
  </UiModal>
  <ConfirmModal v-model="confirm" :message="'Delete category '+(target&&target.name)+'?'" @confirm="del"/>
</div>
</template>

<script>
import { toast } from '@/utils/helpers'
import { M } from '@/utils/data'

export default {
  name: 'CategoriesView',
  data: () => ({
    modal: false, confirm: false, editing: null, target: null,
    f: { name: '', nameKm: '', slug: '', desc: '', order: 1, active: true, image: M.a },
    pool: [M.a, M.i, M.m, M.g, M.u, M.j]
  }),
  computed: { sorted () { return [...this.$s.categories].sort((a, b) => a.order - b.order) } },
  methods: {
    count (slug) { return this.$s.products.filter(p => p.category === slug).length },
    open (c) {
      this.editing = c || null
      this.f = c ? { ...c } : { name: '', nameKm: '', slug: '', desc: '', order: this.$s.categories.length + 1, active: true, image: M.a }
      this.modal = true
    },
    save () {
      if (!this.f.name) return toast('Category name is required', 'error')
      if (!this.f.slug) this.f.slug = this.f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      if (this.editing) { Object.assign(this.editing, this.f); toast('Category updated') }
      else { this.$s.categories.push({ ...this.f, id: Date.now() }); toast('Category created') }
      this.modal = false
    },
    ask (c) { this.target = c; this.confirm = true },
    del () { const i = this.$s.categories.findIndex(c => c.id === this.target.id); if (i > -1) { this.$s.categories.splice(i, 1); toast('Category deleted') } }
  }
}
</script>
