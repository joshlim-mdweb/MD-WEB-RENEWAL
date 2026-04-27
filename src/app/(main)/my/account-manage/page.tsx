import { COLOR } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default function AccountManagePage() {
  return (
    <div className="account_manage_page px-8 py-8">
      <h1 className="text-lg font-bold mb-6" style={{ color: COLOR.TOAST_BG }}>
        계좌 관리
      </h1>
      <div
        className="rounded-2xl px-6 py-16 text-center"
        style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
      >
        <p className="text-sm" style={{ color: COLOR.TEXT_MUTED }}>
          계좌 관리 기능을 준비 중입니다.
        </p>
        <p className="text-xs mt-2" style={{ color: COLOR.TEXT_DISABLED }}>
          인출 시 출금 계좌를 등록할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
