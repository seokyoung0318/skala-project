<script setup>
import { useRoute, RouterView } from 'vue-router'
import weatherLogo from '@/assets/WeatherOrder_Logo.png'
import UnitToggler from '@/components/exercise/UnitToggler.vue'

const route = useRoute()
</script>

<template>
  <el-menu :default-active="route.path" mode="horizontal" :ellipsis="false" router>
    <el-menu-item index="/logo" disabled>
      <img :src="weatherLogo" alt="Weather Order" class="logo-img" />
    </el-menu-item>
    <el-menu-item index="/"> 날씨 대시보드 </el-menu-item>
    <el-menu-item index="/about">서비스 소개</el-menu-item>
    <UnitToggler />
  </el-menu>
  <RouterView />
</template>

<style scoped>
.app-header {
  width: 100%;
  border-bottom: 1px solid #eee;
}
.nav-menu {
  width: 100%;
}
.logo-img {
  height: 48px;
  object-fit: contain;
}
</style>
