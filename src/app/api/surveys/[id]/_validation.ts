/**
 * Re-export from the shared validation module.
 *
 * The canonical implementation lives at '@/lib/survey-validation' so it can be
 * imported by both API routes and client components. This file is kept so that
 * existing relative imports inside the API route directory continue to work
 * without modification.
 */
export type {
  ValidationQuestion,
  ValidationSurvey,
  ValidationError,
} from "@/lib/survey-validation";
export { validateSurveyForPublish } from "@/lib/survey-validation";
