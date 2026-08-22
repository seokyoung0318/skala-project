<script>
defineProps({
  weather: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail', 'update-sales'])
</script>

<template>
  <section class="weather-card" v-if="filteredWeatherList.length > 0">
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
          📢 오늘 추천 발주 : {{ cat.recommendOrder }}개 (일평균 판매수량 X{{ cat.multiplier }})
          <br />
        </div>
      </li>
    </ul>
  </section>
</template>
