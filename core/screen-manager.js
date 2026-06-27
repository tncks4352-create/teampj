/**
 * 신화창조 - 화면 관리 시스템
 * 화면 전환 로직, 상태 관리, 애니메이션 처리
 * 
 * 화면 구조:
 * - lobby: 메인 로비
 * - gacha: 신 모집
 * - growth: 성장 (신/병사/덱)
 * - shop: 상점
 * - mission: 미션
 * - formation: 덱 편성 (전투 전)
 * - battle: 전투 화면
 * - reward: 보상 화면
 */

class ScreenManager {
  constructor() {
    this.currentScreen = 'lobby';
    this.previousScreen = null;
    this.screenStack = [];
    this.isTransitioning = false;
    this.transitionDuration = 300; // ms
    
    // 각 화면 DOM 요소 (초기화 시 캐싱)
    this.screens = {
      lobby: null,
      gacha: null,
      growth: null,
      shop: null,
      mission: null,
      formation: null,
      battle: null,
      reward: null
    };

    // 화면별 초기화 콜백 (EventSystem과 연동)
    this.screenInitializers = {};
    
    // 화면별 정리 콜백
    this.screenCleanups = {};
  }

  /**
   * ScreenManager 초기화
   * @param {Object} screenElements - { lobby: element, gacha: element, ... }
   */
  init(screenElements) {
    Object.assign(this.screens, screenElements);
    console.log('[ScreenManager] Initialized with screens:', Object.keys(this.screens));
  }

  /**
   * 화면 전환 (이전 화면 유지)
   * @param {string} screenName - 이동할 화면명
   * @param {Object} data - 화면에 전달할 데이터
   */
  async goToScreen(screenName, data = {}) {
    if (this.isTransitioning) return;
    if (!this.screens[screenName]) {
      console.error(`[ScreenManager] Unknown screen: ${screenName}`);
      return;
    }

    this.isTransitioning = true;
    
    // 이전 화면 저장
    this.previousScreen = this.currentScreen;
    
    // 현재 화면 정리
    await this._cleanupScreen(this.currentScreen);
    
    // 화면 전환 애니메이션
    await this._transitionOut(this.currentScreen);
    
    // 새 화면 초기화 및 표시
    this.currentScreen = screenName;
    this._showScreen(screenName);
    await this._transitionIn(screenName);
    
    // 새 화면 초기화 콜백 호출
    await this._initializeScreen(screenName, data);
    
    this.isTransitioning = false;
    
    // 이벤트 발생: 화면 전환 완료
    EventSystem.emit('screen:changed', {
      from: this.previousScreen,
      to: screenName,
      data
    });
  }

  /**
   * 화면 스택에 푸시 (이전 화면으로 돌아가기 가능)
   * @param {string} screenName
   * @param {Object} data
   */
  async pushScreen(screenName, data = {}) {
    this.screenStack.push(this.currentScreen);
    await this.goToScreen(screenName, data);
  }

  /**
   * 스택에서 이전 화면으로 돌아가기
   */
  async popScreen() {
    if (this.screenStack.length === 0) {
      console.warn('[ScreenManager] Cannot pop: stack is empty');
      return;
    }
    const previousScreenName = this.screenStack.pop();
    await this.goToScreen(previousScreenName);
  }

  /**
   * 화면 등록: 초기화 콜백
   * @param {string} screenName
   * @param {Function} callback - async (data) => { ... }
   */
  registerScreenInitializer(screenName, callback) {
    this.screenInitializers[screenName] = callback;
  }

  /**
   * 화면 등록: 정리 콜백
   * @param {string} screenName
   * @param {Function} callback - async () => { ... }
   */
  registerScreenCleanup(screenName, callback) {
    this.screenCleanups[screenName] = callback;
  }

  // ===== Private Methods =====

  async _initializeScreen(screenName, data) {
    if (this.screenInitializers[screenName]) {
      await this.screenInitializers[screenName](data);
    }
  }

  async _cleanupScreen(screenName) {
    if (this.screenCleanups[screenName]) {
      await this.screenCleanups[screenName]();
    }
  }

  _showScreen(screenName) {
    // 모든 화면 숨기기
    Object.values(this.screens).forEach(screen => {
      if (screen) screen.classList.add('is-hidden');
    });
    
    // 목표 화면 표시
    if (this.screens[screenName]) {
      this.screens[screenName].classList.remove('is-hidden');
    }
  }

  async _transitionOut(screenName) {
    const screen = this.screens[screenName];
    if (!screen) return;
    
    return new Promise(resolve => {
      screen.style.opacity = '1';
      screen.style.transition = `opacity ${this.transitionDuration}ms ease-out`;
      screen.style.opacity = '0';
      
      setTimeout(() => {
        screen.style.transition = '';
        resolve();
      }, this.transitionDuration);
    });
  }

  async _transitionIn(screenName) {
    const screen = this.screens[screenName];
    if (!screen) return;
    
    return new Promise(resolve => {
      screen.style.opacity = '0';
      screen.style.transition = `opacity ${this.transitionDuration}ms ease-in`;
      screen.style.opacity = '1';
      
      setTimeout(() => {
        screen.style.transition = '';
        resolve();
      }, this.transitionDuration);
    });
  }

  /**
   * 현재 화면명 반환
   */
  getCurrentScreen() {
    return this.currentScreen;
  }

  /**
   * 화면 스택 조회
   */
  getScreenStack() {
    return [...this.screenStack];
  }
}

// 글로벌 인스턴스
const ScreenManager_instance = new ScreenManager();
