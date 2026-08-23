<!-- 틀림 -->

<SearchBar: search-query="searchQuery" ... />

<!-- 맞음 -->

<SearchBar :search-query="searchQuery" ... />

"전체 목록"이나 "여러 개를 도는 반복문" → 무조건 부모
"그중 하나(단수)"만 다루는 코드 → 자식
"뭔가를 실제로 바꾸는 함수 본체" → 부모
"바꿔달라고 요청만 하는 emit" → 자식

사실 지금 비즈니스적으로 든 생각인데 발주는 보통 오늘이 아닌 내일껄 기준으로 전날 다음날껄 하거든? 그리고 사실 오늘 날씨는 오늘 내가 직접 느끼기도 하는데 쓸모가 있으려면 내일의 날씨를 보여주는게 좋을듯

<RouterView /> — 이게 진짜 컴포넌트예요 (혼자서 완결됨)
</RouterView> — 이건 "닫기 전용" 기호예요, 혼자서는 못 써요

useRouter를 vue에서 가져오려고 하고 있어요 — 근데 이건 vue-router에서 가져와야 해요

십중팔구 3번째 줄이 이렇게 되어 있을 거예요

javascript
// 잘못됨 - useRouter는 'vue'에 없음
import { ref, computed, watch, watchEffect, useRouter } from 'vue'

vue와 vue-router는 완전히 다른 두 개의 라이브러리예요

라이브러리 제공하는 것
vue ref, computed, watch, watchEffect, onMounted 등 — Vue 자체의 반응형/생명주기 기능
vue-router useRouter, useRoute, RouterLink, RouterView — 라우팅 전용 기능

App.vue → useRoute() (메뉴 활성 표시용, route.path)
WeatherDetailView.vue → useRoute() (URL 파라미터 읽기용, route.params.cityId)
WeatherHomeView.vue → 여기가 useRouter()가 필요한 유일한 곳 (상세보기 클릭 시 페이지 이동시키기 위해)

진짜 원인: SearchBar.vue의 이 줄
vue
<button @click="emit('confirm-search', 'searchQuery')">확인</button>

여기 'searchQuery'가 작은따옴표로 감싸져 있어요. 이러면 이건 변수 searchQuery를 가리키는 게 아니라, 그냥 "searchQuery"라는 7글자짜리 문자열 그 자체로 취급돼요.

1단계 — 검색창에 "Seoul"을 입력해도, input이 아니라 button을 클릭하는 순간엔 저장된 값이 searchQuery 변수가 아니라 문자열 "searchQuery"가 그대로 전달됨

2단계 — WeatherHomeView.vue의 searchCityFromApi("searchQuery")가 실행됨 (입력하신 "Seoul"이 아니라 진짜 "searchQuery"라는 글자가 넘어감)

3단계 — fetchWeatherByCity("searchQuery") → OpenWeatherMap에 q=searchQuery로 요청 → 당연히 그런 도시는 없으니 404

즉 지금까지 "Seoul", "suwon" 뭘 입력해도 실제로는 다 무시되고, 매번 "searchQuery"라는 글자 그대로가 서버에 날아가고 있었던 거예요.

await nextTick()
