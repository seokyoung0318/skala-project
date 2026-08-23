<script setup>
import weatherLogo from '@/assets/WeatherOrder_Logo.png'
</script>

<template>
  <div class="devlog-page">
    <section class="devlog-card intro-card">
      <img :src="weatherLogo" alt="Weather Order" class="devlog-logo" />
      <h2 class="devlog-title">개발 회고</h2>
      <p class="devlog-desc">
        Weather Order를 만들면서 겪었던 문제와 그 과정에서 배운 것들을 기록했습니다.
      </p>
    </section>

    <section class="devlog-card">
      <h3 class="section-title">발주 기준 시점에 대한 재판단</h3>
      <p class="section-text">
        처음엔 "오늘의 날씨"를 보여주면 될 거라 생각했지만, 개발 도중 실제 발주 업무 경험을
        떠올려보니 발주는 보통 전날 다음날 판매분을 미리 준비하는 구조라는 걸 다시 인식했습니다.
        오늘 날씨는 사용자가 직접 체감할 수 있어 서비스로서의 정보 가치가 낮지만, 내일 날씨는 예측이
        어려운 만큼 서비스가 제공할 실질적인 가치가 있다고 판단해, API 데이터를 "지금 시각과 가장
        가까운 예보"에서 "내일 날짜 기준 예보"로 로직 전체를 바꿨습니다.
      </p>
    </section>

    <section class="devlog-card">
      <h3 class="section-title">트러블슈팅</h3>

      <div class="trouble-item">
        <p class="trouble-title">1. .env 파일 위치 문제로 API 키 인식 실패</p>
        <p class="trouble-text">
          <strong>원인</strong> — 에디터에서 파일을 생성할 때 프로젝트 루트가 아닌 src 폴더 안에
          .env가 만들어져, Vite가 환경변수를 읽지 못하고 API 요청에 키가 빠진 채로 나가고 있었음
        </p>
        <p class="trouble-text">
          <strong>해결</strong> — .env를 프로젝트 루트로 이동, 서버 재시작 후 정상화
        </p>
      </div>

      <div class="trouble-item">
        <p class="trouble-title">2. 컴포넌트 간 emit 이벤트 이름 불일치</p>
        <p class="trouble-text">
          <strong>원인</strong> — 자식이 보내는 emit('selected-card', ...)와 부모가 받는
          @select-card="..."의 이름이 한 글자 달라 통신이 되지 않았음
        </p>
        <p class="trouble-text"><strong>해결</strong> — 이벤트 이름을 정확히 일치시켜 해결</p>
      </div>

      <div class="trouble-item">
        <p class="trouble-title">3. UTC와 로컬 시간대 차이로 인한 날짜 계산 오류</p>
        <p class="trouble-text">
          <strong>원인</strong> — new Date()는 로컬 시간대 기준이지만 .toISOString()으로 변환하면
          UTC 기준 문자열이 되어, 시간대 경계 부근에서 "내일" 판단이 어긋날 수 있었음
        </p>
        <p class="trouble-text">
          <strong>해결</strong> — 원하는 데이터를 못 찾으면 가장 가까운 예보로 대체하는 fallback
          로직 추가
        </p>
      </div>

      <div class="trouble-item">
        <p class="trouble-title">4. 한글 도시명으로 API 검색이 안 되는 문제</p>
        <p class="trouble-text">
          <strong>원인</strong> — OpenWeatherMap API는 영문 도시명으로만 정확히 검색되어, 한글
          지명을 그대로 보내면 404가 발생
        </p>
        <p class="trouble-text">
          <strong>해결</strong> — 한글↔영문 매핑 객체(cityNameMap)를 직접 작성해 전국 주요 지역 약
          40여 곳 등록
        </p>
      </div>

      <div class="trouble-item">
        <p class="trouble-title">5. Chart.js 그래프가 에러 없이 안 뜨는 문제</p>
        <p class="trouble-text">
          <strong>원인</strong> — 데이터를 갱신한 직후 바로 그래프를 그리면, Vue가 화면(DOM)을 아직
          업데이트하지 않은 상태라 캔버스가 존재하지 않음
        </p>
        <p class="trouble-text">
          <strong>해결</strong> — await nextTick()으로 DOM 업데이트 완료를 기다린 뒤 렌더링하도록
          순서 조정
        </p>
      </div>

      <div class="trouble-item">
        <p class="trouble-title">6. 검색이 항상 실패하는 원인이 따옴표 하나였던 문제</p>
        <p class="trouble-text">
          <strong>원인</strong> — emit('confirm-search', 'searchQuery')에서 작은따옴표 때문에 변수가
          아닌 문자열 그 자체가 전달되고 있었음
        </p>
        <p class="trouble-text"><strong>해결</strong> — 따옴표를 제거해 변수를 참조하도록 수정</p>
      </div>
    </section>

    <section class="devlog-card">
      <h3 class="section-title">배운 점</h3>
      <ul class="lesson-list">
        <li>
          컴포넌트를 부모/자식으로 나눌 때, "전체 목록·반복문"은 부모가, "그중 하나만 다루는 표현"은
          자식이 담당한다는 원칙을 체득함
        </li>
        <li>
          "실제로 상태를 바꾸는 함수 본체"는 부모에 두고, 자식은 emit으로 "바꿔달라고 요청"만 한다는
          역할 분리가 명확해짐
        </li>
        <li>
          Chart.js는 이번에 처음 사용해봤고, 동작하는 그래프까지는 완성했지만 옵션 구조(scales,
          plugins 등)를 아직 완전히 체화하진 못함 — 다음엔 공식 문서로 원리를 더 다질 예정
        </li>
      </ul>
    </section>

    <RouterLink to="/" class="back-link">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.devlog-page {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.devlog-card {
  background: #ffffff;
  border: 1px solid var(--toss-border);
  border-radius: var(--toss-radius);
  padding: 28px;
}

.intro-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.devlog-logo {
  height: 36px;
  object-fit: contain;
  margin-bottom: 16px;
}

.devlog-title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 700;
  color: var(--toss-text);
  letter-spacing: -0.6px;
}

.devlog-desc {
  margin: 0;
  font-size: 15px;
  font-weight: 400;
  color: var(--toss-text-sub);
}

.section-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: var(--toss-text);
  letter-spacing: -0.4px;
}

.section-text {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.7;
  color: var(--toss-text-sub);
}

.trouble-item {
  padding: 20px;
  border-radius: var(--toss-radius-sm);
  background: var(--toss-bg);
}

.trouble-item + .trouble-item {
  margin-top: 12px;
}

.trouble-title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 700;
  color: var(--toss-text);
}

.trouble-text {
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--toss-text-mute);
}

.trouble-text strong {
  color: var(--toss-text-sub);
  font-weight: 600;
}

.lesson-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lesson-list li {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.7;
  color: var(--toss-text-sub);
}

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
  .devlog-card {
    padding: 20px;
    border-radius: var(--toss-radius-sm);
  }
  .devlog-title {
    font-size: 20px;
  }
}
</style>
