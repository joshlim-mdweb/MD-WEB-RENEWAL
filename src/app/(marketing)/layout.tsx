import GNB from "@/components/marketing/GNB";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#19191e" }}>
      <GNB />
      <main className="pt-[80px] min-h-screen">{children}</main>
    </div>
  );
}
