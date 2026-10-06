<template>
<div class="max-w-md mx-auto px-4 py-28 text-center">
  <p class="display text-[70px] font-bold leading-none">404</p>
  <p class="text-[14px] muted mt-3">This page drifted off the grid.</p>
  <div class="flex gap-3 justify-center mt-8">
    <UiButton to="/">{{$t('home')}}</UiButton>
    <UiButton variant="secondary" to="/shop">{{$t('shop')}}</UiButton>
  </div>
</div>
</template>

<script>
export default { name: 'NotFoundView' }
</script>
