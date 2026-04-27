import { COLOR } from "@/lib/design-tokens";

// Builder layout — no GNB, full-screen workspace
export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ backgroundColor: COLOR.BG_SURFACE }}>{children}</div>;
}
