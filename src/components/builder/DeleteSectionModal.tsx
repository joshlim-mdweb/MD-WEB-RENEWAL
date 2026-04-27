"use client";

import { useState, type FC } from "react";
import { Section } from "@/lib/types/survey";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";
import { Button } from "@/components/ui";

interface DeleteSectionModalProps {
  section: Section;
  questionCount: number;
  brokenRuleCount: number;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export const DeleteSectionModal: FC<DeleteSectionModalProps> = ({
  section,
  questionCount,
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
      setErrorMessage("섹션을 삭제하지 못했어요. 다시 시도해 주세요.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="delete_section_modal_overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="delete_section_modal_wrap bg-white rounded-xl shadow-xl w-[400px] p-6 flex flex-col gap-4">
        <h2
          style={{
            ...TYPOGRAPHY.STYLE.TITLE_2,
            color: COLOR.TEXT_PRIMARY,
          }}
        >
          섹션 삭제
        </h2>
        <p
          className="leading-relaxed"
          style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}
        >
          <span style={{ fontWeight: TYPOGRAPHY.WEIGHT.MEDIUM, color: COLOR.TEXT_PRIMARY }}>
            {section.title || `Section`}
          </span>
          을 삭제하면 이 섹션의 질문{" "}
          <span style={{ fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD, color: COLOR.NEGATIVE }}>
            {questionCount}개
          </span>
          도 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
          {brokenRuleCount > 0 && (
            <>
              {" "}
              또한 이 섹션을 참조하는 조건 규칙{" "}
              <span style={{ fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD, color: COLOR.WARNING }}>
                {brokenRuleCount}개
              </span>
              가 깨집니다.
            </>
          )}
        </p>

        {errorMessage && (
          <p
            className="rounded-lg px-3 py-2"
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_2,
              color: COLOR.NEGATIVE,
              backgroundColor: COLOR.NEGATIVE_BG,
            }}
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
