# Subscription / Payment Email Templates

이메일 자동화 Subscription / Payment 섹션의 발송 조건과 카피 모음.  
Figma: `EMAIL AUTOMATION` 파일 > `EMAIL CONTENTS` > `2. Subscription/Payment`  
추출일: 2026-09-01 (Figma 캔버스 기준. Description 패널의 발송 조건, 수신자, 변수를 함께 기록)

---

## Enterprise_MonthlyExpiring7

**발송 조건:** CompanyID가 소유한 License ID에 대한 Standalone Monthly 만료 7일 전 오전 10시 발송  
**수신자:** COMPANY ID  
**갱신일:** 2024.11.01  

**Subject:** Upcoming Renewal: Marvelous Designer Monthly License

**Body:**
```
Hello, 
This is a friendly reminder that your Marvelous Designer license is scheduled for renewal in 7 days.

Target License ID: {License ID}
Expiration Date: {Expiry Date}

We’re thrilled to have you as part of the Marvelous Designer community and hope you’re enjoying the experience! 
If you’d like to continue using the software, you can renew your license after {Expiry Date}. Please visit [Pricing] to renew, or contact us at sales@marvelousdesigner.com if you need any assistance."

Best regards,
The Marvelous Designer team.
```

**변수:**
```
{License ID}: 해당 라이선스를 사용 중인 End User의 ID
{Expiry Date}: {해당 결제에 의해 사용할 수 있는 마지막 날짜} 
```

---

## Enterprise_AnnualExpiring14CompanyID

**발송 조건:** CompanyID가 소유한 License ID에 대한 1년 선결제 라이선스 만료 14일전 오전 10시 발송  
**수신자:** COMPANY ID  
**갱신일:** 2026.06.09  

**Subject:** Reminder: Marvelous Designer License Ending in 14 Days

**Body:**
```
Hello, This is a friendly reminder that your annual Marvelous Designer license will expire in 14 days. After your license expires, you can purchase a new license from your My Account page. Should you need any further information, please [contact us]. Best, Marvelous Designer team

Target License ID: {License ID}
Expiration Date: {Expiry Date}
```

**변수:**
```
{License ID}: 해당 라이선스를 사용 중인 End User의 ID
{Expiry Date}: {해당 결제에 의해 사용할 수 있는 마지막 날짜} 
```

---

## Enterprise_UpgradeOrderComplete

**발송 조건:** Company ID의 이메일로 기업 License Subscription으로 전환 구매 성공 시 즉시 발송  
**수신자:** COMPANY ID  
**갱신일:** 2024.11.01  

**Subject:** Your order has been confirmed.

**Body:**
```
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

Transaction Summary

The installer for the License ID(s) can be downloaded from [My Account] (Sign in with License ID) or [License Account Admin] (Sign in with Company ID).

Thank you!

Best, 
Marvelous Designer team
```

**변수:**
```
{Product Name}: Marvelous Designer Enterprise + {Network Online or Network Offline or Standalone}
{Subscription Type}: {MONTHLY or ANNUAL}
{Expiry Date}: {해당 결제에 의해 사용할 수 있는 마지막 날짜} + GMT
{Order Date}: {결제 완료한 날짜(해당 이메일 발송 날짜)}
{Price}: {해당 결제에 포함된 구매 가격}
{Currency}: USD or CNY
{Payment Method}: {Stripe or Paypal or Alipay}
{License ID}: 결제된 라이선스를 할당받는 라이선스 아이디
```

---

## Enterprise_AnnualOrderComplete

**발송 조건:** 기업 1년 선결제 Subscription 구매 완료 시 해당 Company ID에 즉시 발송  
**수신자:** COMPANY ID  
**갱신일:** 2024.11.01  

**Subject:** Your order has been confirmed.

**Body:**
```
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

Transaction Summary

The installer for the License ID(s) can be downloaded from [My Account] (Sign in with License ID) or [License Account Admin] (Sign in with Company ID).

Thank you!

Best, 
Marvelous Designer team
```

**변수:**
```
{Product Name}: Marvelous Designer Enterprise + {Network Online or Network Offline or Standalone}
{Subscription Type}: ANNUAL(고정)
{Expiry Date}: {해당 결제에 의해 사용할 수 있는 마지막 날짜} + GMT
{Order Date}: {결제 완료한 날짜(해당 이메일 발송 날짜)}
{Price}: {해당 결제에 포함된 구매 가격}
{Currency}: USD or CNY
{Payment Method}: {Stripe or Paypal or Alipay}
{License ID}: 결제된 라이선스를 할당받는 라이선스 아이디
```

---

## Enterprise_AnnualExpiring14EndUser

**발송 조건:** 해당 라이선스를 할당받은 License ID에게 1년 선결제 라이선스 만료 14일전 오전 10시 발송  
**수신자:** ENDUSER  
**갱신일:** 2026.06.09  

**Subject:** Reminder: Marvelous Designer License Ending in 14 Days

**Body:**
```
Hello, This is a friendly reminder that your annual Marvelous Designer license will expire in 14 days. If you wish to continue using the software, please contact your administrator to renew your license. Should you need any further information, please [contact us]. Best, Marvelous Designer team
```

---

## Personal_AnnualExpiring14

**발송 조건:** Personal 계정이 소유한 Annual License 만료 14일 전 오전 10시 발송  
**수신자:** PERSONAL  
**갱신일:** 2026.06.09  

**Subject:** Your subscription will expire in 2 weeks.

**Body:**
```
Hello, This is a friendly reminder that your Marvelous Designer license will expire in 2 weeks. After your license expires, you can purchase a new license from your My Account page. Should you need any further information, please [contact us]. Best, Marvelous Designer team
```

**비고:** 발송 시점: 만료 날짜 - 14일의 오전 10시

---

## Personal_AnnualExpiring3

**발송 조건:** 개인 1년 선결제 라이선스 만료 3일 전 발송 / --- / 개인 1년 선결제 라이선스 만료 1일 전 발송 (Personal_AnnualExpiring1, 같은 섹션에 중첩)  
**수신자:** PERSONAL / --- / PERSONAL  
**갱신일:** 2026.06.09 / --- / 2026.06.09  

**Subject:** Your subscription will expire in 3 days.

**Body:**
```
Hello, This is a friendly reminder that your Marvelous Designer license will expire in 3 days. After your license expires, you can purchase a new license from your My Account page. Should you need any further information, please [contact us]. Best, Marvelous Designer team

Your subscription will expire soon.

Hello, This is a friendly reminder that your Marvelous Designer license will expire within 24 hours. After your license expires, you can purchase a new license from your My Account page. Should you need any further information, please [contact us]. Best, Marvelous Designer team
```

**비고:** -
---
-

---

## Enterprise_StandaloneAnnualExpiring7CompanyID

**발송 조건:** 만료 7일 전 발송  
**수신자:** 대상 License ID를 소유한 Company ID에 등록된 이메일  

**Subject:** [Marvelous Designer]Reminder: License expiring D-7

**Body:**
```
Hello,
This is a friendly reminder that your Marvelous Designer license is scheduled for renewal in 
7 days.

Target License ID: {License ID}
Expiration Date: {expirationDate}

Important Notice: Enterprise Standalone Plan Will No Longer Be Available

Standalone Annual will no longer be provided, and Standalone Monthly will move to Network Online Monthly. Get $100 Discount and upgrade to Network Online Annual for $1,900—this offer is only available before your license expires(D-7 | {expirationDate}).

Get $100 discount and upgrade to Network Online

Click HERE to check out our new License Plan Policy
```

---

## Enterprise_StandaloneAnnualExpiring14CompanyID

**발송 조건:** 만료 14일 전 발송  
**수신자:** 대상 License ID를 소유한 Company ID에 등록된 이메일  

**Subject:** [Marvelous Designer]Reminder: License expiring D-14

**Body:**
```
Hello,
This is a friendly reminder that your Marvelous Designer license is scheduled for renewal in 
14 days.

Target License ID: {License ID}
Expiration Date: {expirationDate}

Important Notice: Enterprise Standalone Plan Will No Longer Be Available

Standalone Annual will no longer be provided, and Standalone Monthly will move to Network Online Monthly. Get $100 Discount and upgrade to Network Online Annual for $1,900—this offer is only available before your license expires(D-14 | {expirationDate}).

Get $100 discount and upgrade to Network Online

Click HERE to check out our new License Plan Policy
```

---

## Enterprise_StandaloneAnnualExpiring3CompanyID

**발송 조건:** 만료 3일 전 발송  
**수신자:** 대상 License ID를 소유한 Company ID에 등록된 이메일  

**Subject:** [Marvelous Designer]Reminder: License expiring in D-3

**Body:**
```
Hello,
This is a friendly reminder that your Marvelous Designer license is scheduled for renewal in 
3 days.

Target License ID: {License ID}
Expiration Date: {Expiry Date}

Important Notice: Enterprise Standalone Plan Will No Longer Be Available

Standalone Annual will no longer be provided, and Standalone Monthly will move to Network Online Monthly. Get $100 Discount and upgrade to Network Online Annual for $1,900—this offer is only available before your license expires(D-3 | {expirationDate}).

Get $100 discount and upgrade to Network Online

Click HERE to check out our new License Plan Policy
```

---

## Enterprise_StandaloneAnnualExpiring1CompanyID

**발송 조건:** 만료 1일 전 발송  
**수신자:** 만료 알림 대상 License ID를 소유한 Company ID에 등록된 이메일  

**Subject:** [Marvelous Designer]Reminder: License expiring D-1

**Body:**
```
Hello,
This is a friendly reminder that your annual Marvelous Designer license is set to expire tomorrow.

Target License ID: {License ID}
Expiration Date: {Expiry Date}

Important Notice: Enterprise Standalone Plan Will No Longer Be Available

Standalone Annual will no longer be provided, and Standalone Monthly will move to Network Online Monthly. Get $100 Discount and upgrade to Network Online Annual for $1,900—this offer is only available before your license expires(D-1 | {expirationDate}).

Get $100 discount and upgrade to Network Online

Click HERE to check out our new License Plan Policy
```

---

## Enterprise_StandaloneAnnualExpiring1CompanyID

**발송 조건:** 만료 1일 전 발송 (중복 섹션)  
**수신자:** 만료 알림 대상 License ID를 소유한 Company ID에 등록된 이메일  

**Subject:** [Marvelous Designer]Reminder: License expiring D-1

**Body:**
```
Hello,
This is a friendly reminder that your annual Marvelous Designer license is set to expire tomorrow.

Target License ID: {License ID}
Expiration Date: {Expiry Date}

Enterprise Standalone Annual is no longer available.

Enterprise Standalone Annual is no longer available. All Enterpries plans are now offered through Network Online. Learn more about our new License Plan Policy.

Click HERE to check out our new License Plan Policy

Choose a new plan
```

---

## Personal_AnnualExpiring7

**발송 조건:** Personal 계정이 소유한 Annual License 만료 7일 전 오전 10시 발송  
**수신자:** PERSONAL  
**갱신일:** 2026.06.09  

**Subject:** Your subscription will expire in 1 week.

**Body:**
```
Hello, This is a friendly reminder that your Marvelous Designer license will expire in 1 week. After your license expires, you can purchase a new license from your My Account page. Should you need any further information, please [contact us]. Best, Marvelous Designer team
```

---

## Personal_AnnualOrderComplete

**발송 조건:** Personal 계정의 Annual Plan 구매 확정 즉시 해당 계정의 이메일로 발송  
**수신자:** COMPANY ID  
**갱신일:** 2024.11.01  

**Subject:** Your order has been confirmed.

**Body:**
```
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
```

**변수:**
```
{Product Name}: Marvelous Designer Perosnal + {Trial}(Trial인 경우에만 노출)
{Subscription Type}: ANNUAL(고정)
{Expiry Date}: {해당 결제에 의해 사용할 수 있는 마지막 날짜} + GMT
{Order Date}: {결제 완료한 날짜(해당 이메일 발송 날짜)}
{Price}: {해당 결제에 포함된 구매 가격}
{Currency}: USD or CNY
{Payment Method}: {Stripe or Paypal or Alipay}
```

---

## All_MonthlyPaymentCancel

**발송 조건:** Monthly Subscription 구독 취소 시 해당 계정의 이메일로 즉시 발송  
**수신자:** ALL TYPES  
**갱신일:** 2024.11.01  

**Subject:** Your subscription has been canceled.

**Body:**
```
Hello, 
We're sorry to see you cancel your subscription.

Your current subscription will be active until {Expiry Date}
After the expiration date, you will still be able to sign in to the Marvelous Designer website, but unable to sign in to the software.
Thank you for using Marvelous Designer and please do not hesistate to [contact us].

Best regards,
The Marvelous Designer team.
```

**변수:**
```
{Expiry Date}: 전 결제로 인한 라이선스 사용 기간의 마지막 날
```

**비고:** Target에서 Student 타입 사용자는 제외: Student 타입은 Student_MonthlyPaymentCancel 템플릿 사용

---

## All_MonthlyPaymentNotice

**발송 조건:** Stripe/paypal에서 recurring 결제되기 7일 전 오전 10시에 해당 계정의 이메일로 발송  
**수신자:** ALL TYPES  
**갱신일:** 2024.11.01  

**Subject:** Your subscription will be renewed and charged after 7 days.

**Body:**
```
Hello,

Your subscription will be renewed and charged on {Next Payment Date}(GMT).

If you want to stop using Marvelous Designer, please cancel your subscription from [My Account] at least 24 hours before the next scheduled payment. If you have any questions or concerns, please [contact us].

Best regards,
The Marvelous Designer team.
```

**변수:**
```
{Next Payment Date}: 해당 계정의 다음 결제 날짜
```

**비고:** 구독을 취소하여 다음 결제가 진행되지 않을 예정인 계정은 대상에서 제외

---

## All_MonthlyPaymentFail

**발송 조건:** 결제 불가로 구독이 취소된 경우 해당 계정의 이메일로 즉시 발송  
**수신자:** ALL TYPES  
**갱신일:** 2024.11.01  

**Subject:** Payment failed! Your subscription has been canceled.

**Body:**
```
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
```

**변수:**
```
{Price}: 해당 결제의 금액
{Currency}: USD or CNY
{Payment Failure Date}: Transaction 실패 시점의 시간
{Payment Method}: {Stripe or Paypal or Alipay, Coupon, etc.}
{Expiry Date}: 해당 결제에 의해 사용할 수 있는 마지막 날짜 + GMT
```

**비고:** 이 템플릿은 Student포함 모든 타입 제공 입니다. Student_MonthlyPaymentFail 따로 없음

---

## All_MonthlyPaymentFail_3DS

**발송 조건:** 결제 불가로 구독이 취소된 경우 해당 계정의 이메일로 즉시 발송  
**수신자:** ALL TYPES  
**갱신일:** 2024.11.01  

**Subject:** 

**Body:**
```
(이메일 본문 미작성: 캔버스 비어 있음)
```

**변수:**
```
(All_MonthlyPaymentFail과 동일)
```

**비고:** 이 템플릿은 Student포함 모든 타입 제공 입니다. Student_MonthlyPaymentFail 따로 없음. 이메일 본문 캔버스는 비어 있음(미작성)

---

## All_MonthlyPaymentComplete

**발송 조건:** Paypal, Stripe에서 recurring 결제 성공 시 해당 계정의 이메일로 즉시 발송  
**수신자:** ALL TYPES  
**갱신일:** 2025.01.16  

**Subject:** Billing Statement

**Body:**
```
Hello, 

Your billing statement is now ready to view. Your payment using {Payment Method} will be automatically charged charged as follows:

AMOUNT: {Price} {Currency}

You can view or download a complete break down of all charges under [My Account].
Please note that in order to protect your privacy, we can only communicate account information to the email address on file for your account. If there are any problems processing your automatic payment, you will receive an email asking you to update your credit card information.

Thank you for using Marvelous Designer and please do not hesistate to [contact us] if there is anything we could have done to help make your experience better.

Best regards,
The Marvelous Designer team.
```

**변수:**
```
{Payment Method}: {Stripe or Paypal or Alipay}
{Price}: 해당 결제에 포함된 구매 가격
{Currency}: USD or CNY
```

**비고:** 이 템플릿은 Student포함 모든 타입 제공 입니다. Student_MonthlyPaymentComplete 따로 없음

---

## All_MonthlyPaymentStart

**발송 조건:** Monthly Subscription 첫 구매 완료 시 해당 계정의 이메일로 즉시 발송  
**수신자:** ALL TYPES  
**갱신일:** 2024.11.01  

**Subject:** Your order has been confirmed.

**Body:**
```
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
```

**변수:**
```
{Product Name}: Marvelous Designer Perosnal + {Trial}(Trial인 경우에만 노출)
{Subscription Type}: ANNUAL
{Expiry Date}: {해당 결제에 의해 사용할 수 있는 마지막 날짜} + GMT
{Order Date}: {결제 완료한 날짜(해당 이메일 발송 날짜)}
{Price}: {해당 결제에 포함된 구매 가격}
{Next Price}: {해당 라이선스에 대한 다음 결제 금액}
{Currency}: USD or CNY
{Payment Method}: {Stripe or Paypal or Alipay}
{Next Payment Date}: 다음 결제 예정일
```

**비고:** Target에서 Student 타입 사용자는 제외: Student 타입은 Student_MonthlyPaymentStart 템플릿 사용

---

## Student_MonthlyPaymentStart

**발송 조건:** Student Monthly Subscription 시작 시 알림 (Legacy)  
**수신자:** COMPANY ID  
**갱신일:** 2024.11.01  

**Subject:** Student subscription confirmation

**Body:**
```
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
```

**변수:**
```
{Product Name}: Marvelous Designer Personal + {Student or Trial}(Trial일 경우에만 노출)
{Subscription Type}: MONTHLY(고정)
{Expiry Date}: {해당 결제에 의해 사용할 수 있는 마지막 날짜 + GMT}
{Order Date}: {결제 완료한 날짜(해당 이메일 발송 날짜)}
{Price}: {해당 결제에 포함된 구매 가격}
{Next Price}: {해당 라이선스에 대한 다음 결제 금액}
{Currency}: USD or CNY
{Payment Method}: {Stripe or Paypal or Alipay}
```

---

## Student_MonthlyPaymentCancel

**발송 조건:** Student Subscription 자동결제 취소시 해당 계정의 이메일로 즉시 발송 (LEGACY)  
**수신자:** MD_BIZDEV  
**갱신일:** 2024.11.01  

**Subject:** Your student subscription has been canceled.

**Body:**
```
Hello, Your student subscription has been canceled. The current subscription will be active until {Expiry Date}. After the expiration date, you will still be able to sign in to the Marvelous Designer website, but unable to sign in to the software. Please note that a student discount can be provided only once in a lifetime per user. The discount cannot be offered again, even if you re-subscribe. Thank you for using Marvelous Designer. If you don't recognize this request, please [contact us].

Best, 
Marvelous Designer team
```

**변수:**
```
{Expiry Date}: 전 결제로 인한 라이선스 사용 기간의 마지막 날
```

**비고:** Student Monthly 용도(Legacy)였고 현재 64명의 Student Monthly가 남아있어서 유지해야함. Student Monthly 사용자가 모두 사라지면, 사용되지 않을 템플릿

---

## Personal_SubscriptionSuspend3

**발송 조건:** 3차 결제 후 실패 직후 발송 (ex. 3차 결제 27일)  
**수신자:** PERSONAL  
**갱신일:** 2024.11.14  

**Subject:** Your Subscription Has Been Canceled

**Body:**
```
Hello, We were unable to process your payment after three attempts, and as a result, your subscription has been canceled as of {subscriptionCancelDate}. If you’d like to continue using Marvelous Designer, you can renew your subscription anytime. Simply visit Marvelous Designer [Plan] to get started again. We’d love to have you back! If you have any questions, feel free to [contact us]. Thank you, The Marvelous Designer Team

Best, 
Marvelous Designer team
```

**변수:**
```
{SubscriptionCancelDate}:
```

---

## Personal_SubscriptionSuspend2

**발송 조건:** 3차 결제 후 실패 직후 발송 (ex. 3차 결제 27일)  
**수신자:** PERSONAL  
**갱신일:** 2024.11.14  

**Subject:** Your Subscription Is Still On Hold

**Body:**
```
Hello

Thank you for using Marvelous Designer.

This is a reminder that your Marvelous Designer subscription is still suspended.
We attempted to process your payment again, but the issue with your payment information remains unresolved. 
To continue your subscription, please update your payment details using the link below:

[Update Payment Information] 
Thank you for your continued interest in Marvelous Designer.


Best regards,
The Marvelous Designer team.
```

**변수:**
```
{Subscription Cancel Date}:
```

---

## Personal_SubscriptionSuspend1

**발송 조건:** 구독 자동 재개 시점 결제 후 실패 직후 발송  
**수신자:** PERSONAL_MONTHLY  
**갱신일:** 2025.02.26  

**Subject:** Update Required: Your account is on hold.

**Body:**
```
Hello

Thank you for using Marvelous Designer.

We regret to inform you that there was an issue with verifying your payment information during the recent attempt to resume your subscription. 
As a result, your subscription is now suspended. 
To continue your subscription, please verify that your payment details are correct and make any necessary updates using the link below:

[Update Payment Information]



Best regards,
The Marvelous Designer team.
```

---

## Personal_SubscriptionSuspend1_3DS

**발송 조건:** 구독 자동 재개 시점 결제 후 실패 직후 발송  
**수신자:** PERSONAL_MONTHLY 중 3ds 인증이 필요한 suspended  
**갱신일:** 2025.02.26  

**Subject:** Update Required: Your account is on hold.

**Body:**
```
Hello, Thank you for using Marvelous Designer. We regret to inform you that there was an issue with verifying your payment information during the recent attempt to resume your subscription. As a result, your subscription is now suspended. To continue your subscription, please complete the verification process using the link below: [Complete Verification] Best regards, The Marvelous Designer team.
```

---
