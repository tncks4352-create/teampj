/**
 * 올림포스 신화 게임 - 상수 정의
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
