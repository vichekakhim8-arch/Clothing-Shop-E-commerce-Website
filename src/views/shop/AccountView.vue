<template>
<div class="max-w-[1100px] mx-auto px-4 sm:px-8 py-10 lg:py-14">
  <div class="flex items-center gap-4">
    <span class="w-14 h-14 rounded-full flex items-center justify-center display text-[18px] font-semibold" style="background:var(--soft)">{{initials}}</span>
    <div><h1 class="display text-[22px] font-semibold uppercase">{{$s.user.name}}</h1><p class="text-[13px] muted">{{$s.user.email}}</p></div>
    <UiButton class="ml-auto" variant="ghost" size="sm" icon="logout" @click="logout">{{$t('logout')}}</UiButton>
  </div>
  <div class="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-8 mt-10">
    <aside class="flex lg:flex-col gap-1 overflow-x-auto no-bar">
      <button v-for="s in sections" :key="s.k" @click="tab=s.k"
        :class="['flex items-center gap-3 px-3 h-11 text-[13.5px] rounded-[3px] transition whitespace-nowrap', tab===s.k?'btn-primary':'btn-ghost']">
        <UiIcon :name="s.i" :size="16"/>{{s.l}}</button>
    </aside>
    <div>
      <div v-if="tab==='profile'" class="card p-6 max-w-lg">
        <h3 class="display text-[14px] uppercase tracking-[.14em] font-semibold mb-5">{{$t('profile')}}</h3>
        <div class="space-y-4">
          <UiInput v-model="form.name" :label="$t('name')" icon="user"/>
          <UiInput v-model="form.email" :label="$t('email')" icon="mail"/>
          <UiInput v-model="form.phone" :label="$t('phone')" icon="phone"/>
          <UiButton @click="save">{{$t('save')}}</UiButton></div>
      </div>
      <div v-else-if="tab==='orders'" class="space-y-3">
        <router-link v-for="o in $s.orders.slice(0,6)" :key="o.id" :to="'/order/'+encodeURIComponent(o.id)" class="card p-4 flex items-center gap-4">
          <div class="flex-1"><p class="text-[13.5px] font-medium mono-num">{{o.id}}</p><p class="text-[12px] muted mt-1">{{o.date}} · {{o.itemCount}} items</p></div>
          <StatusBadge :status="o.status"/><span class="font-medium mono-num">{{$money(o.total)}}</span></router-link>
      </div>
      <div v-else-if="tab==='wishlist'">
        <ProductGrid v-if="wish.length" :products="wish" :cols="3"/>
        <div v-else class="card"><EmptyState icon="heart" :title="$t('emptyWishlist')"/></div>
      </div>
      <div v-else-if="tab==='addresses'" class="grid sm:grid-cols-2 gap-4">
        <div v-for="(a,i) in addresses" :key="i" class="card p-5">
          <div class="flex justify-between"><UiBadge :tone="i===0?'dark':'neutral'">{{i===0?'Default':'Other'}}</UiBadge>
            <button class="btn-icon" @click="$toast('Address editor opened','info')"><UiIcon name="edit" :size="14"/></button></div>
          <p class="text-[13.5px] font-medium mt-3">{{a.name}}</p>
          <p class="text-[13px] muted mt-1 leading-relaxed">{{a.line}}<br/>{{a.city}}, {{a.province}}</p></div>
        <button class="card p-5 flex flex-col items-center justify-center gap-2 muted-2 min-h-[140px]" @click="$toast('New address form','info')">
          <UiIcon name="plus" :size="20"/><span class="text-[13px]">Add address</span></button>
      </div>
      <div v-else-if="tab==='reviews'">
        <div v-if="myReviews.length" class="space-y-4">
          <div v-for="r in myReviews" :key="r.id" class="card p-5">
            <div class="flex justify-between"><p class="text-[13.5px] font-medium">{{r.product}}</p><span class="text-[12px] muted-2 mono-num">{{r.date}}</span></div>
            <StarRating :value="r.rating" :size="12" class="mt-2"/><p class="text-[13.5px] muted mt-3">{{r.text}}</p></div>
        </div>
        <div v-else class="card"><EmptyState icon="star" :title="$t('noReviews')"/></div>
      </div>
      <div v-else-if="tab==='password'" class="card p-6 max-w-md">
        <h3 class="display text-[14px] uppercase tracking-[.14em] font-semibold mb-5">{{$t('changePassword')}}</h3>
        <div class="space-y-4">
          <UiInput type="password" label="Current password" icon="lock" v-model="pw.a"/>
          <UiInput type="password" label="New password" icon="lock" v-model="pw.b"/>
          <UiInput type="password" label="Confirm new password" icon="lock" v-model="pw.c" :error="pw.b&&pw.c&&pw.b!==pw.c?'Passwords do not match':''"/>
          <UiButton @click="$toast('Password updated')">{{$t('update')}}</UiButton></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { store } from '@/stores'
import { toast } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'AccountView',
  data () { return { tab: 'profile', form: { ...store.user }, pw: { a: '', b: '', c: '' } } },
  computed: {
    initials () { return (this.$s.user.name || 'U').split(' ').map(x => x[0]).join('').slice(0, 2) },
    wish () { return this.$s.products.filter(p => this.$s.wishlist.includes(p.id)) },
    myReviews () { return this.$s.reviews.slice(0, 3) },
    addresses () {
      return [
        { name: this.$s.user.name, line: 'No. 24, Street 310', city: 'Phnom Penh', province: 'Phnom Penh' },
        { name: 'Office', line: 'Vattanac Tower, 11th floor', city: 'Phnom Penh', province: 'Phnom Penh' }
      ]
    },
    sections () {
      return [
        { k: 'profile', i: 'user', l: t('profile') }, { k: 'orders', i: 'box', l: t('orders') },
        { k: 'wishlist', i: 'heart', l: t('wishlist') }, { k: 'addresses', i: 'pin', l: t('addresses') },
        { k: 'reviews', i: 'star', l: t('myReviews') }, { k: 'password', i: 'lock', l: t('changePassword') }
      ]
    }
  },
  methods: {
    save () { Object.assign(this.$s.user, this.form); toast('Profile updated') },
    logout () { this.$s.user = null; toast('Signed out', 'info'); this.$router.push('/') }
  }
}
</script>
