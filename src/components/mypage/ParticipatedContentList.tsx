"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { COLOR, TYPOGRAPHY } from "@/lib/design-tokens";

interface ActivityItem {
  id: string;
  contentType: "survey";
  title: string;
  participatedAt: string;
}

interface ParticipatedContentListProps {
  activities: ActivityItem[];
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function ParticipatedContentList({ activities }: ParticipatedContentListProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      activities.filter(
        (a) => search === "" || a.title.toLowerCase().includes(search.toLowerCase())
      ),
    [activities, search]
  );

  return (
    <section className="participated_content_area">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 py-4">
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: COLOR.TEXT_MUTED }}
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="제목 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-lg text-sm outline-none w-52"
            style={{
              ...TYPOGRAPHY.STYLE.BODY_2,
              backgroundColor: COLOR.BG_SECTION,
              color: COLOR.TEXT_PRIMARY,
              border: `1px solid ${COLOR.BORDER_DEFAULT}`,
            }}
          />
        </div>
      </div>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <EmptyState search={search} />
      ) : (
        <div className="rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: COLOR.BG_SECTION }}>
                <th
                  className="text-left py-3 px-4 w-16"
                  style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}
                >
                  순번
                </th>
                <th
                  className="text-left py-3 px-4"
                  style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}
                >
                  제목
                </th>
                <th
                  className="text-left py-3 px-4 w-32"
                  style={{ ...TYPOGRAPHY.STYLE.LABEL_1, color: COLOR.TEXT_MUTED }}
                >
                  참여일
                </th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((activity, i) => (
                <tr
                  key={`survey-${activity.id}`}
                  className="group transition-colors hover:bg-[#EEF1F4]"
                >
                  <td
                    className="py-3.5 px-4"
                    style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_DISABLED }}
                  >
                    {String(i + 1).padStart(3, "0")}
                  </td>
                  <td
                    className="py-3.5 px-4"
                    style={{ ...TYPOGRAPHY.STYLE.BODY_1, color: COLOR.TEXT_PRIMARY }}
                  >
                    {activity.title}
                  </td>
                  <td
                    className="py-3.5 px-4"
                    style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}
                  >
                    {formatDate(activity.participatedAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/survey/${activity.id}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ ...TYPOGRAPHY.STYLE.LABEL_2, color: COLOR.ACCENT }}
                    >
                      보러가기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="py-20 text-center">
      <p style={{ ...TYPOGRAPHY.STYLE.BODY_2, color: COLOR.TEXT_MUTED }}>
        {search
          ? `"${search}" 참여 기록이 없어요`
          : "아직 참여한 설문이 없어요. 공개된 설문에 참여해 보세요."}
      </p>
    </div>
  );
}
