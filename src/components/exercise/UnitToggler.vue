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
  margin-right: 16px;
  align-self: center;
  cursor: pointer;
}
</style>
