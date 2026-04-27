"use client";

import { useState, type FC } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { COLOR, TYPOGRAPHY, RADIUS, BUTTON } from "@/lib/design-tokens";
import { useToastStore } from "@/lib/store/toast";

interface AccountActionsProps {
  userId: string;
}

export const AccountActions: FC<AccountActionsProps> = ({ userId }) => {
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();
  const { showToast } = useToastStore();

  async function handleLogout() {
    setIsLogoutLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      showToast("로그아웃에 실패했어요. 잠시 후 다시 시도해 주세요.");
      setIsLogoutLoading(false);
    }
  }

  async function handleDelete() {
    setIsDeleteLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profile")
        .update({ status: "deleted" })
        .eq("uuid", userId);

      if (error) {
        showToast("탈퇴 처리에 실패했어요. 잠시 후 다시 시도해 주세요.");
        setIsDeleteLoading(false);
        return;
      }

      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      showToast("일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
      setIsDeleteLoading(false);
    }
  }

  return (
    <div className="account_actions_wrap">
      <p
        style={{
          ...TYPOGRAPHY.STYLE.LABEL_1,
          color: COLOR.TEXT_SECONDARY,
          marginBottom: "16px",
        }}
      >
        계정 관리
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "480px" }}>
        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={isLogoutLoading}
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_1,
            display: "flex",
            alignItems: "center",
            height: "40px",
            padding: "0 16px",
            borderRadius: RADIUS.MD,
            backgroundColor: BUTTON.NEUTRAL_BG,
            color: BUTTON.NEUTRAL_TEXT,
            border: "none",
            cursor: isLogoutLoading ? "not-allowed" : "pointer",
            opacity: isLogoutLoading ? 0.6 : 1,
            alignSelf: "flex-start",
          }}
        >
          {isLogoutLoading ? "로그아웃 중" : "로그아웃하기"}
        </button>

        {/* Delete account */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              display: "flex",
              alignItems: "center",
              height: "40px",
              padding: "0 16px",
              borderRadius: RADIUS.MD,
              backgroundColor: BUTTON.DANGER_BG,
              color: BUTTON.DANGER_TEXT,
              border: "none",
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
          >
            탈퇴하기
          </button>
        ) : (
          <div
            style={{
              backgroundColor: COLOR.BG_SURFACE,
              borderRadius: RADIUS.LG,
              padding: "16px",
            }}
          >
            <p
              style={{
                ...TYPOGRAPHY.STYLE.BODY_2,
                color: COLOR.TEXT_PRIMARY,
                marginBottom: "4px",
              }}
            >
              정말 탈퇴할까요?
            </p>
            <p
              style={{
                ...TYPOGRAPHY.STYLE.LABEL_2,
                color: COLOR.TEXT_MUTED,
                marginBottom: "16px",
              }}
            >
              탈퇴하면 모든 데이터가 삭제되고 복구할 수 없어요.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                  height: "36px",
                  padding: "0 16px",
                  borderRadius: RADIUS.SM,
                  backgroundColor: BUTTON.NEUTRAL_BG,
                  color: BUTTON.NEUTRAL_TEXT,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                닫기
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleteLoading}
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_1,
                  height: "36px",
                  padding: "0 16px",
                  borderRadius: RADIUS.SM,
                  backgroundColor: BUTTON.DANGER_BG,
                  color: BUTTON.DANGER_TEXT,
                  border: "none",
                  cursor: isDeleteLoading ? "not-allowed" : "pointer",
                  opacity: isDeleteLoading ? 0.6 : 1,
                }}
              >
                {isDeleteLoading ? "탈퇴 처리 중이에요" : "계정 탈퇴하기"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
