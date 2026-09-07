# emailTemplate-visual.md — 레거시 이메일 시각 표현 기록

레거시 `EMAIL CONTENTS` 페이지(node 2:59) 이메일 64종이 색과 버튼을 어떻게 표현하는지의 실측 기록이다. Plugin API로 텍스트 fills, fontSize, 배경 fills를 전수 샘플링했다 (2026-09-01).
**순수 레거시 캡처다.** v2 양산 시 Poppins 15px 우리 체계로 전환 예정이며, 전환 정의는 `email-spec.md`가 담당한다.

원문 텍스트는 `emailTemplate.md`, 발송 조건은 `docs/email/*.md` 참조.

---

## 1. 본문 텍스트

| 요소 | 폰트 | 크기 | 색 |
|---|---|---|---|
| Subject (제목 표시줄) | Avenir 계열 Demi | 18 | `#454545` |
| 본문 문단 | Avenir 계열 Demi (사실상 전체가 semi-bold) | 16 | `#000000` 또는 지정 없음(검정), 일부 `#454545`, `#3F3F3F` |
| 신형 템플릿의 키-값 표 텍스트 | 동일 | 15 | 레이블 `#18181C`, 값 `#DD6A00` |
| 카드형 레이아웃의 캡션 | 동일 | 10 | `#454545` 또는 `#DD6A00` |
| 서명 (Best, Marvelous Designer team) | 동일 | 16 | 본문과 동일 (일부 템플릿은 `#DD6A00`으로 오염돼 있음: TrialExpiry, HelpTrial, LearningContents3) |
| 푸터 (Copyright, Help Center 안내) | 동일 | 12 내외 | 회색, 중앙 정렬 |

신형 템플릿(Indie 계열, Standalone Expiring 계열)은 프레임 상단에 템플릿 코드를 24px `#858585`로 표기한다. 이메일 본문이 아니라 캔버스 라벨이다.

## 2. 버튼

전부 단색 배경 + 흰 텍스트 + 라운드 사각형. 세대별로 3계열이 혼재한다.

| 계열 | 배경 | 텍스트 | 크기 | 쓰인 곳 |
|---|---|---|---|---|
| 구형 주 버튼 | `#DD6A00` | `#FFFFFF` | 14 | ACTIVATE, Reset Password, Transaction Summary 등 대부분의 CTA |
| 구형 소형 버튼 | `#DD6A00` | `#FFFFFF` | 12 | Welcome, Trial, LearningContents의 카드형 소버튼 (FEATURE, Tutorial, Learn More 등) |
| 신형 버튼 | `#FF9136` | `#FFFFFF` | 16 | Indie 계열, Standalone Expiring 계열 (Check out other options for me 등) |
| Userpool 계열 회색 버튼 | `#6E6E6E` | `#FFFFFF` | 14 | MAC OS, WINDOW 64 bit, Go to Downloads, CLO-SET SIGN IN |

## 3. 인라인 링크

| 표현 | 색 | 예 |
|---|---|---|
| 본문 인라인 링크 | 파랑 (본문 원문에 `[contact us]` 대괄호 표기) | [contact us], [here], [Help Center] |
| 신형 보조 링크 | `#4A9DFF` | SIGN UP, Check Specification |

## 4. 정보 박스 (회색 배경 블록)

주문 내역, 라이선스 정보, 목록 안내에 쓰는 배경 블록. 세대별 3종.

| 계열 | 배경 | 내용 |
|---|---|---|
| 구형 | `#F9F9F9` | LICENSE / TYPE / EXPIRY 등 주문 요약, 목록 안내 |
| 신형 키-값 표 | `#F5F5F7` | Indie Staff 통지의 Name, Email 표 (값은 `#DD6A00`) |
| Userpool 계열 | `#F2F2F2` | 설치 파일 안내, 멤버 추가 내역 |

## 5. 강조와 경고

| 표현 | 색 | 예 |
|---|---|---|
| 경고 헤드라인 | `#FF5454` | "Important Notice: Enterprise Standalone Plan Will No Longer Be Available" |
| 변수 하이라이트 | `#DD6A00` | {FORM1_FULL NAME} 등 폼 값, 키-값 표의 값 |

## 6. 캔버스 상태 오버레이 (이메일 아님, 작업 표시)

| 표기 | 스타일 | 위치 |
|---|---|---|
| "사용하지 않음" | 흰 대형 텍스트 (약 124px) + 빨강 박스 | Enterprise_OfflineKeyComplete |
| "보류 중" | 흰 대형 텍스트 (120px) | Personal_LearningContents3 |
| 수정사항 주석 블록 | 진회색 `#2F2F2F` 배경 카드 | Personal_TrialExpiry ("11/07 템플릿 수정사항" 등, 본문 아님) |

## 7. 레이아웃 골격

- 이메일 본문 폭: 약 600px, 흰 배경, 중앙 정렬
- 구조: 로고 워드마크, 본문 문단, (버튼), (정보 박스), 서명, 구분선, 푸터
- 푸터 2행 고정: "Copyright (c) 2019 CLO VIRTUAL FASHION, All rights reserved." + "Want to learn more about Marvelous Designer? Feel free to visit our information hub, [Help Center]!" (느낌표 포함이 원문)

## 관련 문서

- 원문 소스: `emailTemplate.md`
- v2 전환 기준: `email-spec.md`
- 발송 조건, 변수: `docs/email/accountEmail.md`, `subscriptionEmail.md`, `trialEmail.md`, `systemEmail.md`
