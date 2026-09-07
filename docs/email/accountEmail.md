# Account Email Templates

이메일 자동화 Account 섹션의 발송 조건과 카피 모음.  
Figma: `EMAIL AUTOMATION` 파일 > `EMAIL CONTENTS` > `1. ACCOUNT`  
추출일: 2026-09-01 (Figma 캔버스 기준. Description 패널의 발송 조건, 수신자, 변수를 함께 기록)

---

## Enterprise_VerifyEmailJoin

**발송 조건:** 홈페이지를 통한 CompanyID의 회원가입 완료 직후  
**수신자:** COMPANY ID  
**갱신일:** 2024.11.01  

**Subject:** Please activate your account.

**Body:**
```
Hello, 
Thank you for signing up for Marvelous Designer!
Please click on the button below to verify your email address and activate your account.

ACTIVATE

If you did not create this account, please [contact us].

Best, 
Marvelous Designer team
```

---

## Enterprise_ResetPwRequest

**발송 조건:** 비밀번호 변경 시 사용자 인증 이메일  
**수신자:** COMPANY ID  
**갱신일:** 2024.11.01  

**Subject:** Password Change Request

**Body:**
```
Hello, 
You are receiving this email because we received a request to reset your account password. 
Please click on the link below to proceed.

Reset Password

If you did not request this, please [contact us].

Best, 
Marvelous Designer team
```

---

## Enterprise_DeleteEndUser

**발송 조건:** 기업계정에서 EndUser가 삭제된 완료했을 시 Company ID의 이메일로 즉시 발송  
**수신자:** COMPANY ID  
**갱신일:** 2024.11.01  

**Subject:** License ID has been deleted

**Body:**
```
Hello,

This is to inform you that {Deleted License ID} account has been deleted.
As the account deleted, you are not able to access previous history of your licenses, 
support inquiries and account information.

If you have additional inquiries, please [contact us].

Best regards,
The Marvelous Designer team.
```

**변수:**
```
{Deleted License ID}: 삭제된 License ID
```

---

## EnterpriseVerifyEmail

**발송 조건:** 기업 계정에서 EndUser의 이메일 변경을 시도할 경우 즉시 발송  
**수신자:** COMPANY ID와 EndUser의 새로운 이메일  
**갱신일:** 2024.11.01  

**Subject:** Activate your email address

**Body:**
```
Hello,

This email is to verify your request to change the email address associated with your License ID.
Please click the link below to confirm the new email address.

Verification
```

---

## Personal_DeleteUser

**발송 조건:** 개인 계정을 delete 완료했을 때 해당 계정의 이메일로, confirmation 이메일 즉시 발송  
**수신자:** PERSONAL  
**갱신일:** 2024.11.01  

**Subject:** Your account has been deleted.

**Body:**
```
Hello,

We are writing to inform you that your Marvelous Designer account has been deleted.

Thank you for using Marvelous Designer.
If there is anything we could have done to help you make your experience better, please [contact us].

Best regards,
The Marvelous Designer team.
```

---

## Student_VerifyStudent

**발송 조건:** 학생 이메일 인증 페이지로 넘어가면서 해당 인증 시 사용한 학교 이메일로 즉시 발송  
**수신자:** STUDENT 인증을 위해 등록한 학교 이메일  
**갱신일:** 2024.11.01  

**Subject:** Verify your student email address.

**Body:**
```
Hello,

Last step! 
To access your student license discount, please verify your email address.

Verify my student email and purchase now

Please note that your student verification is valid for one week after verification. If you do not purchase the license within this timeframe, you will need to reinitiate your student email verification.

If you have any questions or concerns, please don't hesitate to [contact us]. 
Best, 
Marvelous Designer team
```

---

## Student_SchoolDomainRegisterSuccess

**발송 조건:** 어드민에서 학교 도메일 등록 Confirm시 해당 personal 계정의 이메일로 즉시 발송  
**수신자:** 학교 Email 도메인 등록을 시도한 사용자  
**갱신일:** 2024.11.01  

**Subject:** Verify your student email to start Marvelous Designer.

**Body:**
```
Hello, We are excited to inform you that your school domain has been approved for access to Marvelous Designer. 
However, before you can start using the service, we need to verify your student email address.

To proceed, please click the button below to request a verification email.

Request a verification email

Once you enter your student email through the link, you will receive the verification email. After successful verification, you will be able to access Marvelous Designer with your student email address.

We are thrilled to have you as a user of Marvelous Designer, and we look forward to seeing your creativity shine!

If you have any questions or concerns, please do not hesitate to [contact us].

Best, 
Marvelous Designer team
```

---

## Student_SchoolDomainRegisterFail

**발송 조건:** 어드민에서 도메인 등록 Denied 처리 시해당 personal 계정의 이메일로 즉시 발송  
**수신자:** 학교 Email 도메인 등록을 시도한 사용자  
**갱신일:** 2024.11.01  

**Subject:** Issue verifying your school domain.

**Body:**
```
Hello, Thank you for submitting your school information to us.
We appreciate your interest in accessing Marvelous Designer.

We regret to inform you that we could not verify your school information at this time, as it does not meet our school definition. Our accepted schools include:

* University or college
 - A college or university that grants degrees after completing a regular course of study of at least two years (including 2-year public or private colleges and vocational schools) 
* Primary or secondary school
 - A licensed public or private primary, middle, or high school that provides regular education 
* Homeschool 
* Attendees of private CG-related courses
 - Certification of courses more than 3 months or curriculum schedule and tuition receipt is required.

If your school falls under one of the above categories, and you believe it has been incorrectly flagged, please do not hesitate to contact us for further assistance. Our team will be happy to help you with the verification process.

We apologize for any inconvenience this may have caused, and we appreciate your understanding in this matter. If you have any questions or concerns, please do not hesitate to [contact us].

Best, 
Marvelous Designer team
```

---

## Student_DocRegisterSuccess

**발송 조건:** 어드민에서 학교 문서를 통한 등록 confirm 시 해당 personal 계정의 이메일로 즉시 발송  
**수신자:** STUDENT 등록 시도한 Personal 계정의 이메일  
**갱신일:** 2024.11.01  

**Subject:** Your student status has been verified.

**Body:**
```
Hello, Thank you for submitting your document to verify your student status.
We appreciate your efforts and are pleased to inform you that your status has been successfully verified.

Please note that the document submission acceptance is valid for one week after verification. If you do not purchase the license within this timeframe, you will need to reinitiate the document submission process.

Next steps:
To complete your purchase, please click the button to go to the student pricing page.

Get a student license

If you have any questions or concerns, please do not hesitate to [contact us].

Best, 
Marvelous Designer team
```

---

## Student_DocRegisterFail

**발송 조건:** 학생 인증 문서 등록 시 reject하는 경우 메일해당 personal 계정의 이메일로 즉시 발송  
**수신자:** STUDENT 등록 시도한 Personal 계정의 이메일  
**갱신일:** 2024.11.01  

**Subject:** Issue verifying your student status

**Body:**
```
Hello, 

Thank you for submitting your document to verify your student status with us.
We regret to inform you that we were unable to verify your document this time because it does not contain the necessary information.

To proceed with the verification process, please resubmit your documents. The submitted document must indicate your name, the name of the educational institution, and the issued date.

Sensitive information such as resident registration number or grades should be removed before submission.

The document must have been issued within the last six months.

* Student ID card
* Enrollment certificate or academic transcript
* Proof of tuition payment or statement

We kindly request that you ensure your document contains the information stated above to avoid any further delays.

Resubmit

If you have any questions or concerns, please do not hesitate to [contact us]. Best, 
Marvelous Designer team
```

---

## Academic_RegisterComplete

**발송 조건:** 유저의 Academic Registration에 대해 제출 완료 했을 경우 해당 Company ID의 이메일로 즉시 발송  
**수신자:** ACADEMIC 신청한 Company ID  
**갱신일:** 2024.11.01  

**Subject:** Academic Registration Completed.

**Body:**
```
Hello,
Your academic registration has been completed.

Enterprise: {Company ID}
School website URL: {School website URL}
School Name: {School Name}
School City: {City}
School Country: {Country}

Best, 
Marvelous Designer team
```

**변수:**
```
{Company ID}: 아카데믹 신청한 Comapny ID
{School website URL}: 신청 시 작성한 학교 URL
{School Name}: 신청 시 작성한 학교 이름
{City}: 신청 시 작성한 학교 속한 도시
{Country}: 신청 시 작성한 학교가 속한 국가
```

---

## Indie_RequestSuccess

**발송 조건:** 인디 라이선스 제출 완료 시 전송  
**수신자:** 작성자의 계정 이메일과 폼에 작성된 이메일이 같을 경우 작성자 계정 이메일에만 발송 / 작성자의 계정 이메일과 폼에 작성된 이메일이 다를 경우 작성자 계정 이메일과 폼에 작성된 이메일에 둘 다 발송  

**Subject:** [Marvelous Designer] Your Indie Verification Request has been received

**Body:**
```
Hi {userID}, We’ve successfully received your Indie Verification request. Our team will review the submitted documents, and the review will be completed within n business days. 
We’ll notify you once the review process is complete. Best, Marvelous Designer Team
```

---

## Indie_RequestApproved

**발송 조건:** pending → confirmed로 상태 변경 시점에 전송  
**수신자:** 작성자의 계정 이메일과 폼에 작성된 이메일이 같을 경우 작성자 계정 이메일에만 발송 / 작성자의 계정 이메일과 폼에 작성된 이메일이 다를 경우 작성자 계정 이메일과 폼에 작성된 이메일에 둘 다 발송  

**Subject:** [Marvelous Designer] Your Indie Verification Request has been approved

**Body:**
```
Hi {userID}, Your Indie Verification request has been approved. Please check [License Account Admin] to confirm that your License IDs have the appropriate number of seats assigned. Please [contact us] if you need any help. Best, Marvelous Designer Team
```

---

## Indie_RequestDenied

Figma 섹션명은 `Indie_RequestApproved`로 잘못 복제돼 있다. 내부 프레임명과 본문은 Denied 템플릿.

**발송 조건:** pending → rejected로 상태 변경 시점에 전송  
**수신자:** 작성자의 계정 이메일과 폼에 작성된 이메일이 같을 경우 작성자 계정 이메일에만 발송 / 작성자의 계정 이메일과 폼에 작성된 이메일이 다를 경우 작성자 계정 이메일과 폼에 작성된 이메일에 둘 다 발송  

**Subject:** [Marvelous Designer] Your Indie Verification Request has been denied

**Body:**
```
Hi {userID}, After careful review of your Indie Certification Request, we regret to inform you that your application has not been approved at this time. However, we would still love to have you as part of our community.
 We invite you to explore our other licensing options, which may be a better fit for your current needs and workflow. You can view our available plans:

Check out other options for me

If you have any questions regarding our criteria or need assistance choosing the right license for your projects, please feel free to contact us at sales@marvelousdesigner.com. Thank you.

Best, Marvelous Designer Team

Copyright (c) 2016 CLO VIRTUAL FASHION, All rights reserved.
```

---

## Indie_VerificationRequestStaff

**발송 조건:** 인디 라이선스 제출 완료 시 전송  
**수신자:** 작성자가 Submit 시에 md.bizdev@clo3d.co 로 전송  

**Subject:** [Marvelous Designer] New Indie Application Submitted ({Country})

**Body:**
```
Hello {userID} has sent a Indie verification application.

Name

{Name}

{email}

{companyName}

{country}

Email to Contact

Application Details

Check out on Sales Admin
```

---

## Academic_RegisterApprove

**발송 조건:** 어드민에서 academic 등록 confirm 눌러 승인이 완료 되었을 때 해당 Company ID의 이메일로 즉시 발송  
**수신자:** ACADEMIC 신청한 Company ID  
**갱신일:** 2024.11.01  

**Subject:** Your Academic Registration has been approved.

**Body:**
```
Hello {Company Name},

Thank you for waiting.

We are writing to inform you that your Academic Registration has been approved.
Please further proceed to our website and purchase the academic license per your needs.

Click [here] to get directed to the website.

Feel free to contact us at sales@marvelousdesigner.com for any questions you may have.


Best, 
Marvelous Designer team
```

**변수:**
```
{Company Name}: 해당 Company ID가 회원가입 때 기입한 회사 명
```

---

## Academic_RegisterReject

**발송 조건:** 어드민에서 academic 등록 reject을 눌러 승인 거부가 되었을 때 해당 Company ID의 이메일로 즉시 발송  
**수신자:** ACADEMIC 신청한 Company ID  
**갱신일:** 2024.11.01  

**Subject:** Your Academic Registration has been rejected.

**Body:**
```
Hello {Company Name},

Thank you for waiting.

We are writing to inform you that your Academic Registration has been rejected due to some uncertainties of your school information.
Our related personnel will be in touch with you shortly in regards to this, so please kindly understand and wait for us.


If you have any questions in the meantime, please feel free to contact us at sales@marvelousdesigner.com

Best, 
Marvelous Designer team
```

**변수:**
```
{Company Name}: 해당 Company ID가 회원가입 때 등록한 회사 명
```

---
