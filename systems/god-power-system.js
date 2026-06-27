/**
 * 신화창조 - 신력 시스템
 * 
 * 신력은 게임 내 에너지 재화입니다.
 * - 시간이 지나며 자동 회복 (초당 1씩)
 * - 병사 소환에 사용
 * - 신 스킬 사용에 비용 (향후 확장)
 * 
 * 회복 속도는 조절 가능 (예: 프리미엄 패스로 2배 회복)
 */

class GodPowerSystem {
  constructor() {
    this.gameState = null;
    this.lastUpdateTime = Date.now();
    this.regenerationSpeed = 1; // 초당 회복량
    this.isRegenerating = false;
  }

  /**
   * gameState 참조 설정
   * @param {Object} state
   */
  static setGameState(state) {
    GodPowerSystem.instance.gameState = state;
  }

  /**
   * 신력 초기화
   * @param {number} maxPower - 최대 신력 (기본 100)
   * @returns {Object} { current, max, lastRegenTime }
   */
  static createInitialGodPower(maxPower = 100) {
    return {
      current: maxPower,
      max: maxPower,
      lastRegenTime: Date.now(),
      regenerationPerSecond: 1, // 초당 회복량
      lastUpdateTime: Date.now()
    };
  }

  /**
   * 신력 사용
   * @param {number} amount - 사용할 신력
   * @param {string} reason - 사용 이유 (soldier_summon, skill_use 등)
   * @returns {boolean} 성공 여부
   */
  static usePower(amount, reason = 'unknown') {
    if (!GodPowerSystem.instance.gameState) {
      console.warn('[GodPowerSystem] gameState not set');
      return false;
    }

    const state = GodPowerSystem.instance.gameState;
    if (!state.godPower) {
      console.error('[GodPowerSystem] godPower not initialized in gameState');
      return false;
    }

    if (state.godPower.current < amount) {
      console.warn('[GodPowerSystem] Not enough god power:', {
        required: amount,
        current: state.godPower.current
      });
      return false;
    }

    state.godPower.current -= amount;

    // 이벤트 발생
    EventSystem.emit('godpower:used', {
      amount,
      reason,
      remaining: state.godPower.current
    });

    return true;
  }

  /**
   * 신력 회복
   * @param {number} amount - 회복할 신력
   * @param {string} reason - 회복 이유 (manual_restore, skill_effect 등)
   */
  static restorePower(amount, reason = 'unknown') {
    if (!GodPowerSystem.instance.gameState) {
      console.warn('[GodPowerSystem] gameState not set');
      return;
    }

    const state = GodPowerSystem.instance.gameState;
    if (!state.godPower) {
      console.error('[GodPowerSystem] godPower not initialized in gameState');
      return;
    }

    const oldValue = state.godPower.current;
    state.godPower.current = Math.min(
      state.godPower.current + amount,
      state.godPower.max
    );

    const actualRestore = state.godPower.current - oldValue;

    // 이벤트 발생
    EventSystem.emit('godpower:restored', {
      amount: actualRestore,
      reason,
      current: state.godPower.current
    });
  }

  /**
   * 신력 조회
   * @returns {Object} { current, max, percentage }
   */
  static getPowerStatus() {
    if (!GodPowerSystem.instance.gameState?.godPower) {
      return { current: 0, max: 0, percentage: 0 };
    }

    const power = GodPowerSystem.instance.gameState.godPower;
    return {
      current: power.current,
      max: power.max,
      percentage: (power.current / power.max) * 100
    };
  }

  /**
   * 자동 회복 업데이트 (매 프레임 호출)
   * @param {number} deltaTime - 경과 시간 (초)
   */
  static update(deltaTime) {
    if (!GodPowerSystem.instance.gameState?.godPower) {
      return;
    }

    const state = GodPowerSystem.instance.gameState;
    const power = state.godPower;

    // 최대치에 도달했으면 회복 불필요
    if (power.current >= power.max) {
      return;
    }

    // 자동 회복 적용
    const recoveryAmount = deltaTime * (power.regenerationPerSecond || 1);
    const newValue = Math.min(power.current + recoveryAmount, power.max);

    // 정수로 올림
    if (Math.floor(newValue) !== Math.floor(power.current)) {
      power.current = newValue;
      
      // 1 단위 회복 시 이벤트
      if (Math.floor(newValue) - Math.floor(power.current - recoveryAmount) >= 1) {
        EventSystem.emit('godpower:auto-restored', {
          current: Math.floor(newValue),
          max: power.max
        });
      }
    } else {
      power.current = newValue;
    }
  }

  /**
   * 회복 속도 설정 (프리미엄 패스 등)
   * @param {number} multiplier - 배수 (1 = 정상, 2 = 2배)
   */
  static setRegenerationMultiplier(multiplier) {
    if (!GodPowerSystem.instance.gameState?.godPower) {
      return;
    }
    
    const baseRegen = 1; // 기본 회복속도
    GodPowerSystem.instance.gameState.godPower.regenerationPerSecond = 
      baseRegen * multiplier;
  }

  /**
   * 최대 신력 증가 (레벨업/장비 등으로 확장 가능)
   * @param {number} addAmount
   */
  static increaseMaxPower(addAmount) {
    if (!GodPowerSystem.instance.gameState?.godPower) {
      return;
    }

    const power = GodPowerSystem.instance.gameState.godPower;
    power.max += addAmount;
    
    // 현재값도 비례해서 증가
    power.current += addAmount;
    
    EventSystem.emit('godpower:max-increased', {
      newMax: power.max,
      addAmount
    });
  }

  /**
   * 즉시 회복 (아이템 사용)
   * @param {number} percentage - 최대신력의 몇 % (0-100)
   */
  static instantRestore(percentage) {
    if (!GodPowerSystem.instance.gameState?.godPower) {
      return;
    }

    const power = GodPowerSystem.instance.gameState.godPower;
    const restoreAmount = (power.max * percentage) / 100;
    
    GodPowerSystem.restorePower(restoreAmount, 'item_instant_restore');
  }
}

// 싱글톤 인스턴스
GodPowerSystem.instance = new class {
  constructor() {
    this.gameState = null;
  }
}();
