<script setup></script>
<template>
  <div class="dashboard-card">
    <div class="dashboard-card-search">
      <slot name="search"> </slot>
    </div>
    <div class="dashboard-card-list">
      <slot name="list"></slot>
    </div>
  </div>
</template>

<style scoped>
.dashboard-card {
  background: #ffffff;
  border: 1px solid var(--toss-border);
  border-radius: var(--toss-radius);
  padding: 28px;
}

.dashboard-card-search {
  padding-bottom: 24px;
  border-bottom: 1px solid var(--toss-border);
}

.dashboard-card-list {
  padding-top: 24px;
}

@media (max-width: 640px) {
  .dashboard-card {
    padding: 20px;
    border-radius: var(--toss-radius-sm);
  }
}
</style>
