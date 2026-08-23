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
    <h3>도시 검색</h3>
    <input
      :value="searchQuery"
      @input="(e) => emit('update-query', e.target.value)"
      placeholder="검색할 도시 입력 확인"
    />
    <button @click="emit('confirm-search', searchQuery)">확인</button>
    <p>검색 중인 도시: {{ searchQuery }}</p>
  </section>
</template>
