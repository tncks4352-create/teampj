/**
 * 신화창조 - HTML 구조 재설계
 * 
 * 기존 HTML 문제점:
 * - 타이틀, 로비, 모집, 형성, 상점, 미션, 스테이지 화면 혼재
 * - 각 화면이 분리되어 있지만 구조가 일관성 없음
 * - 모바일 RPG 레이아웃으로 맞춰져 있지 않음
 * 
 * 새로운 구조:
 * - 메인 로비 중심
 * - 각 화면이 모달/팝업 스타일로 오버레이
 * - 또는 탭 기반 전환
 */

const HTML_STRUCTURE = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>신화창조 - Gods of Olympus</title>
  <link rel="stylesheet" href="style-rebrand.css" />
</head>
<body>
  <div id="gameContainer" class="game-container">
    
    <!-- ===== 메인 로비 화면 ===== -->
    <section id="lobbyScreen" class="screen screen-lobby">
      <!-- 상단: 재화 표시 -->
      <header class="lobby-header">
        <div class="currency-display">
          <div class="currency-item gold">
            <span class="icon">🪙</span>
            <span class="amount" id="goldDisplay">10000</span>
          </div>
          <div class="currency-item premium">
            <span class="icon">💎</span>
            <span class="amount" id="premiumDisplay">500</span>
          </div>
        </div>
        <div class="header-buttons">
          <!-- 추후: 우편함, 설정 등 -->
        </div>
      </header>

      <!-- 중앙: 메인 신 표시 -->
      <main class="lobby-main">
        <div class="god-card-container">
          <div class="god-card" id="mainGodCard">
            <!-- 신의 일러스트/스프라이트 -->
            <img id="godImage" src="" alt="God" class="god-image" />
            
            <!-- 신 정보 오버레이 -->
            <div class="god-info">
              <h2 id="godName" class="god-name">아테나</h2>
              <div class="god-level">
                <span class="label">Lv</span>
                <span id="godLevel" class="value">35</span>
              </div>
              
              <!-- 별급 표시 -->
              <div class="god-rarity">
                <div class="stars" id="godStars">
                  ⭐⭐⭐
                </div>
                <!-- 승급 게이지 -->
                <div class="evolution-gauge">
                  <div class="gauge-bar" id="evolutionBar">
                    <div class="gauge-fill" style="width: 40%;"></div>
                  </div>
                  <span class="gauge-text" id="evolutionText">2/5</span>
                </div>
              </div>
            </div>
            
            <!-- 신력 표시 (로비에서도 보이도록) -->
            <div class="god-power-mini">
              <div class="power-bar">
                <div class="power-fill" id="powerFill"></div>
              </div>
              <span id="powerText">100/100</span>
            </div>
          </div>
        </div>

        <!-- 전투 시작 버튼 -->
        <div class="battle-section">
          <button id="startBattleBtn" class="btn btn-primary btn-large">
            전투 시작
          </button>
        </div>
      </main>

      <!-- 하단: 메뉴 탭 -->
      <nav class="lobby-menu">
        <button class="menu-tab" data-tab="gacha">
          <span class="icon">🎰</span>
          <span class="label">신 모집</span>
        </button>
        <button class="menu-tab" data-tab="growth">
          <span class="icon">⬆️</span>
          <span class="label">성장</span>
        </button>
        <button class="menu-tab" data-tab="shop">
          <span class="icon">🏪</span>
          <span class="label">상점</span>
        </button>
        <button class="menu-tab" data-tab="mission">
          <span class="icon">📋</span>
          <span class="label">미션</span>
        </button>
      </nav>
    </section>

    <!-- ===== 신 모집 화면 ===== -->
    <section id="gachaScreen" class="screen screen-gacha is-hidden">
      <!-- 픽업 신 정보 -->
      <div class="gacha-header">
        <h2>신 모집</h2>
        <button class="btn-close" onclick="closeGacha()">×</button>
      </div>

      <div class="gacha-content">
        <!-- 픽업 신 표시 -->
        <div class="rateup-god">
          <img id="rateupGodImage" src="" alt="Rateup God" />
          <div class="rateup-info">
            <span class="label">현재 픽업</span>
            <h3 id="rateupGodName">아테나</h3>
            <span class="rarity">⭐⭐⭐⭐⭐</span>
          </div>
        </div>

        <!-- 뽑기 버튼 -->
        <div class="gacha-buttons">
          <button id="pull1Btn" class="btn btn-primary">
            1회 소환 (×2 다이아)
          </button>
          <button id="pull10Btn" class="btn btn-secondary">
            10회 소환 (×18 다이아)
            <span class="guarantee">★ 4이상 확정</span>
          </button>
        </div>

        <!-- 확률 보기 -->
        <button class="btn-odds" onclick="showGachaOdds()">
          확률 보기
        </button>

        <!-- 뽑기 결과 표시 영역 -->
        <div id="gachaResultContainer" class="gacha-result-container is-hidden">
          <!-- JS로 동적 생성 -->
        </div>
      </div>
    </section>

    <!-- ===== 성장 화면 ===== -->
    <section id="growthScreen" class="screen screen-growth is-hidden">
      <div class="growth-header">
        <h2>성장</h2>
        <button class="btn-close">×</button>
      </div>

      <!-- 성장 탭 -->
      <div class="growth-tabs">
        <button class="tab-btn active" data-tab="god">신 성장</button>
        <button class="tab-btn" data-tab="soldier">병사 성장</button>
        <button class="tab-btn" data-tab="formation">덱 편성</button>
      </div>

      <div class="growth-content">
        <!-- 신 성장 탭 -->
        <div class="tab-panel" id="growthTab-god">
          <div class="god-list">
            <!-- 보유 신 목록 (JS로 동적 생성) -->
          </div>
        </div>

        <!-- 병사 성장 탭 -->
        <div class="tab-panel is-hidden" id="growthTab-soldier">
          <div class="soldier-list">
            <!-- 보유 병사 목록 (JS로 동적 생성) -->
          </div>
        </div>

        <!-- 덱 편성 탭 -->
        <div class="tab-panel is-hidden" id="growthTab-formation">
          <!-- 병사 선택 체크박스 -->
          <div class="soldier-selection">
            <!-- JS로 동적 생성 -->
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 상점 화면 ===== -->
    <section id="shopScreen" class="screen screen-shop is-hidden">
      <div class="shop-header">
        <h2>상점</h2>
        <button class="btn-close">×</button>
      </div>

      <div class="shop-tabs">
        <button class="tab-btn active" data-tab="starter">스타터 패키지</button>
        <button class="tab-btn" data-tab="growth">성장 패키지</button>
        <button class="tab-btn" data-tab="monthly">월정액</button>
        <button class="tab-btn" data-tab="pass">시즌패스</button>
        <button class="tab-btn" data-tab="diamonds">다이아 구매</button>
      </div>

      <div class="shop-products" id="shopProductsContainer">
        <!-- 상품 목록 (JS로 동적 생성) -->
      </div>
    </section>

    <!-- ===== 미션 화면 ===== -->
    <section id="missionScreen" class="screen screen-mission is-hidden">
      <div class="mission-header">
        <h2>미션</h2>
        <button class="btn-close">×</button>
      </div>

      <div class="mission-tabs">
        <button class="tab-btn active" data-tab="daily">일일 미션</button>
        <button class="tab-btn" data-tab="weekly">주간 미션</button>
        <button class="tab-btn" data-tab="achievement">업적</button>
      </div>

      <div class="mission-list" id="missionListContainer">
        <!-- 미션 목록 (JS로 동적 생성) -->
      </div>
    </section>

    <!-- ===== 덱 편성 화면 (전투 전) ===== -->
    <section id="formationScreen" class="screen screen-formation is-hidden">
      <div class="formation-header">
        <h2>덱 편성</h2>
        <div class="selected-god">
          <img id="selectedGodImage" src="" alt="" />
          <span id="selectedGodName">아테나</span>
        </div>
      </div>

      <div class="formation-content">
        <!-- 병사 선택 -->
        <div class="soldier-selection">
          <label class="soldier-checkbox">
            <input type="checkbox" data-soldier="guard" />
            <span>☑ 검병</span>
          </label>
          <label class="soldier-checkbox">
            <input type="checkbox" data-soldier="archer" />
            <span>☑ 궁수</span>
          </label>
          <!-- 추후 더 많은 병사 추가 -->
        </div>

        <!-- 예상 전투력 -->
        <div class="estimated-power">
          <span>예상 전투력</span>
          <span id="estimatedPower" class="power-value">1250</span>
        </div>

        <!-- 확인/취소 버튼 -->
        <div class="formation-buttons">
          <button class="btn btn-primary" onclick="confirmFormation()">
            전투 시작
          </button>
          <button class="btn btn-secondary" onclick="cancelFormation()">
            취소
          </button>
        </div>
      </div>
    </section>

    <!-- ===== 전투 화면 (Canvas) ===== -->
    <section id="battleScreen" class="screen screen-battle is-hidden">
      <div class="battle-container">
        <!-- 전투 HUD -->
        <div class="battle-hud">
          <div class="hud-top">
            <div class="wave-info">
              <span>Wave</span>
              <strong id="waveText">1 / 3</strong>
            </div>
          </div>

          <!-- 신력 바 (중앙 하단) -->
          <div class="god-power-hud">
            <div class="power-bar-container">
              <div class="power-bar">
                <div class="power-fill" id="battlePowerFill"></div>
              </div>
              <span id="battlePowerText">100/100</span>
            </div>
          </div>

          <!-- 병사 소환 버튼 (기존 유지) -->
          <div class="battle-buttons">
            <button id="summonGuardBtn" class="btn btn-summon">
              검병 소환 (신력 10)
            </button>
            <button id="summonArcherBtn" class="btn btn-summon">
              궁수 소환 (신력 15)
            </button>
          </div>
        </div>

        <!-- Canvas (기존) -->
        <canvas id="gameCanvas" width="960" height="540"></canvas>
      </div>

      <!-- 전투 컨트롤 버튼 -->
      <div class="battle-controls">
        <button id="startBtn" class="btn btn-primary">게임 시작</button>
        <button id="restartBtn" class="btn btn-secondary">재시작</button>
      </div>
    </section>

    <!-- ===== 보상 화면 ===== -->
    <section id="rewardScreen" class="screen screen-reward is-hidden">
      <div class="reward-container">
        <!-- 결과 표시 -->
        <div class="reward-result" id="rewardResult">
          <!-- Victory / Defeat -->
        </div>

        <!-- 보상 목록 -->
        <div class="reward-list" id="rewardList">
          <!-- 골드, 정수, 조각 (JS로 동적 생성) -->
        </div>

        <!-- 확인 버튼 -->
        <button class="btn btn-primary btn-large" onclick="confirmReward()">
          확인
        </button>
      </div>
    </section>

  </div>

  <!-- ===== 스크립트 로드 (로드 순서 중요) ===== -->
  <script defer src="data/god-database.js"></script>
  <script defer src="data/constants.js"></script>
  <script defer src="systems/currency-system.js"></script>
  <script defer src="systems/gacha-system.js"></script>
  <script defer src="systems/god-power-system.js"></script>
  <script defer src="core/event-system.js"></script>
  <script defer src="core/screen-manager.js"></script>
  <script defer src="ui/UI-INTERFACE-DESIGN.md"></script> <!-- 실제로는 .js 파일 -->
  <script defer src="script.js"></script>
</body>
</html>
`;

// ===== CSS 구조 계획 (style-rebrand.css) =====

const CSS_STRUCTURE_NOTES = `
1. 레이아웃
   - .game-container: 전체 컨테이너 (모바일 RPG 비율, 16:9 또는 9:16)
   - .screen: 각 화면 (position: absolute, full-screen)
   - .screen.is-hidden: 숨김 상태

2. 로비 레이아웃
   - .lobby-header: 상단 (재화 표시)
   - .lobby-main: 중앙 (신 카드 + 전투 버튼)
   - .lobby-menu: 하단 (탭 메뉴)

3. 신 카드
   - .god-card: 신 이미지 + 정보 오버레이
   - .god-info: 이름, 레벨, 별급, 진화 게이지

4. 화면 전환 애니메이션
   - opacity 페이드 인/아웃
   - transform 슬라이드 (선택사항)

5. 모바일 반응형
   - 전체 화면 크기 (960x540 또는 조정)
   - 터치 친화적 버튼 사이즈

6. 색상 테마
   - 세븐나이츠 리버스 스타일: 어두운 배경 + 네온 악센트
   - AFK Journey 스타일: 밝은 배경 + 부드러운 색상
   → 프로젝트 방향에 맞춰 선택
`;

module.exports = { HTML_STRUCTURE, CSS_STRUCTURE_NOTES };
