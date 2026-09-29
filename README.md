# To focus 디자인 하네스

To focus 앱의 모바일 화면(390×844)을 Figma에 만드는 Claude Code 하네스예요.
화면 이름만 말하면 레퍼런스 조사부터 설계, 키스크린, 최종 디자인까지 서브에이전트가 단계별로 만들어요.
단계마다 판정 스크립트가 결과를 검사하고, 사람은 시안 승인 한 번만 해요.

## 준비물

- Claude Code (이 폴더를 작업 디렉터리로 열어요)
- Node.js (판정 스크립트 실행용)
- MCP 연결
  - **Figma**: 키스크린·최종 화면 편집, 증거 추출
  - **uibowl**: 레퍼런스 수집
- `runs/config.json`에 Figma 파일 키가 있어요.

  ```json
  { "figma_file_key": "<파일 키>" }
  ```

## 쓰는 법

Claude Code 세션에서 아래처럼 말하면 돼요. 메인 세션은 오케스트레이터로만 움직이고, 실제 작업은 서브에이전트가 해요.

| 말 | 동작 |
|---|---|
| `화면 만들어줘: 홈, 수행` | 새 run을 만들고 S1부터 시작해요. 화면은 1~3개예요. |
| `이어서 해줘` | 가장 최근 run의 `state.json`에서 이어서 해요. |
| `승인` / `승인: <이름>` | 키스크린을 승인하고 S4로 넘어가요. |
| `거절: <사유>` | 사유와 함께 S2로 돌아가요. |
| `판정만 다시 해줘` | 증거 추출과 G5 판정만 다시 돌려요. |

화면 이름은 `홈` · `목표 설정` · `할 일 설정` · `수행` · `결산` 중에서만 받아요.

## 진행 순서

```
S1 researcher            → G1
S2 spec-writer ×화면(병렬) → G2
S3 keyscreen-designer → extractor → G3 → 사람 승인
S4 builder ×화면(병렬)    → extractor → S5 judge(G5) → 완료
```

| 단계 | 에이전트 | 하는 일 | 결과 파일 |
|---|---|---|---|
| S1 | `researcher` | uibowl에서 레퍼런스를 모으고 반영 포인트를 정해요 | `s1/research.md` |
| S2 | `spec-writer` | 화면 설계와 화면 문구를 써요 | `s2/<화면>/spec.md`, `copy.json` |
| S3 | `keyscreen-designer` | Figma에 키스크린을 그려요 | `s3/keyscreen.json` |
| S4 | `builder` | 승인된 키스크린을 design.md 토큰대로 완성해요 | `s4/<화면>/build.md` |
| E | `extractor` | 고정 스크립트로 Figma에서 판정 증거를 뽑아요 | `evidence/s3.json`, `s4.json` |
| G | `judge` | 판정 스크립트를 돌려요 | `gates/g1~g5.json` |

**완료 기준**: 입력한 화면이 모두 390×844 프레임으로 Figma에 있고, G5 위반이 0건이고, 승인이 1회 기록되면 끝이에요.

## 게이트

판정은 `node harness/scripts/gN.mjs runs/<id>`의 종료 코드로 해요.
0 통과 · 1 실패 · 2 입력 오류이고, G3에만 3 승인 대기 · 4 거절이 더 있어요.

| 게이트 | 검사 내용 | 실패하면 |
|---|---|---|
| G1 | 화면마다 uibowl 레퍼런스 3개 이상, 반영 포인트 2개 이상 | S1 다시 |
| G2 | 화면 문구에 금지어(`실패`·`스트릭` 등)가 없어요 | 위반 화면만 S2 다시 |
| G3 | 키스크린 개수·크기, G5 규칙 미리 검사 → 사람 승인 | 스크립트 실패는 S3, 거절은 S2 |
| G5 | design.md 규칙 전체(색, 타이포, 간격, pill, 터치 크기 등)와 서비스 규칙 | 위반 노드만 S4 다시 |

- 규칙 값의 원본은 `docs/design.md` frontmatter의 `gates:`예요. 다른 곳에 복사하지 않아요.
- 판정 증거는 작업 에이전트의 보고가 아니라 `extractor`가 Figma에서 직접 뽑은 것만 써요.
- 같은 단계는 최대 2회까지 다시 하고, 3회째에는 멈추고 사람에게 물어요.
- 상세 조건은 [harness/04-gates.md](harness/04-gates.md)에 있어요.

## 폴더 구조

```
CLAUDE.md               오케스트레이터 규칙 (트리거, 순서, 금지)
docs/                   서비스 기준: prd, design(규칙 원본), story-service, story-work
harness/                하네스 설계 문서 01~07
harness/scripts/        판정 스크립트 g1·g2·g3·g5, extract-figma.js, test.mjs
.claude/agents/         서브에이전트 정의 6개
.claude/hooks/guard.mjs 권한 가드 (PreToolUse 훅)
runs/<YYYYMMDD-HHMM>/   run별 산출물과 state.json
runs/guard-log.jsonl    가드가 막은 호출 기록
```

Figma에는 run마다 `run-<id>` 페이지가 하나씩 생겨요. 각 에이전트는 그 run의 페이지만 건드려요.

## 가드와 유지보수

- `guard.mjs`는 에이전트마다 쓸 수 있는 폴더와 명령을 제한해요.
  - 예: `judge`는 `node harness/scripts/g*.mjs runs/<id>` 한 줄만 실행할 수 있어요. `cd … &&`처럼 붙이면 막혀요.
  - 막힌 호출은 `runs/guard-log.jsonl`에 남아요.
- `docs/`, `harness/`, `CLAUDE.md`, `.claude/`는 run 중에 고치지 않아요.
- 하네스를 고칠 때만 `touch .claude/maintenance`로 유지보수 모드를 켜고, 끝나면 `rm .claude/maintenance`로 꺼요.
- 판정 스크립트를 고쳤다면 `node harness/scripts/test.mjs`가 전부 통과해야 해요.

## 알아 둘 점

- **화면당 프레임은 1개예요.** 한 화면에 여러 상태가 있으면(예: `수행`의 시작 전·진행 중·촬영·완료) 상태마다 run을 따로 돌려요. G3·G5가 `button-primary` 1개, `task-item` 1개를 요구해서 여러 상태를 한 프레임에 넣을 수 없어요.
- **버튼 안 텍스트 레이어 이름**에 `button-`, `badge`, `tap/` 접두어를 쓰면 안 돼요. 게이트가 그 레이어를 버튼으로 보고 pill·터치 규칙을 적용해요. `label`처럼 이름을 붙여요.
- **결과는 run 페이지에 흩어져 있어요.** 최종 프레임을 공용 페이지 하나로 모으는 게시 단계(S6 `publisher`)는 아직 없어요. 추가하려면 유지보수 모드에서 CLAUDE.md, 에이전트, 가드, harness 문서를 함께 고쳐야 해요.
- Claude Code의 자동 권한 검사가 일시적으로 판정을 못 내리면 서브에이전트 호출이 거부될 수 있어요. 그때는 잠시 뒤 `이어서 해줘`나 `판정만 다시 해줘`로 다시 돌리면 돼요.

## 지금까지 만든 화면

| 화면 · 상태 | run |
|---|---|
| 수행 · 진행 중 | `20260929-2335` |
| 수행 · 시작 전 | `20260930-0026` |
| 수행 · 촬영 | `20260930-0027` |
| 수행 · 완료 | `20260930-0028` |

네 run 모두 G5 위반 0건이고 승인이 기록돼 있어요.
