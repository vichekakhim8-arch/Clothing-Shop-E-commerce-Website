<template>
<div>
  <AdminHead :title="$t('promotions')" :subtitle="$t('promotionsSubtitle')">
    <UiButton size="sm" icon="plus" @click="open()">{{$t('newPromotion')}}</UiButton>
  </AdminHead>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <div v-for="p in sorted" :key="p.id" class="card overflow-hidden">
      <div class="aspect-[16/9] overflow-hidden" style="background:var(--soft)"><img :src="p.image" class="w-full h-full object-cover"/></div>
      <div class="p-4">
        <div class="flex items-start justify-between gap-2">
          <div><p class="eyebrow">{{p.type}}</p><p class="display text-[15px] font-semibold mt-1">{{p.title}}</p></div>
          <StatusBadge :status="p.status"/>
        </div>
        <p class="text-[12.5px] muted mt-2">{{p.desc}}</p>
        <p class="text-[12px] muted-2 mt-2 mono-num">{{p.start}} → {{p.end}} · #{{p.order}}</p>
        <div class="flex items-center gap-2 mt-4 pt-4 hair-t">
          <UiSwitch :model-value="p.status==='active'" @update:model-value="v=>p.status = v?'active':'inactive'"/>
          <button class="btn-icon ml-auto" @click="open(p)"><UiIcon name="edit" :size="15"/></button>
          <button class="btn-icon" style="color:#D92D20" @click="ask(p)"><UiIcon name="trash" :size="15"/></button>
        </div>
      </div>
    </div>
    <button class="card flex flex-col items-center justify-center gap-2 muted-2 min-h-[260px]" style="border-style:dashed" @click="open()">
      <UiIcon name="plus" :size="22"/><span class="text-[13px]">{{$t('newPromotion')}}</span></button>
  </div>
  <UiModal v-model="modal" :title="editing? $t('editPromotion'):$t('newPromotion')">
    <div class="space-y-4">
      <UiInput v-model="f.title" :label="$t('promoTitle')"/>
      <UiSelect v-model="f.type" :label="$t('type')" :options="['Homepage Banner','Sale Campaign','Featured Products','Flash Sale']"/>
      <UiTextarea v-model="f.desc" :label="$t('description')" :rows="3"/>
      <div><p class="lbl">{{$t('image')}}</p><div class="flex gap-2 flex-wrap">
        <button v-for="im in pool" :key="im" class="w-20 h-14 overflow-hidden hair" :style="{outline: f.image===im?'2px solid var(--text)':'none'}" @click="f.image=im">
          <img :src="im" class="w-full h-full object-cover"/></button></div></div>
      <div class="grid grid-cols-3 gap-4">
        <UiInput v-model="f.start" :label="$t('startDate')" type="date"/>
        <UiInput v-model="f.end" :label="$t('endDate')" type="date"/>
        <UiInput v-model="f.order" :label="$t('displayOrder')" type="number"/></div>
      <UiSwitch v-model="act" :label="act?$t('active'):$t('inactive')"/>
    </div>
    <template #footer>
      <UiButton variant="ghost" size="sm" @click="modal=false">{{$t('cancel')}}</UiButton>
      <UiButton size="sm" @click="save">{{$t('save')}}</UiButton>
    </template>
  </UiModal>
  <ConfirmModal v-model="confirm" message="Delete promotion?" @confirm="del"/>
</div>
</template>

<script>
import { toast } from '@/utils/helpers'
import { M } from '@/utils/data'

export default {
  name: 'PromotionsView',
  data: () => ({
    modal: false, confirm: false, editing: null, target: null, act: true,
    pool: [M.b, M.c, M.u, M.i, M.m, M.j],
    f: { title: '', type: 'Homepage Banner', desc: '', image: M.b, start: '', end: '', order: 1 }
  }),
  computed: { sorted () { return [...this.$s.promotions].sort((a, b) => a.order - b.order) } },
  methods: {
    open (p) {
      this.editing = p || null
      this.act = p ? p.status === 'active' : true
      this.f = p ? { ...p } : { title: '', type: 'Homepage Banner', desc: '', image: M.b, start: new Date().toISOString().slice(0, 10), end: '2026-12-31', order: this.$s.promotions.length + 1 }
      this.modal = true
    },
    save () {
      if (!this.f.title) return toast('Title is required', 'error')
      const p = { ...this.f, order: +this.f.order, status: this.act ? 'active' : 'inactive' }
      if (this.editing) Object.assign(this.editing, p)
      else this.$s.promotions.push({ ...p, id: Date.now() })
      toast('Promotion saved'); this.modal = false
    },
    ask (p) { this.target = p; this.confirm = true },
    del () { const i = this.$s.promotions.findIndex(p => p.id === this.target.id); if (i > -1) { this.$s.promotions.splice(i, 1); toast('Promotion deleted') } }
  }
}
</script>
