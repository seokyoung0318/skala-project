<script setup>
import { ref, computed } from 'vue'

// 4일차 API 연동을 대비한 가상의 백엔드 데이터 배열 (v-for 및 :key 실습용)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

// 검색어 및 알림창 제어용 데이터 (v-model 대용 한글 처리 및 이벤트 실습용)
const searchQuery = ref('') //반응형 변수
const selectedCityInfo = ref('카드를 입력하거나 검색해보세요.')

// 알림 대행 함수 (window 객체 격리 우회)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const selectedCity = ref('확인하고 싶은 지역의 카드를 선택하세요')

const averageSales = ref({
  city_01: 0,
  city_02: 0,
  city_03: 0,
})

const orderRecommendations = computed(() => {
  return weatherList.value.map((city) => {
    let multiplier = 1
    if (city.temp >= 25) multiplier = 2
    else if (city.temp >= 20) multiplier = 1.5
    else multiplier = 1
    const baseSales = averageSales.value[city.id] || 0
    const recommendOrder = Math.round(baseSales * multiplier)
    return { ...city, baseSales, multiplier, recommendOrder }
  })
})


function selectedCard(cityName) {
  selectedCity.value = `${cityName}이 선택되었습니다.`
}

function showMessage() {
  message.value = inputValue.value
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>도시 검색</h3>
      <input
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 입력 확인"
      />
      <button @click="showMessage">확인</button>
      <p>검색 중인 도시: {{ searchQuery }}</p>
    </section>

    <section class="weather-card">
      <h3>지역별 날씨 현황</h3>
      <ul>
        <li v-for="weather in weatherList" :key="weather.id" @click="selectedCard(weather.name)">
          [{{ weather.name + '(' + weather.status + ')' + '현재 기온' + weather.temp }}]
          <span v-if="weather.temp >= 25"> 🌞 높은 기온 야외 활동 주의(25도 이상)</span>
          <span v-else> 🌬️ 신선 함(25도 미만)</span>
          <button @click.stop="showDetail(weather.name, weather.status)">상세보기</button>
        </li>
      </ul>

      <li v-for="city in orderRecommendations" :key="city.id">
        {{ city.name }}({{ city.temp }}도)-일평균 판매수량:
        <input
          type="number"
          :value="averageSales[city.id]"
          @input="(e) => (averageSales[city.id] = Number(e.target.value))"
        />
        📢 오늘 추천 발주량 : {{ city.recommendOrder }}개 (일평균 판매수량 X{{ city.multiplier }})
      </li>
    </section>
    <p>{{ selectedCity }}</p>
  </div>
</template>
