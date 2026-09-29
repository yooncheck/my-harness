# 03. 산출물

> R4에서 확정했고, 1차 리뷰 뒤에 고쳤어요. 단계는 [02-pipeline.md](02-pipeline.md)를 따라요.

## 실행 폴더

실행할 때마다 `runs/<YYYYMMDD-HHMM>/` 폴더를 하나 만들어요.

| 단계 | 파일 | 만드는 쪽 | 형식 |
|---|---|---|---|
| S1 | `s1/research.md` | `researcher` | 레퍼런스 링크 목록 + 반영 포인트 |
| S2 | `s2/<화면>/spec.md` | `spec-writer` | 화면 설계(구성 요소, 상태) |
| S2 | `s2/<화면>/copy.json` | `spec-writer` | 화면에 보이는 문구만 `["…", "…"]`. G2는 이 파일만 검사해요. |
| S3 | `s3/keyscreen.json` | `keyscreen-designer` | 화면별 Figma 프레임 ID |
| S3 | `s3/approval.json` | 오케스트레이터 | `{approved, by, at, reason}` |
| S4 | `s4/<화면>/build.md` | `builder` | 작업 요약 + 프레임 ID. **판정에는 쓰지 않아요.** |
| E | `evidence/s3.json`, `evidence/s4.json` | `extractor` | Figma에서 직접 뽑은 판정 증거 |
| G | `gates/g1.json` … `gates/g5.json` | 판정 스크립트 | `{violations: [{rule, node_id, screen, detail}], count, pass}` |
| — | `state.json` | 오케스트레이터 | `{stage, screens: [...], retries: {S1:0, S2:0, S3:0, S4:0}, figma_file_key}`. `screens`는 판정 스크립트가 읽어요. |

## 판정 증거 (`evidence/*.json`)

- `extractor`는 에이전트가 쓴 코드가 아니라 **고정 추출 스크립트** `harness/scripts/extract-figma.js`를 Figma MCP로 실행해요.
- 필요한 필드만 뽑아요. 노드 JSON 전체를 남기지 않아요.
  - `id`, `name`, `type`, `parent_id`, `x`, `y`, `width`, `height`, `visible`
  - `fills`(단색·그라디언트, 투명도 포함), `strokes`, `cornerRadius`, `effects`
  - 텍스트 노드는 `characters`, `fontFamily`, `fontWeight`, `fontSize`, `lineHeight`(단위 포함), `letterSpacing`(단위 포함)
  - auto-layout은 `itemSpacing`, `padding*`
- `extractor`는 작업 에이전트가 알려 주는 프레임 ID를 받지 않아요. run 페이지(`run-<id>`)의 **최상위 프레임을 전부** 직접 찾아서 뽑아요.
- 증거에는 `extracted_at`, 페이지 ID, 뽑은 프레임 ID 목록을 적어요.
- 판정 스크립트는 먼저 증거의 프레임 집합과 `s3/keyscreen.json`의 프레임 집합이 **양방향으로 같은지** 확인해요. 빠진 프레임이나 신고하지 않은 프레임이 있으면 실패예요.

## 규칙 원본 (SSOT)

- 규칙의 원본은 **[design.md](../docs/design.md)** 하나예요.
- 토큰과 게이트 값은 모두 design.md frontmatter에 있어요.
- 판정 스크립트는 design.md frontmatter만 읽어요. 다른 곳에 규칙 값을 복사하지 않아요.

## 이어서 하기

- 다시 실행하면 `state.json`을 읽고, 마지막으로 통과한 단계의 다음 단계부터 시작해요.

## Figma

- Figma 파일은 **1개**만 써요. 실행할 때마다 **페이지 1개**(`run-<YYYYMMDD-HHMM>`)를 만들어요.
- 파일은 첫 실행 때 새로 만들고, 파일 키를 `runs/config.json`에 저장해요. (`harness/`는 실행 중 쓰기가 막혀 있어서 `runs/`에 둬요.)

## 저장소 공통 파일

| 파일 | 만드는 쪽 | 내용 |
|---|---|---|
| `runs/config.json` | 오케스트레이터 | Figma 파일 키 |
| `runs/guard-log.jsonl` | 가드 훅 | 막힌 도구 호출 기록 `{at, agent, tool, msg}` |
