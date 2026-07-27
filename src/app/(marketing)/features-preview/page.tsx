"use client";

// 브랜딩 타이틀 스타일 예시 — 검토 후 삭제 예정
// 참고: Procreate 패턴 (eyebrow label + 큰 헤드라인)

const EXAMPLES = [
  {
    id: "A",
    style: "Eyebrow — ALL CAPS dot separator",
    eyebrow: "SIMULATION · PHYSICS · DRAPE",
    headline: "The way cloth actually moves.",
    sub: "폴리곤을 깎는 대신 물리엔진으로. 패턴 그대로 중력과 마찰을 계산해 자연스러운 주름을 만들어냅니다.",
  },
  {
    id: "B",
    style: "Eyebrow — slash separator",
    eyebrow: "SIMULATION / PHYSICS / DRAPE",
    headline: "The way cloth actually moves.",
    sub: "폴리곤을 깎는 대신 물리엔진으로. 패턴 그대로 중력과 마찰을 계산해 자연스러운 주름을 만들어냅니다.",
  },
  {
    id: "C",
    style: "Procreate inline — white + fade gray",
    eyebrow: null,
    headline: null,
    inline: {
      white: "Create realistic garments with",
      gray: "simulation, fabric physics and material editing.",
    },
    sub: "폴리곤을 깎는 대신 물리엔진으로. 패턴 그대로 중력과 마찰을 계산해 자연스러운 주름을 만들어냅니다.",
  },
  {
    id: "D",
    style: "Eyebrow — comma list (lowercase)",
    eyebrow: "Simulation, physics, drape",
    headline: "The way cloth actually moves.",
    sub: "폴리곤을 깎는 대신 물리엔진으로. 패턴 그대로 중력과 마찰을 계산해 자연스러운 주름을 만들어냅니다.",
    eyebrowStyle: "lowercase",
  },
  {
    id: "E",
    style: "Eyebrow — subtle pill tags",
    eyebrow: null,
    tags: ["Simulation", "Physics", "Drape"],
    headline: "The way cloth actually moves.",
    sub: "폴리곤을 깎는 대신 물리엔진으로. 패턴 그대로 중력과 마찰을 계산해 자연스러운 주름을 만들어냅니다.",
  },
];

const BLOCKS = [
  {
    eyebrow: "MODELLING",
    headline: "폴리곤이 아닌,\n패턴으로.",
    sub: "실제 봉제 패턴을 배치하고, 봉제선으로 연결. 현실의 재단 방식을 그대로 옮긴 워크플로우.",
  },
  {
    eyebrow: "TEXTURE & FABRIC",
    headline: "실크는 흘러내리고,\n데님은 버틴다.",
    sub: "소재별 무게, 탄성, 마찰 계수 설정으로 각 소재 고유의 텍스쳐와 움직임 구현. 천의 성질, 중력, 마찰까지 의도한 대로.",
  },
  {
    eyebrow: "RIGGING",
    headline: "어떤 캐릭터에도,\n자동으로.",
    sub: "리깅된 아바타를 불러오면 골격과 포즈에 맞게 자동 피팅. 다양한 체형과 포즈에서 안정적으로.",
  },
  {
    eyebrow: "ANIMATION",
    headline: "모든 프레임,\n물리적으로 정확하게.",
    sub: "캐릭터의 움직임에 맞게 천의 물리 반응을 매 프레임 계산, 시뮬레이션 캐시로 저장. 자연스러운 주름과 흐름이 자동으로.",
  },
  {
    eyebrow: "RENDERING",
    headline: "파이프라인은\n그대로.",
    sub: "FBX, Alembic, OBJ 포맷으로 내보내 Maya, Houdini, Unreal Engine, Unity와 직접 연동. 기존 파이프라인 변경 없이.",
  },
];

export default function FeaturesBrandingPreview() {
  return (
    <div style={{ backgroundColor: "#19191e", fontFamily: "Poppins, sans-serif", minHeight: "100vh" }}>
      {/* 섹션 타이틀 스타일 비교 */}
      <div className="max-w-[1100px] mx-auto px-[48px] py-[80px]">
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, letterSpacing: "0.1em", marginBottom: 8 }}>
          BRANDING PREVIEW — 검토 후 삭제
        </p>
        <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 500, marginBottom: 64 }}>
          Section Title Style Variants
        </h1>

        {/* 5가지 스타일 비교 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 48, marginBottom: 120 }}>
          {EXAMPLES.map((ex) => (
            <div key={ex.id} style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 40 }}>
              {/* 스타일명 */}
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.08em", marginBottom: 28 }}>
                [{ex.id}] {ex.style}
              </p>

              {/* 콘텐츠 영역 */}
              <div style={{ maxWidth: 640 }}>
                {/* Pill tags (E) */}
                {ex.tags && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                    {ex.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: 20,
                          padding: "4px 12px",
                          fontSize: 12,
                          color: "rgba(255,255,255,0.6)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Eyebrow */}
                {ex.eyebrow && (
                  <p
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: ex.eyebrowStyle === "lowercase" ? 14 : 11,
                      fontWeight: ex.eyebrowStyle === "lowercase" ? 400 : 500,
                      letterSpacing: ex.eyebrowStyle === "lowercase" ? "0.01em" : "0.12em",
                      textTransform: ex.eyebrowStyle === "lowercase" ? "none" : "uppercase",
                      marginBottom: 16,
                    }}
                  >
                    {ex.eyebrow}
                  </p>
                )}

                {/* Inline headline (C) */}
                {ex.inline && (
                  <p style={{ fontSize: 40, fontWeight: 500, lineHeight: 1.2, marginBottom: 20 }}>
                    <span style={{ color: "#ffffff" }}>{ex.inline.white} </span>
                    <span style={{ color: "rgba(255,255,255,0.38)" }}>{ex.inline.gray}</span>
                  </p>
                )}

                {/* Standard headline */}
                {ex.headline && (
                  <h2
                    style={{
                      color: "#ffffff",
                      fontSize: 40,
                      fontWeight: 500,
                      lineHeight: 1.2,
                      marginBottom: 20,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {ex.headline}
                  </h2>
                )}

                {/* Sub text */}
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.7 }}>
                  {ex.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ────────────── 실제 페이지처럼 4 블록 나열 ────────────── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 64, marginBottom: 40 }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, letterSpacing: "0.1em", marginBottom: 8 }}>
            APPLIED — Features Page (Style A 기준)
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 80 }}>
            실제 페이지에서 4 블록이 어떻게 보이는지 확인용
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
            {BLOCKS.map((block, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 64,
                  alignItems: "center",
                }}
              >
                {/* 텍스트 — 홀수: 왼쪽, 짝수: 오른쪽 */}
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      marginBottom: 16,
                    }}
                  >
                    {block.eyebrow}
                  </p>
                  <h2
                    style={{
                      color: "#ffffff",
                      fontSize: 36,
                      fontWeight: 500,
                      lineHeight: 1.25,
                      marginBottom: 20,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {block.headline}
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.75 }}>
                    {block.sub}
                  </p>
                </div>

                {/* 이미지 플레이스홀더 */}
                <div
                  style={{
                    order: i % 2 === 0 ? 1 : 0,
                    backgroundColor: "#202027",
                    borderRadius: 12,
                    aspectRatio: "16/10",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p style={{ color: "rgba(255,255,255,0.15)", fontSize: 13 }}>
                    Image / GIF placeholder
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
