<template>
  <div class="card">
    <EmptyState icon="lock" :title="$t('permissionRequired')"
      :text="'Your role (' + $s.admin.role + ') does not have access to this section. Switch role in the topbar to preview.'"
      :action-label="$t('goToDashboard')" action-to="/admin" />
  </div>
</template>

<script>
export default { name: 'NoAccess' }
</script>
