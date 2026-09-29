---
version: 0.1
name: To focus
reference: ElevenLabs (npx getdesign@latest add elevenlabs)
description: 오프화이트 캔버스 위에 따뜻한 먹색 잉크, 가는 세리프 디스플레이와 Inter 본문, 파스텔 그라디언트 오브를 유일한 색 포인트로 쓰는 에디토리얼 톤의 디자인 시스템.

colors:
  primary: "#292524"
  primary-active: "#0c0a09"
  ink: "#0c0a09"
  body: "#4e4e4e"
  muted: "#777169"
  muted-soft: "#a8a29e"
  hairline: "#e7e5e4"
  hairline-strong: "#d6d3d1"
  canvas: "#f5f5f5"
  canvas-soft: "#fafafa"
  surface-card: "#ffffff"
  surface-strong: "#f0efed"
  surface-dark: "#0c0a09"
  surface-dark-elevated: "#1c1917"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  on-dark-soft: "#a8a29e"
  gradient-mint: "#a7e5d3"
  gradient-peach: "#f4c5a8"
  gradient-lavender: "#c8b8e0"
  gradient-sky: "#a8c8e8"
  gradient-rose: "#e8b8c4"
  semantic-error: "#dc2626"
  semantic-success: "#16a34a"

typography:
  display-xl: { fontFamily: display, fontSize: 48px, fontWeight: 300, lineHeight: 1.08, letterSpacing: -0.96px }
  display-lg: { fontFamily: display, fontSize: 36px, fontWeight: 300, lineHeight: 1.17, letterSpacing: -0.36px }
  display-md: { fontFamily: display, fontSize: 32px, fontWeight: 300, lineHeight: 1.13, letterSpacing: -0.32px }
  display-sm: { fontFamily: display, fontSize: 24px, fontWeight: 300, lineHeight: 1.2, letterSpacing: 0 }
  title-md: { fontFamily: sans, fontSize: 20px, fontWeight: 500, lineHeight: 1.35 }
  title-sm: { fontFamily: sans, fontSize: 18px, fontWeight: 500, lineHeight: 1.44 }
  body-md: { fontFamily: sans, fontSize: 16px, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0.16px }
  body-strong: { fontFamily: sans, fontSize: 16px, fontWeight: 500, lineHeight: 1.5, letterSpacing: 0.16px }
  body-sm: { fontFamily: sans, fontSize: 15px, fontWeight: 400, lineHeight: 1.47 }
  caption: { fontFamily: sans, fontSize: 14px, fontWeight: 400, lineHeight: 1.5 }
  label: { fontFamily: sans, fontSize: 12px, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0.96px, textTransform: uppercase }
  button: { fontFamily: sans, fontSize: 15px, fontWeight: 500, lineHeight: 1.0 }

spacing: { xxs: 4px, xs: 8px, sm: 12px, base: 16px, md: 20px, lg: 24px, xl: 32px, xxl: 48px, section: 96px }

rounded: { none: 0px, xs: 4px, sm: 6px, md: 8px, lg: 12px, xl: 16px, xxl: 24px, pill: 9999px }

frame: { baseline: 390x844, min-width: 360px, touch-min: 44px }

# 매체별 서체. Figma MCP는 로컬 서체(Pretendard)를 쓸 수 없어서 Figma용을 따로 둬요. (harness/07-verification.md P1)
fonts:
  web: { display: ["EB Garamond", "Noto Serif KR"], sans: ["Inter", "Pretendard"] }
  figma: { display-ko: "Noto Serif KR", display-en: "Cormorant Garamond", sans: "Inter" }
  figma-styles: { display: "Light", sans-400: "Regular", sans-500: "Medium", sans-600: "Semi Bold" }

# 판정 스크립트가 읽는 게이트 값 (harness/04-gates.md 참고)
gates:
  s1:
    min-refs-per-screen: 3
    ref-url-domain: uibowl.io
    min-points-per-screen: 2
    min-refs-cited-per-point: 1
  s3:
    frame: { width: 390, height: 844 }
    keyscreen-count: input
    approval: { approved: true, by: non-empty }
    # 승인 요청 전에 G5 규칙을 미리 검사해요. 토큰·컴포넌트는 S4에서 만들기 때문에 typography·spacing은 빼요.
    precheck-rules: [default-name, font-family, cta-single, color, orb, display-weight, pill, radius, shadow, divider, side-padding, overflow, touch, video-ratio, svc-focus-task, svc-focus-words, svc-home-start, svc-banned-words, svc-banned-colors, svc-goal-hint, svc-recap-goal]
  evidence:
    source: run-page-top-level-frames
    must-match: s3-keyscreen
  s5:
    extra-colors: ["rgba(115,115,115,0.56)"]
    gradient-node-prefix: "orb/"
    display-fonts: ["Noto Serif KR", "Cormorant Garamond"]
    fonts-allowed: ["Noto Serif KR", "Cormorant Garamond", "Inter"]
    display-weight: 300
    pill-node-prefixes: ["button-", "badge"]
    pill-radius: 9999
    radius-allowed: [0, 4, 6, 8, 12, 16, 24, 9999]
    shadow-allowed: ["0 4px 16px rgba(0,0,0,0.04)"]
    spacing-allowed: [0, 4, 8, 10, 12, 16, 20, 24, 32, 48, 96]  # 10은 button-primary 10×20, badge 4×10 패딩용
    divider: { max-height: 1, min-width-ratio: 0.8, except-inside: ["list-row"] }
    side-padding: 16
    layout-exempt-prefixes: ["video/", "orb/"]
    default-name-pattern: "^(Frame|Rectangle|Group|Ellipse|Text|Vector|Line|Polygon|Star|Image|Component|Instance)( \\d+)?$"
    max-primary-per-frame: 1
    touch-min: 44
    touch-node-prefixes: ["button-", "tap/"]
    touch-exempt: ["button-primary"]
    video-node-prefix: "video/"
    video-ratio: [9, 16]
    video-ratio-tolerance-px: 1
  service:
    focus-frame: "수행"
    focus-task-node: "task-item"
    focus-task-count: 1
    focus-banned-patterns: ["남은", "\\d+개", "다시 찍기", "재촬영", "편집"]
    home-frame: "홈"
    home-start-label: "시작"
    banned-words: ["실패", "놓침", "스트릭", "연속"]
    banned-colors: ["#dc2626"]
    goal-hint: { frame: "목표 설정", node: "hint/present-tense", min: 1 }
    recap-goal: { frame: "결산", node: "goal-sentence", position: first-text }
---

# To focus Design System

## 1. 개요

> To focus : 성장하고 싶어하는 사람이 스스로 정한 목표를 위해 작은 성취부터 시작하여 자신의 발걸음을 믿게하는 서비스에요. 주로 20대 후반~30대 초반 여성, 열심히 자기계발을 하면 살아왔지만 스스로를 채운다는 느낌보다는 소진되고 바쁘게 살지만 나의 목표를 위해 나아간다는 느낌은 안 드는데 힘들어서 책이라도 꾸역꾸역 읽는 직장인 or 번아웃 퇴사자를 위한 서비스입니다.

To focus는 **조용한 에디토리얼 매거진** 같은 인상을 목표로 해요. 화려한 색 대신 여백, 가는 디스플레이 서체, 은은한 파스텔 그라디언트로 브랜드를 표현해요.

**핵심 특징**
- 오프화이트 캔버스(`#f5f5f5`) 위에 따뜻한 먹색 잉크(`#0c0a09`)를 써요.
- 채도 높은 강조색이 없어요. 주요 액션은 먹색 알약(pill) 버튼 하나뿐이에요.
- 디스플레이는 굵기 300의 가는 세리프, 본문은 Inter/Pretendard 400·500을 써요.
- 파스텔 그라디언트 오브(민트·피치·라벤더·스카이·로즈)가 유일한 "색" 포인트예요.
- 섹션 사이 96px의 넉넉한 여백으로 인쇄물 같은 리듬을 만들어요.

## 2. 컬러

### 액션
| 토큰 | 값 | 용도 |
|---|---|---|
| `primary` | #292524 | 주요 CTA 알약 버튼. 아껴서 써요. |
| `primary-active` | #0c0a09 | 눌림 상태 |

### 배경·표면
| 토큰 | 값 | 용도 |
|---|---|---|
| `canvas` | #f5f5f5 | 기본 페이지 배경 |
| `canvas-soft` | #fafafa | 교차 섹션, 그라디언트 카드 배경 |
| `surface-card` | #ffffff | 카드 |
| `surface-strong` | #f0efed | 배지, 아이콘 원형 배경 |
| `surface-dark` | #0c0a09 | 다크 히어로/강조 카드 |
| `surface-dark-elevated` | #1c1917 | 다크 배경 위 카드 |

### 텍스트
| 토큰 | 값 | 용도 |
|---|---|---|
| `ink` | #0c0a09 | 제목, 주요 텍스트 |
| `body` | #4e4e4e | 본문 |
| `muted` | #777169 | 보조 설명 |
| `muted-soft` | #a8a29e | 비활성 텍스트 |
| `on-primary` / `on-dark` | #ffffff | 먹색·다크 배경 위 텍스트 |

### 구분선
`hairline` #e7e5e4 (기본 1px) · `hairline-strong` #d6d3d1 (입력창·아웃라인 버튼 테두리)

### 그라디언트 오브 (시그니처)
`gradient-mint` #a7e5d3 · `gradient-peach` #f4c5a8 · `gradient-lavender` #c8b8e0 · `gradient-sky` #a8c8e8 · `gradient-rose` #e8b8c4

부드러운 radial-gradient 배경 장식으로만 써요. 버튼 채우기나 텍스트 색으로는 쓰지 않아요.

### 시맨틱
`semantic-success` #16a34a · `semantic-error` #dc2626

## 3. 타이포그래피

### 서체
- **Display**: Waldenburg Light(300)가 원본이지만 라이선스 서체예요. 대체로 **EB Garamond 300**을 쓰고, 한글 제목은 **Noto Serif KR 300**으로 맞춰요.
- **Sans**: 영문은 **Inter**, 한글은 **Pretendard**를 써요. 굵기는 400·500만 써요.
  - 대체 서체: `Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`
  - 웹에서는 Pretendard Variable을 불러와요. Figma에서는 가변 폰트 대신 고정 굵기 서체를 써요.

### Figma 작업용 서체
Figma MCP(하네스)는 로컬에 설치된 서체를 쓸 수 없어요. 그래서 Pretendard는 Figma에서 쓸 수 없고, EB Garamond에는 Light(300) 굵기가 없어요. Figma에서는 아래 서체를 써요. 웹 코드는 위 서체를 그대로 써요.

| 역할 | 웹 | Figma |
|---|---|---|
| 디스플레이 (한글) | Noto Serif KR 300 | **Noto Serif KR** Light |
| 디스플레이 (영문) | EB Garamond 300 | **Cormorant Garamond** Light |
| Sans | Inter / Pretendard | **Inter** (Regular 400 · Medium 500 · Semi Bold 600) |

### 위계
| 토큰 | 크기 | 굵기 | 행간 | 자간 | 용도 |
|---|---|---|---|---|---|
| `display-xl` | 48px | 300 | 1.08 | -0.96px | 히어로 제목 |
| `display-lg` | 36px | 300 | 1.17 | -0.36px | 섹션 제목 |
| `display-md` | 32px | 300 | 1.13 | -0.32px | 하위 섹션 제목 |
| `display-sm` | 24px | 300 | 1.2 | 0 | 카드 그룹 제목 |
| `title-md` | 20px | 500 | 1.35 | 0 | 컴포넌트 제목 |
| `title-sm` | 18px | 500 | 1.44 | 0 | 리스트 라벨 |
| `body-md` | 16px | 400 | 1.5 | 0.16px | 기본 본문 |
| `body-strong` | 16px | 500 | 1.5 | 0.16px | 강조 본문 |
| `body-sm` | 15px | 400 | 1.47 | 0 | 푸터, 보조 본문 |
| `caption` | 14px | 400 | 1.5 | 0 | 캡션 |
| `label` | 12px | 600 | 1.4 | 0.96px | 섹션 라벨, 배지 (영문 대문자) |
| `button` | 15px | 500 | 1.0 | 0 | 버튼 |

### 원칙
- 디스플레이는 항상 굵기 300이에요. 굵게 만들지 않아요.
- 디스플레이는 자간을 좁히고(음수), 본문은 살짝 넓혀요(+0.16px).

## 4. 레이아웃·모양

### 화면 프레임
- 기준 프레임은 **390 × 844**예요. 모든 키스크린을 이 크기로 그려요.
- 최소 폭은 **360px**이에요. 가로 스크롤이 생기면 안 되고, 긴 텍스트는 줄바꿈해요.
- MVP는 모바일만 다뤄요. 아래 그리드의 데스크톱·태블릿 값은 MVP 이후에 적용해요.

### 터치 영역
- 모든 터치 요소는 최소 **44 × 44px**이에요. `button-primary`만 정해진 높이 40px을 따라요.
- 선택 컨트롤은 작은 점이 아니라 알약 전체를 누를 수 있어야 해요.

### 간격
4px 기본 단위: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 96`
- 섹션 사이: 96px (모바일 48px)
- 카드 사이: 16–24px
- 카드 안쪽 여백: 24–32px
- 섹션은 구분선 없이 여백만으로 나눠요.

### 그리드
- 최대 콘텐츠 폭 1200px, 12컬럼
- 카드 그리드: 데스크톱 3열 → 태블릿 2열 → 모바일 1열
- 모바일 좌우 여백 16px
- 여러 열 그리드는 가로로 흘려보내지 않고, 한 열씩 줄여서 접어요.

### 모서리
| 토큰 | 값 | 용도 |
|---|---|---|
| `none` | 0px | 전체 화면 미디어(결산 영상 재생 등) |
| `xs` | 4px | 인라인 태그 |
| `md` | 8px | 입력창 |
| `lg` | 12px | 작은 카드 |
| `xl` | 16px | 기본 카드, 영상 타일 |
| `xxl` | 24px | 그라디언트 오브 카드, 큰 미디어 카드 |
| `pill` | 9999px | 모든 버튼, 배지, 아바타 |

### 깊이
- 기본은 평면 + 1px `hairline` 테두리예요.
- 그림자는 한 단계만 써요: `0 4px 16px rgba(0,0,0,0.04)` (hover 카드, 선택된 세그먼트)
- 입체감은 그림자가 아니라 그라디언트 오브로 만들어요.

### 미디어 (2초 영상 · 결산 영상)
- 모든 크기에서 고정 비율을 유지해요. 늘리거나 줄이지 않고 잘라서 맞춰요.
- 2초 영상과 결산 영상은 **9:16 세로**예요.
- UI는 무채색과 그라디언트 오브만 써요. 채도는 사용자가 찍은 영상이 담당해요.

## 5. 컴포넌트

### 버튼
| 이름 | 스타일 |
|---|---|
| `button-primary` | 배경 `primary`, 글자 `on-primary`, 높이 40px, 패딩 10×20px, `pill` |
| `button-outline` | 투명 배경, 1px `hairline-strong` 테두리, 글자 `ink`, `pill` |
| `button-text` | 투명 배경, 글자 `ink`. "더보기" 같은 보조 동작에 써요. |

### 카드
| 이름 | 스타일 |
|---|---|
| `card` | 배경 `surface-card`, 1px `hairline`, `xl`(16px), 패딩 24px |
| `card-featured` | 배경 `surface-dark`, 글자 `on-dark`, 모양은 `card`와 같아요 |
| `gradient-orb-card` | 배경 `canvas-soft`, `xxl`(24px), 패딩 32px, 뒤에 그라디언트 오브 1개 |

### 입력·배지
| 이름 | 스타일 |
|---|---|
| `text-input` | 배경 `surface-card`, 1px `hairline-strong`, `md`(8px), 높이 44px, 좌우 패딩 16px(텍스트는 세로 가운데 정렬), 포커스 시 2px `ink` 테두리 |
| `badge` | 배경 `surface-strong`, `label` 서체, `pill`, 패딩 4×10px |
| `badge-overlay` | 영상·사진 위 라벨. 배경 `rgba(115, 115, 115, 0.56)`, 글자 `on-dark`, `label` 서체, `pill` |
| `segmented-control` | 월간/연간 결산 전환 등. 트랙·옵션 모두 `pill`, 트랙 배경 `surface-strong`. 선택된 옵션은 배경 `surface-card` + 글자 `ink` + 그림자 `0 4px 16px rgba(0,0,0,0.04)`, 선택 안 된 옵션은 글자 `muted` |

### 내비게이션
| 이름 | 스타일 |
|---|---|
| `top-nav` | 배경 `canvas`, 높이 64px, 좌측 로고 · 중앙 메뉴 · 우측 primary CTA |
| `list-row` | 투명 배경, 하단 1px `hairline`, 좌측 32px 원형 아이콘 + 텍스트, 세로 패딩 12px |

## 6. Do / Don't

### Do
- 주요 액션은 화면당 하나의 먹색 알약 버튼(`button-primary`)으로 표현해요.
- 제목은 굵기 300 세리프로, 여백을 넉넉히 두어 에디토리얼 톤을 지켜요.
- 색 포인트가 필요하면 파스텔 그라디언트 오브를 배경 장식으로 써요.

### Don't
- 채도 높은 강조색(형광, 원색 CTA 등)을 새로 들이지 않아요.
- 그라디언트 오브를 버튼 배경, 텍스트 색, 카드 채우기로 쓰지 않아요.
- 디스플레이 제목을 굵게 하거나, 버튼을 각진 모서리(0px)로 만들지 않아요.

## 7. 검토 체크리스트 (게이트)

작업 흐름([story-work.md](story-work.md))의 게이트에서 쓰는 체크리스트예요. 하나라도 어기면 게이트에서 걸리고 다음 단계로 넘어가지 않아요.

### 게이트 5 — 컨셉 시안 확정 전 사전 조건
- [ ] 키스크린 개수가 입력한 화면 수와 같아요(1~3개).
- [ ] 모든 키스크린이 390 × 844 프레임이에요.

### 게이트 7 — 디자인 가이드 위반 검토

**색상**
- [ ] 주요 CTA는 `primary` 배경 + `on-primary` 글자의 알약 버튼이고, 한 화면에 하나뿐이에요.
- [ ] 채도 높은 강조색(형광, 원색 CTA 등)이 없어요.
- [ ] 그라디언트 오브는 배경 장식으로만 쓰였어요.
- [ ] 이 문서의 토큰에 없는 색 값이 없어요(`badge-overlay`의 rgba 값만 예외예요).

**타이포그래피**
- [ ] 디스플레이 제목은 굵기 300이에요.
- [ ] 서체·크기·행간·자간이 타이포 토큰 중 하나와 일치해요.
- [ ] Sans에 대체 서체가 지정돼 있어요.

**모양·깊이**
- [ ] 버튼·배지는 모두 `pill`이에요.
- [ ] 모서리 값은 모서리 토큰만 써요.
- [ ] 그림자는 `0 4px 16px rgba(0,0,0,0.04)` 하나뿐이고, hover 카드와 선택된 세그먼트에만 쓰였어요.
- [ ] 섹션 사이에 구분선이 없어요.

**간격·레이아웃**
- [ ] 간격은 간격 토큰에 있는 값과 버튼·배지 패딩용 10px만 써요.
- [ ] 좌우 여백이 16px이에요.
- [ ] 360px 폭에서 가로 스크롤이 없고, 긴 텍스트가 줄바꿈돼요.
- [ ] `button-primary`를 뺀 모든 터치 요소가 44 × 44px 이상이에요.

**컴포넌트·미디어**
- [ ] 입력창은 `text-input` 규칙을 따라요.
- [ ] 영상·사진 위 라벨은 `badge-overlay`를 써요.
- [ ] 세그먼트 토글은 `segmented-control` 규칙을 따라요.
- [ ] 영상과 이미지가 고정 비율을 유지하고, 늘리거나 줄이지 않고 잘라서 맞춰요.
- [ ] 2초 영상과 결산 영상은 9:16이에요.
