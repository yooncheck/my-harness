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

rounded: { xs: 4px, sm: 6px, md: 8px, lg: 12px, xl: 16px, xxl: 24px, pill: 9999px }
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

### 간격
4px 기본 단위: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 96`
- 섹션 사이: 96px (모바일 48px)
- 카드 사이: 16–24px
- 카드 안쪽 여백: 24–32px

### 그리드
- 최대 콘텐츠 폭 1200px, 12컬럼
- 카드 그리드: 데스크톱 3열 → 태블릿 2열 → 모바일 1열
- 모바일 좌우 여백 16px

### 모서리
| 토큰 | 값 | 용도 |
|---|---|---|
| `xs` | 4px | 인라인 태그 |
| `md` | 8px | 입력창 |
| `lg` | 12px | 작은 카드 |
| `xl` | 16px | 기본 카드 |
| `xxl` | 24px | 그라디언트 오브 카드 |
| `pill` | 9999px | 모든 버튼, 배지, 아바타 |

### 깊이
- 기본은 평면 + 1px `hairline` 테두리예요.
- 그림자는 한 단계만 써요: `0 4px 16px rgba(0,0,0,0.04)` (hover 카드)
- 입체감은 그림자가 아니라 그라디언트 오브로 만들어요.

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
| `text-input` | 배경 `surface-card`, 1px `hairline-strong`, `md`(8px), 높이 44px, 포커스 시 2px `ink` 테두리 |
| `badge` | 배경 `surface-strong`, `label` 서체, `pill`, 패딩 4×10px |

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
