//# 서비스 소개용 정적 페이지
<script setup>
import storePhoto from '@/assets/Orders.png'
import weatherLogo from '@/assets/WeatherOrder_Logo.png'
</script>

<template>
  <div class="about-wrapper">
    <p class="tagline">Weather Order — 날씨 기반 사전 발주 추천 서비스</p>
    <h1>매출관리의 핵심은 발주와 재고 관리</h1>

    <section class="about-section">
      <p>
        매출관리의 핵심은 사전 발주를 통해 재고를 확보, 재고 회전일을 고려 효율적으로 운영하는 데
        있습니다.<br />이를 위해서는 <strong>판매량을 사전에 예측</strong>하고, 그에 맞춰 발주로
        재고를 확보하는 과정이 무엇보다 중요합니다.
      </p>
      <p>
        판매량에 영향을 주는 변수는 다양하지만 대부분 통제하거나 예측하기 어렵습니다.<br />그중
        <strong
          >기상 조건은 매출에 직접적인 영향을 주면서도, 예보를 통해 사전 대비가 가능한 몇 안 되는
          변수</strong
        >입니다.
      </p>
      <p>
        Weather Order는 이 기상 변수를 발주 의사결정에 직접 반영해,<br />판매 시점의 날씨를 기준으로
        상품별 발주량을 추천합니다.
      </p>

      <img :src="storePhoto" alt="현장 사진" class="about-photo" />
      <p>
        실제 대학 축제 기간처럼 유동인구가 급증하는 시점, 기상 조건에 따라 얼음컵·우산 같은 상품
        수요가 평소 대비 배로 증가함을 경험했습니다. 기상을 고려해 사전 재고를 확보한 덕분에 전년
        대비 103% 매출을 달성했습니다. 이 외에도 업무 간 사전 재고를 확보했던 점포와 준비가 부족해
        "없어서 못 파는" 기회손실이 발생한 점포의 매출 차이를 체감하며 사전 재고 확보의 중요성을
        느꼈습니다.
        <br /><br />이러한 경험을 바탕으로
        <strong>기상에 따른 발주 추천 시스템인 Weather Order</strong>를 만들게 되었습니다.
      </p>
    </section>

    <section class="about-section">
      <h2>이런 분들을 위해 만들었습니다</h2>
      <p>
        프랜차이즈 가맹점은 본사로부터 발주 노하우와 데이터를 지원받지만, 개인 영세 소상공인은
        오롯이 자신의 경험과 감에만 의존해 발주를 결정해야 합니다. <br />Weather Order는 이런 정보
        격차를 줄여 매출 증진에 실질적인 도움을 드리고자 만든 서비스입니다.
      </p>
    </section>

    <section class="about-section logo-section">
      <h2>로고</h2>
      <div class="logo-content">
        <img :src="weatherLogo" alt="Weather Order 로고" class="logo-img" />
        <p>
          날씨(배경)와 매출 그래프(전경)를 겹친 2단 구조로 "날씨가 매출을 결정한다"는 서비스의 핵심
          메시지를 로고 담았습니다.
        </p>
      </div>
    </section>

    <section class="about-section">
      <h2>주요 기능</h2>
      <ul class="feature-list">
        <li>📅 다음날 예보 기준 지역별 발주 추천</li>
        <li>📊 온도·강수 조건에 따른 카테고리별(음료, 얼음, 우산 등) 발주량 계산</li>
        <li>🔍 지역별 날씨 실시간 검색</li>
      </ul>
    </section>

    <RouterLink to="/" class="back-link">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.about-wrapper {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--toss-text);
  letter-spacing: -0.8px;
  line-height: 1.35;
}

.tagline {
  margin: 12px 0 0;
  font-size: 15px;
  font-weight: 400;
  color: var(--toss-text-mute);
}

.about-section {
  width: 100%;
  margin-top: 40px;
  padding: 28px;
  background: #ffffff;
  border: 1px solid var(--toss-border);
  border-radius: var(--toss-radius);
}

.about-section h2 {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
  color: var(--toss-text);
  letter-spacing: -0.4px;
}

.about-section p {
  margin: 0;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.75;
  color: var(--toss-text-sub);
  word-break: keep-all;
}

.about-section p + p {
  margin-top: 20px;
}

.about-section strong {
  font-weight: 700;
  color: var(--toss-blue);
}

.about-photo {
  display: block;
  width: 100%;
  max-width: 480px;
  margin: 24px auto 24px 0;
  border-radius: var(--toss-radius-sm);
  aspect-ratio: 3 / 2;
  object-fit: cover;
}

.feature-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-list li {
  padding: 16px 18px;
  border-radius: var(--toss-radius-sm);
  background: var(--toss-bg);
  font-size: 15px;
  font-weight: 500;
  color: var(--toss-text-sub);
  word-break: keep-all;
}

.back-link {
  margin-top: 32px;
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
  h1 {
    font-size: 22px;
  }
  .about-section {
    margin-top: 24px;
    padding: 20px;
    border-radius: var(--toss-radius-sm);
  }
}

.logo-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-img {
  height: 60px;
  object-fit: contain;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .logo-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
