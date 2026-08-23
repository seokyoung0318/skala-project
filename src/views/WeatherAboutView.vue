//# 서비스 소개용 정적 페이지
<script setup></script>

<template>
  <div class="about-wrapper">
    <h1>매출관리의 핵심은 발주와 재고 관리</h1>
    <p class="tagline">Weather Order — 날씨 기반 사전 발주 추천 서비스</p>

    <section class="about-section">
      <p>
        매출관리의 핵심은 사전 발주를 통해 재고를 확보하고, 재고 회전일을 고려해 재고를 효율적으로
        운영하는 데 있습니다. 이를 위해서는
        <strong>판매량을 사전에 예측</strong>하고, 그에 맞춰 발주로 재고를 확보하는 과정이 무엇보다
        중요합니다.
      </p>
      <p>
        판매량에 영향을 주는 변수는 다양하지만 대부분 통제하거나 예측하기 어렵습니다. 그중
        <strong
          >기상 조건은 매출에 직접적인 영향을 주면서도, 예보를 통해 사전 대비가 가능한 몇 안 되는
          변수</strong
        >입니다.
      </p>
      <p>
        Weather Order는 이 기상 변수를 발주 의사결정에 직접 반영해, 판매 시점의 날씨를 기준으로
        상품별 발주량을 추천합니다.
      </p>
    </section>

    <section class="about-section">
      <h2>이런 분들을 위해 만들었습니다</h2>
      <p>
        프랜차이즈 가맹점은 본사로부터 발주 노하우와 데이터를 지원받지만, 개인 영세 소상공인은
        오롯이 자신의 경험과 감에만 의존해 발주를 결정해야 합니다. Weather Order는 이런 정보 격차를
        줄이기 위한 서비스입니다.
      </p>
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
  max-width: 720px;
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
</style>
