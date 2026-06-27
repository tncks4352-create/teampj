/**
 * 신화창조 - 이벤트 시스템
 * 모듈 간 느슨한 결합을 위한 pub/sub 패턴
 * 
 * 사용 예:
 * - EventSystem.on('gacha:received', (godInfo) => {...})
 * - EventSystem.emit('gacha:received', { godId: 'zeus', rarity: 5 })
 */

class EventSystem {
  constructor() {
    this.events = {};
    this.eventLog = [];
    this.maxLogSize = 100;
  }

  /**
   * 이벤트 리스너 등록
   * @param {string} eventName - 이벤트명
   * @param {Function} callback - 콜백함수
   * @returns {Function} 리스너 제거 함수
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    
    this.events[eventName].push(callback);
    
    // 리스너 제거 함수 반환
    return () => this.off(eventName, callback);
  }

  /**
   * 한 번만 실행되는 리스너
   * @param {string} eventName
   * @param {Function} callback
   */
  once(eventName, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }

  /**
   * 리스너 제거
   * @param {string} eventName
   * @param {Function} callback
   */
  off(eventName, callback) {
    if (!this.events[eventName]) return;
    
    this.events[eventName] = this.events[eventName].filter(
      listener => listener !== callback
    );
  }

  /**
   * 이벤트 발생
   * @param {string} eventName
   * @param {*} data - 전달할 데이터
   */
  emit(eventName, data = null) {
    // 로그 기록
    this._logEvent(eventName, data);
    
    if (!this.events[eventName]) {
      return;
    }
    
    this.events[eventName].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[EventSystem] Error in ${eventName}:`, error);
      }
    });
  }

  /**
   * 비동기 이벤트 (모든 리스너의 Promise 대기)
   * @param {string} eventName
   * @param {*} data
   */
  async emitAsync(eventName, data = null) {
    this._logEvent(eventName, data);
    
    if (!this.events[eventName]) {
      return;
    }
    
    const promises = this.events[eventName].map(callback => {
      try {
        return Promise.resolve(callback(data));
      } catch (error) {
        console.error(`[EventSystem] Error in ${eventName}:`, error);
        return Promise.reject(error);
      }
    });
    
    await Promise.all(promises);
  }

  /**
   * 이벤트 리스너 수 조회
   * @param {string} eventName
   */
  listenerCount(eventName) {
    return this.events[eventName]?.length || 0;
  }

  /**
   * 모든 리스너 제거
   * @param {string} eventName - 생략 시 모든 이벤트
   */
  removeAllListeners(eventName) {
    if (eventName) {
      delete this.events[eventName];
    } else {
      this.events = {};
    }
  }

  /**
   * 등록된 이벤트 목록 조회
   */
  getRegisteredEvents() {
    return Object.keys(this.events);
  }

  /**
   * 이벤트 로그 조회
   */
  getEventLog() {
    return [...this.eventLog];
  }

  /**
   * 이벤트 로그 초기화
   */
  clearEventLog() {
    this.eventLog = [];
  }

  // ===== Private Methods =====

  _logEvent(eventName, data) {
    this.eventLog.push({
      timestamp: Date.now(),
      event: eventName,
      data
    });

    // 로그 크기 제한
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }
  }
}

// 글로벌 인스턴스
const EventSystem = new EventSystem();

/**
 * 미리 정의된 이벤트 목록 (문서화용)
 * 
 * 화면 관련:
 * - screen:changed { from, to, data }
 * 
 * 가챠 관련:
 * - gacha:pull { type, rarity, godId, godName, isDuplicate }
 * - gacha:received { godInfo }
 * - gacha:result-shown
 * 
 * 성장 관련:
 * - god:levelup { godId, newLevel, oldLevel }
 * - god:evolved { godId, newRarity, oldRarity }
 * - soldier:levelup { soldierType, newLevel }
 * 
 * 전투 관련:
 * - battle:start { stage, deck }
 * - battle:end { victory, rewards }
 * - godpower:restored { amount }
 * - godpower:used { amount, reason }
 * 
 * 재화 관련:
 * - currency:changed { type, amount, source }
 * - essence:received { type, amount }
 * - soldier-fragment:received { type, amount }
 */
