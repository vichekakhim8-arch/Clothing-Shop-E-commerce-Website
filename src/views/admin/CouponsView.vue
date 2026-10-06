<template>
<div>
  <AdminHead :title="$t('coupons')" :subtitle="$s.coupons.length+' coupon codes'">
    <UiButton size="sm" icon="plus" @click="open()">{{$t('createCoupon')}}</UiButton>
  </AdminHead>
  <DataTable :columns="cols" :rows="$s.coupons" :empty-title="$t('noCoupons')">
    <template #row="{row}">
      <td><span class="font-semibold tracking-wider mono-num">{{row.code}}</span></td>
      <td class="capitalize">{{row.type}}</td>
      <td class="mono-num accent">{{row.type==='percent'? row.value+'%':$money(row.value)}}</td>
      <td class="mono-num">{{$money(row.min)}}</td><td class="mono-num">{{$money(row.max)}}</td>
      <td><div class="flex items-center gap-2"><span class="mono-num text-[12.5px]">{{row.used}}/{{row.limit}}</span>
        <span class="w-16 h-1 rounded" style="background:var(--line)"><span class="block h-1 rounded" style="background:var(--text)" :style="{width:Math.min(100,row.used/row.limit*100)+'%'}"></span></span></div></td>
      <td class="mono-num muted-2 text-[12px]">{{row.start}} → {{row.end}}</td>
      <td><StatusBadge :status="row.status"/></td>
      <td><div class="flex gap-0.5 justify-end">
        <button class="btn-icon" @click="copy(row)"><UiIcon name="copy" :size="15"/></button>
        <button class="btn-icon" @click="open(row)"><UiIcon name="edit" :size="15"/></button>
        <button class="btn-icon" style="color:#D92D20" @click="ask(row)"><UiIcon name="trash" :size="15"/></button></div></td>
    </template>
  </DataTable>
  <UiModal v-model="modal" :title="editing? $t('editCoupon'):$t('createCoupon')">
    <div class="space-y-4">
      <UiInput v-model="f.code" :label="$t('couponCode')" icon="ticket" placeholder="SUMMER20"/>
      <div class="grid grid-cols-2 gap-4">
        <UiSelect v-model="f.type" :label="$t('discountType')" :options="[{value:'percent',label:$t('percentage')},{value:'fixed',label:$t('fixedAmount')}]"/>
        <UiInput v-model="f.value" :label="$t('discountValue')" type="number"/>
        <UiInput v-model="f.min" :label="$t('minOrder')" type="number"/>
        <UiInput v-model="f.max" :label="$t('maxDiscount')" type="number"/>
        <UiInput v-model="f.limit" :label="$t('usageLimit')" type="number"/>
        <div><p class="lbl">{{$t('status')}}</p><UiSwitch v-model="act" :label="act?$t('active'):$t('inactive')"/></div>
        <UiInput v-model="f.start" :label="$t('startDate')" type="date"/>
        <UiInput v-model="f.end" :label="$t('endDate')" type="date"/></div>
    </div>
    <template #footer>
      <UiButton variant="ghost" size="sm" @click="modal=false">{{$t('cancel')}}</UiButton>
      <UiButton size="sm" @click="save">{{$t('save')}}</UiButton>
    </template>
  </UiModal>
  <ConfirmModal v-model="confirm" :message="'Delete coupon '+(target&&target.code)+'?'" @confirm="del"/>
</div>
</template>

<script>
import { toast } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'CouponsView',
  data: () => ({
    modal: false, confirm: false, editing: null, target: null, act: true,
    f: { code: '', type: 'percent', value: 10, min: 0, max: 0, limit: 100, start: '', end: '' }
  }),
  computed: {
    cols () {
      return [
        {key:'c',label:t('code')},{key:'t',label:t('type')},{key:'v',label:t('value')},{key:'m',label:t('minOrder')},
        {key:'x',label:t('maxDiscount')},{key:'u',label:t('usage')},{key:'d',label:t('period')},{key:'s',label:t('status')},{key:'a',label:t('actions'),align:'right'}
      ]
    }
  },
  methods: {
    copy (c) { if (navigator.clipboard) navigator.clipboard.writeText(c.code); toast('Code ' + c.code + ' copied') },
    open (c) {
      this.editing = c || null
      this.act = c ? c.status === 'active' : true
      this.f = c ? { ...c } : { code: '', type: 'percent', value: 10, min: 0, max: 0, limit: 100, used: 0, start: new Date().toISOString().slice(0, 10), end: '2026-12-31' }
      this.modal = true
    },
    save () {
      if (!this.f.code) return toast('Coupon code is required', 'error')
      const p = { ...this.f, code: this.f.code.toUpperCase(), value: +this.f.value, min: +this.f.min, max: +this.f.max, limit: +this.f.limit, status: this.act ? 'active' : 'inactive' }
      if (this.editing) Object.assign(this.editing, p)
      else this.$s.coupons.push({ ...p, id: Date.now(), used: 0 })
      toast('Coupon saved'); this.modal = false
    },
    ask (c) { this.target = c; this.confirm = true },
    del () { const i = this.$s.coupons.findIndex(c => c.id === this.target.id); if (i > -1) { this.$s.coupons.splice(i, 1); toast('Coupon deleted') } }
  }
}
</script>
