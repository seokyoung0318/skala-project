<script setup></script>
<template>
  <div class="dashboard-card">
    <slot name="search"> </slot>
    <slot name="list"></slot>
  </div>
</template>

<style scoped>
.dashboard-card {
  padding: 16px;
}
</style>
