export const TAG_PRESETS = {
  popular: [
    "AI·기술",
    "소비 습관",
    "취업·커리어",
    "정신 건강",
    "트렌드",
    "수면",
    "스마트폰",
    "세대 인식",
  ],
  경제금융: ["주식·투자", "소비 습관", "저축·재테크", "부동산", "용돈·생활비", "경제 인식"],
  사회문화: ["트렌드", "정치·사회", "세대 인식", "젠더", "미디어·콘텐츠", "환경", "다양성"],
  건강라이프: [
    "운동·피트니스",
    "식습관",
    "수면",
    "정신 건강",
    "뷰티·외모",
    "육아·가정",
    "반려동물",
  ],
  테크IT: ["스마트폰", "AI·기술", "게임", "앱·서비스", "보안·프라이버시", "소셜미디어"],
  교육학습: ["대학·진학", "취업·커리어", "자기계발", "언어 학습", "온라인 교육", "독서·공부"],
  기타: ["일상", "여행", "음식·맛집", "문화생활", "스포츠", "엔터테인먼트"],
} as const;

export type SurveyPurpose =
  | "portfolio"
  | "startup_research"
  | "work_internal"
  | "academic"
  | "product_feedback"
  | "community"
  | "personal";

export const SURVEY_PURPOSE_LABELS: Record<SurveyPurpose, string> = {
  portfolio: "포트폴리오",
  startup_research: "창업·시장조사",
  work_internal: "직무·업무 조사",
  academic: "학교·학업 연구",
  product_feedback: "제품·서비스 피드백",
  community: "커뮤니티·소셜",
  personal: "개인 호기심·재미",
};

export type QuestionType =
  | "multiple_choice"
  | "short_text"
  | "long_text"
  | "scale"
  | "grade"
  | "checkbox"
  | "dropdown"
  | "ranking"
  | "startpoint"
  | "endpoint";

export type SurveyStatus = "draft" | "published" | "closed" | "archived";

// Reward payout method for a survey.
// none       = no reward (information-gathering surveys)
// first_come = tier 1: all participants get 1,000P when target is met
// random     = tier 2/3: lottery after normal closure (5,000P × 10 or 10,000P × 5)
export type RewardType = "none" | "first_come" | "random";

// The only valid target_participant_count values. DB has a CHECK constraint on these.
export type TargetParticipantCount = 10 | 30 | 50;

export interface Survey {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  status: SurveyStatus;
  // Estimated completion time in minutes — set by creator, nullable
  estimated_time: number | null;
  // Optional respondent cap — null means unlimited
  max_participants: number | null;
  // Hard cap on total accepted submissions — null means unlimited
  max_responses: number | null;
  // Points awarded per winner on normal closure — null means no reward (reward_type = 'none')
  reward_amount: number | null;
  // Payout method: 'none' | 'first_come' | 'random'. Defaults to 'none'.
  reward_type: RewardType;
  // Number of lottery winners — null for tier 1 (all participants), 10 for tier 2, 5 for tier 3
  reward_winner_count: number | null;
  // Required respondent count for normal closure (10 | 30 | 50). null = no target set.
  target_participant_count: TargetParticipantCount | null;
  // Optional cover image URL for survey card display
  thumbnail_url: string | null;
  // Creator-set purpose category
  purpose: SurveyPurpose | null;
  // Creator-set expiry date — survey auto-closes when reached (null = no expiry)
  end_date: string | null;
  // Creator-defined searchable tags (max 5, 1–15 chars each)
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  // Only present when fetched via GET /api/surveys/[id] (includes response count).
  // Absent on list responses (GET /api/surveys) to keep list payloads lean.
  responseCount?: number;
}

// A Section groups related questions within a survey.
// section_id on Question is nullable — questions created before sections were
// introduced, or questions not yet assigned to a section, have section_id = null.
export interface Section {
  id: string;
  survey_id: string;
  title: string;
  description?: string | null;
  color?: string | null;
  border_color?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// Routing target after a question or answer option is submitted.
// type "end" means the survey terminates; targetId is null in that case.
export interface NextTarget {
  type: "question" | "section" | "end";
  targetId: string | null;
}

export interface Question {
  id: string;
  survey_id: string;
  // null when the survey has no sections or the question hasn't been assigned yet
  section_id?: string | null;
  type: QuestionType;
  title: string;
  options: string[] | null;
  order_index: number;
  required: boolean;
  config: QuestionConfig | null;
  // Default next-question routing (overridden per-answer by ConditionalRule)
  next_target?: NextTarget | null;
  created_at: string;
}

// Per-type config — stored in the `config` JSON column
export type QuestionConfig =
  | MultipleChoiceConfig
  | CheckboxConfig
  | DropdownConfig
  | RankingConfig
  | ScaleConfig
  | GradeConfig
  | ShortTextConfig
  | LongTextConfig
  | StartpointConfig
  | EndpointConfig
  | Record<string, never>;

// A single conditional routing rule: when the option at {optionIndex} is selected, jump to a
// section or question. answerValue is kept for runtime response evaluation and display labels.
// optionIndex is optional for backward-compatibility with rules saved before this field existed.
export interface ConditionalRule {
  // Index into question.options — primary key for builder CRUD operations (BUG-001)
  optionIndex?: number;
  // Display text / runtime matcher — kept in sync with options[optionIndex] on every option edit
  answerValue: string;
  action: "jump_to_section" | "jump_to_question";
  targetSectionId?: string;
  targetQuestionId?: string;
}

export interface MultipleChoiceConfig {
  allowMultiple: boolean;
  randomOrder: boolean;
  // Special options (없음 / 기타) are stored inline as sentinel values in the options array.
  // OPTION_NONE = "__none__" and OPTION_OTHER = "__other__" — see OptionsEditor.tsx.
  conditionalEnabled?: boolean;
  conditionalRules?: ConditionalRule[];
  // Default routing when conditionalEnabled is false — null/undefined means "다음 질문으로 이동"
  defaultRoute?: {
    action: "jump_to_section" | "jump_to_question";
    targetSectionId?: string;
    targetQuestionId?: string;
  } | null;
}

export interface CheckboxConfig {
  minSelection?: number;
  maxSelection?: number;
  randomOrder: boolean;
}

export interface DropdownConfig {
  allowMultiple: boolean;
  randomOrder: boolean;
}

export interface RankingConfig {
  randomOrder: boolean;
}

export interface ScaleConfig {
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface GradeConfig {
  grades: string[];
}

export interface ShortTextConfig {
  placeholder?: string;
  maxLength?: number;
}

export interface LongTextConfig {
  maxLength?: number;
}

export interface EndpointConfig {
  message: string;
  redirectUrl?: string;
}

export interface StartpointConfig {
  // Greeting / survey introduction displayed on the cover screen
  message?: string;
  // CTA button label — defaults to "시작하기" when not set
  buttonLabel?: string;
}

export interface Response {
  id: string;
  survey_id: string;
  user_id: string | null;
  // Set when the respondent first loads the survey — used to compute avg completion time
  started_at: string | null;
  created_at: string;
}

export interface Answer {
  id: string;
  response_id: string;
  question_id: string;
  value: AnswerValue;
}

export type AnswerValue = string | string[] | number;

// Survey with questions (used in builder + answer page)
export interface SurveyWithQuestions extends Survey {
  questions: Question[];
  sections?: Section[];
}

// Share token — used for anonymous respondent access via a public link
export interface SurveyShare {
  id: string;
  survey_id: string;
  token: string;
  expires_at: string | null;
  max_responses: number | null;
  // Denormalised counter maintained by DB trigger — do not update manually
  response_count: number;
  created_at: string;
  created_by: string;
}

// The shape returned when validating a share token before rendering the survey
export interface SurveyShareValidation {
  valid: boolean;
  reason?: "expired" | "max_responses_reached" | "survey_not_published" | "token_not_found";
  share: SurveyShare | null;
}
