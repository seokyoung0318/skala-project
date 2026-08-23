//# :cityId 패턴을 수신하는 동적 상세 페이지
<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { fetchWeatherByCity, getTomorrowFullDay, cityNameMap } from '@/api/weather'
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
  console.log('renderChart 호출됨', chartCanvas.value, hourlyForecast.value.length)
  if (!chartCanvas.value || hourlyForecast.value.length === 0) return

  const labels = hourlyForecast.value.map((item) => item.dt_txt.split(' ')[1].slice(0, 5))
  const temps = hourlyForecast.value.map((item) => Math.round(item.main.temp))
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
        y: { ticks: { callback: (v) => v + '도' } },
        x: { grid: { display: false } },
      },
    },
  })
}

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
  <div v-if="city">
    <h2>{{ city.name }} 상세 정보</h2>
    <p>{{ city.name }}지역 내일의 날씨는 [{{ city.status }}] 예정입니다.</p>
    <p>예상 기온: {{ displayTemp }}도</p>

    <div v-if="categories.length === 0">현재 특별한 발주 추천 상품이 없습니다.</div>
    <div v-else v-for="cat in categories" :key="cat.key">
      일평균 {{ cat.label }} 판매수량:
      <input
        type="number"
        min="0"
        :value="cat.baseSales"
        @input="(e) => updateSales(cat.key, Number(e.target.value))"
      />
      <br />
      📢 {{ cat.label }} 추천 발주: {{ cat.recommendOrder }}개
      <br />
      → {{ getRecommendReason(cat) }}
    </div>

    <h3>내일 시간대별 예보</h3>
    <div style="position: relative; height: 240px">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <RouterLink to="/">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
  <div v-else>
    <p>해당 도시 정보를 찾을 수 없습니다.</p>
  </div>
</template>
