# To focus 디자인 하네스

이 저장소는 To focus 화면 디자인을 만드는 하네스예요.
메인 세션은 **오케스트레이터**예요. 단계 작업은 직접 하지 않고, 서브에이전트에게 맡겨요.

## 참조 문서 (필요할 때만 읽어요)
- 상태 전이·강제 장치 상세: `harness/06-orchestrator.md`
- 산출물 경로: `harness/03-artifacts.md`
- 게이트 조건: `harness/04-gates.md` (값의 원본은 `docs/design.md` frontmatter `gates:`)
- 서비스 기준 `docs/prd.md` · `docs/story-service.md`, 작업 흐름 `docs/story-work.md`는 서브에이전트가 읽어요. 오케스트레이터는 읽지 않아도 돼요.

## 트리거
| 말 | 동작 |
|---|---|
| "화면 만들어줘: <화면 1~3개>" | `runs/<YYYYMMDD-HHMM>/`와 `state.json`(`screens` 포함)을 만들고 S1부터 시작 |
| "이어서 해줘" | 가장 최근 run의 `state.json`에서 이어서 진행 |
| "승인" / "승인: <이름>" | `s3/approval.json`에 `approved: true`, `by`, `at`을 기록하고 S4로 |
| "거절: <사유>" | `approved: false`, `reason`을 기록하고 S2로 |
| "판정만 다시 해줘" | `extractor` → `judge`(G5)만 다시 실행 |

화면 이름은 `홈 · 목표 설정 · 할 일 설정 · 수행 · 결산` 중에서만 받아요. 그 밖의 이름이 오면 되물어요.

## 진행 순서
```
S1 researcher → G1
S2 spec-writer ×화면(병렬) → G2
S3 keyscreen-designer → extractor → G3 → 사람 승인 대기
S4 builder ×화면(병렬) → extractor → S5 judge(G5) → 완료
```
- 판정은 `judge`가 `node harness/scripts/gN.mjs runs/<id>`를 돌린 **종료 코드**로 해요.
  - 0 통과 · 1 실패 · 2 입력 오류(파일 누락 등, 해당 단계를 다시 해요)
  - G3만: 3 승인 대기 · 4 거절
- 판정 증거는 `extractor`가 Figma에서 직접 뽑아요. 작업 에이전트의 파일로 판정하지 않아요.
- 실패하면 되돌아가요: G1→S1, G2→S2, G3 스크립트 실패→S3, 거절→S2, G5→S4.
  - **위반이 있는 화면·노드만** 다시 하고, 위반 목록이나 거절 사유를 넘겨요.
  - 재시도는 돌아간 단계의 `retries`에 세요. 3에 닿으면 멈추고 실행자에게 물어요.
- G3 스크립트를 통과하면 Figma 링크와 함께 승인을 요청하고 **기다려요**.

## 완료 기준
입력한 화면 N개가 모두 390×844 프레임으로 Figma에 있고, G5 위반이 0건이며, 승인이 1회 기록되면 완료예요.

## 금지
- 오케스트레이터는 리서치, 설계, Figma 편집, 증거 추출을 직접 하지 않아요.
- 판정 결과(`gates/*.json`)나 증거(`evidence/*.json`)를 고치거나 무시하지 않아요.
- `docs/`, `harness/`, `CLAUDE.md`, `.claude/`는 실행 중에 고치지 않아요.
- 규칙 값을 design.md 밖에 복사하지 않아요.
- Figma는 이번 run의 페이지(`run-<id>`)만 건드려요. Figma 파일 키는 `runs/config.json`에 있어요.

## 가드와 유지보수
- `.claude/hooks/guard.mjs`가 권한을 강제해요. 막히면 `runs/guard-log.jsonl`에 기록돼요. 서브에이전트가 "막혔다"고 보고하면 경로를 바꾸게 하지 말고 실패로 처리해요.
- 하네스 문서·규칙을 고칠 때만 `touch .claude/maintenance`로 유지보수 모드를 켜고, 끝나면 `rm .claude/maintenance`로 꺼요. 실행 중에는 켜지 않아요.
- 판정 스크립트를 고쳤다면 `node harness/scripts/test.mjs`가 전부 통과해야 해요.
