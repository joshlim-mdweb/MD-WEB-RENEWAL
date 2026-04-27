# OPINION MVP Product Policy Source of Truth

This document defines the modular product policy baseline for the OPINION MVP.
Use this file as the default reference when generating PRDs, functional specs, UX flows, validation rules, edge cases, and implementation guidance.

---

# 0. How to Use This Document

## Purpose

This file is the source of truth for OPINION MVP policy decisions.
It should be used to keep product planning, design, development, and QA aligned.

## Writing Rules

When using this document to generate outputs:

- follow MVP-first thinking
- avoid introducing subscription plans unless explicitly requested later
- do not expand scope beyond the policies defined here
- prefer simple, enforceable rules over ideal but complex systems
- preserve data integrity over editing convenience
- preserve reward trust over growth shortcuts
- treat AI features as token-based, not plan-based

## Output Guidance

When generating documents from this file:

- write in Korean unless explicitly asked otherwise
- keep language practical and implementation-friendly
- distinguish clearly between:
  - allowed
  - restricted
  - blocked
  - recommended
- when a policy is not fixed, mark it as an open question instead of inventing a final rule

---

# 1. Product Overview

## Product Definition

OPINION은 두 레이어로 구성된 인센티브 기반 리서치 플랫폼이다.

**Poll — 커뮤니티 레이어**
플랫폼이 운영하는 커뮤니티 공간. 가볍고 빠른 단일 질문에 참여해 포인트를 쌓는다.
플랫폼이 보상을 직접 지급하며, 유저 유입과 리텐션을 담당한다.

**Survey — 서비스 레이어**
창작자가 포인트를 구매해 보상을 세팅하고, 응답자가 참여해 그 보상을 받는 리서치 서비스.
플랫폼은 포인트 거래 흐름에서 수수료를 수취한다.

Users can:

- create Surveys (창작자)
- purchase points to fund Survey rewards (창작자)
- participate in Surveys — 3 free/day, +1 per 500P consumed (응답자)
- participate in Polls — 100P each, max 5/day, platform-funded (모든 유저)
- accumulate points and cash out (출금 시 수수료 8%, Max 플랜 6%)
- use AI for survey creation and analysis (구독 플랜 크레딧 기반)

## MVP Focus

The MVP should stay intentionally simple.

The MVP focuses on:

- Survey creation and participation
- Poll participation and reward accumulation
- Point and withdrawal structure
- AI-assisted survey creation
- AI-assisted result analysis
- minimal but clear policy rules

The MVP does **not** include:

- subscription plans
- multi-tier pricing plans
- advanced collaboration systems
- complicated role packages
- overly complex branching or billing systems

---

# 2. Global Product Principles

## 2.1 MVP Simplicity First

The MVP should be designed with the smallest useful rule set.
Do not introduce plan-based complexity unless explicitly requested later.

## 2.2 Data Integrity First

Survey structure, response data, point rewards, withdrawal eligibility, and report outputs are linked.
Structural changes that can damage interpretation or accounting should be restricted.

## 2.3 Reward Trust First

Because the product includes monetary-like incentives, trust in reward logic is more important than rapid growth hacks.

## 2.4 Prefer Status Changes Over Hard Delete

Where response data, point data, or analysis data already exist, use status transitions such as hidden, closed, archived, inactive, or reversed instead of hard deletion.

## 2.5 AI Is Usage-Based

AI features are not unlocked by plans.
AI is used through token consumption.

## 2.6 Abuse Prevention Starts in MVP

The product must assume abuse risks from the start.
Duplicate participation, low-quality responses, bots, and suspicious withdrawal attempts must be accounted for in policy and implementation.

---

# 3. Shared Status System

## 3.1 Content Statuses

Use the following common status values where relevant:

- Draft
- Published
- Closed
- Archived

### Definitions

- Draft: being created or edited, not open to respondents
- Published: open and available for participation
- Closed: no longer collecting new responses
- Archived: preserved for recordkeeping, not active in normal flows

## 3.2 Reward Statuses

Use the following point/reward statuses where relevant:

- Earned
- Pending
- Available
- Withdrawn
- Reversed

### Definitions

- Earned: reward event recorded
- Pending: waiting for validation, review, or settlement
- Available: eligible for withdrawal
- Withdrawn: already cashed out
- Reversed: invalidated or taken back

## 3.3 Withdrawal Statuses

Use the following withdrawal statuses where relevant:

- Available
- Requested
- Processing
- Completed
- Failed
- Canceled

---

# 4. Service Common Policy Module

## 4.1 Scope

This module applies across:

- Survey
- Poll
- Report
- My Page
- Point / Withdrawal
- AI Usage

## 4.2 Core Shared Rules

### Participation-based reward rule

Rewards are granted only after valid completion of participation.

### AI token rule

All AI features are token-based.
No subscription logic should be introduced in MVP.

### Integrity rule

Once responses exist, structural changes should be restricted.

### Abuse review rule

Suspicious participation or suspicious reward events may remain Pending or be excluded from reward eligibility.

## 4.3 Beta Budget Context

The beta user test budget is:

- 100 users x 30,000 KRW = 3,000,000 KRW

This is a beta operation/testing budget and should be treated separately from in-product reward payout budget.

## 4.4 Event Reward Examples

Possible event reward examples:

Option A

- first 50 users x 1,000 KRW
- random 5 users x 10,000 KRW

Option B

- first 30 users x 1,000 KRW
- random 3 users x 10,000 KRW

### Rule

Event rewards are separate from standard Poll/Survey participation rewards.

---

# 5. Survey Policy Module

## 5.1 Survey Definition

A Survey is a structured response collection object with multiple questions and a more intentional flow than Poll.

## 5.2 Survey Scope

This applies to:

- Survey
- Survey List
- Survey Detail
- Survey Builder
- My Surveys
- Participated Surveys

## 5.3 Survey Status Policy

### Statuses

- Draft
- Published
- Closed
- Archived

### State meanings

- Draft: only editable by creator, not public
- Published: public and answerable
- Closed: no longer answerable, data preserved
- Archived: retained but generally hidden from active flows

### Recommended transitions

- Draft -> Published
- Published -> Closed
- Closed -> Archived

### Restricted transitions

- Published -> Draft: not allowed by default
- Archived -> Published: not included in MVP by default

## 5.4 Survey Edit Policy

### Draft

Allowed:

- edit title
- edit description
- edit questions
- edit options
- edit logic
- save incomplete structures
- auto-save and manual save

### Published with zero responses

Allowed:

- structural edits
- question add/delete/edit
- option edits
- logic edits

### Published with existing responses

Restricted:

- deleting existing questions
- changing question type
- deleting or meaningfully altering options
- major reorder of questions
- changing core logic structure

Allowed:

- description edits
- introduction or helper text edits
- thank-you or ending message edits
- minor wording cleanup that does not affect interpretation

### Principle

Once responses exist, the Survey becomes a data collection structure and should be treated conservatively.

## 5.5 Survey Publish Policy

### Publish allowed only if:

- survey title exists
- at least one visible question exists
- all visible questions are complete
- required settings are valid
- there are no broken logic references

### Publish blocking conditions

- empty title
- zero visible questions
- invalid required settings
- insufficient options
- invalid min/max values
- broken logic references
- circular logic

## 5.6 Survey Participation Policy

### Participation allowed if:

- survey is Published
- participation conditions are met
- duplicate participation restrictions pass
- account is not restricted

### Participation blocked if:

- survey is Draft, Closed, or Archived
- user already completed the survey
- user account is restricted
- user fails eligibility conditions

## 5.7 Survey AI Policy

### Survey creation AI includes:

- draft survey generation
- question rewriting
- option recommendation
- question type recommendation
- logic recommendation

### Analysis AI includes:

- response summary
- relation analysis between questions
- insight sentence generation
- portfolio-style summary sentence generation if later included

## 5.8 Survey AI Token Rule

All AI features related to Survey are token-based.
Do not describe them as plan-based.
Do not use monthly usage tiers unless explicitly requested later.

### Token-based examples

- generate survey draft
- refine question wording
- recommend follow-up logic
- summarize results
- generate insight statements

## 5.9 Survey Data Integrity Rule

If structural revision is needed after responses exist, prefer duplication into a new Survey version rather than modifying the live structure directly.

## 5.10 Survey Open Questions

- Should analysis AI require a minimum response count?
- Should typo-only edits after responses exist be logged?
- Which analysis features are definitely in MVP versus later?

---

# 6. Poll Policy Module

## 6.1 Poll Definition

A Poll is a lightweight, single-question or single-step response unit designed for fast participation.

## 6.2 Poll Purpose

Poll exists to:

- lower participation friction
- create repeat participation
- let users accumulate reward points quickly
- serve as an entry point into the reward economy

## 6.3 Poll Scope

This applies to:

- Short / Poll area
- Poll participation
- Poll reward
- Poll participation history
- Poll point accumulation linkage

## 6.4 Poll Status Policy

Statuses:

- Draft
- Published
- Closed
- Archived

Use the same state logic as Survey unless a specific exception is later defined.

## 6.5 Poll Participation Policy

### Participation allowed if:

- Poll is Published
- account is normal
- duplicate participation restriction passes
- daily limit has not been exceeded

### Participation blocked if:

- Poll is Draft, Closed, or Archived
- user already completed this Poll
- suspicious or restricted account
- daily participation limit exceeded

### Completion rule

A Poll is considered completed only when the expected answer submission is successfully completed.

## 6.6 Poll Reward Policy

### Base reward

- 100 points for 1 completed Poll

### Daily limit

- maximum 5 Poll participations per day

### Daily max point earning

- maximum 500 points per day from Poll participation

### Reward conditions

- submission completed successfully
- no duplicate participation
- no suspicious pattern detected

### Reward exclusion conditions

- duplicate account or duplicate participation suspicion
- invalid or abnormal response pattern
- failed submission due to system issues
- abuse-related exclusion decision

## 6.7 Event Reward Policy

Event rewards are separate from base Poll reward.

Examples:

- first-come rewards
- random winner rewards

These should be handled as promotional budget, not part of the default daily Poll reward structure.

## 6.8 Poll Creation Policy

### Draft

Allowed:

- edit question text
- edit choices
- save and revise freely

### Published with zero responses

Allowed:

- structural edits

### Published with existing responses

Restricted:

- changing core question structure
- changing answer options in a way that breaks interpretation

Allowed:

- explanatory text cleanup only

## 6.9 Poll Data Integrity Rule

Poll response records and Poll point rewards must remain traceable to each other.

## 6.10 Poll Open Questions

- Should Poll be single-choice only in MVP?
- Should Poll rewards default to Pending or Available?
- Are event rewards beta-only or part of ongoing ops?

---

# 7. Report Policy Module

## 7.1 Report Definition

Reports are the result and analysis layer built from Survey or Poll responses.

## 7.2 Report Scope

This applies to:

- Report
- Survey result summary
- Poll result summary
- AI-assisted analysis tools

## 7.3 Report Access Policy

### Default access

- full reports are available to the creator of the Survey/Poll
- participants do not have access to the full report by default

## 7.4 Report Types

### Basic Report

Can include:

- response count
- simple ratios
- simple charts
- basic summary

### AI Analysis Tools

Can include:

- response summarization
- relation analysis
- key pattern extraction
- insight sentence generation
- portfolio-ready sentence formatting if later included

## 7.5 Report Generation Policy

Reports require response data to exist.

### Recommended behavior

If sample size is too small, mark results as reference-only rather than presenting them as strong insight.

## 7.6 AI Analysis Policy

All AI-assisted report features are token-based.

### Token-based analysis examples

- summarize responses
- generate insight sentences
- analyze relations between answers
- prepare concise result narratives

### Rule

Basic reporting may be available without token use, but AI-assisted reporting must be treated as token-consuming functionality.

## 7.7 Report Reliability Rule

Analysis quality depends on structural consistency.
If structure changes after responses exist, analysis trust decreases.

### Therefore

- structural changes after responses should be restricted
- low sample counts should be clearly labeled
- sample size should be visible in analysis output where relevant

## 7.8 Report Open Questions

- What is the minimum response threshold for stronger analysis?
- Which parts of AI analysis are in MVP?
- Is portfolio-ready narrative generation MVP or later?

---

# 8. My Page Policy Module

## 8.1 My Page Definition

My Page is the personal workspace where a user can review their own activity, assets, and current usable state.

## 8.2 Scope

This applies to:

- Dashboard
- My Surveys
- Participated Surveys
- Points
- Account
- AI token visibility

## 8.3 Core My Page Rules

### Separate creator and participant perspectives

- My Surveys = Surveys created by the user
- Participated content = Surveys or Polls answered by the user

### Show current state and next action

My Page should prioritize:

- total points
- available points
- pending points
- remaining Poll participation count today
- ongoing created surveys
- recent participation history
- remaining AI tokens

## 8.4 Dashboard Policy

Dashboard should be summary-first, not heavy management-first.

### Recommended summary blocks

- total points
- available points
- Poll participations left today
- count of active created surveys
- count of completed created surveys
- recent participated content
- remaining AI tokens

## 8.5 My Surveys Policy

My Surveys should represent creator-owned Surveys only.

### Suggested grouping

- in progress
- completed

### Meaning

- in progress can include Draft and Published items that still require management
- completed can include Closed items

## 8.6 Participated Content Policy

Participated content includes Surveys and Polls answered by the user.

### Suggested grouping

- in progress
- completed

### Display guidance

Poll and Survey may be grouped together but should have type badges if needed.

## 8.7 Point Visibility Policy

Show:

- Total Points
- Pending Points
- Available Points
- points earned today from Polls
- remaining Poll participations today

## 8.8 AI Token Visibility Policy

Show:

- current token balance
- recent token usage history
- survey creation token usage
- analysis token usage

### Principle

Users should understand they are consuming tokens before and after AI feature use.

## 8.9 Empty State Policy

If no surveys exist:

- show CTA to create first Survey

If no participation history exists:

- show CTA to explore Poll or Survey

If no points exist:

- show CTA to participate in Poll

If no AI use exists:

- show CTA for AI survey generation or AI analysis

## 8.10 My Page Open Questions

- Should Poll history and Survey history be fully merged or partially separated?
- Should points or AI tokens be the top-most dashboard metric?
- Should token purchase/recharge entry appear directly in My Page for MVP?

---

# 9. Point & Withdrawal Policy Module

## 9.1 Point Definition

Points are reward assets earned through participation.

## 9.2 Scope

This applies to:

- Point balances
- Withdrawal information
- Point history
- Poll reward
- Survey reward
- cash-out behavior

## 9.3 Point Status Policy

Use:

- Earned
- Pending
- Available
- Withdrawn
- Reversed

## 9.4 Point Earning Policy

### Poll base reward

- 100 points per completed Poll

### Poll daily limit

- max 5 Polls per day
- max 500 points per day from Polls

### Survey reward

Survey reward follows the reward amount configured for that Survey.

## 9.5 Pending Policy

### Pending reasons

- abuse review in progress
- response quality review in progress
- settlement queue
- system validation waiting state

### Principle

For a reward-based product, it is often safer for points to pass through Pending before becoming Available.

## 9.6 Available Policy

Points can become Available only when:

- participation is valid
- review is complete
- reversal risk is sufficiently low

## 9.7 Withdrawal Policy

### Withdrawal allowed if:

- Available points meet the minimum withdrawal threshold
- payout information is registered
- required identity/verification is complete
- account is not payout-restricted

### Withdrawal blocked if:

- below minimum withdrawal threshold
- no payout information
- verification incomplete
- fraud/review state active
- only Pending points exist
- payout on hold

## 9.8 Withdrawal Status Policy

Use:

- Available
- Requested
- Processing
- Completed
- Failed
- Canceled

## 9.9 Point History Policy

History should include:

- earn
- pending
- available transition if shown
- withdraw
- reverse
- other major status changes

### Principle

Users must be able to trust how their reward asset changed over time.

## 9.10 Point & Withdrawal Open Questions

- Should Poll rewards default to Pending or Available?
- What is the minimum withdrawal threshold?
- Should Survey and Poll rewards share the same release timing?

---

# 10. AI Token Policy Module

## 10.1 AI Token Definition

AI tokens are the usage unit for all AI-assisted functionality in the MVP.

## 10.2 Scope

This applies to:

- AI survey generation
- AI question improvement
- AI logic recommendation
- AI result summarization
- AI insight generation
- AI analysis tools

## 10.3 AI Usage Categories

### Survey Creation AI

Examples:

- generate draft survey
- improve question wording
- recommend options
- recommend question type
- recommend logic

### Analysis AI

Examples:

- summarize results
- identify major patterns
- analyze relations between responses
- generate insight statements
- prepare concise narrative output if included

## 10.4 Token Usage Rule

### Core rule

Every AI action consumes tokens.

### Important constraints

- no plan-based unlock logic in MVP
- no subscription-style entitlement assumptions
- if token balance is insufficient, AI action cannot run

### Variable cost rule

Different AI actions may consume different token amounts depending on complexity.

## 10.5 Token Exposure Policy

Users should be able to see:

- current token balance
- recent token usage
- token requirement before execution where reasonable
- token insufficiency error state

## 10.6 Token Blocking Policy

### AI execution blocked if:

- token balance insufficient
- system error
- data insufficient for requested analysis
- unsupported input/data structure

### Message principle

Explain clearly why execution is blocked.

## 10.7 AI Token Open Questions

- What should each function cost in tokens?
- Should users receive starter tokens in MVP?
- Is portfolio-style narrative generation included in MVP?

---

# 11. Abuse Prevention Baseline Module

## 11.1 Abuse Types to Watch

- duplicate accounts
- duplicate participation
- bot submissions
- low-quality or meaningless responses
- reward farming
- suspicious withdrawals

## 11.2 Policy Baseline

- suspicious participation may receive no reward
- suspicious rewards may stay Pending
- suspicious payouts may be blocked or delayed
- quality checks are allowed before making points Available

## 11.3 Product Behavior Guidance

Do not promise immediate guaranteed reward release unless policy explicitly allows it.
Trust and fraud control come before speed in ambiguous cases.

---

# 12. Documentation Behavior for Claude

When asked to generate artifacts based on this file:

## For PRDs

- anchor every requirement to these modules
- do not invent plans or pricing tiers
- use token-based AI logic only
- use reward-based participation logic only

## For functional specs

- include state values exactly as defined here where applicable
- distinguish Draft vs Published vs Closed vs Archived clearly
- separate Pending vs Available vs Withdrawn clearly

## For UX writing

- keep wording simple, operational, and trust-building
- make reward and token rules explicit
- avoid vague wording for blocked states

## For engineering guidance

- preserve data integrity and abuse prevention assumptions
- avoid destructive actions once responses or rewards exist
- prefer archive/inactive/reverse patterns over hard deletion

## For QA scenarios

Always test:

- Poll daily limit
- 100-point reward logic
- duplicate participation prevention
- token insufficiency behavior
- reward Pending vs Available logic
- survey edit restriction after responses exist
- report access restriction
- withdrawal blocked conditions

---

# 13. Fast Reference Summary

## Poll

- 100 points per completed Poll
- max 5 Polls per day
- max 500 points per day from Polls

## Survey

- structured multi-question content
- edit freely in Draft
- restrict structural changes after responses exist

## AI

- token-based only
- used for survey creation and later analysis
- no subscription logic in MVP

## Reports

- creator-only by default
- AI-assisted analysis uses tokens
- low sample size should be treated carefully

## Points

- statuses: Earned, Pending, Available, Withdrawn, Reversed

## Withdrawals

- require Available points and payout eligibility
- block when under threshold or under review

## Beta context

- 100 users x 30,000 KRW = 3,000,000 KRW user test budget
- event rewards separate from normal participation rewards

---

# 14. End Rule

If a future request conflicts with this file:

- prefer this file for MVP work
- unless the user explicitly says the MVP policy has changed
- or explicitly asks to extend beyond MVP
