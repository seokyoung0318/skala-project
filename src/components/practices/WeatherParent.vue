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
  <div class=""
</template>
