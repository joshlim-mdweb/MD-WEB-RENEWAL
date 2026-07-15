---
project: gnb-renewal
updated: 2026-06-04
---

## 관련 Jira 티켓
- 없음 (GNB WF는 Figma 작업 단위)

## TODO
1. GNB DOC 프레임 작성 — 상태별 메뉴 구성 한 장짜리 (Header / Footer 구분, 비로그인/로그인 상태별)
2. Solutions(Enterprise/Academics/Students) 진입 경로 확정 — GNB 제거 후 어디서 접근하는지 결정 필요
3. GNB Default 컴포넌트(2608:1085) 업데이트 — 현재 영문 "Product/Plan/Learn/Resources" 상태, WF와 동기화 필요 여부 확인
4. 로그인 상태 GNB 별도 설계 — 현재 WF는 비로그인 상태만 존재

## 컨텍스트

### 확정 GNB 구조 (적용 완료 — 노드 199:1516)

**Header**

| 상태 | 항목 |
|------|------|
| 공통 | 제품∨ / 플랜 / 학습 지원∨ / 고객 지원∨ |
| 비로그인 | [무료체험 시작하기] / 로그인 |
| 로그인 | 미정 |

- 제품∨: 새로운 기능 / 무료 체험 / 다운로드 / 새로운 소식
- 학습 지원∨: 튜토리얼 / 매뉴얼 / 유저 스포트라이트
- 고객 지원∨: 문의하기 / 헬프센터 →

**Footer (이동 확정)**
언어 설정 / Connect / 교육기관 인증 프로그램 / 헬프센터

### 미결 사항
- Solutions 진입 경로: GNB에서 제거됐으나 Enterprise/Academics/Students 페이지 접근 방법 미결정
- 고객 지원 드롭다운: 자주 묻는 질문은 GNB 제외 확정(회의록). 문의하기 + 헬프센터 → 만 포함

### Figma 참조
- 파일: `PeCid7uJcg0HenViaaiHUp`
- GNB 섹션(WF): 노드 199:1516 (COVER 페이지)
- 구조 레퍼런스: 노드 3913:4119 ("GNB Default - Not Signed In")

## 완료 로그

### 2026-06-04
- GNB WF 텍스트 전체 교체 (Features→제품, Solutions→숨김, Resources→학습 지원, Download→고객 지원)
- 학습 지원 드롭다운 재구성 (유저 스포트라이트/튜토리얼/매뉴얼)
- 고객 지원 드롭다운 추가 (문의하기/헬프센터 확정 전 자주 묻는 질문/문의하기로 임시 적용)
- 제품 드롭다운 신규 추가 (새로운 기능/무료 체험/다운로드/새로운 소식)
- 확장 바 고객 지원 트리거 위치 교정 (x=256 → x=617)
- 무료체험 시작하기 / 로그인 텍스트 변경
