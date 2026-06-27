# 신화창조 (Gods of Olympus) 리빌드 구조 설계

상태: Phase 1 설계 완료  
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

## 3. 목표 정보 구조

모바일 세로 화면을 기본으로 하되 전투는 기존 16:9 Canvas 비율을 유지한다.

```text
앱
├─ 시작
│  └─ 타이틀 / 로딩
├─ 메인 셸
│  ├─ 홈(로비)
│  ├─ 신
│  │  ├─ 보유 목록
│  │  └─ 상세 / 성장
│  ├─ 편성
│  ├─ 소환
│  └─ 상점
├─ 보조 화면
│  ├─ 미션
│  ├─ 우편함
│  ├─ 설정
│  └─ 재화 상세
└─ 전투 흐름
   └─ 스테이지 선택 → 출전 편성 → 전투 → 결과 / 보상 → 홈
```

### 공통 모바일 RPG 셸

- 상단 바: 플레이어 정보, 골드, 프리미엄 재화, 설정
- 콘텐츠 영역: 현재 화면의 고유 콘텐츠
- 하단 내비게이션: 홈, 신, 편성, 소환, 상점
- 플로팅 진입점: 미션과 우편함
- 모달 레이어: 확인, 재화 부족, 확률 안내, 보상 상세
- 토스트 레이어: 짧은 상태 안내

전투 화면에서는 메인 셸을 숨기고 전투 HUD만 사용한다.

## 4. 화면 책임

| 화면 | Phase 2 책임 | Phase 3 이후 책임 |
|---|---|---|
| 타이틀 | 브랜드, 시작 진입 | 세이브 로드, 공지 |
| 홈 | 대표 신, 진행도, 전투 진입, 메뉴 | 수령 가능 상태, 라이브 배너 |
| 신 | 카드 목록과 상세 레이아웃 | 레벨업, 진화, 스킬 |
| 편성 | 신/병사 슬롯 편집 UI | 전투력 계산, 편성 저장 |
| 소환 | 배너, 확률, 1/10회 버튼 UI | 재화 차감, 천장, 결과 반영 |
| 상점 | 탭과 상품 카드 UI | 구매, 재고, 결제 |
| 미션 | 탭과 미션 목록 UI | 진행도, 보상 수령 |
| 스테이지 | 챕터와 스테이지 선택 | 해금 조건, 소모 재화 |
| 전투 | 기존 Canvas + 모바일 HUD | 신 스킬, 배속, 자동 전투 |
| 결과 | 승패와 보상 레이아웃 | 보상 지급, 다음 스테이지 |

## 5. 코드 경계

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

### 교체 영역

- 화면마다 흩어진 `showLobby()`, `showShop()` 형태의 직접 전환
- 화면 고유 스타일이 뒤섞인 단일 CSS 구조
- 픽셀디펜스/기사왕국/황야 상점처럼 혼재된 명칭과 시각 테마
- 준비 중 안내만 있는 메뉴
- 전투 외부의 데스크톱 중심 레이아웃

### 어댑터 경계

UI는 아래 명령만 전투에 전달한다.

```js
BattleAdapter.start({ stageId, formation });
BattleAdapter.summon("guard");
BattleAdapter.summon("archer");
BattleAdapter.restart();
BattleAdapter.exit();
```

전투는 아래 스냅샷과 이벤트만 UI에 제공한다.

```js
BattleAdapter.getSnapshot();
// stage, wave, gold, unitCount, playerHp, enemyHp, running, result

Events.emit("battle:updated", snapshot);
Events.emit("battle:ended", { result, stageId });
```

Phase 2에서는 기존 함수를 감싸는 얇은 어댑터만 사용한다. 전투 코드를 새로운 상태 구조로 대규모 이전하지 않는다.

## 6. 상태 모델

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

## 7. 화면 전환 규칙

화면 식별자는 DOM id가 아닌 route 이름을 사용한다.

```text
title
home
gods
formation
summon
shop
missions
stage-select
battle
result
```

- 하단 내비게이션 이동은 스택을 쌓지 않는다.
- 상세, 미션, 스테이지 선택은 이전 화면으로 돌아갈 수 있다.
- 전투 진입 시 중복 입력을 막고 전환 중 상태를 둔다.
- 전투 종료 시 `result`를 거친 뒤 홈 또는 다음 스테이지로 이동한다.
- 브라우저 뒤로 가기는 활성 모달 → 보조 화면 → 홈 순서로 처리한다.

## 8. 권장 파일 구조

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
  gods-screen.js
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

## 9. 단계별 실행 계획

### Phase 1 — 전체 구조 설계

- 정보 구조, 화면 책임, 전투 경계 확정
- 보존 자산과 회귀 기준 확정
- 상태와 라우팅 계약 정의

완료 조건: 이 문서가 승인되고 추가 최종 요구사항이 반영되어 있다.

### Phase 2 — UI/UX 리빌드

1. 디자인 토큰과 모바일 앱 프레임 구축
2. 공통 상단 바, 하단 내비게이션, 모달/토스트 구축
3. 홈, 신, 편성, 소환, 상점, 미션, 스테이지, 결과 화면의 정적 UI 구축
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
2. 편성 저장과 전투 반영
3. 신 목록, 상세, 성장
4. 소환과 보유 신 반영
5. 미션과 보상 수령
6. 상점과 재화 사용
7. 신 스킬, 자동 전투, 배속

각 기능은 `데이터 → 시스템 → UI 이벤트 → 저장 → 테스트` 단위로 하나씩 완결한다.

## 10. 회귀 테스트 기준

Phase 2 전후에 아래 항목이 같아야 한다.

- Stage 1~3 선택과 잠금 해제
- 방패병/궁수 소환 비용과 최대 소환 수
- 유닛 이동, 공격, 투사체, 사망 처리
- 적 스폰 수와 웨이브 전환
- 플레이어/적 성 체력과 승패 판정
- 전투 재시작
- 진행도 localStorage 저장
- 기존 4개 보존 이미지의 로드 성공

## 11. 현재 확인이 필요한 입력

사용자 메시지는 “아래는 최종 목표입니다.”에서 끝나 있어 이후 상세 목표가 전달되지 않았다. Phase 2 착수 전 해당 내용을 이 문서의 화면 목록, 시각 방향, 기능 우선순위에 반영해야 한다.
