# emailTemplate.md — 레거시 이메일 원문 소스

레거시 `EMAIL AUTOMATION` 파일, `EMAIL CONTENTS` 페이지(node 2:59)의 이메일 64종 원문. 한 템플릿당 한 레코드.
추출일: 2026-09-01. 원문 보존 원칙: 오탈자 포함 그대로 옮겼다 (수정은 v2 양산에서).
표기: 버튼은 `[레이블]` 대괄호. 인라인 링크는 레거시 원문 표기(`[contact us]` 등) 그대로.
시각 표현(색, 버튼 스타일)은 `emailTemplate-visual.md`, 발송 조건과 변수는 `docs/email/*.md` 인벤토리 참조.

---

Section: Account
Type: Enterprise
Template: Enterprise_VerifyEmailJoin
Title: Please activate your account.
Contents:
Hello, 
Thank you for signing up for Marvelous Designer!
Please click on the button below to verify your email address and activate your account.

[ACTIVATE]

If you did not create this account, please [contact us].

Best, 
Marvelous Designer team

---

Section: Account
Type: Enterprise
Template: Enterprise_ResetPwRequest
Title: Password Change Request
Contents:
Hello, 
You are receiving this email because we received a request to reset your account password. 
Please click on the link below to proceed.

[Reset Password]

If you did not request this, please [contact us].

Best, 
Marvelous Designer team

---

Section: Account
Type: Enterprise
Template: Enterprise_DeleteEndUser
Title: License ID has been deleted
Contents:
Hello,

This is to inform you that {Deleted License ID} account has been deleted.
As the account deleted, you are not able to access previous history of your licenses, 
support inquiries and account information.

If you have additional inquiries, please [contact us].

Best regards,
The Marvelous Designer team.

---

Section: Account
Type: Enterprise
Template: EnterpriseVerifyEmail
Title: Activate your email address
Contents:
Hello,

This email is to verify your request to change the email address associated with your License ID.
Please click the link below to confirm the new email address.

[Verification]

---

Section: Account
Type: Personal
Template: Personal_DeleteUser
Title: Your account has been deleted.
Contents:
Hello,

We are writing to inform you that your Marvelous Designer account has been deleted.

Thank you for using Marvelous Designer.
If there is anything we could have done to help you make your experience better, please [contact us].

Best regards,
The Marvelous Designer team.

---

Section: Account
Type: Student
Template: Student_VerifyStudent
Title: Verify your student email address.
Contents:
Hello,

Last step! 
To access your student license discount, please verify your email address.

[Verify my student email and purchase now]

Please note that your student verification is valid for one week after verification. If you do not purchase the license within this timeframe, you will need to reinitiate your student email verification.

If you have any questions or concerns, please don't hesitate to [contact us]. 
Best, 
Marvelous Designer team

---

Section: Account
Type: Student
Template: Student_SchoolDomainRegisterSuccess
Title: Verify your student email to start Marvelous Designer.
Contents:
Hello, We are excited to inform you that your school domain has been approved for access to Marvelous Designer. 
However, before you can start using the service, we need to verify your student email address.

To proceed, please click the button below to request a verification email.

[Request a verification email]

Once you enter your student email through the link, you will receive the verification email. After successful verification, you will be able to access Marvelous Designer with your student email address.

We are thrilled to have you as a user of Marvelous Designer, and we look forward to seeing your creativity shine!

If you have any questions or concerns, please do not hesitate to [contact us].

Best, 
Marvelous Designer team

---

Section: Account
Type: Student
Template: Student_SchoolDomainRegisterFail
Title: Issue verifying your school domain.
Contents:
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

---

Section: Account
Type: Student
Template: Student_DocRegisterSuccess
Title: Your student status has been verified.
Contents:
Hello, Thank you for submitting your document to verify your student status.
We appreciate your efforts and are pleased to inform you that your status has been successfully verified.

Please note that the document submission acceptance is valid for one week after verification. If you do not purchase the license within this timeframe, you will need to reinitiate the document submission process.

Next steps:
To complete your purchase, please click the button to go to the student pricing page.

[Get a student license]

If you have any questions or concerns, please do not hesitate to [contact us].

Best, 
Marvelous Designer team

---

Section: Account
Type: Student
Template: Student_DocRegisterFail
Title: Issue verifying your student status
Contents:
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

[Resubmit]

If you have any questions or concerns, please do not hesitate to [contact us]. Best, 
Marvelous Designer team

---

Section: Account
Type: Academic
Template: Academic_RegisterComplete
Title: Academic Registration Completed.
Contents:
Hello,
Your academic registration has been completed.

Enterprise: {Company ID}
School website URL: {School website URL}
School Name: {School Name}
School City: {City}
School Country: {Country}

Best, 
Marvelous Designer team

---

Section: Account
Type: Indie
Template: Indie_RequestSuccess
Title: [Marvelous Designer] Your Indie Verification Request has been received
Contents:
Hi {userID}, We’ve successfully received your Indie Verification request. Our team will review the submitted documents, and the review will be completed within n business days. 
We’ll notify you once the review process is complete. Best, Marvelous Designer Team

---

Section: Account
Type: Indie
Template: Indie_RequestApproved
Title: [Marvelous Designer] Your Indie Verification Request has been approved
Contents:
Hi {userID}, Your Indie Verification request has been approved. Please check [License Account Admin] to confirm that your License IDs have the appropriate number of seats assigned. Please [contact us] if you need any help. Best, Marvelous Designer Team

---

Section: Account
Type: Indie
Template: Indie_RequestDenied
Title: [Marvelous Designer] Your Indie Verification Request has been denied
Contents:
Hi {userID}, After careful review of your Indie Certification Request, we regret to inform you that your application has not been approved at this time. However, we would still love to have you as part of our community.
 We invite you to explore our other licensing options, which may be a better fit for your current needs and workflow. You can view our available plans:

[Check out other options for me]

If you have any questions regarding our criteria or need assistance choosing the right license for your projects, please feel free to contact us at sales@marvelousdesigner.com. Thank you.

Best, Marvelous Designer Team

Copyright (c) 2016 CLO VIRTUAL FASHION, All rights reserved.
Note: Figma 섹션명이 Indie_RequestApproved로 잘못 복제돼 있음 (내부 프레임명 기준으로 기록)

---

Section: Account
Type: Indie
Template: Indie_VerificationRequestStaff
Title: [Marvelous Designer] New Indie Application Submitted ({Country})
Contents:
Hello {userID} has sent a Indie verification application.

Name

{Name}

{email}

{companyName}

{country}

Email to Contact

Application Details

[Check out on Sales Admin]

---

Section: Account
Type: Academic
Template: Academic_RegisterApprove
Title: Your Academic Registration has been approved.
Contents:
Hello {Company Name},

Thank you for waiting.

We are writing to inform you that your Academic Registration has been approved.
Please further proceed to our website and purchase the academic license per your needs.

Click [here] to get directed to the website.

Feel free to contact us at sales@marvelousdesigner.com for any questions you may have.

Best, 
Marvelous Designer team

---

Section: Account
Type: Academic
Template: Academic_RegisterReject
Title: Your Academic Registration has been rejected.
Contents:
Hello {Company Name},

Thank you for waiting.

We are writing to inform you that your Academic Registration has been rejected due to some uncertainties of your school information.
Our related personnel will be in touch with you shortly in regards to this, so please kindly understand and wait for us.

If you have any questions in the meantime, please feel free to contact us at sales@marvelousdesigner.com

Best, 
Marvelous Designer team

---

Section: Subscription/Payment
Type: Enterprise
Template: Enterprise_MonthlyExpiring7
Title: Upcoming Renewal: Marvelous Designer Monthly License
Contents:
Hello, 
This is a friendly reminder that your Marvelous Designer license is scheduled for renewal in 7 days.

Target License ID: {License ID}
Expiration Date: {Expiry Date}

We’re thrilled to have you as part of the Marvelous Designer community and hope you’re enjoying the experience! 
If you’d like to continue using the software, you can renew your license after {Expiry Date}. Please visit [Pricing] to renew, or contact us at sales@marvelousdesigner.com if you need any assistance."

Best regards,
The Marvelous Designer team.

---

Section: Subscription/Payment
Type: Enterprise
Template: Enterprise_AnnualExpiring14CompanyID
Title: Reminder: Marvelous Designer License Ending in 14 Days
Contents:
Hello, This is a friendly reminder that your annual Marvelous Designer license will expire in 14 days. After your license expires, you can purchase a new license from your My Account page. Should you need any further information, please [contact us]. Best, Marvelous Designer team

Target License ID: {License ID}
Expiration Date: {Expiry Date}

---

Section: Subscription/Payment
Type: Enterprise
Template: Enterprise_UpgradeOrderComplete
Title: Your order has been confirmed.
Contents:
Hello,

Thank you for purchasing! Your order has been confirmed. 
Here's a summary of your order for your records:

LICENSE: {product name}
TYPE: {Subscription Type}
EXPIRATION DATE: {Expiry Date} (GMT)
ORDER DATE: {Order Date} (GMT)
AMOUNT: {Price} {Currency}
PAYMENT METHOD: {Payment Method} LICENSE USER ID: {License ID}

Click the button to print a copy of your transaction summary.

[Transaction Summary]

The installer for the License ID(s) can be downloaded from [My Account] (Sign in with License ID) or [License Account Admin] (Sign in with Company ID).

Thank you!

Best, 
Marvelous Designer team

---

Section: Subscription/Payment
Type: Enterprise
Template: Enterprise_AnnualOrderComplete
Title: Your order has been confirmed.
Contents:
Hello,

Thank you for purchasing! Your order has been confirmed. 
Here's a summary of your order for your records:

LICENSE: {product name}
TYPE: ANNUAL
EXPIRATION DATE: {Expiry Date} (GMT)
ORDER DATE: {Order Date} (GMT)
AMOUNT: {Price} {Currency}
PAYMENT METHOD: {Payment Method} LICENSE USER ID: {License ID}

This license will not automatically renew after the expiry date.
If you would like to keep using Marvelous Designer, click [here] to purchase a new license before the expiry date. Click the button to print a copy of your transaction summary.

[Transaction Summary]

The installer for the License ID(s) can be downloaded from [My Account] (Sign in with License ID) or [License Account Admin] (Sign in with Company ID).

Thank you!

Best, 
Marvelous Designer team

---

Section: Subscription/Payment
Type: Enterprise
Template: Enterprise_AnnualExpiring14EndUser
Title: Reminder: Marvelous Designer License Ending in 14 Days
Contents:
Hello, This is a friendly reminder that your annual Marvelous Designer license will expire in 14 days. If you wish to continue using the software, please contact your administrator to renew your license. Should you need any further information, please [contact us]. Best, Marvelous Designer team

---

Section: Subscription/Payment
Type: Personal
Template: Personal_AnnualExpiring14
Title: Your subscription will expire in 2 weeks.
Contents:
Hello, This is a friendly reminder that your Marvelous Designer license will expire in 2 weeks. After your license expires, you can purchase a new license from your My Account page. Should you need any further information, please [contact us]. Best, Marvelous Designer team

---

Section: Subscription/Payment
Type: Personal
Template: Personal_AnnualExpiring3
Title: Your subscription will expire in 3 days.
Contents:
Hello, This is a friendly reminder that your Marvelous Designer license will expire in 3 days. After your license expires, you can purchase a new license from your My Account page. Should you need any further information, please [contact us]. Best, Marvelous Designer team

Your subscription will expire soon.

Hello, This is a friendly reminder that your Marvelous Designer license will expire within 24 hours. After your license expires, you can purchase a new license from your My Account page. Should you need any further information, please [contact us]. Best, Marvelous Designer team

---

Section: Subscription/Payment
Type: Enterprise
Template: Enterprise_StandaloneAnnualExpiring7CompanyID
Title: [Marvelous Designer]Reminder: License expiring D-7
Contents:
Hello,
This is a friendly reminder that your Marvelous Designer license is scheduled for renewal in 
7 days.

Target License ID: {License ID}
Expiration Date: {expirationDate}

Important Notice: Enterprise Standalone Plan Will No Longer Be Available

Standalone Annual will no longer be provided, and Standalone Monthly will move to Network Online Monthly. Get $100 Discount and upgrade to Network Online Annual for $1,900—this offer is only available before your license expires(D-7 | {expirationDate}).

[Get $100 discount and upgrade to Network Online]

Click HERE to check out our new License Plan Policy

---

Section: Subscription/Payment
Type: Enterprise
Template: Enterprise_StandaloneAnnualExpiring14CompanyID
Title: [Marvelous Designer]Reminder: License expiring D-14
Contents:
Hello,
This is a friendly reminder that your Marvelous Designer license is scheduled for renewal in 
14 days.

Target License ID: {License ID}
Expiration Date: {expirationDate}

Important Notice: Enterprise Standalone Plan Will No Longer Be Available

Standalone Annual will no longer be provided, and Standalone Monthly will move to Network Online Monthly. Get $100 Discount and upgrade to Network Online Annual for $1,900—this offer is only available before your license expires(D-14 | {expirationDate}).

[Get $100 discount and upgrade to Network Online]

Click HERE to check out our new License Plan Policy

---

Section: Subscription/Payment
Type: Enterprise
Template: Enterprise_StandaloneAnnualExpiring3CompanyID
Title: [Marvelous Designer]Reminder: License expiring in D-3
Contents:
Hello,
This is a friendly reminder that your Marvelous Designer license is scheduled for renewal in 
3 days.

Target License ID: {License ID}
Expiration Date: {Expiry Date}

Important Notice: Enterprise Standalone Plan Will No Longer Be Available

Standalone Annual will no longer be provided, and Standalone Monthly will move to Network Online Monthly. Get $100 Discount and upgrade to Network Online Annual for $1,900—this offer is only available before your license expires(D-3 | {expirationDate}).

[Get $100 discount and upgrade to Network Online]

Click HERE to check out our new License Plan Policy

---

Section: Subscription/Payment
Type: Enterprise
Template: Enterprise_StandaloneAnnualExpiring1CompanyID
Title: [Marvelous Designer]Reminder: License expiring D-1
Contents:
Hello,
This is a friendly reminder that your annual Marvelous Designer license is set to expire tomorrow.

Target License ID: {License ID}
Expiration Date: {Expiry Date}

Important Notice: Enterprise Standalone Plan Will No Longer Be Available

Standalone Annual will no longer be provided, and Standalone Monthly will move to Network Online Monthly. Get $100 Discount and upgrade to Network Online Annual for $1,900—this offer is only available before your license expires(D-1 | {expirationDate}).

[Get $100 discount and upgrade to Network Online]

Click HERE to check out our new License Plan Policy

---

Section: Subscription/Payment
Type: Enterprise
Template: Enterprise_StandaloneAnnualExpiring1CompanyID
Title: [Marvelous Designer]Reminder: License expiring D-1
Contents:
Hello,
This is a friendly reminder that your annual Marvelous Designer license is set to expire tomorrow.

Target License ID: {License ID}
Expiration Date: {Expiry Date}

Enterprise Standalone Annual is no longer available.

Enterprise Standalone Annual is no longer available. All Enterpries plans are now offered through Network Online. Learn more about our new License Plan Policy.

Click HERE to check out our new License Plan Policy

[Choose a new plan]
Note: 중복 섹션 (1778:3213과 같은 이름, D-1 리마인더 변형: 버튼이 Choose a new plan)

---

Section: Subscription/Payment
Type: Personal
Template: Personal_AnnualExpiring7
Title: Your subscription will expire in 1 week.
Contents:
Hello, This is a friendly reminder that your Marvelous Designer license will expire in 1 week. After your license expires, you can purchase a new license from your My Account page. Should you need any further information, please [contact us]. Best, Marvelous Designer team

---

Section: Subscription/Payment
Type: Personal
Template: Personal_AnnualOrderComplete
Title: Your order has been confirmed.
Contents:
Hello,

Thank you for purchasing Marvelous Designer! 
Here's a summary of your order for your records:

LICENSE: {product name}
TYPE: ANNUAL
EXPIRATION DATE: {Expiry Date}(GMT)
ORDER DATE: {Order Date}(GMT)
AMOUNT: {Price} {Currency}
PAYMENT METHOD: {Payment Method}

Your license will not automatically renew after the expiry date. 
If you would like to keep using Marvelous Designer, click [here] to purchase a new license.
You can view and change the details of your information at any time from your [Order page].

Thank you for using Marvelous Designer!

Best, 
Marvelous Designer team

---

Section: Subscription/Payment
Type: All
Template: All_MonthlyPaymentCancel
Title: Your subscription has been canceled.
Contents:
Hello, 
We're sorry to see you cancel your subscription.

Your current subscription will be active until {Expiry Date}
After the expiration date, you will still be able to sign in to the Marvelous Designer website, but unable to sign in to the software.
Thank you for using Marvelous Designer and please do not hesistate to [contact us].

Best regards,
The Marvelous Designer team.

---

Section: Subscription/Payment
Type: All
Template: All_MonthlyPaymentNotice
Title: Your subscription will be renewed and charged after 7 days.
Contents:
Hello,

Your subscription will be renewed and charged on {Next Payment Date}(GMT).

If you want to stop using Marvelous Designer, please cancel your subscription from [My Account] at least 24 hours before the next scheduled payment. If you have any questions or concerns, please [contact us].

Best regards,
The Marvelous Designer team.

---

Section: Subscription/Payment
Type: All
Template: All_MonthlyPaymentFail
Title: Payment failed! Your subscription has been canceled.
Contents:
Hello

This is to inform you that your account has been canceled due to payment failure.

AMOUNT: {Price} {Currency}

Canceled On : {Payment Failure Date} (GMT)
Note : The payment was not accepted by {Payment Method}. Please contact [PaymentMethodLink] or your card issuer.

Your current subscription will expire on {Expiry Date} (GMT).

To keep using Marvelous Designer, please [subscribe again] with another payment method. 
If you have any questions or concerns, please [contact us].

Best regards,
The Marvelous Designer team.

---

Section: Subscription/Payment
Type: All
Template: All_MonthlyPaymentFail_3DS
Title: (없음)
Contents:
(본문 미작성)
Note: 이메일 본문 미작성 (캔버스 비어 있음). 발송 조건은 All_MonthlyPaymentFail과 동일

---

Section: Subscription/Payment
Type: All
Template: All_MonthlyPaymentComplete
Title: Billing Statement
Contents:
Hello,

Your billing statement is now ready to view. Your payment using {Payment Method} will be automatically charged charged as follows:

AMOUNT: {Price} {Currency}

You can view or download a complete break down of all charges under [My Account].
Please note that in order to protect your privacy, we can only communicate account information to the email address on file for your account. If there are any problems processing your automatic payment, you will receive an email asking you to update your credit card information.

Thank you for using Marvelous Designer and please do not hesistate to [contact us] if there is anything we could have done to help make your experience better.

Best regards,
The Marvelous Designer team.

---

Section: Subscription/Payment
Type: All
Template: All_MonthlyPaymentStart
Title: Your order has been confirmed.
Contents:
Hello,
Thanks for subscribing to Marvelous Designer! Here's a summary of your order for your records:

LICENSE: {product name}
TYPE: MONTHLY
EXPIRATION DATE: {Expiry Date}(GMT)
ORDER DATE: {Order Date}(GMT)
AMOUNT: {Price} {Currency}
PAYMENT METHOD: {Payment Method}

Your subscription will automatically renew {Next Payment Date}(GMT) and you will be charged {Next Price} plus any applicable taxes at that time. The subscription will automatically renew unless you turn it off no later than 24 hours before the end of the current period. You can view or change the details of your subscription at any time from your [My Account].

In order to protect your privacy, we can only communicate account information to the email address on file for your account. If there are any problems processing your automatic payment, you will receive an email requesting that you update your credit card information.

Thank you for using Marvelous Designer!

Best, 
Marvelous Designer team

---

Section: Subscription/Payment
Type: Student
Template: Student_MonthlyPaymentStart
Title: Student subscription confirmation
Contents:
Hello,

Thank you for purchasing! Your order has been confirmed. 
Here's a summary of your order for your records:

LICENSE: {product name}
TYPE: MONTHLY
EXPIRATION DATE: {Expiry Date}(GMT)
ORDER DATE: {Order Date}(GMT)
AMOUNT: {Price} {Currency}
PAYMENT METHOD: {Payment Method}

This student discount will be valid until {Student Discount Expiry e.g. Sep 12, 2017}(GMT) unless you cancel the subscription. Once you cancel it, the student discount will NOT be applicable. Your subscription will automatically renew {Next Payment Date e.g.Sep 12, 2017, PM 11:59}(GMT) and you will be charged {Next Price} {Currency} plus any applicable taxes at that time. The subscription will automatically renew unless you turn it off no later than 24 hours before the end of the current period. You can view or change the details of your subscription at any time from your [My Account]. In order to protect your privacy, we can only communicate account information to the email address on file for your account. If there are any problems processing your automatic payment, you will receive an email requesting that you update your credit card information. Thank you for using Marvelous Designer!

Best, 
Marvelous Designer team

---

Section: Subscription/Payment
Type: Student
Template: Student_MonthlyPaymentCancel
Title: Your student subscription has been canceled.
Contents:
Hello, Your student subscription has been canceled. The current subscription will be active until {Expiry Date}. After the expiration date, you will still be able to sign in to the Marvelous Designer website, but unable to sign in to the software. Please note that a student discount can be provided only once in a lifetime per user. The discount cannot be offered again, even if you re-subscribe. Thank you for using Marvelous Designer. If you don't recognize this request, please [contact us].

Best, 
Marvelous Designer team

---

Section: Subscription/Payment
Type: Personal
Template: Personal_SubscriptionSuspend3
Title: Your Subscription Has Been Canceled
Contents:
Hello, We were unable to process your payment after three attempts, and as a result, your subscription has been canceled as of {subscriptionCancelDate}. If you’d like to continue using Marvelous Designer, you can renew your subscription anytime. Simply visit Marvelous Designer [Plan] to get started again. We’d love to have you back! If you have any questions, feel free to [contact us]. Thank you, The Marvelous Designer Team

Best, 
Marvelous Designer team

[Update Payment Information]
Note: 버튼(Update Payment Information)은 컴포넌트 인스턴스라 본문 텍스트 추출에 없음. Description LINK 필드 기준으로 말미에 표기

---

Section: Subscription/Payment
Type: Personal
Template: Personal_SubscriptionSuspend2
Title: Your Subscription Is Still On Hold
Contents:
Hello

Thank you for using Marvelous Designer.

This is a reminder that your Marvelous Designer subscription is still suspended.
We attempted to process your payment again, but the issue with your payment information remains unresolved. 
To continue your subscription, please update your payment details using the link below:

[Update Payment Information] 
Thank you for your continued interest in Marvelous Designer.

Best regards,
The Marvelous Designer team.

---

Section: Subscription/Payment
Type: Personal
Template: Personal_SubscriptionSuspend1
Title: Update Required: Your account is on hold.
Contents:
Hello

Thank you for using Marvelous Designer.

We regret to inform you that there was an issue with verifying your payment information during the recent attempt to resume your subscription. 
As a result, your subscription is now suspended. 
To continue your subscription, please verify that your payment details are correct and make any necessary updates using the link below:

[Update Payment Information]

Best regards,
The Marvelous Designer team.

---

Section: Subscription/Payment
Type: Personal
Template: Personal_SubscriptionSuspend1_3DS
Title: Update Required: Your account is on hold.
Contents:
Hello, Thank you for using Marvelous Designer. We regret to inform you that there was an issue with verifying your payment information during the recent attempt to resume your subscription. As a result, your subscription is now suspended. To continue your subscription, please complete the verification process using the link below: [Complete Verification] Best regards, The Marvelous Designer team.

---

Section: System
Type: Enterprise
Template: Enterprise_OfflineKeyComplete
Title: Your V2C File for Network Offline Key Update.
Contents:
Hello {Company Name},

Please find the attached V2C file to update your Network Offline License for License ID: {License ID}.

Click [here] to download V2C File 
(If you're not able to download the file through the link above, please go to [this page] and login with your company account to download the file.)

For instructions on how to update the key, please refer to the [manual].

Feel free to contact us sales@marvelousdesigner.com anytime should you have any questions.

Thank you for using Marvelous Designer.

Best, 
Marvelous Designer team
Note: 캔버스에 "사용하지 않음" 오버레이

---

Section: System
Type: All
Template: All_Deactivation
Title: Your license has been signed out.
Contents:
Hello,

Your account using {requested license name} has been signed out successfully from other device.

If you have additional inquiries, please [contact us].

Best, 
Marvelous Designer team

---

Section: System
Type: All
Template: All_WelcomeEmail_MarketingYes
Title: Welcome to Marvelous Designer
Contents:
Ready to be a Marvelous Designer?
Welcome to Marvelous Designer!
Marvelous Designer is the industry standard for cloth simulation and modeling, pioneering the digital recreation of traditional garment-making values. Now it's time to unleash your creativity and start designing!

Your Account
{email}

[FEATURE]

Discover more features that Marvelous Designer provide.

[FEATURE]

[PLAN]

[PLAN]

Check out what we offer and find out the best option for you.

[TUTORIAL]

Master the software step-by-step with hand-picked contents.

[TUTORIAL]

[User Spotlight]

Check real-world examples of how Marvelous Designer has been a key player across the industries.

[User Spotlight]

CONNECT

Explore CLO-SET CONNECT asset store for your templates, make a few tweaks, and complete your look!

[CONENCT]

[HELP CENTER]

Find FAQs, troubleshooting guides, and user manuals to improve your knowledge.

[HELP CENTER]

---

Section: System
Type: All
Template: All_WelcomeEmail_MarketingNo
Title: Welcome to Marvelous Designer
Contents:
Ready to be a Marvelous Designer?
Welcome to Marvelous Designer!
Marvelous Designer is the industry standard for cloth simulation and modeling, pioneering the digital recreation of traditional garment-making values. Now it's time to unleash your creativity and start designing!

Your Account
{email}

[FEATURE]

Discover more features that Marvelous Designer provide.

[FEATURE]

[PLAN]

[PLAN]

Check out what we offer and find out the best option for you.

[TUTORIAL]

Master the software step-by-step with hand-picked contents.

[TUTORIAL]

[User Spotlight]

Check real-world examples of how Marvelous Designer has been a key player across the industries.

[User Spotlight]

CONNECT

Explore CLO-SET CONNECT asset store for your templates, make a few tweaks, and complete your look!

[CONENCT]

[HELP CENTER]

Find FAQs, troubleshooting guides, and user manuals to improve your knowledge.

[HELP CENTER]

Don't want to miss the latest updates?

[Go subscribe us and stay updated]

---

Section: System
Type: All
Template: All_UserpoolSoftwareShared
Title: {Headquarter Name} has sent an installer.
Contents:
{Headquarter Name} has shared INSTALLER DOWNLOAD ACCESS

If you need any further help, please contact us or visit help center. Best regards, The Marvelous Designer Team

Please download Marvelous Designer for Enterprise below and sign in with CLO-SET account.

[MAC OS]

[WINDOW 64 bit]

Check Specification

The INSTALLER DOWNLOAD access expires on YYYY.MM.DD.

---

Section: System
Type: All
Template: All_UserpoolInvitation
Title: {Headquarter Name} has invited you to Userpool.
Contents:
{Headquarter Name} wants to share a license with you. Please review the steps below.

If you need any further help, please contact us or visit help center. Best regards, The Marvelous Designer Team

Please download Marvelous Designer for Enterprise below and sign in with CLO-SET account.

[Go to Downloads]

The INSTALLER DOWNLOAD access expires on YYYY.MM.DD.

[CLO-SET SIGN IN]

Don’t have CLO-SET account?

SIGN UP

Why do we need a CLO-SET account to use Marvelous Desginer

---

Section: System
Type: All
Template: All_ForumComments
Title: New reply posted on your subscribed topic.
Contents:
Hi {user ID},

A new reply has been posted on the topic you subscribed.

[See My Post]

---

Section: System
Type: All
Template: All_ContactUs
Title: Thanks for contacting us
Contents:
Hello

Thank you for getting in touch with us. We just wanted to let you know that we've received your message and our support agent will get back to you within 2 business days.

Best regards, 
The Marvelous Designer Team

Have any questions? Please check out our [help center]!

FOOTER

---

Section: System
Type: All
Template: All_OfflineAuth
Title: Your Requested Offline Authentication Key
Contents:
Hello,

Please use the attached Offline Authentication Key to activate your license. For instructions on how the use the key, please refer to the [manual].

Feel free to contact us at anytime should you have any questions. Thank you for using Marvelous Designer.

Best, 
Marvelous Designer team

---

Section: System
Type: Personal
Template: Personal_LearningContents1
Title: Start Creating with Marvelous Designer Today!
Contents:
Now’s the perfect time to dive into endless possibilities with the ultimate cloth creation tool. 
Get started for free and unlock your creative potential!

[Try Now]

Don't know where to start? Explore our tutorials!

[Check Quick Starts]

Get inspired by the user cases!

[Learn More]

---

Section: System
Type: Personal
Template: Personal_LearningContents2
Title: You've unlocked exclusive tutorials.
Contents:
Hello,   You now have access to exclusive benefits designed just for you: Handpicked Tutorials  Curated by the Marvelous Designer Team to help you master the software. Filter tutorials by skill level and language to find the perfect fit for you.

[Check Playlists]

Need assistance? Our comprehensive user guide will help you explore the key features and functions with ease.

[Check User Guide]

Get inspired by the user cases!

[Learn More]

---

Section: System
Type: Personal
Template: Personal_LearningContents3
Title: Free assets and popular features that people use the most.
Contents:
Hello,

Some features that you can use for a easier start!

CONNECT FREE ASSET

CLO-SET CONNECT, an extension of CLO-SET, is a global digital apparel community and is home to a digital asset marketplace, allowing artists and vendors to purchase and sell 3D assets.

[Connect Free Asset]

and we want to introduce the most used tools in Marvelous Designer so far.

Tool 1

Description

[Button]

Tool 2

[Button]

Description

Tool 3

Description

[Button]

Tool 4

Description

[Button]

Best, 
Marvelous Designer team
Note: 캔버스에 "보류 중" 오버레이

---

Section: System
Type: Enterprise
Template: Enterprise_ UserpoolMemberAdded
Title: (Userpool) New member(s) can use your license IDs.
Contents:
New member(s) can use your license IDs.

{Member Email} can now use {License ID}’s license.

GUSET EMAIL: {Member Email}

JOINED DATE: {JOINED DATE}

JOINED BY: {JOINED PATH}

If you cannot verify who this guest is, please check with your team or delete in License Account Admin.

{bb@email.com} can now use {License ID}’s license.

GUSET EMAIL: {Member Email}

JOINED DATE: {JOINED DATE}

JOINED BY: {JOINED PATH}

If you cannot verify who this guest is, please check with your team or delete in License Account Admin.

{cc@email.com} can now use {License ID}’s license.

GUSET EMAIL: {Member Email}

JOINED DATE: {JOINED DATE}

JOINED BY: {JOINED PATH}

If you cannot verify who this guest is, please check with your team or delete in License Account Admin.

---

Section: Trial
Type: Enterprise
Template: Enterprise_TrialInquiryStaff
Title: Enterprise Trial Inquiry [{Name}, {Country}]
Contents:
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

---

Section: Trial
Type: Enterprise
Template: Enterprise_TrialInquiryUser
Title: Enterprise Trial Inquiry
Contents:
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

---

Section: Trial
Type: Personal
Template: Personal_HelpTrial
Title: How to Fully Experience Your Marvelous Designer Trial
Contents:
Hello,

We've brought you some services to make your trial easier and help you learn Marvelous Designer faster!

EXCLUSIVE TUTORIALS

Master the software step-by-step with hand-picked contents.

[Tutorial]

[FEATURE]

[FEATURE]

Discover more features that Marvelous Designer provide.

CONNECT FREE ASSET

Explore CLO-SET CONNECT asset store for your templates, make a few tweaks, and complete your look!

CONNECT

USER SPOTLIGHT

User Spotlight Check real-world examples of how Marvelous Designer has been a key player across the industries.

[User Spotlight]

Best, 
Marvelous Designer team

---

Section: Trial
Type: Personal
Template: Personal_TrialExpiring3Continue
Title: Your trial is almost over.
Contents:
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

---

Section: Trial
Type: Personal
Template: Personal_TrialExpiring3Cancel
Title: You can still enjoy trial for 3 days.
Contents:
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

---

Section: Trial
Type: Personal
Template: Personal_TrialCancel
Title: Your trial is canceled.
Contents:
Hi,

Thank you for trying Marvelous Designer! As per your request, your trial has been successfully canceled, and you won’t be charged.

We hope you enjoyed exploring the possibilities of Marvelous Designer and found the experience creative and rewarding. If you ever feel like revisiting, you're always welcome to return at any time!

Just a reminder, Marvelous Designer offers:

- Easy-to-follow tutorials to help you master the tool
- Free assets on CONNECT to enhance your projects
- Frequent feature updates to keep your work at the cutting edge

[Check Our Pricing Options]

If you have any questions or need assistance, don’t hesitate to contact us. We hope to see you back soon!

Best, 
Marvelous Designer team

---

Section: Trial
Type: Personal
Template: Personal_TrialExpiry
Title: Your trial is finished!
Contents:
Hello,

Thank you for using the Marvelous Designer trial. Some features are ready for your Marvelous Designer projects.

EXCLUSIVE TUTORIALS

Master the software step-by-step with hand-picked contents.

[Tutorial]

[FEATURE]

[FEATURE]

Discover more features that Marvelous Designer provide.

CONNECT FREE ASSET

Explore CLO-SET CONNECT asset store for your templates, make a few tweaks, and complete your look!

CONNECT

USER SPOTLIGHT

User Spotlight Check real-world examples of how Marvelous Designer has been a key player across the industries.

[User Spotlight]

If you have any inquiries, please [contact us].

Best, 
Marvelous Designer team

---

Section: Trial
Type: Personal
Template: Personal_TrialStart
Title: Your 14-day free trial begins.
Contents:
Hello,
 Your trial license period has been started since {Trial Start Date}. Try out all the latest features of Marvelous Designer!
This trial license will be valid until {Trial Expiry Date}.
 If you have any inquiries, please [contact us].

Best, 
Marvelous Designer team

---
