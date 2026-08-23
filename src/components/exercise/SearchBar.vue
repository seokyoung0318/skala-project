<script setup>
defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query', 'confirm-search'])
</script>

<template>
  <section class="search-box">
    <h3 class="search-title">도시 검색</h3>
    <div class="search-row">
      <input
        class="search-input"
        :value="searchQuery"
        @input="(e) => emit('update-query', e.target.value)"
        placeholder="검색할 도시 입력 확인"
      />
      <button class="search-button" @click="emit('confirm-search', searchQuery)">확인</button>
    </div>
    <p class="search-hint">검색 중인 도시: {{ searchQuery }}</p>
  </section>
</template>

<style scoped>
.search-box {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.search-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--toss-text);
  letter-spacing: -0.4px;
}

.search-row {
  display: flex;
  gap: 8px;
}

.search-input {
  flex: 1;
  min-width: 0;
  height: 50px;
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: var(--toss-radius-sm);
  background: var(--toss-bg);
  color: var(--toss-text);
  font-size: 15px;
  font-family: inherit;
  letter-spacing: -0.2px;
  outline: none;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

.search-input::placeholder {
  color: var(--toss-text-mute);
}

.search-input:focus {
  background: #ffffff;
  border-color: var(--toss-blue);
}

.search-button {
  flex-shrink: 0;
  height: 50px;
  padding: 0 24px;
  border: none;
  border-radius: var(--toss-radius-sm);
  background: var(--toss-blue);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: -0.2px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background: var(--toss-blue-dark);
}

.search-button:active {
  transform: scale(0.98);
}

.search-hint {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  color: var(--toss-text-mute);
}
</style>
