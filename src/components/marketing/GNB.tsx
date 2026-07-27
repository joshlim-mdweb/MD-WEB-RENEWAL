"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// ─── Nav data ────────────────────────────────────────────────────────────────

const SOLUTIONS_ITEMS = [
  { label: "Enterprise", href: "/solutions/enterprise" },
  { label: "Academics", href: "/solutions/academics" },
  { label: "Students", href: "/solutions/students" },
];

const RESOURCES_ITEMS = [
  { label: "User Spotlight", href: "#" },
  { label: "Newsroom", href: "#" },
  { label: "Release", href: "#" },
  { label: "Manual", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "Asset Store", href: "#" },
];

type DropdownItem = { label: string; href: string };
type NavItem =
  | { label: string; href: string; dropdown?: undefined }
  | { label: string; href?: undefined; dropdown: DropdownItem[] };

const NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "/features" },
  { label: "Solutions", dropdown: SOLUTIONS_ITEMS },
  { label: "Plan", href: "/plan" },
  { label: "Download", href: "/download" },
  { label: "Resources", dropdown: RESOURCES_ITEMS },
];

// ─── Chevron icon ─────────────────────────────────────────────────────────────

function ChevronDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Dropdown menu ────────────────────────────────────────────────────────────

function Dropdown({ items }: { items: DropdownItem[] }) {
  return (
    // pt-3: transparent bridge covering the gap so mouse doesn't escape the wrapper
    <div className="absolute top-full left-0 z-50 pt-3">
      <div
        className="flex flex-col rounded-[7px] px-3 py-2"
        style={{
          backgroundColor: "#19191e",
          border: "1px solid rgba(255,255,255,0.08)",
          gap: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="block whitespace-nowrap text-white transition-opacity hover:opacity-60"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "24px",
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Dropdown nav item ────────────────────────────────────────────────────────

function DropdownNavItem({ label, items }: { label: string; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-0 text-white transition-opacity hover:opacity-70"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontSize: "16px",
          lineHeight: "24px",
        }}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {label}
        <span
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown />
        </span>
      </button>
      {open && <Dropdown items={items} />}
    </div>
  );
}

// ─── GNB ─────────────────────────────────────────────────────────────────────

export default function GNB() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[80px] flex items-center"
      style={{ backgroundColor: "#19191e" }}
    >
      <div className="w-full flex items-center justify-between px-[48px]">
        {/* ── Left: Logo + Nav ── */}
        <div className="flex items-center" style={{ gap: "58px" }}>
          {/* Logo placeholder — replace with <Image> once logo asset is available */}
          <Link
            href="/"
            className="shrink-0 flex items-center justify-center rounded-[8px] size-[40px] text-white text-xs font-bold"
            style={{ backgroundColor: "#f44e00", fontFamily: "Poppins, sans-serif" }}
            aria-label="Marvelous Designer"
          >
            MD
          </Link>

          {/* Nav items */}
          <nav className="flex items-center" style={{ gap: "40px" }}>
            {NAV_ITEMS.map((item) => {
              if (item.dropdown) {
                return (
                  <DropdownNavItem
                    key={item.label}
                    label={item.label}
                    items={item.dropdown}
                  />
                );
              }

              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="transition-opacity hover:opacity-70"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.85)",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── Right: CTAs ── */}
        <div className="flex items-center" style={{ gap: "8px" }}>
          <Link
            href="/trial"
            className="flex items-center justify-center text-white transition-opacity hover:opacity-90"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "24px",
              backgroundColor: "#f44e00",
              borderRadius: "20px",
              width: "120px",
              height: "40px",
            }}
          >
            Free Trial
          </Link>
          <Link
            href="/sign-in"
            className="flex items-center justify-center text-white transition-opacity hover:opacity-70"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "24px",
              border: "1px solid #b4b4b4",
              borderRadius: "20px",
              paddingLeft: "12px",
              paddingRight: "12px",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
