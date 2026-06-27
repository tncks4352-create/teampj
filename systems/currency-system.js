/**
 * 올림포스 신화 게임 - 통화(Currency) 시스템
 * 골드, 프리미엄 화폐, 배틀패스 포인트 관리
 */

class CurrencySystem {
  /**
   * 통화 초기 상태 생성
   */
  static createInitialCurrency() {
    return {
      gold: 5000,              // 기본 게임 화폐
      premium: 150,            // 결제 화폐 (다이아)
      battlePass: 0,           // 배틀패스 포인트
      lastDailyRewardTime: 0,  // 마지막 일일 보상 시간
      history: [],             // 거래 기록 (분석용)
    };
  }

  /**
   * 통화 보유 확인
   * @param {string} type - 통화 타입 ('gold' | 'premium' | 'battlePass')
   * @param {number} amount - 필요한 양
   * @returns {boolean}
   */
  static hasCurrency(type, amount) {
    if (!gameState.currency || gameState.currency[type] === undefined) {
      console.warn(`Invalid currency type: ${type}`);
      return false;
    }
    return gameState.currency[type] >= amount;
  }

  /**
   * 통화 추가
   * @param {string} type - 통화 타입
   * @param {number} amount - 추가할 양
   * @param {string} source - 출처 (e.g., 'battle_reward', 'gacha_purchase', 'daily_reward')
   * @returns {boolean}
   */
  static addCurrency(type, amount, source = 'unknown') {
    if (!gameState.currency || gameState.currency[type] === undefined) {
      console.warn(`Invalid currency type: ${type}`);
      return false;
    }

    if (amount <= 0) {
      console.warn(`Invalid amount: ${amount}`);
      return false;
    }

    const previousAmount = gameState.currency[type];
    gameState.currency[type] += amount;

    // 히스토리 기록
    this.logTransaction({
      type: 'add',
      currency: type,
      amount: amount,
      source: source,
      previousAmount: previousAmount,
      newAmount: gameState.currency[type],
      timestamp: Date.now(),
    });

    console.log(`✅ Added ${amount} ${type} from ${source}`);
    return true;
  }

  /**
   * 통화 차감 (구매/소비)
   * @param {string} type - 통화 타입
   * @param {number} amount - 차감할 양
   * @param {string} reason - 사용 이유 (e.g., 'gacha_pull', 'shop_purchase', 'god_upgrade')
   * @returns {boolean} 성공 여부
   */
  static spendCurrency(type, amount, reason = 'unknown') {
    if (!this.hasCurrency(type, amount)) {
      console.warn(`Insufficient ${type}. Need: ${amount}, Have: ${gameState.currency[type]}`);
      return false;
    }

    const previousAmount = gameState.currency[type];
    gameState.currency[type] -= amount;

    // 히스토리 기록
    this.logTransaction({
      type: 'spend',
      currency: type,
      amount: amount,
      reason: reason,
      previousAmount: previousAmount,
      newAmount: gameState.currency[type],
      timestamp: Date.now(),
    });

    console.log(`💸 Spent ${amount} ${type} for ${reason}`);
    return true;
  }

  /**
   * 통화 변환 (골드 → 프리미엄은 불가, 프리미엄 → 골드는 가능)
   * @param {number} amount - 프리미엄 양
   * @returns {boolean}
   */
  static convertPremiumToGold(amount) {
    const CONVERSION_RATE = 100;  // 1 프리미엄 = 100 골드

    if (!this.hasCurrency('premium', amount)) {
      console.warn(`Insufficient premium currency`);
      return false;
    }

    const goldReward = amount * CONVERSION_RATE;

    this.spendCurrency('premium', amount, 'currency_conversion');
    this.addCurrency('gold', goldReward, 'currency_conversion');

    console.log(`🔄 Converted ${amount} premium to ${goldReward} gold`);
    return true;
  }

  /**
   * 일일 보상 지급
   * @returns {object} 보상 정보
   */
  static claimDailyReward() {
    const now = Date.now();
    const lastRewardTime = gameState.currency.lastDailyRewardTime || 0;
    const dayInMs = 24 * 60 * 60 * 1000;

    // 이미 오늘 받았는지 확인
    if (now - lastRewardTime < dayInMs) {
      const timeRemaining = dayInMs - (now - lastRewardTime);
      const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000));
      console.warn(`Daily reward already claimed. Available in ${hoursRemaining} hours`);
      return null;
    }

    // 보상 배정
    const reward = {
      gold: 1000,
      battlePass: 50,
      essences: { normal: 10 },
    };

    // 통화 추가
    this.addCurrency('gold', reward.gold, 'daily_reward');
    this.addCurrency('battlePass', reward.battlePass, 'daily_reward');

    // 시간 기록
    gameState.currency.lastDailyRewardTime = now;

    console.log(`🎁 Daily reward claimed: ${reward.gold} gold, ${reward.battlePass} battlePass`);
    return reward;
  }

  /**
   * 스테이지 승리 보상
   * @param {number} stageNumber - 스테이지 번호
   * @param {number} wave - 진행한 웨이브
   * @returns {object} 보상 정보
   */
  static getStageReward(stageNumber, wave) {
    const baseGold = 100 * stageNumber;
    const waveBonus = wave * 50;
    const totalGold = baseGold + waveBonus;

    const baseBattlePass = 25 * stageNumber;
    const waveBonusBattlePass = wave * 10;
    const totalBattlePass = baseBattlePass + waveBonusBattlePass;

    return {
      gold: totalGold,
      battlePass: totalBattlePass,
      essences: {
        normal: 20 + wave * 5,
        rare: wave >= 2 ? 3 : 0,
      },
    };
  }

  /**
   * 스테이지 승리 시 보상 지급
   * @param {number} stageNumber - 스테이지 번호
   * @param {number} wave - 진행한 웨이브
   */
  static claimStageReward(stageNumber, wave) {
    const reward = this.getStageReward(stageNumber, wave);

    this.addCurrency('gold', reward.gold, `stage_${stageNumber}_clear`);
    this.addCurrency('battlePass', reward.battlePass, `stage_${stageNumber}_clear`);

    console.log(`🏆 Stage ${stageNumber} clear reward: ${reward.gold} gold, ${reward.battlePass} battlePass`);
    return reward;
  }

  /**
   * 거래 기록 (분석용)
   * @param {object} transaction - 거래 정보
   */
  static logTransaction(transaction) {
    if (!gameState.currency.history) {
      gameState.currency.history = [];
    }

    gameState.currency.history.push(transaction);

    // 히스토리 최대 1000개 유지 (메모리 관리)
    if (gameState.currency.history.length > 1000) {
      gameState.currency.history.shift();
    }
  }

  /**
   * 통화 현황 조회
   * @returns {object}
   */
  static getCurrencyStatus() {
    return {
      gold: gameState.currency.gold || 0,
      premium: gameState.currency.premium || 0,
      battlePass: gameState.currency.battlePass || 0,
      lastDailyReward: gameState.currency.lastDailyRewardTime || 0,
    };
  }

  /**
   * 통화 초기화 (테스트용)
   */
  static resetCurrency() {
    gameState.currency = this.createInitialCurrency();
    console.log('✓ Currency reset to initial state');
  }

  /**
   * 통화 디버그 출력
   */
  static debugPrint() {
    console.table(this.getCurrencyStatus());
    console.log(`Transaction history (last 10):`, gameState.currency.history?.slice(-10));
  }

  /**
   * 배틀패스 레벨 계산
   * @returns {number} 현재 레벨 (1~100)
   */
  static getBattlePassLevel() {
    const POINTS_PER_LEVEL = 100;
    return Math.min(100, Math.floor((gameState.currency.battlePass || 0) / POINTS_PER_LEVEL) + 1);
  }

  /**
   * 배틀패스 진행도 (%)
   * @returns {number} 0~100
   */
  static getBattlePassProgress() {
    const POINTS_PER_LEVEL = 100;
    const currentLevel = this.getBattlePassLevel();
    const pointsInCurrentLevel = (gameState.currency.battlePass || 0) % POINTS_PER_LEVEL;
    return (pointsInCurrentLevel / POINTS_PER_LEVEL) * 100;
  }
}

/**
 * 통화 상수
 */
const CURRENCY_CONSTANTS = {
  GOLD: 'gold',
  PREMIUM: 'premium',
  BATTLE_PASS: 'battlePass',

  // 기본 가격 (골드)
  SUMMON_COST: {
    guard: 50,
    archer: 75,
  },

  // 프리미엄 가격 (다이아)
  PREMIUM_COST: {
    gacha_1pull: 2,
    gacha_10pull: 18,
    battle_pass: 10,
  },

  // 환율
  CONVERSION_RATE: {
    premium_to_gold: 100,  // 1 프리미엄 = 100 골드
  },

  // 배틀패스
  BATTLE_PASS_POINTS_PER_LEVEL: 100,
  MAX_BATTLE_PASS_LEVEL: 100,
};

/**
 * 통화 UI 업데이트 (HTML 요소에 반영)
 */
function updateCurrencyUI() {
  const goldText = document.getElementById('goldText');
  const premiumText = document.getElementById('premiumText');
  const battlePassText = document.getElementById('battlePassText');

  if (goldText) {
    goldText.textContent = `${Math.floor(gameState.currency.gold)}`;
  }

  if (premiumText) {
    premiumText.textContent = `${gameState.currency.premium}`;
  }

  if (battlePassText) {
    const level = CurrencySystem.getBattlePassLevel();
    const progress = CurrencySystem.getBattlePassProgress();
    battlePassText.textContent = `Lv.${level} (${Math.floor(progress)}%)`;
  }
}

/**
 * 통화 표시 포맷팅
 * @param {number} amount - 숫자
 * @returns {string} 포맷된 문자열
 */
function formatCurrency(amount) {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return `${amount}`;
}
