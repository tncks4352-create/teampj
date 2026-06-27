/**
 * 올림포스 신화 게임 - 신(Hero) 데이터베이스
 * 각 신의 스탯, 스킬, 강화 정보 정의
 */

const GOD_DATABASE = {
  // ==================== 지혜의 신 ====================
  athena: {
    id: "athena",
    name: "아테나",
    title: "지혜의 여신",
    element: "wisdom",
    color: "#70f7ff",
    
    // 별급별 기본 스탯 (레벨 1)
    baseStat: {
      1: { hp: 40, atk: 12, spd: 35 },
      2: { hp: 60, atk: 16, spd: 42 },
      3: { hp: 80, atk: 20, spd: 50 },
      4: { hp: 100, atk: 25, spd: 55 },
      5: { hp: 120, atk: 30, spd: 60 },
    },
    
    // 레벨당 성장률 (%)
    growth: {
      hp: 0.05,    // 레벨당 5% 증가
      atk: 0.04,   // 레벨당 4% 증가
      spd: 0.02,   // 레벨당 2% 증가
    },
    
    // 최대 레벨 (별급별)
    maxLevel: {
      1: 20,
      2: 30,
      3: 40,
      4: 50,
      5: 60,
    },
    
    // 스킬
    skill: {
      passive: {
        name: "지혜의 축복",
        description: "전투 시작 시 ATK +15%, DEF +10%",
        effect: { atk: 1.15, def: 1.10 },
      },
      active: {
        name: "창 투척",
        description: "적 범위 공격 (쿨: 6초)",
        cooldown: 6,
        range: 200,
      },
    },
    
    // 강화 필요 조각
    fragments: {
      1: 5,    // 1성 조각 5개
      2: 10,   // 2성 조각 10개
      3: 50,   // 3성 조각 50개
      4: 100,  // 4성 조각 100개
      5: 200,  // 5성 조각 200개
    },
    
    // 특수 효과
    buff: "아군 전체 ATK +5%",
  },

  // ==================== 전쟁의 신 ====================
  ares: {
    id: "ares",
    name: "아레스",
    title: "전쟁의 신",
    element: "war",
    color: "#ff6bd6",
    
    baseStat: {
      1: { hp: 50, atk: 15, spd: 30 },
      2: { hp: 70, atk: 20, spd: 38 },
      3: { hp: 90, atk: 25, spd: 45 },
      4: { hp: 110, atk: 30, spd: 50 },
      5: { hp: 130, atk: 35, spd: 55 },
    },
    
    growth: {
      hp: 0.06,
      atk: 0.05,
      spd: 0.015,
    },
    
    maxLevel: {
      1: 20,
      2: 30,
      3: 40,
      4: 50,
      5: 60,
    },
    
    skill: {
      passive: {
        name: "전투 광기",
        description: "받은 대미지의 10%를 반사",
        effect: { reflection: 0.10 },
      },
      active: {
        name: "무술",
        description: "적 단일 대미지 공격 (쿨: 4초)",
        cooldown: 4,
        range: 50,
      },
    },
    
    fragments: {
      1: 5,
      2: 10,
      3: 50,
      4: 100,
      5: 200,
    },
    
    buff: "아군 전체 DEF +5%",
  },

  // ==================== 속도의 신 ====================
  hermes: {
    id: "hermes",
    name: "헤르메스",
    title: "속도의 신",
    element: "speed",
    color: "#75ff8f",
    
    baseStat: {
      1: { hp: 35, atk: 10, spd: 55 },
      2: { hp: 50, atk: 14, spd: 65 },
      3: { hp: 65, atk: 18, spd: 75 },
      4: { hp: 80, atk: 22, spd: 85 },
      5: { hp: 95, atk: 26, spd: 95 },
    },
    
    growth: {
      hp: 0.04,
      atk: 0.03,
      spd: 0.04,  // 다른 신보다 높은 성장률
    },
    
    maxLevel: {
      1: 20,
      2: 30,
      3: 40,
      4: 50,
      5: 60,
    },
    
    skill: {
      passive: {
        name: "신속함",
        description: "SPD +20%, 공격 시 회피 확률 15%",
        effect: { spd: 1.20, dodge: 0.15 },
      },
      active: {
        name: "신의 발걸음",
        description: "위치 이동 및 공격 (쿨: 3초)",
        cooldown: 3,
        range: 150,
      },
    },
    
    fragments: {
      1: 5,
      2: 10,
      3: 50,
      4: 100,
      5: 200,
    },
    
    buff: "아군 전체 SPD +8%",
  },

  // ==================== 바다의 신 ====================
  poseidon: {
    id: "poseidon",
    name: "포세이돈",
    title: "바다의 신",
    element: "sea",
    color: "#70f7ff",
    
    baseStat: {
      1: { hp: 55, atk: 13, spd: 32 },
      2: { hp: 75, atk: 18, spd: 40 },
      3: { hp: 95, atk: 23, spd: 48 },
      4: { hp: 115, atk: 28, spd: 53 },
      5: { hp: 135, atk: 33, spd: 58 },
    },
    
    growth: {
      hp: 0.055,
      atk: 0.045,
      spd: 0.02,
    },
    
    maxLevel: {
      1: 20,
      2: 30,
      3: 40,
      4: 50,
      5: 60,
    },
    
    skill: {
      passive: {
        name: "바다의 분노",
        description: "HP가 50% 이하일 때 ATK +20%",
        effect: { lowHpAtk: 1.20 },
      },
      active: {
        name: "삼지창",
        description: "범위 공격 (3갈래) (쿨: 5초)",
        cooldown: 5,
        range: 180,
      },
    },
    
    fragments: {
      1: 5,
      2: 10,
      3: 50,
      4: 100,
      5: 200,
    },
    
    buff: "아군 전체 HP +10%",
  },

  // ==================== 사랑의 신 ====================
  aphrodite: {
    id: "aphrodite",
    name: "아프로디테",
    title: "사랑의 여신",
    element: "love",
    color: "#ff6bd6",
    
    baseStat: {
      1: { hp: 45, atk: 11, spd: 48 },
      2: { hp: 65, atk: 15, spd: 55 },
      3: { hp: 85, atk: 19, spd: 62 },
      4: { hp: 105, atk: 24, spd: 68 },
      5: { hp: 125, atk: 29, spd: 74 },
    },
    
    growth: {
      hp: 0.05,
      atk: 0.04,
      spd: 0.03,
    },
    
    maxLevel: {
      1: 20,
      2: 30,
      3: 40,
      4: 50,
      5: 60,
    },
    
    skill: {
      passive: {
        name: "매력",
        description: "모든 아군의 치명타 확률 +15%",
        effect: { critRate: 0.15 },
      },
      active: {
        name: "황금의 사과",
        description: "아군 회복 (쿨: 7초)",
        cooldown: 7,
        range: 300,
      },
    },
    
    fragments: {
      1: 5,
      2: 10,
      3: 50,
      4: 100,
      5: 200,
    },
    
    buff: "아군 전체 치명타 +10%",
  },

  // ==================== 장의 신 ====================
  apollo: {
    id: "apollo",
    name: "아폴로",
    title: "장의 신",
    element: "light",
    color: "#ffd66b",
    
    baseStat: {
      1: { hp: 42, atk: 14, spd: 40 },
      2: { hp: 62, atk: 19, spd: 48 },
      3: { hp: 82, atk: 24, spd: 56 },
      4: { hp: 102, atk: 29, spd: 63 },
      5: { hp: 122, atk: 34, spd: 70 },
    },
    
    growth: {
      hp: 0.05,
      atk: 0.045,
      spd: 0.025,
    },
    
    maxLevel: {
      1: 20,
      2: 30,
      3: 40,
      4: 50,
      5: 60,
    },
    
    skill: {
      passive: {
        name: "광선",
        description: "매 공격마다 30% 확률로 추가 공격",
        effect: { doubleAttack: 0.30 },
      },
      active: {
        name: "태양의 화살",
        description: "직선 범위 공격 (쿨: 5.5초)",
        cooldown: 5.5,
        range: 220,
      },
    },
    
    fragments: {
      1: 5,
      2: 10,
      3: 50,
      4: 100,
      5: 200,
    },
    
    buff: "아군 전체 ATK +8%",
  },

  // ==================== 사냥의 신 ====================
  artemis: {
    id: "artemis",
    name: "아르테미스",
    title: "사냥의 여신",
    element: "hunt",
    color: "#75ff8f",
    
    baseStat: {
      1: { hp: 40, atk: 16, spd: 52 },
      2: { hp: 58, atk: 21, spd: 60 },
      3: { hp: 76, atk: 26, spd: 68 },
      4: { hp: 94, atk: 31, spd: 76 },
      5: { hp: 112, atk: 36, spd: 84 },
    },
    
    growth: {
      hp: 0.045,
      atk: 0.05,
      spd: 0.035,
    },
    
    maxLevel: {
      1: 20,
      2: 30,
      3: 40,
      4: 50,
      5: 60,
    },
    
    skill: {
      passive: {
        name: "야생성",
        description: "적이 죽을 때마다 아군 전체 ATK +3% (최대 15%)",
        effect: { stackAttack: 0.03 },
      },
      active: {
        name: "화살 폭주",
        description: "다중 화살 공격 (쿨: 4.5초)",
        cooldown: 4.5,
        range: 240,
      },
    },
    
    fragments: {
      1: 5,
      2: 10,
      3: 50,
      4: 100,
      5: 200,
    },
    
    buff: "아군 전체 공격 속도 +10%",
  },

  // ==================== 대장장이의 신 ====================
  hephaestus: {
    id: "hephaestus",
    name: "헤파이스토스",
    title: "대장장이의 신",
    element: "fire",
    color: "#ff9f3f",
    
    baseStat: {
      1: { hp: 60, atk: 12, spd: 28 },
      2: { hp: 80, atk: 17, spd: 35 },
      3: { hp: 100, atk: 22, spd: 42 },
      4: { hp: 120, atk: 27, spd: 48 },
      5: { hp: 140, atk: 32, spd: 54 },
    },
    
    growth: {
      hp: 0.065,
      atk: 0.04,
      spd: 0.015,
    },
    
    maxLevel: {
      1: 20,
      2: 30,
      3: 40,
      4: 50,
      5: 60,
    },
    
    skill: {
      passive: {
        name: "용광로",
        description: "매 턴 후 아군 전체 회복 (최대 HP의 5%)",
        effect: { healing: 0.05 },
      },
      active: {
        name: "화염 폭발",
        description: "범위 불 공격 (쿨: 6초)",
        cooldown: 6,
        range: 160,
      },
    },
    
    fragments: {
      1: 5,
      2: 10,
      3: 50,
      4: 100,
      5: 200,
    },
    
    buff: "아군 전체 DEF +8%",
  },

  // ==================== 지혜의 여신 (미네르바) ====================
  minerva: {
    id: "minerva",
    name: "미네르바",
    title: "책략의 여신",
    element: "wisdom",
    color: "#70f7ff",
    
    baseStat: {
      2: { hp: 55, atk: 17, spd: 48 },
      3: { hp: 75, atk: 22, spd: 56 },
      4: { hp: 95, atk: 27, spd: 63 },
      5: { hp: 115, atk: 32, spd: 70 },
    },
    
    growth: {
      hp: 0.05,
      atk: 0.042,
      spd: 0.025,
    },
    
    maxLevel: {
      2: 30,
      3: 40,
      4: 50,
      5: 60,
    },
    
    skill: {
      passive: {
        name: "책략",
        description: "아군이 받는 대미지 10% 감소",
        effect: { damageReduction: 0.10 },
      },
      active: {
        name: "방어막",
        description: "아군 보호 및 피해 흡수 (쿨: 8초)",
        cooldown: 8,
        range: 250,
      },
    },
    
    fragments: {
      2: 10,
      3: 50,
      4: 100,
      5: 200,
    },
    
    buff: "아군 전체 방어 +12%",
  },

  // ==================== 풍요의 신 ====================
  demeter: {
    id: "demeter",
    name: "데메테르",
    title: "풍요의 여신",
    element: "earth",
    color: "#75ff8f",
    
    baseStat: {
      2: { hp: 70, atk: 15, spd: 36 },
      3: { hp: 90, atk: 20, spd: 44 },
      4: { hp: 110, atk: 25, spd: 51 },
      5: { hp: 130, atk: 30, spd: 58 },
    },
    
    growth: {
      hp: 0.06,
      atk: 0.035,
      spd: 0.02,
    },
    
    maxLevel: {
      2: 30,
      3: 40,
      4: 50,
      5: 60,
    },
    
    skill: {
      passive: {
        name: "수확",
        description: "전투 중 아군 전체 HP 천천히 회복",
        effect: { continuousHealing: 0.03 },
      },
      active: {
        name: "곡식의 성장",
        description: "범위 회복 (쿨: 7초)",
        cooldown: 7,
        range: 200,
      },
    },
    
    fragments: {
      2: 10,
      3: 50,
      4: 100,
      5: 200,
    },
    
    buff: "아군 전체 HP +15%",
  },
};

/**
 * 강화 비용 테이블
 */
const UPGRADE_COST = {
  // 레벨업 비용
  levelUp: (currentLevel) => {
    return 50 + currentLevel * 10;  // 레벨 1: 60, 레벨 2: 70, ...
  },
  
  // 별급 업 비용 (조각 + 정수)
  rarityUp: {
    1: { fragments: 5, essences: { normal: 0, rare: 0, epic: 0 } },
    2: { fragments: 10, essences: { normal: 10, rare: 0, epic: 0 } },
    3: { fragments: 50, essences: { normal: 25, rare: 5, epic: 0 } },
    4: { fragments: 100, essences: { normal: 50, rare: 20, epic: 3 } },
    5: { fragments: 200, essences: { normal: 100, rare: 50, epic: 10 } },
  },
  
  // 스킬 해제 비용
  skillUnlock: {
    level: 30,
    cost: { gold: 5000, essences: { rare: 10 } },
  },
};

/**
 * 조각 획득 정보
 */
const FRAGMENT_SOURCES = {
  gacha: {
    1: 5,      // 1성 뽑기에서 5개
    2: 10,     // 2성 뽑기에서 10개
    3: 20,     // 3성 뽑기에서 20개
    4: 50,     // 4성 뽑기에서 50개
    5: 100,    // 5성 뽑기에서 100개
  },
  dailyShop: { count: 10, max: 50 },  // 일일 상점
  weeklyQuest: { count: 20, max: 100 },  // 주간 퀘스트
  specialEvent: { count: 30, max: 150 },  // 특수 이벤트
};

/**
 * 신 정수 획득 정보
 */
const ESSENCE_SOURCES = {
  normal: {
    image: "assets/essences/normal.png",
    description: "기본 정수",
    dropRate: 0.40,
    rewards: [10, 20, 30],
  },
  rare: {
    image: "assets/essences/rare.png",
    description: "희귀 정수",
    dropRate: 0.12,
    rewards: [3, 5, 10],
  },
  epic: {
    image: "assets/essences/epic.png",
    description: "epic 정수",
    dropRate: 0.02,
    rewards: [1, 2, 3],
  },
};

/**
 * 신 정렬 옵션
 */
const GOD_SORT_OPTIONS = {
  byRarity: (godList) => godList.sort((a, b) => b.rarity - a.rarity),
  byLevel: (godList) => godList.sort((a, b) => b.level - a.level),
  byName: (godList) => godList.sort((a, b) => a.name.localeCompare(b.name)),
  byElement: (godList) => godList.sort((a, b) => a.element.localeCompare(b.element)),
};

/**
 * 신 필터 옵션
 */
const GOD_FILTER_OPTIONS = {
  byRarity: (godList, rarity) => godList.filter((god) => god.rarity === rarity),
  byElement: (godList, element) => godList.filter((god) => GOD_DATABASE[god.id]?.element === element),
  byLevel: (godList, minLevel) => godList.filter((god) => god.level >= minLevel),
  equipped: (godList) => godList.filter((god) => god.equipped === true),
};

/**
 * 신의 모든 엘리먼트 목록
 */
const ELEMENTS = {
  wisdom: { name: "지혜", icon: "💎", color: "#70f7ff" },
  war: { name: "전쟁", icon: "⚔️", color: "#ff6bd6" },
  speed: { name: "속도", icon: "⚡", color: "#75ff8f" },
  sea: { name: "바다", icon: "🌊", color: "#70f7ff" },
  love: { name: "사랑", icon: "💖", color: "#ff6bd6" },
  light: { name: "빛", icon: "☀️", color: "#ffd66b" },
  hunt: { name: "사냥", icon: "🏹", color: "#75ff8f" },
  fire: { name: "불", icon: "🔥", color: "#ff9f3f" },
  earth: { name: "땅", icon: "🌍", color: "#75ff8f" },
};

/**
 * 유틸리티: 신 ID로 신 정보 조회
 */
function getGodInfo(godId) {
  return GOD_DATABASE[godId] || null;
}

/**
 * 유틸리티: 신의 현재 레벨 기반 스탯 계산
 */
function calculateGodStats(god) {
  const info = getGodInfo(god.id);
  if (!info) return null;
  
  const baseStat = info.baseStat[god.rarity];
  const growth = info.growth;
  const level = god.level - 1;  // 레벨 1일 때 성장 0%
  
  return {
    hp: Math.floor(baseStat.hp * Math.pow(1 + growth.hp, level)),
    atk: Math.floor(baseStat.atk * Math.pow(1 + growth.atk, level)),
    spd: Math.floor(baseStat.spd * Math.pow(1 + growth.spd, level)),
  };
}

/**
 * 유틸리티: 신 강화에 필요한 비용 계산
 */
function getUpgradeCost(currentLevel, targetRarity) {
  const levelCost = UPGRADE_COST.levelUp(currentLevel);
  const rarityCost = UPGRADE_COST.rarityUp[targetRarity] || { fragments: 0, essences: {} };
  
  return {
    levelUp: levelCost,
    rarityUp: rarityCost,
  };
}

/**
 * 유틸리티: 별급 업에 필요한 조각 개수
 */
function getFragmentsNeeded(godId, currentRarity) {
  const info = getGodInfo(godId);
  if (!info) return 0;
  
  return info.fragments[currentRarity] || 0;
}
