<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center p-0 sm:p-6"
        style="background:rgba(10,10,12,.55); backdrop-filter:blur(3px)" @click.self="$emit('update:modelValue', false)">
        <transition name="pop" appear>
          <div class="card-soft w-full overflow-hidden flex flex-col max-h-[92vh]" :class="w" style="border-radius:4px">
            <div class="flex items-center justify-between px-5 py-4 hair-b">
              <h3 class="display text-[15px] font-semibold uppercase tracking-wide">{{ title }}</h3>
              <button class="btn-icon" @click="$emit('update:modelValue', false)"><UiIcon name="x" :size="17" /></button>
            </div>
            <div class="p-5 overflow-y-auto scroll-thin"><slot /></div>
            <div v-if="$slots.footer" class="px-5 py-4 hair-t flex items-center justify-end gap-2" style="background:var(--panel-2)"><slot name="footer" /></div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { lockScroll } from '@/utils/helpers'
export default {
  name: 'UiModal',
  props: { modelValue: Boolean, title: String, size: { default: 'md' } },
  emits: ['update:modelValue'],
  computed: { w () { return { sm: 'sm:max-w-md', md: 'sm:max-w-xl', lg: 'sm:max-w-3xl', xl: 'sm:max-w-5xl' }[this.size] } },
  watch: { modelValue: { immediate: true, handler (v) { lockScroll(v) } } },
  unmounted () { lockScroll(false) }
}
</script>
