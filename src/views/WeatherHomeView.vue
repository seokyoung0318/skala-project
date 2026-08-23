// # 메인 날씨 대시보드 화면
<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { fetchWeatherByCity, getTomorrowForecast, cityNameMap } from '@/api/weather'
import { averageSales } from '@/stores/averageSalesStore'

const router = useRouter()

// ===== 1. 반응형 상태 =====
// 4일차 API 연동을 대비한 가상의 백엔드 데이터 배열 (v-for 및 :key 실습용)
const weatherList = ref([])

// 검색어 및 알림창 제어용 데이터 (v-model 대용 한글 처리 및 이벤트 실습용)
const searchQuery = ref('') //반응형 변수
const hasSearched = ref(false)
const selectedCity = ref('확인하고 싶은 지역의 카드를 선택하세요')

// ===== 2. Computed ===== computed 함수로 필터 기능 추가
const filteredWeatherList = computed(() => {
  return weatherList.value
    .filter((city) => city.name.includes(searchQuery.value))
    .map((city) => {
      const categories = []

      if (city.temp >= 28) {
        const baseSales = averageSales.value[city.id].ice
        categories.push({
          key: 'ice',
          label: '얼음컵',
          multiplier: 2,
          baseSales,
          recommendOrder: Math.round(baseSales * 2),
        })
      }

      if (city.temp >= 25) {
        const baseSales = averageSales.value[city.id].drink
        categories.push({
          key: 'drink',
          label: '음료',
          multiplier: 1.5,
          baseSales,
          recommendOrder: Math.round(baseSales * 1.5),
        })
      }

      if (city.status === '비') {
        const baseSales = averageSales.value[city.id].umbrella
        categories.push({
          key: 'umbrella',
          label: '우산',
          multiplier: 1.5,
          baseSales,
          recommendOrder: Math.round(baseSales * 1.5),
        })
      }

      if (city.temp < 15) {
        const baseSales = averageSales.value[city.id].warmDrink
        categories.push({
          key: 'warmDrink',
          label: '온장고 음료',
          multiplier: 1.5,
          baseSales,
          recommendOrder: Math.round(baseSales * 1.5),
        })
      }

      return { ...city, categories }
    })
})

// ===== 3. Watch =====
watch(selectedCity, (newValue, oldValue) => {
  console.log(`상태바 문구 변경: "${oldValue}"=>"${newValue}"`)
})

watchEffect(() => {
  console.log(`검색어 변경 감지: "${searchQuery.value}"`)
})

// ===== 4. 함수 (Actions) =====
// 알림 대행 함수 (window 객체 격리 우회)

onMounted(async () => {
  const defaultCities = ['서울', '부산', '인천']

  for (const city of defaultCities) {
    await searchCityFromApi(city)
  }
})

function selectedCard(cityName) {
  selectedCity.value = `${cityName}이 선택되었습니다.`
}

function showMessage() {
  if (filteredWeatherList.value.length > 0) {
    const firstMatch = filteredWeatherList.value[0]
    selectedCard(firstMatch.name)
  } else {
    selectedCity.value = '일치하는 도시가 없습니다.'
  }
}

function getRecommendReason(city, rule) {
  if (rule.key === 'ice' && city.temp >= 28) {
    return `폭염 기준(28도 이상) 충족 - 평소보다 ${rule.multiplier}배 수요 예상`
  }
  if (rule.key === 'umbrella' && city.status === '비') {
    return `강수 예보 - 우산 수요 반영`
  }
  if (rule.key === 'drink' && city.temp >= 25) {
    return `폭염 기준(25도 이상) 충족 - 평소보다 ${rule.multiplier}배 수요 예상`
  }
  if (rule.key === 'warmDrink' && city.temp < 15) {
    return `낮은 기온(15도 미만) - 평소보다 ${rule.multiplier}배 수요 예상`
  }
}
const showDetail = (cityName, status) => {
  const city = filteredWeatherList.value.find((c) => c.name === cityName)
  if (!city) return
  router.push('/weather/' + city.id)
}

function updateSales(cityId, key, value) {
  averageSales.value[cityId][key] = value
}

function updateQuery(value) {
  searchQuery.value = value
  hasSearched.value = false
}
async function searchCityFromApi(cityName) {
  if (!cityName) return
  hasSearched.value = true
  try {
    const apiQuery = cityNameMap[cityName] || cityName
    const data = await fetchWeatherByCity(apiQuery)
    const tomorrowData = getTomorrowForecast(data)
    const newCityId = `city_${cityName}`

    const newCity = {
      id: newCityId,
      name: cityName,
      temp: Math.round(tomorrowData.main.temp),
      status: tomorrowData.weather[0].main,
    }
    // 이미 같은 도시가 있는지 찾기
    const existingIndex = weatherList.value.findIndex((city) => city.id === newCityId)

    if (existingIndex !== -1) {
      // 이미 있으면 그 자리 값만 교체
      weatherList.value[existingIndex] = newCity
    } else {
      // 없으면 새로 추가
      weatherList.value.push(newCity)
    }

    // averageSales는 기존 값 있으면 유지, 없으면만 새로 초기화
    if (!averageSales.value[newCityId]) {
      averageSales.value[newCityId] = { drink: 0, ice: 0, umbrella: 0, warmDrink: 0 }
    }
  } catch (error) {
    console.error('도시 검색 실패:', error)
    selectedCity.value = '해당 도시를 찾을 수 없습니다.'
  }
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <template #search>
        <SearchBar
          :search-query="searchQuery"
          @update-query="updateQuery"
          @confirm-search="searchCityFromApi"
        />
      </template>
      <template v-slot:list>
        <section class="weather-card" v-if="filteredWeatherList.length > 0">
          <h3 class="section-title">지역별 추천 발주 상품</h3>
          <ul class="weather-list">
            <WeatherCard
              v-for="weather in filteredWeatherList"
              :key="weather.id"
              :weather="weather"
              @select-card="selectedCard"
              @click-detail="showDetail"
              @update-sales="updateSales"
            />
          </ul>
        </section>
        <p class="empty-text" v-else-if="hasSearched">{{ searchQuery }} 없습니다.</p>
      </template>
    </BaseDashboardCard>
    <p class="status-banner">{{ selectedCity }}</p>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: var(--toss-text);
  letter-spacing: -0.4px;
}

.weather-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* 마지막 카드 아래 여백 제거 (카드 자체 margin-bottom 상쇄) */
.weather-list > :last-child {
  margin-bottom: 0;
}

.empty-text {
  margin: 0;
  padding: 40px 0;
  text-align: center;
  font-size: 15px;
  color: var(--toss-text-mute);
}

.status-banner {
  margin: 0;
  padding: 16px 20px;
  border-radius: var(--toss-radius-sm);
  background: var(--toss-blue-light);
  color: var(--toss-blue-dark);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.2px;
  text-align: center;
}
</style>
