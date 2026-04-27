import { COLOR } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default function SettlementsPage() {
  return (
    <div className="settlements_page px-8 py-8">
      <h1 className="text-lg font-bold mb-6" style={{ color: COLOR.TOAST_BG }}>
        정산 내역
      </h1>
      <div
        className="rounded-2xl px-6 py-16 text-center"
        style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
      >
        <p className="text-sm" style={{ color: COLOR.TEXT_MUTED }}>
          정산 내역 기능을 준비 중입니다.
        </p>
      </div>
    </div>
  );
}
