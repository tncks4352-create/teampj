/**
 * 올림포스 신화 게임 - 가챠(Gacha) 시스템
 * 신 획득, 누적 시스템, 확률 관리
 */

class GachaSystem {
  /**
   * 가챠 초기 상태 생성
   */
  static createInitialGacha() {
    return {
      pity: 0,              // 누적 뽑기 수 (5성 미획득)
      pity10: 0,            // 누적 뽑기 수 (4성 미획득)
      pulls: [],            // 뽑기 기록
      lastPullTime: 0,      // 마지막 뽑기 시간
      rateup: {
        god: "athena",      // 픽업 신
        rarity: 5,          // 픽업 별급
        startTime: Date.now(),
        endTime: Date.now() + 14 * 24 * 60 * 60 * 1000,  // 2주
      },
    };
  }

  /**
   * 가챠 확률 테이블
   */
  static getGachaRates() {
    return {
      // 5성 신 (전체 3%)
      5star: {
        rateup: 0.015,        // 픽업 신: 1.5%
        other: 0.015,         // 다른 5성: 1.5%
        total: 0.03,
      },
      
      // 4성 신 (전체 15%)
      4star: {
        rateup: 0.06,         // 픽업 신: 6%
        other: 0.09,          // 다른 4성: 9%
        total: 0.15,
      },
      
      // 3성 신 (전체 52%)
      3star: {
        total: 0.52,
      },
      
      // 조각 (전체 30%)
      fragment: {
        total: 0.30,
      },
    };
  }

  /**
   * 모든 신 목록 조회
   */
  static getAllGods() {
    return Object.keys(GOD_DATABASE);
  }

  /**
   * 별급별 신 목록 조회
   */
  static getGodsByRarity(rarity) {
    return Object.entries(GOD_DATABASE)
      .filter(([_, god]) => god.baseStat[rarity])
      .map(([id, _]) => id);
  }

  /**
   * 가챠 결과 생성 (1회)
   */
  static generateGachaResult() {
    const rates = this.getGachaRates();
    const random = Math.random();
    let result = {
      type: 'fragment',
      rarity: 3,
      godId: null,
      isDuplicate: false,
    };

    // 5성 판정 (누적 90회 이상 시 무조건 5성)
    if (this.gameState.gacha.pity >= 90) {
      result = this.generate5StarResult();
      this.gameState.gacha.pity = 0;
    } 
    // 4성 판정 (누적 10회 이상 시 무조건 4성)
    else if (this.gameState.gacha.pity10 >= 10) {
      result = this.generate4StarResult();
      this.gameState.gacha.pity10 = 0;
      this.gameState.gacha.pity += 1;
    }
    // 확률 계산
    else if (random < rates['5star'].total) {
      result = this.generate5StarResult();
      this.gameState.gacha.pity = 0;
      this.gameState.gacha.pity10 = 0;
    } else if (random < rates['5star'].total + rates['4star'].total) {
      result = this.generate4StarResult();
      this.gameState.gacha.pity10 = 0;
      this.gameState.gacha.pity += 1;
    } else if (random < rates['5star'].total + rates['4star'].total + rates['3star'].total) {
      // 3성 신 또는 조각
      result = this.generate3StarResult();
      this.gameState.gacha.pity += 1;
      this.gameState.gacha.pity10 += 1;
    } else {
      // 조각
      result = this.generateFragmentResult();
      this.gameState.gacha.pity += 1;
      this.gameState.gacha.pity10 += 1;
    }

    return result;
  }

  /**
   * 5성 신 생성
   */
  static generate5StarResult() {
    const rateupGod = this.gameState.gacha.rateup.god;
    const isRateup = Math.random() < 0.5;  // 50% 확률로 픽업 신

    const godId = isRateup ? rateupGod : this.getRandomGodByRarity(5);
    const god = GOD_DATABASE[godId];

    // 중복 여부 확인
    const existingGod = this.gameState.gods?.inventory?.find(g => g.id === godId);
    const isDuplicate = !!existingGod;

    return {
      type: 'god',
      rarity: 5,
      godId: godId,
      godName: god.name,
      isDuplicate: isDuplicate,
      isRateup: isRateup,
    };
  }

  /**
   * 4성 신 생성
   */
  static generate4StarResult() {
    const rateupGod = this.gameState.gacha.rateup.god;
    const isRateup = Math.random() < 0.4;  // 40% 확률로 픽업 신

    const godId = isRateup ? rateupGod : this.getRandomGodByRarity(4);
    const god = GOD_DATABASE[godId];

    // 중복 여부 확인
    const existingGod = this.gameState.gods?.inventory?.find(g => g.id === godId);
    const isDuplicate = !!existingGod;

    return {
      type: 'god',
      rarity: 4,
      godId: godId,
      godName: god.name,
      isDuplicate: isDuplicate,
      isRateup: isRateup,
    };
  }

  /**
   * 3성 신 또는 조각 생성
   */
  static generate3StarResult() {
    const isGod = Math.random() < 0.8;  // 80% 확률로 3성 신

    if (isGod) {
      const godId = this.getRandomGodByRarity(3);
      const god = GOD_DATABASE[godId];

      const existingGod = this.gameState.gods?.inventory?.find(g => g.id === godId);
      const isDuplicate = !!existingGod;

      return {
        type: 'god',
        rarity: 3,
        godId: godId,
        godName: god.name,
        isDuplicate: isDuplicate,
      };
    } else {
      return this.generateFragmentResult();
    }
  }

  /**
   * 조각 생성 (중복 신 또는 직접 조각)
   */
  static generateFragmentResult() {
    const allGods = this.getAllGods();
    const randomGod = allGods[Math.floor(Math.random() * allGods.length)];
    const god = GOD_DATABASE[randomGod];

    return {
      type: 'fragment',
      rarity: Math.random() < 0.7 ? 3 : 2,  // 3성: 70%, 2성: 30%
      godId: randomGod,
      godName: god.name,
      count: this.getFragmentCount(god.rarity || 3),
    };
  }

  /**
   * 별급별 조각 개수 반환
   */
  static getFragmentCount(rarity) {
    const counts = { 1: 5, 2: 10, 3: 20, 4: 50, 5: 100 };
    return counts[rarity] || 20;
  }

  /**
   * 특정 별급의 랜덤 신 조회
   */
  static getRandomGodByRarity(rarity) {
    const gods = this.getGodsByRarity(rarity);
    if (gods.length === 0) return 'athena';
    return gods[Math.floor(Math.random() * gods.length)];
  }

  /**
   * 1회 뽑기 실행
   */
  static executePull() {
    // 프리미엄 확인
    if (!CurrencySystem.hasCurrency('premium', CURRENCY_CONSTANTS.PREMIUM_COST.gacha_1pull)) {
      console.warn('Insufficient premium currency');
      return null;
    }

    // 프리미엄 차감
    CurrencySystem.spendCurrency(
      'premium',
      CURRENCY_CONSTANTS.PREMIUM_COST.gacha_1pull,
      'gacha_1pull'
    );

    // 결과 생성
    const result = this.generateGachaResult();

    // 기록 저장
    this.logPull(result, 1);

    return result;
  }

  /**
   * 10회 뽑기 실행
   */
  static execute10Pulls() {
    const pulls = [];
    let hasFourStarOrBetter = false;

    for (let i = 0; i < 10; i++) {
      // 프리미엄 확인
      if (!CurrencySystem.hasCurrency('premium', CURRENCY_CONSTANTS.PREMIUM_COST.gacha_1pull)) {
        console.warn('Insufficient premium currency');
        break;
      }

      // 프리미엄 차감
      CurrencySystem.spendCurrency(
        'premium',
        CURRENCY_CONSTANTS.PREMIUM_COST.gacha_1pull,
        'gacha_10pull'
      );

      // 결과 생성
      const result = this.generateGachaResult();
      pulls.push(result);

      // 4성 이상 확인
      if (result.rarity >= 4) {
        hasFourStarOrBetter = true;
      }
    }

    // 만약 4성 이상이 없으면 10번째에 무조건 4성 이상
    if (!hasFourStarOrBetter && pulls.length === 10) {
      pulls[9] = this.generate4StarResult();
    }

    // 기록 저장
    pulls.forEach((pull, index) => {
      this.logPull(pull, index + 1);
    });

    return pulls;
  }

  /**
   * 뽑기 결과 처리 (신 획득)
   */
  static applyPullResult(result) {
    if (!this.gameState.gods) {
      this.gameState.gods = { inventory: [], equipped: {} };
    }

    if (result.type === 'god') {
      // 신 획득
      const existingGod = this.gameState.gods.inventory.find(g => g.id === result.godId);

      if (existingGod) {
        // 중복: 조각 획득
        const fragmentCount = GOD_DATABASE[result.godId].fragments[result.rarity];
        if (!this.gameState.inventory) {
          this.gameState.inventory = { fragments: {} };
        }
        if (!this.gameState.inventory.fragments) {
          this.gameState.inventory.fragments = {};
        }
        if (!this.gameState.inventory.fragments[result.godId]) {
          this.gameState.inventory.fragments[result.godId] = 0;
        }
        this.gameState.inventory.fragments[result.godId] += fragmentCount;
        console.log(`✓ Received ${fragmentCount} fragments of ${result.godName}`);
      } else {
        // 신 획득
        const newGod = {
          id: result.godId,
          name: result.godName,
          rarity: result.rarity,
          level: 1,
          exp: 0,
          nextExp: 1000,
          equipped: false,
        };
        this.gameState.gods.inventory.push(newGod);
        
        // 초기 조각도 함께 획득
        const initialFragments = result.rarity >= 4 ? 50 : 20;
        if (!this.gameState.inventory) {
          this.gameState.inventory = { fragments: {} };
        }
        if (!this.gameState.inventory.fragments) {
          this.gameState.inventory.fragments = {};
        }
        if (!this.gameState.inventory.fragments[result.godId]) {
          this.gameState.inventory.fragments[result.godId] = 0;
        }
        this.gameState.inventory.fragments[result.godId] += initialFragments;
        console.log(`✓ Acquired new god: ${result.godName} (${result.rarity}★)`);
      }
    } else if (result.type === 'fragment') {
      // 조각 획득
      if (!this.gameState.inventory) {
        this.gameState.inventory = { fragments: {} };
      }
      if (!this.gameState.inventory.fragments) {
        this.gameState.inventory.fragments = {};
      }
      if (!this.gameState.inventory.fragments[result.godId]) {
        this.gameState.inventory.fragments[result.godId] = 0;
      }
      this.gameState.inventory.fragments[result.godId] += result.count;
      console.log(`✓ Received ${result.count} fragments of ${result.godName}`);
    }
  }

  /**
   * 뽑기 기록 저장
   */
  static logPull(result, pullNumber) {
    if (!this.gameState.gacha.pulls) {
      this.gameState.gacha.pulls = [];
    }

    this.gameState.gacha.pulls.push({
      result: result,
      pullNumber: pullNumber,
      timestamp: Date.now(),
      pity: this.gameState.gacha.pity,
    });

    // 기록 최대 1000개 유지
    if (this.gameState.gacha.pulls.length > 1000) {
      this.gameState.gacha.pulls.shift();
    }

    this.gameState.gacha.lastPullTime = Date.now();
  }

  /**
   * 가챠 확률표 표시
   */
  static displayProbability() {
    const rates = this.getGachaRates();
    console.log('=== GACHA PROBABILITY ===');
    console.log(`5★ ${(rates['5star'].total * 100).toFixed(2)}% (UP: ${(rates['5star'].rateup * 100).toFixed(2)}%)`);
    console.log(`4★ ${(rates['4star'].total * 100).toFixed(2)}% (UP: ${(rates['4star'].rateup * 100).toFixed(2)}%)`);
    console.log(`3★ ${(rates['3star'].total * 100).toFixed(2)}%`);
    console.log(`Fragment ${(rates.fragment.total * 100).toFixed(2)}%`);
    console.log(`========================`);
  }

  /**
   * 픽업 신 변경
   */
  static updateRateup(godId, rarity) {
    if (!GOD_DATABASE[godId]) {
      console.warn(`Invalid god: ${godId}`);
      return false;
    }

    this.gameState.gacha.rateup = {
      god: godId,
      rarity: rarity,
      startTime: Date.now(),
      endTime: Date.now() + 14 * 24 * 60 * 60 * 1000,  // 2주
    };

    console.log(`✓ Rate-up updated: ${GOD_DATABASE[godId].name} (${rarity}★)`);
    return true;
  }

  /**
   * 가챠 통계 조회
   */
  static getGachaStats() {
    const pulls = this.gameState.gacha.pulls || [];
    const stats = {
      totalPulls: pulls.length,
      totalGods: pulls.filter(p => p.result.type === 'god').length,
      total5Stars: pulls.filter(p => p.result.rarity === 5).length,
      total4Stars: pulls.filter(p => p.result.rarity === 4).length,
      total3Stars: pulls.filter(p => p.result.rarity === 3).length,
      currentPity: this.gameState.gacha.pity,
      currentPity10: this.gameState.gacha.pity10,
    };
    return stats;
  }

  /**
   * gameState 설정 (핵심)
   */
  static setGameState(state) {
    this.gameState = state;
  }
}

/**
 * 가챠 UI 도우미 함수
 */
function displayGachaResult(results) {
  const isMultiple = Array.isArray(results);
  const pulls = isMultiple ? results : [results];

  console.log(`\n=== GACHA RESULT (${pulls.length} pull${pulls.length > 1 ? 's' : ''}) ===`);

  pulls.forEach((result, index) => {
    const rarity = result.rarity || 3;
    const rarityStr = '★'.repeat(rarity);
    const type = result.type === 'god' ? 'GOD' : 'FRAGMENT';

    if (result.type === 'god') {
      console.log(`[${index + 1}] ${rarityStr} ${result.godName} (${type})`);
      if (result.isDuplicate) console.log('    → Fragment obtained (duplicate)');
    } else {
      console.log(`[${index + 1}] ${result.count}x ${result.godName} Fragments`);
    }
  });

  console.log(`============================\n`);
}
