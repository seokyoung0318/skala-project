<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// 4일차 API 연동을 대비한 가상의 백엔드 데이터 배열 (v-for 및 :key 실습용)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

//나만의 데이터 추가
const averageSales = ref({
  city_01: { drink: 0, umbrella: 0, warmDrink: 0 },
  city_02: { drink: 0, umbrella: 0, warmDrink: 0 },
  city_03: { drink: 0, umbrella: 0, warmDrink: 0 },
})

// 검색어 및 알림창 제어용 데이터 (v-model 대용 한글 처리 및 이벤트 실습용)
const searchQuery = ref('') //반응형 변수

// 알림 대행 함수 (window 객체 격리 우회)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const selectedCity = ref('확인하고 싶은 지역의 카드를 선택하세요')

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

//computed 함수로 필터 기능 추가
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

watch(selectedCity, (newValue, oldValue) => {
  console.log(`상태바 문구 변경: "${oldValue}"=>"${newValue}"`)
})

watchEffect(() => {
  console.log(`검색어 변경 감지: "${searchQuery.value}"`)
})
</script>

<template>
  <!-- <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>도시 검색</h3>
      <input
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 입력 확인"
      />
      <button @click="showMessage">확인</button>
      <p>검색 중인 도시: {{ searchQuery }}</p>
    </section> -->

    <!-- <section class="weather-card" v-if="filteredWeatherList.length > 0">
      <h3>지역별 발주 추천</h3>
      <ul>
        <li
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          class="weather-card-item"
          @click="selectedCard(weather.name)"
        >
          [{{ weather.name + '(' + weather.status + ')' + '현재 기온' + weather.temp }}]
          <span v-if="weather.temp >= 25"> 높은 기온(25도 이상) ☀️</span>
          <span v-else-if="weather.temp >= 15 && weather.temp < 25"
            >활동하기 좋은 날씨(15도~24도)</span
          >
          <span v-else> 낮은 기온(15도 이하)</span>
          <span v-if="weather.status === '비;'"> 비 ☔️</span>

          <button @click.stop="showDetail(weather.name, weather.status)">상세보기</button>
          <div v-for="cat in weather.categories" :key="cat.key" @click.stop>
            일평균 {{ cat.label }} 판매수량:
            <input
              type="number"
              min="0"
              :value="averageSales[weather.id][cat.key]"
              @keydown="
                (e) => {
                  if (e.key === '-') e.preventDefault()
                }
              "
              @click.stop
              @input="(e) => (averageSales[weather.id][cat.key] = Number(e.target.value))"
            />
            <br />
            📢 오늘 추천 발주 : {{ cat.recommendOrder }}개 (일평균 판매수량 X{{ cat.multiplier }}) -->
            <br />
            {{ getRecommendReason(weather, cat) }}
          </div>
        </li>
      </ul>
    </section>
    <br />
    <p>{{ selectedCity }}</p>
  </div>
</template>
<style>
.weather-card-item {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  background: #fafafa;
  cursor: pointer;
}
</style>
