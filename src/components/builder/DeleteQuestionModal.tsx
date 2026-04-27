"use client";

import { useState, type FC } from "react";
import { Question } from "@/lib/types/survey";
import { Button } from "@/components/ui";
import { COLOR } from "@/lib/design-tokens";

interface DeleteQuestionModalProps {
  question: Question;
  brokenRuleCount: number;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export const DeleteQuestionModal: FC<DeleteQuestionModalProps> = ({
  question,
  brokenRuleCount,
  onConfirm,
  onCancel,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await onConfirm();
    } catch {
      setErrorMessage("질문 삭제 중 오류가 생겼어요. 다시 시도해 주세요.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="delete_question_modal_overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="delete_question_modal_wrap bg-white rounded-xl shadow-xl w-[400px] p-6 flex flex-col gap-4">
        <h2 className="text-base font-semibold" style={{ color: COLOR.TEXT_PRIMARY }}>
          질문 삭제
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: COLOR.TEXT_MUTED }}>
          <span className="font-medium" style={{ color: COLOR.TEXT_PRIMARY }}>
            {question.title || "제목 없는 질문"}
          </span>
          을 삭제합니다. 이 작업은 되돌릴 수 없습니다.
          {brokenRuleCount > 0 && (
            <>
              {" "}
              이 질문을 참조하는 조건 규칙{" "}
              <span className="font-semibold" style={{ color: COLOR.WARNING }}>
                {brokenRuleCount}개
              </span>
              가 깨집니다.
            </>
          )}
        </p>

        {errorMessage && (
          <p
            className="text-xs rounded-lg px-3 py-2"
            style={{ color: COLOR.NEGATIVE, backgroundColor: COLOR.NEGATIVE_BG }}
          >
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="neutral" size="md" onClick={onCancel} disabled={isDeleting}>
            닫기
          </Button>
          <Button variant="danger" size="md" loading={isDeleting} onClick={handleConfirm}>
            삭제하기
          </Button>
        </div>
      </div>
    </div>
  );
};
