<template>
  <UiModal :model-value="$s.authOpen" @update:model-value="$s.authOpen = $event" :title="isLogin ? $t('signIn') : $t('createAccount')" size="sm">
    <div v-if="$s.authReason" class="flex gap-3 p-3.5 mb-5 rounded-[3px]" style="background:var(--info-soft)">
      <UiIcon name="lock" :size="15" class="mt-0.5 shrink-0" :style="{ color: 'var(--info)' }" />
      <div>
        <p class="text-[12.5px] font-medium" :style="{ color: 'var(--info)' }">{{ $t('loginRequired') }}</p>
        <p class="text-[12px] muted mt-1 leading-relaxed">{{ $s.authReason }}</p>
      </div>
    </div>
    <div class="flex gap-6 hair-b mb-5">
      <button class="tab" :class="isLogin ? 'active' : ''" @click="$s.authTab = 'login'">{{ $t('signIn') }}</button>
      <button class="tab" :class="!isLogin ? 'active' : ''" @click="$s.authTab = 'register'">{{ $t('createAccount') }}</button>
    </div>
    <form class="space-y-4" @submit.prevent="submit">
      <UiInput v-if="!isLogin" v-model="f.name" :label="$t('name')" icon="user" :error="err.name" />
      <UiInput v-model="f.email" :label="$t('email')" icon="mail" type="email" :error="err.email" placeholder="you@email.com" />
      <UiInput v-if="!isLogin" v-model="f.phone" :label="$t('phone')" icon="phone" :error="err.phone" />
      <UiInput v-model="f.pass" :label="$t('password')" icon="lock" type="password" :error="err.pass" placeholder="••••••••" />
      <div v-if="isLogin" class="flex items-center justify-between text-[12.5px]">
        <UiSwitch v-model="remember" :label="$t('rememberMe')" />
        <a href="#" class="muted link-u" @click.prevent="$toast('Reset link sent', 'info')">{{ $t('forgotPassword') }}</a>
      </div>
      <UiButton type="submit" block size="lg">{{ isLogin ? $t('signIn') : $t('createAccount') }}</UiButton>
      <p class="text-center text-[13px] muted">{{ isLogin ? $t('noAccountYet') : $t('haveAccount') }}
        <button type="button" class="link-u" style="color:var(--text)" @click="$s.authTab = isLogin ? 'register' : 'login'">{{ isLogin ? $t('register') : $t('login') }}</button>
      </p>
      <p class="p-3 soft text-[12px] muted leading-relaxed">Demo mode — any email and password will sign you in.</p>
    </form>
  </UiModal>
</template>

<script>
import { toast } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'AuthModal',
  data: () => ({ f: { name: '', email: '', phone: '', pass: '' }, err: {}, remember: true }),
  computed: { isLogin () { return this.$s.authTab === 'login' } },
  watch: { '$s.authTab' () { this.err = {} } },
  methods: {
    submit () {
      const e = {}, f = this.f
      if (!/.+@.+\..+/.test(f.email)) e.email = 'Enter a valid email'
      if (f.pass.length < 4) e.pass = 'Minimum 4 characters'
      if (!this.isLogin) { if (!f.name) e.name = 'Required'; if (f.phone.length < 6) e.phone = 'Enter a valid phone' }
      this.err = e
      if (Object.keys(e).length) return
      this.$s.user = { name: f.name || f.email.split('@')[0].replace(/\b\w/g, c => c.toUpperCase()), email: f.email, phone: f.phone || '+855 12 345 678' }
      this.$s.authOpen = false; this.$s.authReason = ''
      this.f = { name: '', email: '', phone: '', pass: '' }
      toast(t('welcomeBack') + ', ' + this.$s.user.name)
      const next = this.$s.authNext; this.$s.authNext = ''
      if (next) this.$router.push(next)
    }
  }
}
</script>
