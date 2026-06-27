/**
 * 신화창조 - gameState 확장 설계
 * 
 * 기존 gameState 구조에 신화창조 시스템을 통합하는 방법
 * 이 파일은 설계 문서이며, createInitialState() 구현 시 참고합니다.
 */

/**
 * ==========================================
 * 확장된 gameState 구조
 * ==========================================
 */

const GAMESTATE_STRUCTURE = {
  // ===== 1. 기존 전투 시스템 (유지) =====
  battle: {
    running: false,
    gameOver: false,
    clear: false,
    stage: 1,
    wave: 1,
    maxWave: 3,
    message: '',
    messageTimer: 0,
    
    // 전투 엔티티
    playerBaseHp: 100,
    enemyBaseHp: 90,
    playerBaseMaxHp: 100,
    enemyBaseMaxHp: 90,
    units: [],
    enemies: [],
    projectiles: [],
    particles: [],
    
    // 전투 타이밍
    waveBreakTimer: 0,
    enemySpawnTimer: 0,
    spawnedInWave: 0,
    enemiesToSpawn: 0,
    baseEnemiesToSpawn: 3,
  },

  // ===== 2. 신 시스템 (확장) =====
  gods: {
    // 보유한 신 목록
    inventory: [
      {
        godId: 'athena',
        rarity: 3,                    // 1~5성
        level: 1,                     // 현재 레벨
        maxLevel: 20,                 // 별급별 최대 레벨
        experience: 0,                // 경험치 (향후)
        
        // 승급 진행도 (0~5)
        // 각 정수 5개씩 필요
        essenceProgress: 0,           // ■□□□□
        
        // 장비 (향후 확장)
        equipment: {
          weapon: null,
          armor: null,
          artifact: null
        },
        
        // 스킬 (향후 확장)
        skills: {
          passive: 'athena_wisdom',
          active: 'holy_wisdom'
        }
      },
      // ... 더 많은 신들
    ],

    // 선택된 메인 신
    selectedMainGodId: 'athena',

    // 덱 (향후 다중 덱 지원 가능)
    deck: {
      main: 'athena',           // 주 신
      support: [/* id, id */]   // 서포트 신 (향후)
    }
  },

  // ===== 3. 병사 시스템 (확장) =====
  soldiers: {
    inventory: {
      guard: { owned: 1, level: 1, fragments: 0 },
      archer: { owned: 1, level: 1, fragments: 0 },
      // ... 더 많은 병사 타입
    },

    // 덱 편성: 전투에서 사용할 병사 선택
    selectedForBattle: ['guard', 'archer'],

    // 각 병사 타입별 보유 수 (향후 상세 관리)
    // 예: guard의 정보가 여러 개일 수 있음
  },

  // ===== 4. 재화 시스템 (확장) =====
  currency: {
    // 영구 재화
    gold: 10000,
    premium: 500,

    // 병사 성장 재화
    soldierFragments: {
      guard: 20,
      archer: 15,
      spearman: 0,
      healer: 0,
      knight: 0
    },

    // 신 성장 재화 (6가지 정수)
    essences: {
      lightning: 0,   // 제우스 (번개의 정수)
      ocean: 0,       // 포세이돈 (바다의 정수)
      soul: 0,        // 하데스 (영혼의 정수)
      wisdom: 0,      // 아테나 (지혜의 정수)
      war: 0,         // 아레스 (전쟁의 정수)
      strength: 0     // 헤라클레스 (힘의 정수)
    },

    // 거래 기록 (분석/디버깅)
    history: []
  },

  // ===== 5. 신력 시스템 (NEW) =====
  godPower: {
    current: 100,                      // 현재 신력
    max: 100,                          // 최대 신력 (향후 증가 가능)
    regenerationPerSecond: 1,          // 초당 회복량
    lastUpdateTime: Date.now(),
    
    // 신력 회복 정보 (UI용)
    nextRecoveryTime: null,            // 다음 회복 시간 (1 단위)
    isFullyCharged: true
  },

  // ===== 6. 가챠 시스템 (기존) =====
  gacha: {
    pity: 0,
    pity10: 0,
    pulls: [],
    rateup: {
      god: 'athena',
      rarity: 5,
      startTime: Date.now(),
      endTime: Date.now() + 14 * 24 * 60 * 60 * 1000
    }
  },

  // ===== 7. 화면 상태 (NEW) =====
  ui: {
    currentScreen: 'lobby',              // 현재 화면명
    previousScreen: null,                // 이전 화면명
    
    // 각 화면의 로컬 상태
    lobby: {
      selectedGodId: 'athena'           // 로비에서 표시 중인 신
    },
    
    growth: {
      activeTab: 'god',                  // god | soldier | formation
      selectedGodId: null                // 상세보기 중인 신
    },
    
    gacha: {
      lastPullResult: null,              // 마지막 뽑기 결과
      isAnimating: false                 // 뽑기 연출 중
    },
    
    formation: {
      selectedSoldiers: ['guard', 'archer'],
      estimatedPower: 0
    }
  },

  // ===== 8. 보상 시스템 (NEW) =====
  lastReward: {
    gold: 0,
    essences: {},                        // { lightning: 5, war: 3 }
    soldierFragments: {},                // { guard: 20 }
    timestamp: 0
  },

  // ===== 9. 게임 설정 =====
  settings: {
    masterVolume: 1,
    bgmVolume: 1,
    sfxVolume: 1,
    vibration: true,
    fps: 60
  },

  // ===== 10. 분석/데이터 =====
  analytics: {
    totalPlayTime: 0,
    totalBattles: 0,
    totalWins: 0,
    totalLosses: 0,
    maxStageCleared: 1,
    firstGameTime: Date.now(),
    lastPlayTime: Date.now()
  }
};

/**
 * ==========================================
 * createInitialState() 작성 시 참고사항
 * ==========================================
 */

const CREATE_INITIAL_STATE_NOTES = `
1. 신 시스템
   - 초기: 사용자가 첫 신(예: 아테나)을 보유하고 시작
   - 가챠는 GameState와 분리하여 관리 (GachaSystem)
   - 신 정보는 GOD_DATABASE에서 로드

2. 병사 시스템
   - 초기: guard, archer 각 1개씩 보유
   - inventory는 소유 수 기반 (추후 상세 확장 가능)
   - 덱 편성은 배열 기반 (선택된 병사 목록)

3. 재화 시스템
   - 초기: 골드 10000, 다이아 500
   - 정수는 모두 0으로 시작 (전투/미션으로 획득)
   - CurrencySystem 호출

4. 신력 시스템
   - 초기: 100/100
   - GodPowerSystem.createInitialGodPower() 호출
   - update(dt) 루프에서 자동 회복

5. 화면 상태
   - 로비에서 시작
   - 각 화면이 필요한 정보 저장
   - 화면 전환 시 상태 업데이트

6. 이벤트 시스템
   - 재화 변경 시 'currency:changed' 발생
   - 신력 사용 시 'godpower:used' 발생
   - UI는 이벤트 리스너로 반응

7. 기존 전투 코드와의 호환성
   - battle 객체는 기존과 동일하게 유지
   - gameState.gold 대신 gameState.currency.gold 사용
   - 신력은 별도 시스템 (골드와 무관)
`;

/**
 * ==========================================
 * 마이그레이션 계획
 * ==========================================
 */

const MIGRATION_PLAN = `
1. 현재 gameState 백업
2. 새 구조로 createInitialState() 재작성
3. 기존 코드에서:
   - gameState.gold → gameState.currency.gold
   - gameState.enemyBaseHp → gameState.battle.enemyBaseHp
   - gameState.running → gameState.battle.running
   등으로 업데이트
4. ScreenManager 초기화
5. EventSystem 리스너 등록
6. GodPowerSystem 초기화
7. 테스트
`;
