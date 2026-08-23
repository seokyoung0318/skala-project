<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { translateWeatherStatus } from '@/api/weather'

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
  <el-card
    class="weather-card-item"
    shadow="never"
    :data-weather="weather.status"
    @click="emit('select-card', weather.name)"
  >
    <div class="card-header">
      <span class="card-title"
        >[{{
          weather.name +
          '(' +
          translateWeatherStatus(weather.status) +
          ')' +
          '현재 기온' +
          displayTemp +
          configStore.unitSymbol
        }}]</span
      >

      <el-button
        class="card-detail-btn"
        type="primary"
        plain
        round
        size="small"
        @click.stop="emit('click-detail', weather.name, weather.status)"
        >상세보기</el-button
      >
    </div>

    <div class="badge-row">
      <span v-if="weather.temp >= 25" class="badge badge-hot"> 높은 기온(25도 이상) ☀️</span>
      <span v-else-if="weather.temp >= 15 && weather.temp < 25" class="badge badge-mild"
        >활동하기 좋은 날씨(15도~24도)</span
      >
      <span v-else class="badge badge-cold"> 낮은 기온(15도 이하)</span>
      <span v-if="weather.status === '비'" class="badge badge-rain"> 비 ☔️</span>
    </div>

    <div class="sales-row" v-for="cat in weather.categories" :key="cat.key" @click.stop>
      <label class="sales-label">
        일평균 {{ cat.label }} 판매수량:
        <input
          class="sales-input"
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
      </label>
      <p class="sales-result">{{ cat.label }} 추천 발주 : {{ cat.recommendOrder }}개</p>
    </div>
  </el-card>
</template>
<style scoped>
.weather-card-item {
  list-style: none;
  margin-bottom: 16px;
  border: 1px solid var(--toss-border);
  border-radius: var(--toss-radius);
  background: #ffffff;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

.weather-card-item:hover {
  border-color: #c9cfd6;
}

.weather-card-item :deep(.el-card__body) {
  padding: 24px;
}

/* ===== 날씨별 분위기 (data-weather 기반, 전부 CSS) ===== */
/* 제목 앞 아이콘은 content 로만 주입 */
.weather-card-item[data-weather] .card-title::before {
  margin-right: 6px;
}

/* 맑음 */
.weather-card-item[data-weather='Clear'] {
  background: linear-gradient(135deg, #fffaeb 0%, #fff3e2 100%);
  border-color: #ffe6bd;
}
.weather-card-item[data-weather='Clear'] .card-title::before {
  content: '☀️';
}

/* 구름 */
.weather-card-item[data-weather='Clouds'] {
  background: linear-gradient(135deg, #fafbfc 0%, #f0f3f6 100%);
  border-color: #e3e7ec;
}
.weather-card-item[data-weather='Clouds'] .card-title::before {
  content: '☁️';
}

/* 비 / 이슬비 */
.weather-card-item[data-weather='Rain'] {
  background: linear-gradient(135deg, #f2f7fd 0%, #e6effa 100%);
  border-color: #d2e2f5;
}
.weather-card-item[data-weather='Rain'] .card-title::before {
  content: '🌧️';
}

.weather-card-item[data-weather='Drizzle'] {
  background: linear-gradient(135deg, #f4f9fd 0%, #eaf2fa 100%);
  border-color: #d9e7f6;
}
.weather-card-item[data-weather='Drizzle'] .card-title::before {
  content: '🌦️';
}

/* 뇌우 */
.weather-card-item[data-weather='Thunderstorm'] {
  background: linear-gradient(135deg, #f3f3fa 0%, #e8e8f4 100%);
  border-color: #d8d8e9;
}
.weather-card-item[data-weather='Thunderstorm'] .card-title::before {
  content: '⛈️';
}

/* 눈 */
.weather-card-item[data-weather='Snow'] {
  background: linear-gradient(135deg, #fafdff 0%, #edf6fd 100%);
  border-color: #daecf8;
}
.weather-card-item[data-weather='Snow'] .card-title::before {
  content: '❄️';
}

/* 안개 (Mist / Fog / Haze) */
.weather-card-item[data-weather='Mist'],
.weather-card-item[data-weather='Fog'],
.weather-card-item[data-weather='Haze'] {
  background: linear-gradient(135deg, #f7f8f9 0%, #edeff1 100%);
  border-color: #dfe2e5;
}
.weather-card-item[data-weather='Mist'] .card-title::before,
.weather-card-item[data-weather='Fog'] .card-title::before,
.weather-card-item[data-weather='Haze'] .card-title::before {
  content: '🌫️';
}

/* 날씨 배경 위에서는 발주 입력 박스를 흰색으로 띄워 대비 확보 */
.weather-card-item[data-weather] .sales-row {
  background: rgba(255, 255, 255, 0.72);
}

/* ===== 헤더 ===== */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--toss-text);
  letter-spacing: -0.3px;
  line-height: 1.4;
}

.card-detail-btn {
  flex-shrink: 0;
  font-weight: 600;
}

/* ===== 상태 배지 ===== */
.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.2px;
  white-space: nowrap;
}

.badge-hot {
  background: var(--toss-orange-light);
  color: #d97400;
}

.badge-mild {
  background: var(--toss-green-light);
  color: #0e9c64;
}

.badge-cold {
  background: var(--toss-blue-light);
  color: var(--toss-blue-dark);
}

.badge-rain {
  background: var(--toss-blue-light);
  color: var(--toss-blue);
}

/* ===== 발주 입력 ===== */
.sales-row {
  margin-top: 16px;
  padding: 16px;
  border-radius: var(--toss-radius-sm);
  background: var(--toss-bg);
  cursor: default;
}

.sales-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--toss-text-sub);
}

.sales-input {
  width: 92px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--toss-border);
  border-radius: 10px;
  background: #ffffff;
  color: var(--toss-text);
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  text-align: right;
  outline: none;
  transition: border-color 0.2s;
}

.sales-input:focus {
  border-color: var(--toss-blue);
}

.sales-result {
  margin: 10px 0 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--toss-blue);
  letter-spacing: -0.2px;
}

@media (max-width: 640px) {
  .weather-card-item :deep(.el-card__body) {
    padding: 18px;
  }
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
