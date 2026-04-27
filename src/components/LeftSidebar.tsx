"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "홈",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M7.5 18V13h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/survey/new",
    label: "설문 만들기",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M7 7h6M7 10h6M7 13h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/my",
    label: "마이페이지",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function LeftSidebar() {
  const pathname = usePathname();

  return (
    <aside className="group fixed left-0 top-[52px] bottom-0 z-40 flex flex-col bg-white border-r border-[#e5e8eb] w-14 hover:w-56 transition-[width] duration-200 overflow-hidden">
      <nav className="flex flex-col gap-1 p-2 pt-4">
        {navItems.map(({ href, label, icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-[#eff6ff] text-[#3182f6]"
                  : "text-[#6b7684] hover:bg-[#f9fafb] hover:text-[#333d4b]"
              }`}
            >
              <span className="flex-shrink-0">{icon}</span>
              <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
