<template>
  <div class="flex items-end justify-between gap-6 mb-7">
    <div>
      <p v-if="eyebrow" class="eyebrow mb-2">{{ eyebrow }}</p>
      <h2 class="display text-[clamp(22px,4vw,34px)] font-semibold uppercase leading-[1.05]">{{ title }}</h2>
    </div>
    <router-link v-if="link" :to="link" class="text-[12.5px] uppercase tracking-[.14em] link-u whitespace-nowrap hidden sm:inline-flex items-center gap-2">
      {{ linkLabel || $t('viewAll') }} <UiIcon name="arrowR" :size="14" />
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'SectionHead',
  props: { eyebrow: String, title: String, link: String, linkLabel: String }
}
</script>
