<template>
<AuthShell :title="$t('signIn')" :subtitle="$t('welcomeBack')">
  <form class="space-y-4" @submit.prevent="submit">
    <UiInput v-model="email" :label="$t('email')" icon="mail" type="email" :error="err.email" placeholder="you@email.com"/>
    <UiInput v-model="pass" :label="$t('password')" icon="lock" type="password" :error="err.pass" placeholder="••••••••"/>
    <div class="flex items-center justify-between text-[12.5px]">
      <UiSwitch v-model="remember" :label="$t('rememberMe')"/>
      <a href="#" class="muted link-u" @click.prevent="$toast('Reset link sent','info')">{{$t('forgotPassword')}}</a>
    </div>
    <UiButton type="submit" block size="lg">{{$t('signIn')}}</UiButton>
    <div class="p-3 soft text-[12px] muted leading-relaxed">Demo: any email + password works. <br/>Admin panel: <router-link to="/admin" class="link-u accent">/admin</router-link></div>
    <p class="text-center text-[13px] muted">{{$t('noAccountYet')}} <router-link to="/register" class="link-u" style="color:var(--text)">{{$t('createAccount')}}</router-link></p>
  </form>
</AuthShell>
</template>

<script>
import AuthShell from '@/components/layout/AuthShell.vue'
import { toast } from '@/utils/helpers'
import { t } from '@/utils/i18n'

export default {
  name: 'LoginView',
  components: { AuthShell },
  data: () => ({ email: '', pass: '', remember: true, err: {} }),
  methods: {
    submit () {
      const e = {}
      if (!/.+@.+\..+/.test(this.email)) e.email = 'Enter a valid email'
      if (this.pass.length < 4) e.pass = 'Minimum 4 characters'
      this.err = e
      if (Object.keys(e).length) return
      this.$s.user = { name: this.email.split('@')[0].replace(/\b\w/g, c => c.toUpperCase()), email: this.email, phone: '+855 12 345 678' }
      this.$s.authReason = ''
      const n = this.$s.authNext; this.$s.authNext = ''
      toast(t('welcomeBack') + ', ' + this.$s.user.name)
      this.$router.push(this.$route.query.redirect || n || '/account')
    }
  }
}
</script>
