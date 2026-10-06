<template>
<AuthShell :title="$t('createAccount')" subtitle="Create an account in less than a minute.">
  <form class="space-y-4" @submit.prevent="submit">
    <UiInput v-model="f.name" :label="$t('name')" icon="user" :error="err.name"/>
    <UiInput v-model="f.email" :label="$t('email')" icon="mail" type="email" :error="err.email"/>
    <UiInput v-model="f.phone" :label="$t('phone')" icon="phone" :error="err.phone"/>
    <UiInput v-model="f.pass" :label="$t('password')" icon="lock" type="password" :error="err.pass" hint="At least 6 characters"/>
    <UiButton type="submit" block size="lg">{{$t('createAccount')}}</UiButton>
    <p class="text-center text-[13px] muted">{{$t('haveAccount')}} <router-link to="/login" class="link-u" style="color:var(--text)">{{$t('signIn')}}</router-link></p>
  </form>
</AuthShell>
</template>

<script>
import AuthShell from '@/components/layout/AuthShell.vue'
import { toast } from '@/utils/helpers'

export default {
  name: 'RegisterView',
  components: { AuthShell },
  data: () => ({ f: { name: '', email: '', phone: '', pass: '' }, err: {} }),
  methods: {
    submit () {
      const e = {}, f = this.f
      if (!f.name) e.name = 'Required'
      if (!/.+@.+\..+/.test(f.email)) e.email = 'Enter a valid email'
      if (f.phone.length < 6) e.phone = 'Enter a valid phone'
      if (f.pass.length < 6) e.pass = 'At least 6 characters'
      this.err = e
      if (Object.keys(e).length) return
      this.$s.user = { name: f.name, email: f.email, phone: f.phone }
      this.$s.authReason = ''
      const n = this.$s.authNext; this.$s.authNext = ''
      toast('Account created — welcome')
      this.$router.push(this.$route.query.redirect || n || '/account')
    }
  }
}
</script>
