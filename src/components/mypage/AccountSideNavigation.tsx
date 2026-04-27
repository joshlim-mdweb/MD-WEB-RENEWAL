"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";

const navGroups = [
  {
    items: [{ href: "/my", label: "홈", exact: true }],
  },
  {
    items: [{ href: "/my/point", label: "포인트" }],
  },
  {
    items: [{ href: "/my/survey", label: "내 설문" }],
  },
  {
    items: [{ href: "/my/account", label: "계정 정보" }],
  },
];

export default function AccountSideNavigation() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="account_side_navigation w-full">
      <div className="pt-2 pb-4 flex flex-col gap-4 px-2">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            <nav className="flex flex-col gap-0.5">
              {group.items.map(({ href, label, ...rest }) => {
                const exact = "exact" in rest ? rest.exact : undefined;
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center px-3 py-2 rounded-lg transition-colors"
                    style={{
                      ...TYPOGRAPHY.STYLE.LABEL_1,
                      fontWeight: TYPOGRAPHY.WEIGHT.SEMIBOLD,
                      ...(active
                        ? { backgroundColor: COLOR.ACCENT_LIGHT, color: COLOR.ACCENT }
                        : { color: COLOR.TEXT_MUTED }),
                    }}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
