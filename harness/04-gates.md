# 04. 게이트

> R5에서 확정했고, 1차 리뷰 뒤에 고쳤어요. 게이트 값의 원본은 [design.md](../docs/design.md) frontmatter의 `gates:` 블록이에요. 이 문서는 그 값이 무엇을 뜻하는지 설명해요.

## 게이트 한눈에 보기

| 게이트 | 단계 | 판정 | 읽는 파일 | 실패하면 |
|---|---|---|---|---|
| G1 | S1 research | 스크립트 | `s1/research.md` | S1 다시 |
| G2 | S2 spec | 스크립트 | `s2/<화면>/copy.json` | 위반 화면만 S2 다시 |
| G3 | S3 keyscreen | 스크립트 + **사람 승인** | `evidence/s3.json`, `s3/approval.json` | S2로 |
| G5 | S5 review | 스크립트 | `evidence/s4.json` | 위반 노드만 S4 다시 |

- G3과 G5는 **증거 무결성**부터 확인해요(`gates.evidence`).
  - 증거는 `extractor`가 run 페이지의 최상위 프레임을 전부 직접 뽑은 거예요.
  - 증거의 프레임 집합과 `s3/keyscreen.json`의 프레임 집합이 양방향으로 같아야 해요.
  - 다르면 판정하지 않고 실패예요.
- 같은 단계는 최대 2회까지 다시 해요. 3회째 실패하면 멈추고 실행자에게 물어요.

## G1 — 반영 포인트 선정 (`gates.s1`)

- [ ] 대상 화면마다 레퍼런스가 3개 이상이고, 모두 `uibowl.io` 링크예요.
- [ ] 대상 화면마다 반영 포인트가 2개 이상이에요.
- [ ] 반영 포인트마다 레퍼런스 링크를 1개 이상 인용해요.

## G2 — 화면 문구 (`gates.service`) ★

설계 문서 본문이 아니라 **`copy.json`(화면에 보이는 문구)만** 검사해요.
- [ ] 모든 화면 문구에 `실패`·`놓침`·`스트릭`·`연속`이 0건이에요.
- [ ] `수행` 화면 문구에 `남은`, `N개`, `다시 찍기`, `재촬영`, `편집`이 0건이에요.

## G3 — 시안 확정 (`gates.s3`) · 사람 승인 지점

**1단계 — 스크립트 (승인 요청 전)**
- [ ] 키스크린 개수가 입력한 화면 수와 같아요.
- [ ] 모든 키스크린 프레임이 390 × 844예요.
- [ ] **G5 규칙 미리 검사**: `gates.s3.precheck-rules`에 있는 규칙 ID(아래 G5 표)를 모두 통과해요.
  - `typography`와 `spacing`은 빼요. 토큰과 컴포넌트는 S4에서 만들어요([story-work.md](../docs/story-work.md) 6번).
  - 실패하면 사람에게 승인을 요청하지 않고 S3을 다시 해요.

**2단계 — 사람 승인**
- [ ] `approved == true`이고 `by`가 비어 있지 않아요.

이렇게 하면 사람은 규칙 위반이 없는 시안만 보고 승인해요.

## G5 — 디자인 가이드 위반 검토 (`gates.s5`, `gates.service`)

### 이름 규칙 강제
| ID | 규칙 | 조건 |
|---|---|---|
| `default-name` | 기본 이름 금지 | 화면 프레임 아래 노드 중 이름이 Figma 기본값(`Frame 12`, `Rectangle 3` 등)인 노드 = 0 |

이름 규칙이 강제되기 때문에, 이름으로 노드를 찾는 아래 검사를 이름을 안 붙이는 방식으로 피해 갈 수 없어요.

### design.md 규칙

| ID | 규칙 | 조건 |
|---|---|---|
| `cta-single` | CTA 하나 | 프레임마다 `button-primary` 노드 수 ≤ 1 |
| `color` | 색 | 모든 단색 채우기·선 색 ∈ `colors` 토큰 + `rgba(115,115,115,0.56)` |
| `orb` | 오브 | 그라디언트 채우기는 `orb/` 노드에만 있음 |
| `font-family` | Figma 서체 | 모든 텍스트의 서체 ∈ {Noto Serif KR, Cormorant Garamond, Inter} (`gates.s5.fonts-allowed`) |
| `display-weight` | 디스플레이 굵기 | Noto Serif KR·Cormorant Garamond 텍스트의 굵기 = 300 |
| `typography` | 타이포 | 모든 텍스트의 (크기, 굵기, 행간, 자간) ∈ `typography` 토큰. 행간은 배수로, 자간은 px로 환산해서 비교해요. *(G5만)* |
| `pill` | pill | `button-*`·`badge*` 노드의 모서리 = 9999 |
| `radius` | 모서리 | 모든 모서리 ∈ {0, 4, 6, 8, 12, 16, 24, 9999} |
| `shadow` | 그림자 | 그림자 = `0 4px 16px rgba(0,0,0,0.04)`만 |
| `divider` | 구분선 | 높이 ≤ 1px이고 폭 ≥ 프레임 80%인 노드 = 0 (`list-row` 안은 제외) |
| `spacing` | 간격 | auto-layout gap·padding ∈ {0, 4, 8, 10, 12, 16, 20, 24, 32, 48, 96} (10은 버튼·배지 패딩) *(G5만)* |
| `side-padding` | 좌우 여백 | 최상위 콘텐츠 노드의 x = 16 (`video/`·`orb/` 제외) |
| `overflow` | 가로 스크롤 | 모든 자식의 x + width ≤ 프레임 폭 (`video/`·`orb/` 제외) |
| `touch` | 터치 | `button-*`(primary 제외)·`tap/*` 노드의 폭·높이 ≥ 44 |
| `video-ratio` | 영상 | `video/*` 노드의 폭:높이 = 9:16 (±1px) |

### ★ 어기면 안 되는 것 ([story-service.md](../docs/story-service.md)) + PRD 합격선

| ID | 기준 | 조건 | 적용 화면 |
|---|---|---|---|
| `svc-focus-task` | 할 일 부담 금지 | `task-item` 노드 = 1개 | `수행` |
| `svc-focus-words` | | 텍스트에 `남은`, `N개`, `다시 찍기`, `재촬영`, `편집` = 0건 | `수행` |
| `svc-home-start` | | 텍스트가 "시작"인 `button-*` ≥ 1개, `visible = true` | `홈` |
| `svc-banned-words` | 못 한 날을 실패로 표시 금지 | 모든 텍스트에 `실패`·`놓침`·`스트릭`·`연속` = 0건 | 전체 |
| `svc-banned-colors` | | `#dc2626` 사용 = 0건 | 전체 |
| `svc-goal-hint` | 목표는 현재시제로 (PRD 6-2) | `hint/present-tense` 노드 ≥ 1개 | `목표 설정` |
| `svc-recap-goal` | 결산 첫 장면은 목표 문장 (PRD 6-2) | 텍스트 노드 중 y가 가장 작은 노드 = `goal-sentence` | `결산` |

적용 화면이 입력에 없으면 그 조건은 건너뛰어요.

### 값 정규화 (P1에서 확인)

| 값 | 증거 형식 | 비교 방법 |
|---|---|---|
| 색 | `{r,g,b}` 0~1 실수 + `opacity` | `round(x × 255)`로 hex로 바꿔요. 불투명도가 1이 아니면 rgba로 비교해요. |
| 행간 | `{unit: PERCENT \| PIXELS \| AUTO, value}` | PERCENT는 ÷100, PIXELS는 ÷fontSize로 바꿔 배수로 비교해요(±0.01). AUTO는 불일치예요. |
| 자간 | `{unit: PIXELS \| PERCENT, value}` | PERCENT는 ÷100×fontSize로 px로 바꿔 비교해요(±0.01px). |
| 크기·위치 | 실수 | ±0.5px |

## Figma 레이어 이름 규칙

| 접두어 / 이름 | 대상 |
|---|---|
| `button-primary`, `button-outline`, `button-text` | 버튼 |
| `badge`, `badge-overlay` | 배지 |
| `orb/…` | 그라디언트 오브 |
| `video/…` | 2초 영상·결산 영상 |
| `tap/…` | 버튼이 아닌 터치 요소 |
| `task-item` | 할 일 한 개 |
| `list-row` | 리스트 행 |
| `hint/present-tense` | 목표를 현재시제로 쓰도록 안내하는 문구 |
| `goal-sentence` | 결산 영상의 목표 문장 |
| `홈`, `목표 설정`, `할 일 설정`, `수행`, `결산` | 최상위 화면 프레임 |
| 그 밖 | 역할이 드러나는 이름. Figma 기본 이름은 금지예요. |
