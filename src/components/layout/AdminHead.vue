<template>
  <div class="flex flex-wrap items-end justify-between gap-x-4 gap-y-3 mb-5 sm:mb-6 min-w-0">
    <div class="min-w-0 flex-1" style="min-width:min(100%,200px)">
      <h1 class="display text-[clamp(19px,3vw,27px)] font-semibold uppercase leading-tight break-anywhere">{{ title }}</h1>
      <p v-if="subtitle" class="text-[12.5px] muted mt-1.5 break-anywhere">{{ subtitle }}</p>
    </div>
    <div class="flex flex-wrap items-center gap-2 shrink-0"><slot /></div>
  </div>
</template>

<script>
export default {
  name: 'AdminHead',
  props: { title: String, subtitle: String }
}
</script>
