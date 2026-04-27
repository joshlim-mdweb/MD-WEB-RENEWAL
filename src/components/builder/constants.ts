import { QuestionType } from "@/lib/types/survey";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: "Multiple Choice",
  short_text: "Short Text",
  long_text: "Long Text",
  scale: "Scale",
  grade: "Grade",
  checkbox: "Checkbox",
  dropdown: "Dropdown",
  ranking: "Ranking",
  startpoint: "Startpoint",
  endpoint: "Endpoint",
};

export const QUESTION_TYPES = Object.keys(QUESTION_TYPE_LABELS) as QuestionType[];
