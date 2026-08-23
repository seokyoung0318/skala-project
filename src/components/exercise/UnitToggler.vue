<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <button @click="configStore.toggleUnit" class="unit-toggle-btn">
    단위변경 ({{ configStore.unitSymbol }})
  </button>
</template>

<style scoped>
.unit-toggle-btn {
  margin-left: auto;
  align-self: center;
  cursor: pointer;

  border: none;
  border-radius: 999px;
  padding: 9px 18px;
  background: var(--toss-bg);
  color: var(--toss-text-sub);
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: -0.2px;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.unit-toggle-btn:hover {
  background: var(--toss-blue-light);
  color: var(--toss-blue);
}

.unit-toggle-btn:active {
  transform: scale(0.97);
}
</style>
