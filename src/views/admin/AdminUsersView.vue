<template>
<div>
  <AdminHead :title="$t('adminUsers')" :subtitle="$t('rolesSubtitle')">
    <UiButton size="sm" icon="plus" @click="open()">{{$t('inviteUser')}}</UiButton>
  </AdminHead>
  <div class="grid gap-4 lg:grid-cols-3 mb-4">
    <div v-for="r in roles" :key="r.k" class="card p-5">
      <div class="flex items-center justify-between">
        <p class="display text-[14px] font-semibold uppercase">{{r.k}}</p>
        <UiBadge :tone="r.k==='Owner'?'dark':'neutral'">{{count(r.k)}} {{$t('users')}}</UiBadge>
      </div>
      <p class="text-[12.5px] muted mt-2">{{r.d}}</p>
      <div class="flex flex-wrap gap-1.5 mt-4">
        <span v-for="p in PERMS[r.k]" :key="p" class="text-[11px] px-2 py-1 rounded-[2px] capitalize" style="background:var(--soft); color:var(--text-2)">{{p}}</span>
      </div>
    </div>
  </div>
  <DataTable :columns="cols" :rows="$s.adminUsers" :empty-title="$t('noAdminUsers')">
    <template #row="{row}">
      <td><div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold" style="background:var(--soft)">{{row.name.split(' ').map(x=>x[0]).join('')}}</span>
        <span class="font-medium">{{row.name}}</span></div></td>
      <td class="muted">{{row.email}}</td>
      <td><select v-model="row.role" class="field h-8 w-auto text-[12.5px]"><option>Owner</option><option>Admin</option><option>Staff</option></select></td>
      <td><StatusBadge :status="row.status"/></td><td class="muted-2">{{row.last}}</td>
      <td><div class="flex gap-0.5 justify-end">
        <button class="btn-icon" @click="row.status = row.status==='active'?'inactive':'active'"><UiIcon name="refresh" :size="15"/></button>
        <button class="btn-icon" style="color:#D92D20" @click="ask(row)"><UiIcon name="trash" :size="15"/></button></div></td>
    </template>
  </DataTable>
  <UiModal v-model="modal" :title="$t('inviteUser')" size="sm">
    <div class="space-y-4">
      <UiInput v-model="f.name" :label="$t('name')" icon="user"/>
      <UiInput v-model="f.email" :label="$t('email')" icon="mail" type="email"/>
      <UiSelect v-model="f.role" :label="$t('role')" :options="['Owner','Admin','Staff']"/>
    </div>
    <template #footer>
      <UiButton variant="ghost" size="sm" @click="modal=false">{{$t('cancel')}}</UiButton>
      <UiButton size="sm" @click="save">{{$t('sendInvite')}}</UiButton>
    </template>
  </UiModal>
  <ConfirmModal v-model="confirm" message="Remove this admin user?" @confirm="del"/>
</div>
</template>

<script>
import { PERMS } from '@/utils/permissions'
import { toast } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'AdminUsersView',
  data: () => ({
    modal: false, confirm: false, target: null, PERMS,
    f: { name: '', email: '', role: 'Staff' },
    roles: [
      { k: 'Owner', d: 'Full access to every section including settings and billing.' },
      { k: 'Admin', d: 'Manages catalogue, orders, customers, promotions and reports.' },
      { k: 'Staff', d: 'Day-to-day operations: orders, products and inventory only.' }
    ]
  }),
  computed: {
    cols () {
      return [
        {key:'n',label:t('name')},{key:'e',label:t('email')},{key:'r',label:t('role')},
        {key:'s',label:t('status')},{key:'l',label:t('lastActive')},{key:'a',label:t('actions'),align:'right'}
      ]
    }
  },
  methods: {
    count (r) { return this.$s.adminUsers.filter(u => u.role === r).length },
    open () { this.f = { name: '', email: '', role: 'Staff' }; this.modal = true },
    save () {
      if (!this.f.name || !this.f.email) return toast('Name and email are required', 'error')
      this.$s.adminUsers.push({ ...this.f, id: Date.now(), status: 'active', last: 'Never' })
      toast('Invitation sent'); this.modal = false
    },
    ask (u) { this.target = u; this.confirm = true },
    del () { const i = this.$s.adminUsers.findIndex(u => u.id === this.target.id); if (i > -1) { this.$s.adminUsers.splice(i, 1); toast('User removed') } }
  }
}
</script>
