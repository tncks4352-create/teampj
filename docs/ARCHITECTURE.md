# 신화창조 (Gods of Olympus) 리빌드 구조 설계

상태: Phase 1 설계 확정

작성일: 2026-06-28

범위: 구조 설계만 포함하며 UI 구현과 신규 기능 구현은 포함하지 않는다.

## 1. 리빌드 원칙

1. 기존 전투의 규칙과 손맛을 회귀 기준선으로 삼는다.
2. 기존 방패병, 궁수, 플레이어 성, 적 성 이미지는 교체하지 않는다.
3. UI는 모바일 RPG의 공통 화면 셸과 화면별 콘텐츠로 분리한다.
4. UI가 전투 내부 배열이나 타이머를 직접 수정하지 않게 한다.
5. Phase 2에서는 화면 이동과 시각 구조만 완성하고, 경제·성장·가챠의 실제 처리는 Phase 3 이후에 연결한다.

## 2. 현재 프로젝트 판독 결과

현재 애플리케이션은 별도 빌드 과정이 없는 HTML/CSS/JavaScript 프로젝트다.

- `index.html`: 타이틀, 로비, 모집, 상점, 편성, 스테이지 선택, 전투 DOM이 한 파일에 있다.
- `style.css`: 모든 화면과 전투 UI 스타일이 한 파일에 있다.
- `script.js`: 화면 전환, UI 이벤트, 저장, 전투 시뮬레이션, Canvas 렌더링이 한 파일에 결합되어 있다.
- `data/`: 신 데이터와 상수가 있다.
- `systems/`: 재화와 가챠 시스템 초안이 있다.
- `core/`: 화면 관리자와 이벤트 버스 초안이 있으나 현재 `index.html`에서 로드하거나 실제 흐름에 사용하지 않는다.

현재 실제 화면 흐름은 다음과 같다.

```text
타이틀 → 로비
          ├─ 모집
          ├─ 상점
          ├─ 편성
          └─ 스테이지 선택 → 전투
```

미션은 안내 문구만 표시하며, 성장·보상 전용 화면은 아직 없다.

## 3. 제품 방향

`신화창조`는 기존 픽셀 디펜스의 횡스크롤 전투를 코어로 유지하고, 그 바깥을 모바일 수집형 RPG의 로비·성장·BM 구조로 재구성한다.

- 전투 감각: 팔라독 스타일의 횡스크롤 디펜스
- 로비 밀도: 세븐나이츠 리버스 계열
- 성장/BM 구조: 라스트워 계열
- 정보 정돈과 여백: AFK Journey 계열
- 시각 목표: 현재의 아케이드 픽셀 UI가 아닌 현대적인 모바일 RPG UI

레퍼런스의 그래픽을 복제하지 않고 정보 위계, 진입 동선, 상품 확장성만 참고한다. 기존 픽셀 병사와 성은 전투 고유 자산으로 유지하며, 로비와 메타 UI는 별도의 세련된 신화 테마로 통일한다.

## 4. 목표 정보 구조

모바일 세로 화면을 기본으로 하되 전투는 기존 16:9 Canvas 비율을 유지한다.

```text
앱
├─ 시작
│  └─ 타이틀 / 로딩
├─ 메인 셸
│  ├─ 홈(로비)
│  ├─ 신 모집
│  ├─ 성장
│  │  ├─ 신 성장
│  │  ├─ 병사 성장
│  │  └─ 덱 편성
│  ├─ 상점
│  └─ 미션
├─ 보조 화면
│  ├─ 미션
│  ├─ 우편함
│  ├─ 설정
│  └─ 재화 상세
└─ 전투 흐름
   └─ 덱 편성 → 전투 → 결과 / 보상 → 홈
```

### 공통 모바일 RPG 셸

- 상단 바: 플레이어 정보, 골드, 프리미엄 재화, 설정
- 콘텐츠 영역: 현재 화면의 고유 콘텐츠
- 하단 메뉴: 신 모집, 성장, 상점, 미션
- 홈의 주요 행동 버튼: 전투 시작
- 추후 확장 영역: 우편함, 설정
- 모달 레이어: 확인, 재화 부족, 확률 안내, 보상 상세
- 토스트 레이어: 짧은 상태 안내

전투 화면에서는 메인 셸을 숨기고 전투 HUD만 사용한다.

## 5. 확정 플레이 흐름

```text
게임 실행
  → 메인 로비
  → 전투 시작
  → 덱 편성
  → 전투
  → Victory / Defeat 및 보상
  → 확인
  → 메인 로비
```

`전투 시작`은 전투를 직접 시작하지 않는다. 반드시 덱 편성을 거쳐 출전한다. 기존 스테이지 선택 기능은 삭제하지 않고 Phase 2에서 덱 편성 진입 전의 챕터/스테이지 선택 단계 또는 로비의 진행 정보로 흡수한다.

## 6. 화면 책임

| 화면 | Phase 2 책임 | Phase 3 이후 책임 |
|---|---|---|
| 타이틀 | 브랜드, 시작 진입 | 세이브 로드, 공지 |
| 홈 | 골드/다이아, 중앙의 선택 신, 전투 시작, 4개 하단 메뉴 | 선택 신 대기 모션, 우편함, 설정 |
| 성장 | 신/병사/덱 편성 3개 탭 | 레벨업, 승급, 병사 강화, 편성 저장 |
| 덱 편성 | 선택 신, 보유 병사 체크 목록, 예상 전투력 | 선택 저장과 전투 반영 |
| 신 모집 | 신 전용 배너, 확률 보기, 1/10회 소환 UI | 다이아 차감, 천장, 결과 반영 |
| 상점 | 스타터/성장/월정액/시즌패스/다이아 탭과 상품 카드 | 구매, 재고, 결제 |
| 미션 | 일일/주간/업적 탭과 보상 미리보기 | 진행도, 보상 수령 |
| 스테이지 | 챕터와 스테이지 선택 | 해금 조건, 소모 재화 |
| 전투 | 기존 Canvas + 모바일 HUD | 신 스킬, 배속, 자동 전투 |
| 결과 | 승패와 보상 레이아웃 | 보상 지급, 다음 스테이지 |

### 로비 중심 콘텐츠

```text
상단       골드 | 다이아 | (추후 우편/설정)
중앙       선택한 신의 대형 비주얼
           제우스 · Lv35
           ★★★ · 현재 별 게이지 [■■□□□]
중앙 하단  [전투 시작]
하단       [신 모집] [성장] [상점] [미션]
```

선택 신은 항상 로비 중앙에 표시한다. 신 전용 일러스트가 준비되지 않은 Phase 2에는 교체 가능한 플레이스홀더 컴포넌트를 사용한다.

### 성장 규칙

- 신 레벨업은 영구 재화인 골드를 사용한다.
- 별 단계마다 레벨 상한이 있다.
- 각 신의 전용 정수로 별 내부의 5칸 게이지를 채운다.
- 5칸 완성 시 별 1단계가 올라가고 다음 레벨 상한이 열린다.
- 예: `번개의 정수 20개 → ■□□□□`, 다시 20개 사용 시 `■■□□□`.
- 병사 성장은 병사별 조각을 사용한다.

별과 게이지는 서로 다른 값으로 저장한다.

```js
{
  stars: 1,             // 1~5
  essenceStep: 2,       // 0~5
  essencePerStep: 20,
  level: 35,
  levelCap: 40
}
```

### 전투 편성

- 상단에 현재 선택한 신을 표시한다.
- 보유 병사 중 검병, 궁수, 창병, 힐러, 기병을 체크 방식으로 선택한다.
- 선택한 병사만 전투 소환 버튼에 나타난다.
- 우측 하단에 예상 전투력을 표시한다.
- 아직 자산과 전투 구현이 없는 병사는 Phase 2에서 잠금/준비 중 상태로 표현하고, 기존 방패병과 궁수만 실제 전투에 연결한다.

## 7. 코드 경계

### 보존 영역

다음 `script.js` 로직은 Phase 2에서 동작을 변경하지 않는다.

- `STAGE_CONFIGS`와 스테이지 진행 규칙
- `createInitialState()`의 기존 전투 필드
- `startGame()`부터 전투 시작에 필요한 초기화
- `summonGuard()`, `summonArcher()`
- `spawnEnemy()`와 웨이브 진행
- `updateUnits()`, `updateEnemies()`, `updateProjectiles()`
- 충돌, 피해, 사망, 승패 판정
- `gameLoop()`, `update()`, `draw()`와 Canvas 렌더링
- 기존 이미지 경로와 스프라이트 프레임 규격

보존 자산:

```text
assets/animations/guard/guard_spritesheet_v2.png
assets/animations/archer/archer_spritesheet_v2.png
assets/maps/stage1/player_castle_stage1.png
assets/maps/stage1/enemy_castle_stage1.png
```

### 변경 허용 영역

- 화면마다 흩어진 `showLobby()`, `showShop()` 형태의 직접 전환
- 화면 고유 스타일이 뒤섞인 단일 CSS 구조
- 픽셀디펜스/기사왕국/황야 상점처럼 혼재된 명칭과 시각 테마
- 준비 중 안내만 있는 메뉴
- 전투 외부의 데스크톱 중심 레이아웃
- 기존 전투 HUD와 골드 기반 소환 표시

### 어댑터 경계

UI는 아래 명령만 전투에 전달한다.

```js
BattleAdapter.start({ stageId, formation });
BattleAdapter.summon("guard");
BattleAdapter.summon("archer");
BattleAdapter.castGodSkill();
BattleAdapter.restart();
BattleAdapter.exit();
```

전투는 아래 스냅샷과 이벤트만 UI에 제공한다.

```js
BattleAdapter.getSnapshot();
// stage, wave, godPower, unitCount, playerHp, enemyHp, running, result

Events.emit("battle:updated", snapshot);
Events.emit("battle:ended", { result, stageId });
```

Phase 2에서는 기존 함수를 감싸는 얇은 어댑터만 사용한다. 전투 코드를 새로운 상태 구조로 대규모 이전하지 않는다. 골드에서 신력으로의 실제 전환은 전투 규칙 변경이므로 Phase 3의 첫 기능 작업으로 분리한다.

## 8. 상태 모델

상태는 저장 대상과 세션 대상을 분리한다.

```js
const gameState = {
  profile: {
    name: "플레이어",
    level: 1,
    experience: 0
  },
  progression: {
    selectedStage: 1,
    unlockedStage: 1
  },
  roster: {
    gods: [],
    soldiers: {},
    formation: {
      gods: [],
      soldiers: ["guard", "archer"]
    }
  },
  wallet: {
    gold: 0,
    premium: 0,
    summonTicket: 0,
    materials: {}
  },
  battle: {
    // 기존 전투 상태를 우선 그대로 수용
    godPower: {
      current: 100,
      max: 100,
      regenerationPerSecond: 1
    }
  },
  ui: {
    route: "home",
    previousRoute: null,
    modal: null,
    toast: null
  }
};
```

- 저장 대상: `profile`, `progression`, `roster`, `wallet`
- 세션 대상: `battle`, `ui`
- Phase 2에서는 기존 `pixelDefenseStageProgress` 저장 키를 유지한다.
- 저장 형식 마이그레이션은 Phase 3에서 버전 필드와 함께 진행한다.

### 재화 분류

```text
영구 재화
├─ 골드
└─ 다이아

병사 성장
└─ 병사별 조각

신 성장
├─ 번개의 정수
├─ 바다의 정수
├─ 영혼의 정수
├─ 지혜의 정수
├─ 전쟁의 정수
└─ 힘의 정수

전투 세션
└─ 신력
```

신력은 전투 시작 시 초기화되며 시간에 따라 회복한다. 병사 소환과 신 스킬이 신력을 소비한다. 전투 중 골드는 생성하거나 소비하지 않는다.

## 9. 화면 전환 규칙

화면 식별자는 DOM id가 아닌 route 이름을 사용한다.

```text
title
home
summon
growth
shop
missions
formation
stage-select
battle
result
```

- 하단 메뉴 이동은 스택을 쌓지 않는다.
- 상세, 미션, 스테이지 선택은 이전 화면으로 돌아갈 수 있다.
- 전투 진입 시 중복 입력을 막고 전환 중 상태를 둔다.
- 전투 종료 시 `result`를 거친 뒤 홈 또는 다음 스테이지로 이동한다.
- 브라우저 뒤로 가기는 활성 모달 → 보조 화면 → 홈 순서로 처리한다.

## 10. 상점과 미션의 확장 계약

상품과 미션은 HTML에 개별 항목을 하드코딩하지 않고 데이터로 렌더링한다.

```js
const shopCategories = [
  "starter",
  "growth",
  "monthly",
  "seasonPass",
  "diamond"
];

const missionCategories = ["daily", "weekly", "achievement"];
const rewardTypes = ["gold", "diamond", "soldierFragment", "godEssence"];
```

이 구조를 통해 상품이나 미션 추가 시 화면 레이아웃과 이벤트 코드를 다시 작성하지 않게 한다.

## 11. 권장 파일 구조

Phase 2에서 과도한 프레임워크 도입 없이 현재 기술 스택을 유지한다.

```text
index.html
styles/
  tokens.css
  base.css
  shell.css
  screens.css
  battle.css
core/
  screen-manager.js
  event-system.js
  app-state.js
adapters/
  battle-adapter.js
ui/
  app-shell.js
  home-screen.js
  growth-screen.js
  formation-screen.js
  summon-screen.js
  shop-screen.js
  mission-screen.js
  stage-screen.js
  battle-hud.js
  result-screen.js
data/
systems/
assets/
script.js
```

`script.js`는 당분간 전투 엔진 역할을 유지한다. 전투 모듈 분리는 UI 리빌드가 안정화된 뒤 별도 작업으로 진행한다.

## 12. 단계별 실행 계획

### Phase 1 — 전체 구조 설계

- 정보 구조, 화면 책임, 전투 경계 확정
- 보존 자산과 회귀 기준 확정
- 상태와 라우팅 계약 정의

완료 조건: 사용자 최종 요구사항이 정보 구조, 상태, 전투 경계와 구현 순서에 반영되어 있다.

### Phase 2 — UI/UX 리빌드

1. 디자인 토큰과 모바일 앱 프레임 구축
2. 공통 상단 바, 하단 내비게이션, 모달/토스트 구축
3. 홈, 성장, 편성, 소환, 상점, 미션, 스테이지, 결과 화면의 정적 UI 구축
4. ScreenManager로 화면 전환 통합
5. 기존 전투를 BattleAdapter로 연결
6. 360px, 390px, 430px 너비와 데스크톱 미리보기 검증

완료 조건:

- 모든 목표 화면을 터치로 왕복할 수 있다.
- 준비 중 기능은 비활성 상태와 안내가 명확하다.
- 전투 시작, 병사 소환, 웨이브, 승패, 재시작이 기존과 동일하게 동작한다.
- 보존 대상 병사 및 성 이미지가 그대로 표시된다.
- 가로 스크롤과 핵심 버튼 겹침이 없다.

### Phase 3 — 기능 추가

권장 우선순위:

1. 결과/보상과 진행도 저장
2. 전투 골드를 신력으로 교체하고 자동 회복 연결
3. 편성 저장과 소환 가능 병사 반영
4. 신 목록, 상세, 5칸 승급, 레벨 상한
5. 소환과 보유 신 반영
6. 미션과 보상 수령
7. 상점과 재화 사용
8. 신 스킬, 자동 전투, 배속

각 기능은 `데이터 → 시스템 → UI 이벤트 → 저장 → 테스트` 단위로 하나씩 완결한다.

## 13. 회귀 테스트 기준

Phase 2 전후에 아래 항목이 같아야 한다.

- Stage 1~3 선택과 잠금 해제
- 방패병/궁수 소환 비용과 최대 소환 수
- 유닛 이동, 공격, 투사체, 사망 처리
- 적 스폰 수와 웨이브 전환
- 플레이어/적 성 체력과 승패 판정
- 전투 재시작
- 진행도 localStorage 저장
- 기존 4개 보존 이미지의 로드 성공

Phase 3 신력 전환 시에는 기존 소환 비용의 밸런스 값을 초기 신력/회복 속도에 맞게 별도 보정하고, 회귀 기준을 골드가 아닌 신력 소비로 갱신한다.

## 14. 확정 보상 흐름

승리 결과 화면의 최소 계약은 다음과 같다.

```text
Victory
골드 +2500
병사 조각 +20
신의 정수 +5
[확인]
```

확인을 누른 시점에 보상 지급을 한 번만 확정하고 메인 로비로 돌아간다. 중복 클릭이나 화면 재진입으로 보상이 중복 지급되지 않도록 결과에 고유 식별자와 수령 상태를 둔다.
