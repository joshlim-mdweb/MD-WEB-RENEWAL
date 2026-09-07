# Trial Email Templates

이메일 자동화 Trial 섹션의 발송 조건과 카피 모음.  
Figma: `EMAIL AUTOMATION` 파일 > `EMAIL CONTENTS` > `3. Trial`  
추출일: 2026-09-01 (Figma 캔버스 기준. Description 패널의 발송 조건, 수신자, 변수를 함께 기록)

---

## Enterprise_TrialInquiryStaff

**발송 조건:** 기업 트라이얼 신청 시 MD_BIZDEV로 전달되는 신청자 정보  
**수신자:** MD_BIZDEV  
**갱신일:** 2024.11.01  

**Subject:** Enterprise Trial Inquiry [{Name}, {Country}]

**Body:**
```
A ENTERPRISE TRIAL INQUIRY has arrived.

Inquiry Details

Name:

{FORM1_FULL NAME}

Business Email:

{FORM2_EMAIL}

Job Title:

{FORM3_JOB TITLE}

Company Name:

{FORM 4_COMPANY NAME}

Country:

{FORM5_COUNTRY}

Company Webpage:

{FORM6_WEBPAGE}(link)

Domain:

{FORM7_COMPANYDOMAIN}

Inquiry:

{FORM8_INQUIRY}

Best regards, The Marvelous Designer Team
```

**변수:**
```
{FORM1_FULL NAME}: 제출 시 입력한 작성자의 이름
{FORM2_EMAIL}: 제출 시 입력한 작성자의 이메일
{FORM3_JOB TITLE}: 제출 시 입력한 작성자의 직업
{FORM4_COMPANY NAME}: 제출 시 입력한 작성자의 회사명
{FORM5_COUNTRY}: 제출 시 입력한 국가
{FORM7_COMPANYDOMAIN}: 제출 시 입력한 회사 Domain
{FORM8_INQUIRY}: 제출 시 입력한 요청 내용
```

**비고:** 관련 프로젝트 링크: https://www.figma.com/design/4lcojdG34Y9IcKr2qctzbk/Enterprise-Trial-Inquiry?node-id=52-16469

---

## Enterprise_TrialInquiryUser

**발송 조건:** 기업 트라이얼 신청 시 신청 기업으로 가는 확인 메일  
**수신자:** ENTERPRISE (APPLICANTS)  
**갱신일:** 2024.11.01  

**Subject:** Enterprise Trial Inquiry

**Body:**
```
Thank you for your submission! We’ll get the best manager to help you as soon as possible!

If you need any further help, please contact us or visit help center. Best regards, The Marvelous Designer Team

Inquiry Details

Name:

{FORM1_FULL NAME}

Business Email:

{FORM2_EMAIL}

Job Title:

{FORM3_JOB TITLE}

Company Name:

{FORM 4_NAME}

Country:

{FORM5_COUNTRY}

Company Webpage:

{FORM6_WEBPAGE}(link)

Domain:

{FORM7_COMPANYDOMAIN}

Inquiry:

{FORM8_INQUIRY}
```

**변수:**
```
(Staff 버전과 동일한 FORM 변수 세트)
```

**비고:** 관련 프로젝트 링크: https://www.figma.com/design/4lcojdG34Y9IcKr2qctzbk/Enterprise-Trial-Inquiry?node-id=52-16469

---

## Personal_HelpTrial

**발송 조건:** Trial 시작 날짜 + 3일 후 오전 10시에 발송  
**수신자:** PERSONAL  
**갱신일:** 2024.11.01  

**Subject:** How to Fully Experience Your Marvelous Designer Trial

**Body:**
```
Hello,

We've brought you some services to make your trial easier and help you learn Marvelous Designer faster!

EXCLUSIVE TUTORIALS

Master the software step-by-step with hand-picked contents.

Tutorial

FEATURE

FEATURE

Discover more features that Marvelous Designer provide.

CONNECT FREE ASSET

Explore CLO-SET CONNECT asset store for your templates, make a few tweaks, and complete your look!

CONNECT

USER SPOTLIGHT

User Spotlight Check real-world examples of how Marvelous Designer has been a key player across the industries.

User Spotlight

Best, 
Marvelous Designer team
```

**비고:** 3일 이내에 Trial 취소한 계정은 발송 대상에서 제외

---

## Personal_TrialExpiring3Continue

**발송 조건:** 구독전환용 트라이얼 기간 만료 3일 전 오전 10시에 Trial 중간 구독취소하지 않은 사용자에게 발송  
**수신자:** PERSONAL  
**갱신일:** 2024.11.01  

**Subject:** Your trial is almost over.

**Body:**
```
Hello,

We hope you've found a good starting point with Marvelous Designer.

Just a friendly reminder that your trial period ends in 3 days. Your membership will automatically continue and you'll be charged on {Subscription Start Date} where your free trial period ends.

Your subscription will include:

- Access to an exclusive learning page
- The latest feature updates
- Community news, and more

To ensure a smooth subscription update process, there may be a time variance of up to 10 hours before or after the scheduled date. We'd be thrilled to have you as our member!
If you have any questions, we're here to help you. Visit the [Help Center] for more information or just [contact us].

You can cancel your membership or update payment method on [my account].

Best, 
Marvelous Designer team
```

**변수:**
```
{Subscription Start Date}: 트라이얼 종료 후 정규 구독으로 전환되는 날짜
```

---

## Personal_TrialExpiring3Cancel

**발송 조건:** 트라이얼 이후 구독전환 되지는 않는 경우(Trial 취소한 사용자) 기간 만료 3일 전 오전 10시에 발송  
**수신자:** PERSONAL  
**갱신일:** 2024.11.01  

**Subject:** You can still enjoy trial for 3 days.

**Body:**
```
Hello,

We hope you've found a good starting point with Marvelous Designer.

Even though you canceled TRIAL, you can to continue your membership even after the trial period ends, please visit the [pricing page] and subscribe to the plan that suits you best.

Your subscription will include:

- Access to an exclusive learning page
- The latest feature updates
- Community news, and more

We'd be thrilled to have you as our member!
If you have any questions, we're here to help you. Visit the [Help Center] for more information or just [contact us].

Best, 
Marvelous Designer team
```

---

## Personal_TrialCancel

**발송 조건:** 중간 TRIAL 구독취소한 직후 발송  
**수신자:** PERSONAL  
**갱신일:** 2024.11.01  

**Subject:** Your trial is canceled.

**Body:**
```
Hi,

Thank you for trying Marvelous Designer! As per your request, your trial has been successfully canceled, and you won’t be charged.

We hope you enjoyed exploring the possibilities of Marvelous Designer and found the experience creative and rewarding. If you ever feel like revisiting, you're always welcome to return at any time!

Just a reminder, Marvelous Designer offers:

- Easy-to-follow tutorials to help you master the tool
- Free assets on CONNECT to enhance your projects
- Frequent feature updates to keep your work at the cutting edge

Check Our Pricing Options

If you have any questions or need assistance, don’t hesitate to contact us. We hope to see you back soon!

Best, 
Marvelous Designer team
```

---

## Personal_TrialExpiry

**발송 조건:** 트라이얼 이후 구독전환 되는 날의 오전 10시에 발송  
**수신자:** PERSONAL  
**갱신일:** 2024.11.01  

**Subject:** Your trial is finished!

**Body:**
```
Hello,

Thank you for using the Marvelous Designer trial. Some features are ready for your Marvelous Designer projects.

EXCLUSIVE TUTORIALS

Master the software step-by-step with hand-picked contents.

Tutorial

FEATURE

FEATURE

Discover more features that Marvelous Designer provide.

CONNECT FREE ASSET

Explore CLO-SET CONNECT asset store for your templates, make a few tweaks, and complete your look!

CONNECT

USER SPOTLIGHT

User Spotlight Check real-world examples of how Marvelous Designer has been a key player across the industries.

User Spotlight

If you have any inquiries, please [contact us].

Best, 
Marvelous Designer team

11/07 템플릿 수정사항_다혜

USER SPOTLIGHT

텍스트 설명 부분 문구 변경 Check real-world examples of how Marvelous Designer has been a key player across the industries.

FILENAME

변경 내용!

FILENAME

변경 내용!
```

---

## Personal_TrialStart

**발송 조건:** Trial Checkout 완료한 직후 발송  
**수신자:** PERSONAL  
**갱신일:** 2024.11.01  

**Subject:** Your 14-day free trial begins.

**Body:**
```
Hello,
 Your trial license period has been started since {Trial Start Date}. Try out all the latest features of Marvelous Designer!
This trial license will be valid until {Trial Expiry Date}.
 If you have any inquiries, please [contact us].

Best, 
Marvelous Designer team
```

**변수:**
```
{Trial start date}: 트라이얼 시작한 날짜
{Trial expiry date}: 트라이얼 종료 예정일
```

---
