# 06. 오케스트레이터

> R7에서 확정했고, 1차 리뷰 뒤에 고쳤어요. 역할은 [05-roles.md](05-roles.md), 게이트는 [04-gates.md](04-gates.md)를 따라요.

## 구성

- 오케스트레이터는 메인 Claude Code 세션이에요. 루트의 **CLAUDE.md**를 읽고 동작해요.
- 서브에이전트 정의 파일은 `.claude/agents/`에 있어요.
  - 작업 에이전트 4개: `researcher.md` · `spec-writer.md` · `keyscreen-designer.md` · `builder.md`
  - 판정 쪽 2개: `extractor.md` · `judge.md`

## 오케스트레이터가 하는 일

1. 트리거를 해석해요.
2. `runs/<id>/`와 `state.json`을 만들고 갱신해요.
3. 단계 순서대로 에이전트를 불러요.
   - S2와 S4는 화면마다 하나씩 **동시에** 불러요.
   - Figma 단계(S3·S4)가 끝나면 `extractor`를 부르고, 그다음 `judge`를 불러요.
4. 판정 결과에 따라 다음 단계로 넘어가거나, 되돌아가거나, 멈춰요.
   - 되돌아갈 때는 **위반이 있는 화면만** 다시 해요.
5. 승인과 거절을 `s3/approval.json`에 기록해요.

## 오케스트레이터가 하지 않는 일

- 단계 작업(리서치, 설계, Figma 편집, 증거 추출)을 직접 하지 않아요.
- 판정 결과를 바꾸지 않아요.

## 상태 전이

| 현재 | 판정 | 다음 |
|---|---|---|
| S1 | G1 통과 | S2 |
| S1 | G1 실패 | S1 (retries.S1 + 1) |
| S2 | G2 통과 | S3 |
| S2 | G2 실패 | 위반 화면만 S2 (retries.S2 + 1) |
| S3 | E → G3 스크립트 통과 | 사람 승인 대기 |
| S3 | E → G3 스크립트 실패 | S3 (retries.S3 + 1) |
| 승인 대기 | 승인 | S4 |
| 승인 대기 | 거절 | S2 (retries.S2 + 1) |
| S4 | — | E → S5 |
| S5 | G5 통과 | **완료** |
| S5 | G5 실패 | 위반 노드만 S4 (retries.S4 + 1) |
| 어느 단계든 | retries ≥ 3 | **멈춤**. 실행자에게 물어요. |

## 강제 장치

| 장치 | 내용 |
|---|---|
| 서브에이전트 `tools` 제한 | `judge`는 Read와 Bash만 쓸 수 있고, Bash는 `harness/scripts/g*.mjs` 실행만 해요. `spec-writer`는 MCP를 쓰지 않아요. |
| PreToolUse 훅 (`.claude/settings.json`) | `docs/`, `harness/`, `CLAUDE.md`, `.claude/`에 대한 Write/Edit를 모두 막아요. |
| PreToolUse 훅 (`.claude/settings.json`) | 훅 입력의 `agent_type`(서브에이전트 이름)으로 에이전트를 식별해요. 자기 편집 폴더 밖에 Write/Edit하면 종료 코드 2로 막아요. 메인 세션(오케스트레이터)은 `agent_type`이 없어요. ([07](07-verification.md) P2에서 확인) |
| 증거 분리 | 판정 증거는 `extractor`만 만들어요. 작업 에이전트의 파일은 판정에 쓰지 않아요. |

## CLAUDE.md 구성

- 파일 이름은 **CLAUDE.md**예요.
- 본문에는 트리거, 상태 전이, 금지사항만 적어요.
- 다른 문서는 `@`로 불러오지 않고 경로만 적어요. 각 에이전트가 필요한 문서만 읽어요.
