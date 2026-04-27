"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";

const navItems = [
  { href: "/", label: "설문" },
  { href: "/pricing", label: "플랜" },
];

export default function GnbNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map(({ href, label }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="px-3 py-1.5 transition-colors"
            style={{
              ...TYPOGRAPHY.STYLE.BODY_1,
              fontWeight: isActive ? TYPOGRAPHY.WEIGHT.BOLD : TYPOGRAPHY.WEIGHT.REGULAR,
              color: isActive ? COLOR.TEXT_PRIMARY : COLOR.TEXT_MUTED,
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
