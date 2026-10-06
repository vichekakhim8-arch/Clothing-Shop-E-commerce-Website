<template>
  <div class="min-h-screen grid lg:grid-cols-2" style="background:var(--bg)">
    <div class="hidden lg:block relative overflow-hidden" style="background:var(--soft)">
      <img :src="img" class="w-full h-full object-cover" />
      <router-link to="/" class="absolute top-8 left-10 display text-white text-[18px] font-bold tracking-[.22em]">SHADXW</router-link>
      <div class="absolute inset-0 flex items-end p-10" style="background:linear-gradient(to top,rgba(0,0,0,.65),transparent 60%)">
        <div>
          <p class="display text-white text-[30px] font-bold uppercase leading-tight">Members get<br />the drop first</p>
          <p class="text-white/70 text-[13.5px] mt-3 max-w-xs">Early access, saved addresses and faster checkout.</p>
        </div>
      </div>
    </div>
    <div class="flex flex-col min-h-screen lg:min-h-0">
      <div class="flex items-center justify-between px-5 sm:px-8 h-16 shrink-0">
        <router-link to="/" class="display text-[17px] font-bold tracking-[.22em] lg:invisible">SHADXW</router-link>
        <div class="flex items-center gap-1">
          <button class="btn-icon" @click="$toggleLang()"><span class="text-[11px] font-semibold tracking-wider">{{ $s.lang === 'en' ? 'EN' : 'ខ្មែរ' }}</span></button>
          <button class="btn-icon" @click="$s.theme = $s.theme === 'dark' ? 'light' : 'dark'"><UiIcon :name="$s.theme === 'dark' ? 'sun' : 'moon'" :size="17" /></button>
          <router-link to="/" class="btn btn-sm btn-ghost ml-1"><UiIcon name="arrowL" :size="14" />{{ $t('backToStore') }}</router-link>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <div class="w-full max-w-sm">
          <p class="eyebrow mb-3">SHADXW</p>
          <h1 class="display text-[30px] font-semibold uppercase leading-none">{{ title }}</h1>
          <p class="text-[13.5px] muted mt-3">{{ subtitle }}</p>
          <div class="mt-8"><slot /></div>
        </div>
      </div>
      <p class="text-center text-[11.5px] muted-2 pb-6 px-5">© 2026 SHADXW · <a href="#" class="link-u">Privacy</a> · <a href="#" class="link-u">Terms</a></p>
    </div>
  </div>
</template>

<script>
import { M } from '@/utils/data'
export default {
  name: 'AuthShell',
  props: { title: String, subtitle: String },
  computed: { img () { return M.d } }
}
</script>
