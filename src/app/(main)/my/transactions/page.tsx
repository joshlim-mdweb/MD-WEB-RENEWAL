import { COLOR } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default function TransactionsPage() {
  return (
    <div className="transactions_page px-8 py-8">
      <h1 className="text-lg font-bold mb-6" style={{ color: COLOR.TOAST_BG }}>
        거래 내역
      </h1>
      <div
        className="rounded-2xl px-6 py-16 text-center"
        style={{ border: `1px solid ${COLOR.BORDER_DEFAULT}` }}
      >
        <p className="text-sm" style={{ color: COLOR.TEXT_MUTED }}>
          거래 내역 기능을 준비 중입니다.
        </p>
      </div>
    </div>
  );
}
