//# :cityId 패턴을 수신하는 동적 상세 페이지
<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  fetchWeatherByCity,
  getTomorrowFullDay,
  cityNameMap,
  translateWeatherStatus,
} from '@/api/weather'
import { averageSales } from '@/stores/averageSalesStore'
import { useConfigStore } from '@/stores/configStore'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from 'chart.js'
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip)

const route = useRoute()
const city = ref(null)
const hourlyForecast = ref([])
const cityId = route.params.cityId
const configStore = useConfigStore()

const chartCanvas = ref(null)
let chartInstance = null

const categories = computed(() => {
  if (!city.value || !averageSales.value[cityId]) return []

  const sales = averageSales.value[cityId]
  const list = []
  const temp = city.value.temp
  const status = city.value.status

  if (temp >= 28) {
    list.push({
      key: 'ice',
      label: '얼음컵',
      multiplier: 2,
      baseSales: sales.ice,
      recommendOrder: Math.round(sales.ice * 2),
    })
  }
  if (temp >= 25) {
    list.push({
      key: 'drink',
      label: '음료',
      multiplier: 1.5,
      baseSales: sales.drink,
      recommendOrder: Math.round(sales.drink * 1.5),
    })
  }
  if (['Rain', 'Drizzle', 'Thunderstorm'].includes(status)) {
    list.push({
      key: 'umbrella',
      label: '우산',
      multiplier: 1.5,
      baseSales: sales.umbrella,
      recommendOrder: Math.round(sales.umbrella * 1.5),
    })
  }
  if (temp < 15) {
    list.push({
      key: 'warmDrink',
      label: '온장고 음료',
      multiplier: 1.5,
      baseSales: sales.warmDrink,
      recommendOrder: Math.round(sales.warmDrink * 1.5),
    })
  }

  return list
})

const displayTemp = computed(() => {
  if (!city.value) return null
  const rawTemp = city.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

function updateSales(key, value) {
  averageSales.value[cityId][key] = value
}

function getRecommendReason(rule) {
  if (rule.key === 'ice') {
    return `폭염 기준(28도 이상) 충족 - 평소보다 ${rule.multiplier}배 수요 예상`
  }
  if (rule.key === 'umbrella') {
    return `강수 예보 - 우산 수요 반영`
  }
  if (rule.key === 'drink') {
    return `폭염 기준(25도 이상) 충족 - 평소보다 ${rule.multiplier}배 수요 예상`
  }
  if (rule.key === 'warmDrink') {
    return `낮은 기온(15도 미만) - 평소보다 ${rule.multiplier}배 수요 예상`
  }
}

function renderChart() {
  if (!chartCanvas.value || hourlyForecast.value.length === 0) return

  const labels = hourlyForecast.value.map((item) => item.dt_txt.split(' ')[1].slice(0, 5))
  const temps = hourlyForecast.value.map((item) => {
    const raw = Math.round(item.main.temp)
    if (configStore.unit === 'fahrenheit') {
      return Math.round((raw * 9) / 5 + 32)
    }
    return raw
  })
  const pointColors = hourlyForecast.value.map((item) => {
    const status = item.weather[0].main
    return status === 'Rain' ? '#eb6834' : '#2a78d6'
  })

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          data: temps,
          borderColor: '#2a78d6',
          borderWidth: 2,
          pointRadius: 6,
          pointBackgroundColor: pointColors,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          tension: 0.3,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { ticks: { callback: (v) => v + configStore.unitSymbol } },
        x: { grid: { display: false } },
      },
    },
  })
}

watch(
  () => configStore.unit,
  async () => {
    await nextTick()
    renderChart()
  },
)

onMounted(async () => {
  const cityName = cityId.replace('city_', '')
  const apiQuery = cityNameMap[cityName] || cityName

  if (!averageSales.value[cityId]) {
    averageSales.value[cityId] = { drink: 0, ice: 0, umbrella: 0, warmDrink: 0 }
  }

  try {
    const data = await fetchWeatherByCity(apiQuery)
    hourlyForecast.value = getTomorrowFullDay(data)

    const representative = hourlyForecast.value[0]
    city.value = {
      name: cityName,
      temp: Math.round(representative.main.temp),
      status: representative.weather[0].main,
    }
    await nextTick()
    renderChart()
  } catch (error) {
    console.error('상세 정보 조회 실패:', error)
  }
})
</script>

<template>
  <div class="detail-page" v-if="city">
    <section class="detail-card summary-card" :data-weather="city.status">
      <h2 class="detail-title">{{ city.name }} 상세 정보</h2>
      <p class="detail-desc">
        {{ city.name }}지역 내일의 날씨는 [{{ translateWeatherStatus(city.status) }}] 예정입니다.
      </p>
      <p class="detail-temp">예상 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
    </section>

    <section class="detail-card">
      <div class="empty-box" v-if="categories.length === 0">
        현재 특별한 발주 추천 상품이 없습니다.
      </div>
      <div class="cat-item" v-else v-for="cat in categories" :key="cat.key">
        <label class="cat-label">
          일평균 {{ cat.label }} 판매수량:
          <input
            class="cat-input"
            type="number"
            min="0"
            :value="cat.baseSales"
            @input="(e) => updateSales(cat.key, Number(e.target.value))"
          />
        </label>
        <p class="cat-order">📢 {{ cat.label }} 추천 발주: {{ cat.recommendOrder }}개</p>
        <p class="cat-reason">→ {{ getRecommendReason(cat) }}</p>
      </div>
    </section>

    <section class="detail-card">
      <h3 class="chart-title">내일 시간대별 예보</h3>
      <div class="chart-box">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </section>

    <RouterLink to="/" class="back-link">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
  <div class="detail-page" v-else>
    <section class="detail-card">
      <p class="empty-box">해당 도시 정보를 찾을 수 없습니다.</p>
    </section>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-card {
  background: #ffffff;
  border: 1px solid var(--toss-border);
  border-radius: var(--toss-radius);
  padding: 28px;
}

/* ===== 날씨별 분위기 (data-weather 기반, 전부 CSS) ===== */
.summary-card {
  position: relative;
  overflow: hidden;
  padding-right: 130px;
  transition: background 0.4s ease;
}

/* 우측 대형 아이콘 — content 로만 주입 */
.summary-card::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 28px;
  transform: translateY(-50%);
  font-size: 68px;
  line-height: 1;
  opacity: 0.85;
  pointer-events: none;
}

/* 맑음 — 살굿빛 노랑 */
.summary-card[data-weather='Clear'] {
  background: linear-gradient(135deg, #fff8e3 0%, #ffeed9 100%);
  border-color: #ffe0ad;
}
.summary-card[data-weather='Clear']::after {
  content: '☀️';
}

/* 구름 — 연회색 */
.summary-card[data-weather='Clouds'] {
  background: linear-gradient(135deg, #f8f9fb 0%, #ecf0f4 100%);
  border-color: #dfe4ea;
}
.summary-card[data-weather='Clouds']::after {
  content: '☁️';
}

/* 비 / 이슬비 — 차분한 푸른빛 */
.summary-card[data-weather='Rain'] {
  background: linear-gradient(135deg, #eef4fc 0%, #e0ebf8 100%);
  border-color: #cbdff4;
}
.summary-card[data-weather='Rain']::after {
  content: '🌧️';
}

.summary-card[data-weather='Drizzle'] {
  background: linear-gradient(135deg, #f0f6fc 0%, #e5eef8 100%);
  border-color: #d3e3f4;
}
.summary-card[data-weather='Drizzle']::after {
  content: '🌦️';
}

/* 뇌우 — 어둑한 남보라 */
.summary-card[data-weather='Thunderstorm'] {
  background: linear-gradient(135deg, #f0f0f8 0%, #e3e3f1 100%);
  border-color: #d3d3e6;
}
.summary-card[data-weather='Thunderstorm']::after {
  content: '⛈️';
}

/* 눈 — 차가운 흰푸른 */
.summary-card[data-weather='Snow'] {
  background: linear-gradient(135deg, #f7fbff 0%, #e9f4fd 100%);
  border-color: #d5e9f7;
}
.summary-card[data-weather='Snow']::after {
  content: '❄️';
}

/* 안개 (Mist / Fog / Haze) — 뿌연 회색 */
.summary-card[data-weather='Mist'],
.summary-card[data-weather='Fog'],
.summary-card[data-weather='Haze'] {
  background: linear-gradient(135deg, #f5f6f7 0%, #e9ebed 100%);
  border-color: #dcdfe2;
}
.summary-card[data-weather='Mist']::after,
.summary-card[data-weather='Fog']::after,
.summary-card[data-weather='Haze']::after {
  content: '🌫️';
}

/* ===== 도시 요약 ===== */
.detail-title {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 700;
  color: var(--toss-text);
  letter-spacing: -0.6px;
}

.detail-desc {
  margin: 0;
  font-size: 15px;
  font-weight: 400;
  color: var(--toss-text-sub);
}

.detail-temp {
  margin: 20px 0 0;
  font-size: 15px;
  font-weight: 400;
  color: var(--toss-text-sub);
}

/* ===== 발주 추천 ===== */
.cat-item + .cat-item {
  margin-top: 12px;
}

.cat-item {
  padding: 20px;
  border-radius: var(--toss-radius-sm);
  background: var(--toss-bg);
}

.cat-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--toss-text-sub);
}

.cat-input {
  width: 100px;
  height: 42px;
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

.cat-input:focus {
  border-color: var(--toss-blue);
}

.cat-order {
  margin: 16px 0 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--toss-blue);
  letter-spacing: -0.3px;
}

.cat-reason {
  margin: 6px 0 0;
  font-size: 13px;
  font-weight: 400;
  color: var(--toss-text-mute);
}

.empty-box {
  margin: 0;
  padding: 28px 0;
  text-align: center;
  font-size: 15px;
  color: var(--toss-text-mute);
}

/* ===== 차트 ===== */
.chart-title {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 700;
  color: var(--toss-text);
  letter-spacing: -0.4px;
}

.chart-box {
  position: relative;
  height: 240px;
}

/* ===== 돌아가기 ===== */
.back-link {
  align-self: flex-start;
  padding: 12px 20px;
  border-radius: var(--toss-radius-sm);
  background: #ffffff;
  border: 1px solid var(--toss-border);
  font-size: 14px;
  font-weight: 600;
  color: var(--toss-text-sub);
  transition:
    color 0.2s,
    border-color 0.2s;
}

.back-link:hover {
  color: var(--toss-blue);
  border-color: var(--toss-blue);
}

@media (max-width: 640px) {
  .detail-card {
    padding: 20px;
    border-radius: var(--toss-radius-sm);
  }
  .detail-title {
    font-size: 20px;
  }
  /* 좁은 화면에서는 아이콘을 줄이고 본문과 겹치지 않게 */
  .summary-card {
    padding-right: 80px;
  }
  .summary-card::after {
    right: 16px;
    font-size: 44px;
  }
}
</style>
