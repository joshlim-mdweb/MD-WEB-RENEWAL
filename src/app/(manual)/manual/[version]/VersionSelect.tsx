"use client";

import { usePathname, useRouter } from "next/navigation";

export function VersionSelect({
  versions,
  current,
}: {
  versions: string[];
  current: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function onChange(next: string) {
    // 같은 경로를 새 버전 스코프로 — 대상 페이지가 유효성 판단·폴백
    const rest = pathname.replace(`/manual/${current}`, "");
    router.push(`/manual/${next}${rest}`);
  }

  return (
    <select value={current} onChange={(e) => onChange(e.target.value)}>
      {versions.map((v) => (
        <option key={v} value={v}>
          MD {v}
        </option>
      ))}
    </select>
  );
}
