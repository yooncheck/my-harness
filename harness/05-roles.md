# 05. 역할

> R6에서 확정했고, 1차 리뷰 뒤에 고쳤어요. 단계는 [02-pipeline.md](02-pipeline.md), 게이트는 [04-gates.md](04-gates.md)를 따라요.

## 작업 에이전트

각 에이전트는 **자기 편집 폴더 1개**만 고쳐요.

| 에이전트 | 단계 | 편집 폴더 | 외부 도구 | 읽는 문서 | 모델 |
|---|---|---|---|---|---|
| `researcher` | S1 | `runs/<id>/s1/` | uibowl MCP (읽기) | prd.md 5번 | sonnet |
| `spec-writer` ×화면 | S2 | `runs/<id>/s2/<화면>/` | 없음 | prd.md, story-service.md, `s1/research.md` | sonnet |
| `keyscreen-designer` | S3 | `runs/<id>/s3/` | Figma MCP (해당 run 페이지만) | design.md, `s2/*` | opus |
| `builder` ×화면 | S4 | `runs/<id>/s4/<화면>/` | Figma MCP (자기 화면 프레임만) | design.md, 04-gates.md 이름 규칙 | opus |

- 모든 에이전트에게 **읽기 전용**인 파일: `docs/`(prd, design, story-service, story-work), `harness/`
- 에이전트는 표의 "읽는 문서"만 읽어요. 모든 문서를 통째로 불러오지 않아요.

## 판정 쪽 (작업 에이전트와 분리)

| 에이전트 | 편집 폴더 | 도구 | 하는 일 | 모델 |
|---|---|---|---|---|
| `extractor` | `runs/<id>/evidence/` | Figma MCP. 고정 스크립트 `harness/scripts/extract-figma.js` 실행만 | run 페이지의 최상위 프레임을 전부 직접 찾아 판정 증거를 뽑아요. 프레임 ID를 입력으로 받지 않아요. | haiku |
| `judge` | 없음 (쓰기 금지) | Read, Bash(`harness/scripts/g*.mjs` 실행만) | 판정 스크립트를 돌리고 결과를 보고해요 | haiku |

- 판정 결과는 스크립트가 `runs/<id>/gates/g1.json` … `g5.json`에 써요.
- `harness/scripts/`는 어떤 에이전트도 고칠 수 없어요.
- 작업 에이전트가 만든 파일은 판정 증거로 쓰지 않아요.

## 자연어 트리거

| 말 | 동작 |
|---|---|
| "화면 만들어줘: 홈, 수행" | 새 실행을 시작해요 (화면 1~3개). |
| "이어서 해줘" | 가장 최근 실행을 `state.json` 기준으로 이어서 해요. |
| "승인" / "승인: <이름>" | `s3/approval.json`에 승인을 기록해요. `by`는 이름이 없으면 `designer`예요. |
| "거절: <사유>" | `s3/approval.json`에 거절을 기록하고 S2로 돌아가요. |
| "판정만 다시 해줘" | E → S5 판정만 다시 돌려요. |
