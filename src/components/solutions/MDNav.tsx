"use client";

import { useState, type FC } from "react";
import Link from "next/link";

type DropdownItem = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "/features" },
  {
    label: "Solutions",
    dropdown: [
      { label: "Individual", href: "/solutions/individual" },
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Academics", href: "/solutions/academics" },
      { label: "Students", href: "/solutions/students" },
    ],
  },
  { label: "Plan", href: "/plan" },
  {
    label: "Resources",
    dropdown: [
      { label: "Documentation", href: "/docs" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Community", href: "/community" },
      { label: "Blog", href: "/blog" },
    ],
  },
  { label: "Download", href: "/download" },
];

const MDNav: FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav
      className="md_nav_wrap"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#0a0a0a",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 18 }}>🐝</span>
          Marvelous Designer
        </Link>

        {/* Center Nav */}
        <div
          className="md_nav_center"
          style={{ display: "flex", alignItems: "center", gap: 4 }}
        >
          {NAV_ITEMS.map((item) => {
            const isOpen = openDropdown === item.label;

            if (item.dropdown) {
              return (
                <div
                  key={item.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "6px 12px",
                      borderRadius: 6,
                      color: isOpen
                        ? "#ffffff"
                        : "rgba(255,255,255,0.65)",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      fontSize: 14,
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      transition: "color 150ms ease",
                    }}
                  >
                    {item.label}
                    <svg
                      width={10}
                      height={10}
                      viewBox="0 0 10 10"
                      fill="none"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 150ms ease",
                        opacity: 0.6,
                      }}
                    >
                      <path
                        d="M2 3.5L5 6.5L8 3.5"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        backgroundColor: "#111111",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        padding: "6px 0",
                        minWidth: 160,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      }}
                    >
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          style={{
                            display: "block",
                            padding: "8px 16px",
                            color: "rgba(255,255,255,0.75)",
                            textDecoration: "none",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            fontSize: 14,
                            fontWeight: 400,
                            transition: "color 150ms ease, background 150ms ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#ffffff";
                            e.currentTarget.style.backgroundColor =
                              "rgba(255,255,255,0.06)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href ?? "#"}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: 14,
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right: Sign In */}
        <Link
          href="/login"
          style={{
            padding: "6px 18px",
            borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#ffffff",
            textDecoration: "none",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 14,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            transition: "border-color 150ms ease, background 150ms ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default MDNav;
