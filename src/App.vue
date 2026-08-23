<script setup>
import { useRoute, RouterView } from 'vue-router'
import weatherLogo from '@/assets/WeatherOrder_Logo.png'
import UnitToggler from '@/components/exercise/UnitToggler.vue'

const route = useRoute()
</script>

<template>
  <header class="app-header">
    <div class="app-header-inner">
      <el-menu :default-active="route.path" mode="horizontal" :ellipsis="false" router>
        <el-menu-item index="/logo" disabled>
          <img :src="weatherLogo" alt="Weather Order" class="logo-img" />
        </el-menu-item>
        <el-menu-item index="/"> 날씨 대시보드 </el-menu-item>
        <el-menu-item index="/about">서비스 소개</el-menu-item>
        <el-menu-item index="/devlog">회고</el-menu-item>
        <UnitToggler />
      </el-menu>
    </div>
  </header>

  <main class="app-main">
    <RouterView />
  </main>
</template>

<style scoped>
.app-header {
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid var(--toss-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 12px;
}

.logo-img {
  height: 81px;
  object-fit: contain;
  vertical-align: middle;
}

.app-main {
  width: 100%;
  min-height: calc(100vh - 96px);
  padding: 40px 24px 80px;
}

/* ===== Element Plus 메뉴 토스 스타일 오버라이드 ===== */
.app-header :deep(.el-menu--horizontal) {
  border-bottom: none;
  height: 96px;
  background: transparent;
  align-items: center;
}

.app-header :deep(.el-menu--horizontal > .el-menu-item) {
  height: 96px;
  line-height: 96px;
  padding: 0 18px;
  font-size: 15px;
  font-weight: 600;
  color: var(--toss-text-sub);
  border-bottom: 2px solid transparent;
  transition:
    color 0.2s,
    border-color 0.2s;
}

.app-header :deep(.el-menu--horizontal > .el-menu-item:hover) {
  background-color: transparent;
  color: var(--toss-text);
}

.app-header :deep(.el-menu--horizontal > .el-menu-item.is-active) {
  color: var(--toss-blue);
  border-bottom-color: var(--toss-blue);
  background-color: transparent;
}

/* 로고 아이템은 메뉴 항목처럼 보이지 않도록 */
.app-header :deep(.el-menu--horizontal > .el-menu-item.is-disabled) {
  opacity: 1;
  cursor: default;
  padding-left: 0;
  padding-right: 28px;
  border-bottom-color: transparent;
}

@media (max-width: 640px) {
  .app-header-inner {
    padding: 0 16px;
  }
  .app-main {
    padding: 24px 16px 60px;
  }
}
</style>
