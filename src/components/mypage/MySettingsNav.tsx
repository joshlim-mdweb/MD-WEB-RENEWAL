"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLOR, TYPOGRAPHY, RADIUS, INTERACTION } from "@/lib/design-tokens";

const NAV_ITEMS: readonly { href: string; label: string; exact?: boolean }[] = [
  { href: "/my", label: "프로필", exact: true },
  { href: "/my/point", label: "포인트" },
  { href: "/my/survey", label: "내 설문" },
  { href: "/my/history", label: "참여 내역" },
  { href: "/my/account", label: "계정 설정" },
];

export function MySettingsNav() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="my_settings_nav_wrap flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            style={{
              ...TYPOGRAPHY.STYLE.LABEL_1,
              fontWeight: active ? TYPOGRAPHY.WEIGHT.MEDIUM : TYPOGRAPHY.WEIGHT.REGULAR,
              display: "flex",
              alignItems: "center",
              height: "36px",
              padding: "0 12px",
              borderRadius: RADIUS.MD,
              color: active ? COLOR.ACCENT : COLOR.TEXT_SECONDARY,
              backgroundColor: active ? COLOR.ACCENT_LIGHT : "transparent",
              transition: INTERACTION.TRANSITION_BG,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = INTERACTION.HOVER_BG;
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              }
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
