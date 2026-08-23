<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  weather: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail', 'update-sales'])

const configStore = useConfigStore()

const displayTemp = computed(() => {
  const rawTemp = props.weather.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
</script>

<template>
  <el-card class="weather-card-item" @click="emit('select-card', weather.name)">
    [{{
      weather.name +
      '(' +
      weather.status +
      ')' +
      '현재 기온' +
      displayTemp +
      configStore.unitSymbol
    }}]
    <span v-if="weather.temp >= 25"> 높은 기온(25도 이상) ☀️</span>
    <span v-else-if="weather.temp >= 15 && weather.temp < 25">활동하기 좋은 날씨(15도~24도)</span>
    <span v-else> 낮은 기온(15도 이하)</span>
    <span v-if="weather.status === '비'"> 비 ☔️</span>

    <el-button @click.stop="emit('click-detail', weather.name, weather.status)">상세보기</el-button>
    <div v-for="cat in weather.categories" :key="cat.key" @click.stop>
      일평균 {{ cat.label }} 판매수량:
      <input
        type="number"
        min="0"
        :value="cat.baseSales"
        @keydown="
          (e) => {
            if (e.key === '-') e.preventDefault()
          }
        "
        @click.stop
        @input="(e) => emit('update-sales', weather.id, cat.key, Number(e.target.value))"
      />
      <br />
      {{ cat.label }} 추천 발주 : {{ cat.recommendOrder }}개
      <br />
    </div>
  </el-card>
</template>
<style scoped>
.weather-card-item {
  list-style: none;
  padding: 0;
  margin-bottom: 16px;
}
</style>
