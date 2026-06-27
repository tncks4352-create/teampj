/**
 * UI 모듈 인터페이스 설계
 * 
 * 모든 UI 모듈은 이 구조를 따릅니다:
 * - init() : 초기화
 * - show() : 화면 표시 및 데이터 로드
 * - hide() : 화면 숨김 및 정리
 * - update(dt) : 매 프레임 업데이트 (필요시)
 * - destroy() : 메모리 정리
 */

// ===================================================
// 1. 메인 로비 UI (lobby-ui.js)
// ===================================================

class LobbyUI {
  /**
   * 메인 로비 초기화
   * @param {HTMLElement} container
   */
  init(container) {
    // 하위 요소 캐싱
    // this.godCardElement = container.querySelector('.main-god-card');
    // this.startBattleBtn = container.querySelector('#startBattleBtn');
    // ...
    
    // 이벤트 리스너 등록
    // EventSystem.on('currency:changed', this.onCurrencyChanged);
    // this.startBattleBtn.addEventListener('click', this.onStartBattle);
  }

  /**
   * 로비 화면 표시 (매번 진입 시 호출)
   * @param {Object} data - ScreenManager에서 전달
   */
  async show(data = {}) {
    // 신 정보 업데이트 (gameState.gods.selectedMainGodId)
    // 재화 표시 업데이트 (gameState.currency)
    // 신력 표시 업데이트 (gameState.godPower)
  }

  /**
   * 로비 화면 숨김
   */
  async hide() {
    // 상태 저장 (필요시)
    // 애니메이션 정지
  }

  /**
   * 매 프레임 업데이트 (신력 바 동적 표시)
   * @param {number} dt - 경과시간(초)
   */
  update(dt) {
    // 신력 바 업데이트
    // 신 애니메이션 업데이트
  }

  // 이벤트 핸들러들
  // onCurrencyChanged(data) { ... }
  // onStartBattle() { ... }
  // onGachaClick() { ... }
  // onGrowthClick() { ... }
  // 등등
}

// ===================================================
// 2. 신 모집 UI (gacha-ui.js)
// ===================================================

class GachaUI {
  init(container) {
    // this.pull1Btn = container.querySelector('#pull1Btn');
    // this.pull10Btn = container.querySelector('#pull10Btn');
    // this.resultDisplay = container.querySelector('.gacha-result');
  }

  /**
   * 가챠 화면 표시
   * @param {Object} data - { rateupGod, odds }
   */
  async show(data = {}) {
    // 픽업 신 정보 표시
    // 확률 표시
    // 보유 다이아 표시
  }

  async hide() {}

  /**
   * 1회 뽑기
   */
  onPull1() {
    // GachaSystem.executePull()
    // 결과 표시
    // EventSystem.emit('gacha:pull-animation-start')
  }

  /**
   * 10회 뽑기
   */
  onPull10() {
    // GachaSystem.execute10Pulls()
    // 결과 테이블 표시
    // EventSystem.emit('gacha:pull-animation-start')
  }

  /**
   * 확률 보기 버튼
   */
  onShowOdds() {
    // 가챠 확률 모달 표시
  }

  /**
   * 뽑기 결과 연출
   * @param {Object} result
   */
  async displayGachaResult(result) {
    // 뽑기 카드 연출
    // 신 획득/조각 획득 표시
  }
}

// ===================================================
// 3. 성장 UI (growth-ui.js)
// ===================================================

class GrowthUI {
  init(container) {
    // 탭: 신성장 / 병사성장 / 덱편성
    // this.tabs = {
    //   god: container.querySelector('#growthTab-god'),
    //   soldier: container.querySelector('#growthTab-soldier'),
    //   formation: container.querySelector('#growthTab-formation')
    // };
  }

  /**
   * 성장 화면 표시
   * @param {Object} data - { activeTab }
   */
  async show(data = {}) {
    // 지정된 탭 활성화
  }

  async hide() {}

  // ===== 신 성장 서브탭 =====
  /**
   * 신 성장 탭 표시
   */
  showGodGrowth() {
    // 보유 신 목록 표시
    // 각 신별: 레벨, 별급, 진화 게이지
    // 선택 시 상세 정보 표시
  }

  /**
   * 신 상세 정보 표시
   * @param {string} godId
   */
  displayGodDetails(godId) {
    // 현재 스탯
    // 레벨업 비용
    // 진화 필요 정수
    // [레벨업] [진화] 버튼
  }

  /**
   * 신 레벨업 처리
   * @param {string} godId
   */
  levelupGod(godId) {
    // 비용 확인
    // CurrencySystem.spendCurrency('gold', cost)
    // god.level++
    // EventSystem.emit('god:levelup', { godId, newLevel })
  }

  /**
   * 신 진화 처리
   * @param {string} godId
   */
  evolveGod(godId) {
    // 정수 확인
    // CurrencySystem.spendEssence(essenceType, amount)
    // god.rarity++
    // EventSystem.emit('god:evolved', { godId, newRarity })
  }

  // ===== 병사 성장 서브탭 =====
  /**
   * 병사 성장 탭 표시
   */
  showSoldierGrowth() {
    // 보유 병사 목록
    // 각 병사별: 소유수, 레벨, 조각
    // 강화 선택 시 비용 표시
  }

  // ===== 덱 편성 서브탭 =====
  /**
   * 덱 편성 탭 표시
   */
  showFormation() {
    // 현재 선택 신
    // 보유 병사 체크박스
    // 예상 전투력 표시
  }
}

// ===================================================
// 4. 상점 UI (shop-ui.js)
// ===================================================

class ShopUI {
  init(container) {
    // this.productList = container.querySelector('.shop-products');
    // this.tabs = { starter, growth, monthly, pass, diamonds };
  }

  /**
   * 상점 화면 표시
   */
  async show(data = {}) {
    // 상품 목록 로드
    // 각 상품: 이름, 설명, 가격, [구매] 버튼
  }

  async hide() {}

  /**
   * 상품 구매 처리
   * @param {string} productId
   */
  onPurchase(productId) {
    // 결제 시뮬레이션 (향후 결제 모듈 연동)
    // CurrencySystem.addCurrency()
    // 구매 완료 메시지
  }
}

// ===================================================
// 5. 미션 UI (mission-ui.js)
// ===================================================

class MissionUI {
  init(container) {
    // 탭: 일일 / 주간 / 업적
  }

  /**
   * 미션 화면 표시
   */
  async show(data = {}) {
    // 미션 목록 로드
    // 완료 상태 표시
    // 보상 표시
  }

  async hide() {}

  /**
   * 미션 보상 수령
   * @param {string} missionId
   */
  claimMissionReward(missionId) {
    // 보상 지급
    // EventSystem.emit('mission:reward-claimed', { missionId })
  }
}

// ===================================================
// 6. 덱 편성 화면 (formation-ui.js)
// (전투 직전 병사 선택 화면)
// ===================================================

class FormationUI {
  init(container) {}

  /**
   * 덱 편성 화면 표시
   */
  async show(data = {}) {
    // 현재 메인 신 표시
    // 보유 병사 체크박스 목록
    // 예상 전투력 계산 및 표시
  }

  async hide() {}

  /**
   * 병사 선택 토글
   * @param {string} soldierType
   */
  toggleSoldier(soldierType) {
    // gameState.soldiers.selectedForBattle에 추가/제거
    // 예상 전투력 업데이트
  }

  /**
   * 전투 시작 확인
   */
  onConfirm() {
    // gameState 저장
    // ScreenManager.goToScreen('battle')
  }

  /**
   * 뒤로 가기
   */
  onBack() {
    // ScreenManager.popScreen()
  }
}

// ===================================================
// 7. 전투 HUD (battle-ui.js)
// ===================================================

class BattleUI {
  init(container) {
    // 전투 중 표시되는 UI 요소들
    // this.godPowerBar = container.querySelector('.god-power-bar');
    // this.waveText = container.querySelector('#waveText');
    // 등등
  }

  /**
   * 전투 시작 시 초기화
   */
  async show(data = {}) {
    // 신력 바 초기화
    // 병사 소환 버튼 활성화
    // 웨이브 정보 표시
  }

  async hide() {}

  /**
   * 매 프레임 업데이트
   * @param {number} dt
   */
  update(dt) {
    // 신력 바 동적 업데이트
    // HUD 정보 갱신
  }

  /**
   * 신력 표시 업데이트
   */
  updateGodPowerDisplay() {
    // 현재/최대 신력
    // 게이지 비율 표시
    // 회복 시간 표시
  }

  /**
   * 병사 소환 (신력 사용)
   * @param {string} soldierType
   */
  summonSoldier(soldierType) {
    // GodPowerSystem.usePower(cost)
    // 기존 병사 소환 로직 호출
    // UI 피드백
  }
}

// ===================================================
// 8. 보상 화면 (reward-ui.js)
// ===================================================

class RewardUI {
  init(container) {}

  /**
   * 보상 화면 표시
   * @param {Object} data - { victory, rewards }
   */
  async show(data = {}) {
    // Victory/Defeat 표시
    // 획득 보상 표시 (골드, 정수, 조각)
    // [확인] 버튼
  }

  async hide() {}

  /**
   * 확인 클릭 (로비로 복귀)
   */
  onConfirm() {
    // 보상 저장 (gameState.lastReward)
    // ScreenManager.goToScreen('lobby')
  }

  /**
   * 보상 연출
   */
  async playRewardAnimation() {
    // 각 보상별 팝업 연출
    // 숫자 표시 애니메이션
  }
}

/**
 * ===================================================
 * UI 모듈 로드 순서
 * ===================================================
 * 
 * 1. core/screen-manager.js
 * 2. core/event-system.js
 * 3. systems/god-power-system.js
 * 4. ui/*.js (모든 UI 모듈)
 * 5. script.js (메인 루프)
 */
