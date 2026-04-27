export type ThumbnailPreset = {
  id: number;
  url: string;
  label: string;
};

export const THUMBNAIL_PRESETS: ThumbnailPreset[] = [
  { id: 1, url: "/thumbnails/preset-1.svg", label: "협업" },
  { id: 2, url: "/thumbnails/preset-2.svg", label: "데이터 분석" },
  { id: 3, url: "/thumbnails/preset-3.svg", label: "리서치" },
  { id: 4, url: "/thumbnails/preset-4.svg", label: "설문지" },
  { id: 5, url: "/thumbnails/preset-5.svg", label: "피드백" },
  { id: 6, url: "/thumbnails/preset-6.svg", label: "성장" },
  { id: 7, url: "/thumbnails/preset-7.svg", label: "커뮤니티" },
  { id: 8, url: "/thumbnails/preset-8.svg", label: "모바일" },
  { id: 9, url: "/thumbnails/preset-9.svg", label: "인사이트" },
  { id: 10, url: "/thumbnails/preset-10.svg", label: "보고서" },
];
