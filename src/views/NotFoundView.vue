//# 정의되지 않은 경로 접근 시 (Catch-all Route)
<script setup>
</script>

<template>
  <div class="not-found">
    <h2>페이지를 찾을 수 없습니다</h2>
    <p>요청하신 페이지가 존재하지 않습니다.</p>
    <RouterLink to="/" class="back-link">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 80px 20px;
}
</style>
