"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";

const TAB_ITEMS = [
  {
    href: "/",
    label: "설문",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="2" width="16" height="18" rx="2" />
        <path d="M7 7h8M7 11h8M7 15h5" />
      </svg>
    ),
  },
  {
    href: "/my",
    label: "마이",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="7" r="4" />
        <path d="M3 19c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
] as const;

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="bottom_tab_bar_wrap fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        backgroundColor: COLOR.BG_BASE,
        borderTop: `1px solid ${COLOR.BORDER_DEFAULT}`,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-stretch h-14">
        {TAB_ITEMS.map(({ href, label, icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors"
              style={{
                color: isActive ? COLOR.ACCENT : COLOR.TEXT_MUTED,
                textDecoration: "none",
              }}
            >
              {icon(isActive)}
              <span
                style={{
                  ...TYPOGRAPHY.STYLE.LABEL_2,
                  fontWeight: isActive ? "600" : "500",
                  color: isActive ? COLOR.ACCENT : COLOR.TEXT_MUTED,
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
