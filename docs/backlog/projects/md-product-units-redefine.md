---
project: md-product-units-redefine
updated: 2026-08-07
---

## 관련 Jira 티켓
- 없음 (Slack 스레드 대응 단계, 티켓화 여부 미결)

## TODO
1. **Steven의 Group A/B 대안에 대한 회신** — 아직 스레드에 답변 안 보냄. 초안 3줄 작성해둠 (아래 컨텍스트 참고), Josh 검토 후 전송 필요
2. **Steven 제안(Group A: Win/Mac $2,000 · Group B: 全OS $2,300) 채택 여부 판단** — 채택되면 Enterprise Team Linux 플랜 정의·가격 정책(`docs/policy/plan.md`)에 영향. 아직 미결
3. **Plans 페이지 문구 오류 수정** — "Linux 라이선스가 Network Online과 동일한 접근권(Win/Mac 포함)을 제공한다"고 오해하게 만드는 문구. Josh가 직접 고치겠다고 함 (본인 작업)
4. Klay 회신 스레드 후속 확인 — Steven 제안에 대한 Klay/Bryan 반응이 아직 없음. 다음에 스레드 다시 확인 필요

## 컨텍스트

### 이슈 배경
Slack 스레드 (`C01EGG976DB`, thread_ts `1785839012.095219`) — Enterprise 고객이 Windows→Linux 전환 중 두 OS를 동시에 써야 하는데, MD Linux 라이선스가 **Linux에서만 실행**되는 걸 뒤늦게 알고 항의. 웹페이지 안내가 Network Online과 동일한 걸 다 포함하는 것처럼 읽혀 오해 유발.

### 참여자별 입장
- **Daniel Rojas Keyser** (요청자) — Linux 라이선스로 Win/Mac/Linux 다 되게 해달라는 클라이언트 요청 전달
- **Bryan Kim** — 동의, `MD Enterprise Basic`(Win/Mac) + `MD Enterprise Extensive`(Basic+Linux) 패키징 재구성 제안 (Headless API 티어도 고려)
- **Klay Kim** — 반대 근거 설명: Network Online과 Network Online Linux는 출시 당시 별도 product group으로 분리됨. 이유는 concurrent session 카운트가 OS별 구분을 못 해서, 같은 그룹으로 묶으면 어뷰징(적은 비용으로 더 많은 Linux 세션 확보) 가능. 그래서 "기존 유저에게 영향 없이 즉시 구현은 어렵다"는 결론
- **Steven** — 한 단계 더 구체적인 대안 제시: 같은 Company ID 안에 Group A(Win/Mac만, $2,000/copy) / Group B(全OS 가능, $2,300/copy)로 나누면 그룹별 concurrent count는 독립적으로 유지되니 어뷰징 없이 멀티 OS 지원 가능. 회신 대기 중

### Josh 답변 초안 (전송 전, 채팅에 작성해둔 것)
1. Plans 페이지 문구 오류는 Josh가 직접 수정
2. Klay 설명대로, 처음부터 별개 product로 나눈 이유가 있으므로 Bryan의 Basic+Linux 패키징은 현재와 동일한 혼란을 재현할 위험 있음 — 현재 판매 정책 기준으로는 별도 product로 유지하는 게 맞다는 입장
3. 재구성이 필요하다면, Bryan이 말한 대로 리패키징을 통한 product 정책 변경이 선행되어야 한다는 입장

→ 아직 전송 안 됨. Steven 답변은 이 초안 이후에 달렸으므로, 다음 회신 시 Steven 제안까지 반영해서 다시 정리할 것

### 블로커
- Steven의 Group A/B 제안에 대한 Klay·Bryan 반응 없음 — 이 프로젝트 자체가 "채택 여부 미결" 상태로 대기 중
