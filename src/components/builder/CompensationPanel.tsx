"use client";

import { useState, useCallback, type FC, type ChangeEvent } from "react";
import { Button } from "@/components/ui";
import { COLOR, RADIUS, TYPOGRAPHY, SPACING } from "@/lib/design-tokens";

interface CompensationPanelProps {
  surveyId: string;
  onPublish: () => void;
  isPublishing: boolean;
}

type PanelStatus =
  | "not_configured"
  | "draft_configured"
  | "payment_pending"
  | "paid"
  | "payment_failed";

interface CompensationFormState {
  perResponseAmount: number | "";
  maxRecipients: number | "";
  status: PanelStatus;
}

function formatKRW(n: number): string {
  return n.toLocaleString("ko-KR");
}

// 숫자 문자열만 허용하는 파서
function parseNumericInput(raw: string): number | "" {
  const cleaned = raw.replace(/[^0-9]/g, "");
  if (cleaned === "") return "";
  const n = parseInt(cleaned, 10);
  return isNaN(n) ? "" : n;
}

export const CompensationPanel: FC<CompensationPanelProps> = ({
  surveyId: _surveyId,
  onPublish,
  isPublishing,
}) => {
  const [form, setForm] = useState<CompensationFormState>({
    perResponseAmount: "",
    maxRecipients: "",
    status: "not_configured",
  });

  const [amountError, setAmountError] = useState<string | null>(null);

  const isPending = form.status === "payment_pending";

  const totalAmount =
    typeof form.perResponseAmount === "number" && typeof form.maxRecipients === "number"
      ? form.perResponseAmount * form.maxRecipients
      : null;

  const isDraftConfigured =
    typeof form.perResponseAmount === "number" &&
    form.perResponseAmount >= 100 &&
    typeof form.maxRecipients === "number" &&
    form.maxRecipients >= 1;

  const handleAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = parseNumericInput(e.target.value);
    setForm((prev) => ({ ...prev, perResponseAmount: value, status: "not_configured" }));
    if (typeof value === "number" && value > 0 && value < 100) {
      setAmountError("100원 이상으로 설정해 주세요");
    } else {
      setAmountError(null);
    }
  }, []);

  const handleRecipientsChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = parseNumericInput(e.target.value);
    setForm((prev) => ({ ...prev, maxRecipients: value, status: "not_configured" }));
  }, []);

  // Phase 0 mock: 실제 결제 API 없이 로컬 상태만 변경
  const handleMockPay = useCallback(() => {
    if (!isDraftConfigured) return;
    setForm((prev) => ({ ...prev, status: "payment_pending" }));
  }, [isDraftConfigured]);

  return (
    <div
      className="compensation_panel_wrap"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {/* 패널 헤더 */}
      <div
        className="compensation_panel_header"
        style={{
          padding: `${SPACING[4]} ${SPACING[5]}`,
          borderBottom: `1px solid ${COLOR.BORDER_DEFAULT}`,
        }}
      >
        <h2 style={{ ...TYPOGRAPHY.STYLE.TITLE_1, color: COLOR.TEXT_PRIMARY }}>보상 설정</h2>
        <p
          style={{
            ...TYPOGRAPHY.STYLE.BODY_2,
            color: COLOR.TEXT_MUTED,
            marginTop: SPACING[1],
          }}
        >
          응답자에게 지급할 보상 금액을 설정해요
        </p>
      </div>

      {/* 패널 본문 */}
      <div
        className="compensation_panel_body"
        style={{
          flex: 1,
          padding: SPACING[5],
          display: "flex",
          flexDirection: "column",
          gap: SPACING[4],
        }}
      >
        {/* payment_pending 배너 */}
        {isPending && (
          <div
            className="compensation_pending_banner"
            style={{
              backgroundColor: COLOR.ACCENT_SUBTLE,
              borderRadius: RADIUS.MD,
              padding: `${SPACING[3]} ${SPACING[4]}`,
              border: `1px solid ${COLOR.ACCENT_MUTED}`,
            }}
          >
            <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.ACCENT }}>
              보상 예산이 예약됐어요. 검토 후 확정돼요.
            </p>
          </div>
        )}

        {/* 1인당 보상 금액 */}
        <div>
          <label
            htmlFor="per-response-amount"
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              color: COLOR.TEXT_SECONDARY,
              display: "block",
              marginBottom: SPACING[2],
            }}
          >
            1인당 보상 금액 (원)
          </label>
          <input
            id="per-response-amount"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            disabled={isPending}
            value={form.perResponseAmount === "" ? "" : String(form.perResponseAmount)}
            onChange={handleAmountChange}
            placeholder="예: 1000"
            style={{
              width: "100%",
              padding: `${SPACING[3]} ${SPACING[4]}`,
              borderRadius: RADIUS.MD,
              border: `1.5px solid ${amountError ? COLOR.NEGATIVE : COLOR.BORDER_INPUT}`,
              backgroundColor: isPending ? COLOR.BG_SECTION : COLOR.BG_BASE,
              ...TYPOGRAPHY.STYLE.BODY_1,
              color: COLOR.TEXT_PRIMARY,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {amountError && (
            <p
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_2,
                color: COLOR.NEGATIVE,
                marginTop: SPACING[1],
              }}
            >
              {amountError}
            </p>
          )}
        </div>

        {/* 최대 지급 인원 */}
        <div>
          <label
            htmlFor="max-recipients"
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              color: COLOR.TEXT_SECONDARY,
              display: "block",
              marginBottom: SPACING[2],
            }}
          >
            최대 지급 인원 (명)
          </label>
          <input
            id="max-recipients"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            disabled={isPending}
            value={form.maxRecipients === "" ? "" : String(form.maxRecipients)}
            onChange={handleRecipientsChange}
            placeholder="예: 100"
            style={{
              width: "100%",
              padding: `${SPACING[3]} ${SPACING[4]}`,
              borderRadius: RADIUS.MD,
              border: `1.5px solid ${COLOR.BORDER_INPUT}`,
              backgroundColor: isPending ? COLOR.BG_SECTION : COLOR.BG_BASE,
              ...TYPOGRAPHY.STYLE.BODY_1,
              color: COLOR.TEXT_PRIMARY,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* 총 예산 자동 계산 */}
        <div
          className="compensation_total_area"
          aria-live="polite"
          style={{
            backgroundColor: COLOR.BG_SURFACE,
            borderRadius: RADIUS.MD,
            padding: `${SPACING[3]} ${SPACING[4]}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_SECONDARY }}>
              총 예산
            </span>
            <span
              style={{
                ...TYPOGRAPHY.STYLE.TITLE_2,
                color: totalAmount !== null ? COLOR.TEXT_PRIMARY : COLOR.TEXT_DISABLED,
                fontWeight: 600,
              }}
            >
              {totalAmount !== null ? `${formatKRW(totalAmount)}원` : "—"}
            </span>
          </div>
          {totalAmount !== null && (
            <p
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_2,
                color: COLOR.TEXT_MUTED,
                marginTop: SPACING[1],
              }}
            >
              {typeof form.perResponseAmount === "number"
                ? `${formatKRW(form.perResponseAmount)}원`
                : "—"}{" "}
              × {typeof form.maxRecipients === "number" ? `${form.maxRecipients}명` : "—"}
            </p>
          )}
        </div>
      </div>

      {/* 패널 푸터 — CTA */}
      <div
        className="compensation_panel_footer"
        style={{
          padding: SPACING[5],
          borderTop: `1px solid ${COLOR.BORDER_DEFAULT}`,
          display: "flex",
          flexDirection: "column",
          gap: SPACING[2],
        }}
      >
        <Button
          variant="primary"
          size="md"
          className="w-full"
          disabled={!isDraftConfigured || isPending}
          onClick={handleMockPay}
        >
          예산 예약하기
        </Button>
        <Button
          variant="solid"
          size="md"
          className="w-full"
          loading={isPublishing}
          onClick={onPublish}
        >
          보상 없이 공개하기
        </Button>
      </div>
    </div>
  );
};
