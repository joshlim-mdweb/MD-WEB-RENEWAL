"use client";

import { useState, type FC } from "react";
import { createClient } from "@/lib/supabase/client";
import { COLOR, TYPOGRAPHY, RADIUS, INPUT } from "@/lib/design-tokens";
import { useToastStore } from "@/lib/store/toast";

interface ProfileNicknameEditorProps {
  initialNickName: string | null;
  userId: string;
}

export const ProfileNicknameEditor: FC<ProfileNicknameEditorProps> = ({
  initialNickName,
  userId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialNickName ?? "");
  const [savedValue, setSavedValue] = useState(initialNickName ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToastStore();

  async function handleSave() {
    if (value.trim() === savedValue) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profile")
        .update({ nick_name: value.trim() })
        .eq("uuid", userId);

      if (error) {
        showToast("저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
      } else {
        setSavedValue(value.trim());
        setIsEditing(false);
        showToast("닉네임을 저장했어요.");
      }
    } catch {
      showToast("일시적인 오류가 생겼어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setValue(savedValue);
    setIsEditing(false);
  }

  if (!isEditing) {
    return (
      <div
        className="profile_nickname_display_wrap"
        style={{ display: "flex", alignItems: "center", gap: "12px" }}
      >
        {savedValue ? (
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_PRIMARY }}>{savedValue}</p>
        ) : (
          <p style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_DISABLED }}>
            닉네임을 설정해 보세요
          </p>
        )}
        <button
          onClick={() => setIsEditing(true)}
          style={{
            ...TYPOGRAPHY.STYLE.LABEL_2,
            color: COLOR.ACCENT,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          변경하기
        </button>
      </div>
    );
  }

  return (
    <div
      className="profile_nickname_edit_wrap"
      style={{ display: "flex", alignItems: "center", gap: "8px" }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") handleCancel();
        }}
        autoFocus
        maxLength={20}
        style={{
          ...TYPOGRAPHY.STYLE.BODY_1,
          border: `1px solid ${INPUT.BORDER_FOCUS}`,
          borderRadius: RADIUS.SM,
          padding: "6px 10px",
          outline: "none",
          backgroundColor: INPUT.BG_DEFAULT,
          color: COLOR.TEXT_PRIMARY,
          boxShadow: INPUT.SHADOW_FOCUS,
          transition: INPUT.TRANSITION,
          minWidth: 0,
          width: "200px",
        }}
      />
      <button
        onClick={handleSave}
        disabled={isSaving}
        style={{
          ...TYPOGRAPHY.STYLE.LABEL_1,
          color: COLOR.ACCENT,
          background: "none",
          border: "none",
          cursor: isSaving ? "not-allowed" : "pointer",
          padding: 0,
          opacity: isSaving ? 0.6 : 1,
        }}
      >
        {isSaving ? "저장하는 중이에요" : "저장하기"}
      </button>
      <button
        onClick={handleCancel}
        disabled={isSaving}
        style={{
          ...TYPOGRAPHY.STYLE.LABEL_1,
          color: COLOR.TEXT_MUTED,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        닫기
      </button>
    </div>
  );
};
