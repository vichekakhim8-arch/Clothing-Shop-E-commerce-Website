<template>
<div>
  <AdminHead :title="$t('settings')" :subtitle="$t('settingsSubtitle')">
    <UiButton size="sm" icon="check" @click="$toast('Settings saved')">{{$t('save')}}</UiButton>
  </AdminHead>
  <div class="grid lg:grid-cols-[210px_minmax(0,1fr)] gap-5 lg:gap-6 min-w-0">
    <aside class="flex lg:flex-col gap-1 overflow-x-auto no-bar">
      <button v-for="sec in sections" :key="sec.k" @click="tab=sec.k"
        :class="['flex items-center gap-3 px-3 h-10 rounded-[3px] text-[13px] whitespace-nowrap transition', tab===sec.k?'btn-primary':'btn-ghost']">
        <UiIcon :name="sec.i" :size="15"/>{{sec.l}}</button>
    </aside>
    <div class="space-y-4">
      <AdminCard v-if="tab==='store'" :title="$t('storeInformation')">
        <div class="grid sm:grid-cols-2 gap-4">
          <UiInput v-model="s.storeName" :label="$t('storeName')" icon="store"/>
          <UiInput v-model="s.tagline" :label="$t('tagline')"/>
          <UiInput v-model="s.email" :label="$t('email')" icon="mail"/>
          <UiInput v-model="s.phone" :label="$t('phone')" icon="phone"/>
          <UiInput v-model="s.address" :label="$t('address')" icon="pin" class="sm:col-span-2"/>
          <div class="sm:col-span-2"><p class="lbl">{{$t('logo')}}</p>
            <div class="flex items-center gap-4">
              <div class="w-20 h-20 flex items-center justify-center hair display font-bold tracking-widest">SHX</div>
              <UiButton variant="secondary" size="sm" icon="image" @click="$toast('Upload dialog','info')">{{$t('uploadLogo')}}</UiButton></div></div>
        </div>
      </AdminCard>

      <AdminCard v-if="tab==='locale'" :title="$t('currencyLanguage')">
        <div class="grid sm:grid-cols-2 gap-4">
          <UiSelect v-model="s.currency" :label="$t('currency')" :options="['USD','KHR','EUR']"/>
          <UiInput v-model="s.symbol" :label="$t('currencySymbol')"/>
          <UiSelect :model-value="$s.lang" @update:model-value="$setLang($event)" :label="$t('language')" :options="[{value:'en',label:'English'},{value:'km',label:'ខ្មែរ (Khmer)'}]"/>
          <UiInput v-model="s.tax" :label="$t('tax')+' (%)'" type="number"/>
        </div>
      </AdminCard>

      <AdminCard v-if="tab==='payment'" :title="$t('paymentMethods')">
        <div class="space-y-3">
          <div v-for="p in pays" :key="p.k" class="flex items-center gap-4 p-4 hair rounded-[6px]">
            <UiIcon :name="p.i" :size="18"/>
            <div class="flex-1 min-w-0"><p class="text-[13.5px] font-medium">{{p.l}}</p><p class="text-[12px] muted-2">{{p.d}}</p></div>
            <UiSwitch v-model="s.payments[p.k]"/>
          </div>
        </div>
      </AdminCard>

      <!-- KHQR / Bakong gateway -->
      <template v-if="tab==='khqr'">
        <AdminCard :title="$t('khqrSettings')" subtitle="Bakong · National Bank of Cambodia">
          <template #actions><UiBadge :tone="statusTone" dot>{{statusLabel}}</UiBadge></template>
          <div class="flex flex-wrap items-center gap-3 p-4 rounded-[8px] mb-5 min-w-0" :style="bannerStyle">
            <span class="w-9 h-9 rounded-[6px] flex items-center justify-center shrink-0" style="background:#E2231A">
              <span class="text-white font-bold" style="font-size:9px;letter-spacing:.06em">KHQR</span></span>
            <div class="min-w-0 flex-1">
              <p class="text-[13px] font-medium">{{k.merchantName}} · {{k.accountId}}</p>
              <p class="text-[11.5px] muted-2 mt-0.5">{{$t('lastVerified')}}: <span class="mono-num">{{k.lastVerified||'—'}}</span> · {{$t('expiresOn')}}: <span class="mono-num">{{k.expires||'—'}}</span></p>
            </div>
            <UiBadge :tone="k.env==='production'?'accent':'warn'">{{k.env==='production'? $t('production'):$t('sandbox')}}</UiBadge>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <UiInput v-model="k.merchantName" :label="$t('merchantName')" icon="store"/>
            <UiInput v-model="k.merchantId" :label="$t('merchantId')" icon="tag"/>
            <UiInput v-model="k.accountId" :label="$t('bakongAccountId')" icon="user" placeholder="shadxw_shop@acleda"/>
            <UiInput v-model="k.city" :label="$t('merchantCity')" icon="pin"/>
          </div>
          <div class="mt-5">
            <span class="lbl">{{$t('apiToken')}}</span>
            <div class="flex gap-2">
              <span class="relative flex-1 min-w-0">
                <UiIcon name="lock" :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 muted-2 pointer-events-none"/>
                <input :type="show?'text':'password'" v-model="k.token" class="field has-icon pr-10 mono-num text-[12.5px]" spellcheck="false"/>
                <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 btn-icon w-7 h-7" @click="show=!show" :title="show? $t('hideToken'):$t('showToken')">
                  <UiIcon :name="show?'eyeOff':'eye'" :size="15"/></button>
              </span>
              <UiButton variant="secondary" icon="copy" @click="copyToken" :title="$t('copyToken')"/>
            </div>
            <p class="text-[11.5px] muted-2 mt-2 leading-relaxed">{{$t('tokenHint')}}</p>
          </div>
          <div class="mt-5">
            <span class="lbl">{{$t('environment')}}</span>
            <div class="grid sm:grid-cols-2 gap-3">
              <button v-for="e in envs" :key="e.k" type="button" @click="k.env=e.k"
                class="p-4 hair rounded-[6px] text-left transition" :style="{borderColor: k.env===e.k?'var(--text)':'var(--line)'}">
                <div class="flex items-center justify-between"><span class="text-[13px] font-medium">{{e.l}}</span>
                  <UiIcon v-if="k.env===e.k" name="check" :size="15"/></div>
                <p class="text-[11.5px] muted-2 mt-1 leading-relaxed">{{e.d}}</p></button>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 mt-6 pt-5 hair-t">
            <UiButton variant="secondary" :disabled="testing" @click="testConn">
              <span v-if="testing" class="khqr-spin" style="border-color:rgba(128,128,128,.3);border-top-color:currentColor"></span>
              <UiIcon v-else name="refresh" :size="15"/>{{ testing? $t('testing')+'…' : $t('testConnection') }}</UiButton>
            <UiButton variant="ghost" icon="sparkle" @click="renew">{{$t('renewToken')}}</UiButton>
            <UiButton class="ml-auto" icon="check" @click="saveToken">{{$t('saveToken')}}</UiButton>
          </div>
        </AdminCard>
        <AdminCard :title="$t('preview')" :subtitle="$t('scanToPay')">
          <div class="flex flex-wrap gap-6 items-start justify-center sm:justify-start min-w-0">
            <KhqrPanel :amount="29.9" bill="PREVIEW001" compact/>
            <div class="text-[12.5px] muted space-y-2 min-w-0 flex-1">
              <p class="leading-relaxed">{{$t('supportedBanks')}}</p>
              <div class="p-3 soft rounded-[6px] break-anywhere mono-num text-[11px] leading-relaxed">{{samplePayload}}</div>
              <p class="text-[11px] muted-2">EMVCo TLV payload · CRC-16/CCITT</p>
            </div>
          </div>
        </AdminCard>
      </template>

      <AdminCard v-if="tab==='shipping'" :title="$t('shippingDelivery')">
        <div class="grid sm:grid-cols-2 gap-4">
          <UiInput v-model="s.flatShipping" :label="$t('flatRate')" type="number"/>
          <UiInput v-model="s.freeShipOver" :label="$t('freeShipAbove')" type="number"/>
        </div>
        <p class="text-[12.5px] muted mt-4">Orders above {{$money(s.freeShipOver)}} ship free. Express delivery adds $7 at checkout.</p>
      </AdminCard>

      <AdminCard v-if="tab==='notify'" :title="$t('notifications')">
        <div class="space-y-4">
          <UiSwitch v-model="s.notifyOrder" :label="$t('notifyOrderL')"/>
          <UiSwitch v-model="s.notifyStock" :label="$t('notifyStockL')"/>
          <UiSwitch v-model="s.notifyReview" :label="$t('notifyReviewL')"/>
        </div>
      </AdminCard>

      <AdminCard v-if="tab==='email'" :title="$t('emailSettings')">
        <div class="grid sm:grid-cols-2 gap-4">
          <UiInput v-model="smtp.host" label="SMTP host" icon="mail"/>
          <UiInput v-model="smtp.port" label="Port"/>
          <UiInput v-model="smtp.from" label="From address" class="sm:col-span-2"/>
        </div>
        <UiButton variant="secondary" size="sm" class="mt-4" @click="$toast('Test email sent')">{{$t('sendTest')}}</UiButton>
      </AdminCard>

      <AdminCard v-if="tab==='social'" :title="$t('socialMedia')">
        <div class="grid sm:grid-cols-3 gap-4">
          <UiInput v-model="s.social.instagram" label="Instagram"/>
          <UiInput v-model="s.social.facebook" label="Facebook"/>
          <UiInput v-model="s.social.tiktok" label="TikTok"/>
        </div>
      </AdminCard>
    </div>
  </div>
</div>
</template>

<script>
import { buildKHQR } from '@/utils/khqr'
import { isoDay, addDays } from '@/utils/dates'
import { toast } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'SettingsView',
  data: () => ({ tab: 'store', show: false, testing: false, smtp: { host: 'smtp.shadxw.com', port: '587', from: 'no-reply@shadxw.com' } }),
  computed: {
    s () { return this.$s.settings },
    k () { return this.$s.settings.khqr },
    sections () {
      return [
        {k:'store',i:'store',l:t('storeInformation')},{k:'locale',i:'globe',l:t('currencyLanguage')},
        {k:'payment',i:'card',l:t('paymentMethods')},{k:'khqr',i:'grid',l:t('paymentGateways')},
        {k:'shipping',i:'truck',l:t('shippingDelivery')},{k:'notify',i:'bell',l:t('notifications')},
        {k:'email',i:'mail',l:t('emailSettings')},{k:'social',i:'users',l:t('socialMedia')}
      ]
    },
    pays () {
      return [
        {k:'cod',i:'truck',l:t('cod'),d:'Collect payment on delivery'},
        {k:'bank',i:'card',l:t('bank'),d:'ABA / Wing bank transfer'},
        {k:'qr',i:'grid',l:'KHQR',d:t('scanToPay')}
      ]
    },
    envs () { return [{k:'sandbox',l:t('sandbox'),d:t('sandboxHint')},{k:'production',l:t('production'),d:t('productionHint')}] },
    statusTone () { return { connected:'ok', expired:'warn', invalid:'danger' }[this.k.status] || 'neutral' },
    statusLabel () { return { connected:t('connected'), expired:t('tokenExpired'), invalid:t('invalidToken') }[this.k.status] || t('notConfigured') },
    bannerStyle () {
      const m = { connected:'var(--ok-soft)', expired:'var(--warn-soft)', invalid:'rgba(217,45,32,.08)' }
      return { background: m[this.k.status] || 'var(--soft)' }
    },
    samplePayload () {
      return buildKHQR({ amount: 29.9, billNumber: 'PREVIEW001', merchantName: this.k.merchantName, bakongId: this.k.accountId, city: this.k.city }).slice(0, 180) + '…'
    }
  },
  methods: {
    copyToken () { if (navigator.clipboard) navigator.clipboard.writeText(this.k.token); toast(t('copied')) },
    testConn () {
      this.testing = true
      setTimeout(() => {
        this.testing = false
        const ok = !!this.k.token && this.k.token.length > 40 && !!this.k.accountId
        this.k.status = ok ? 'connected' : 'invalid'
        this.k.lastVerified = new Date().toISOString().slice(0, 16).replace('T', ' ')
        toast(ok ? t('connectionOk') : t('connectionFail'), ok ? 'success' : 'error')
      }, 1200)
    },
    renew () {
      const seg = () => Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
      this.k.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + seg().slice(0, 56) + '.' + seg().slice(0, 40)
      this.k.status = 'connected'
      this.k.expires = isoDay(addDays(new Date(), 365))
      this.k.lastVerified = new Date().toISOString().slice(0, 16).replace('T', ' ')
      toast(t('renewToken') + ' — OK')
    },
    saveToken () {
      if (!this.k.accountId || !this.k.token) return toast(t('connectionFail'), 'error')
      toast(t('tokenSaved'))
    }
  }
}
</script>
