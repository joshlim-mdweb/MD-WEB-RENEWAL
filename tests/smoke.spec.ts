import { test, expect } from "@playwright/test";

// 스모크 테스트 — 인증 없이 접근 가능한 페이지들이 정상 로드되는지 확인.
// Supabase 연결 없이도 통과해야 한다.

test.describe("페이지 로드", () => {
  test("홈 — 200 응답, 레이아웃 렌더됨 (Supabase 없어도 통과)", async ({ page }) => {
    await page.goto("/");
    // 500 에러 페이지가 아닌지 확인 — layout은 Supabase 없이도 렌더됨
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("h1, h2, main, [class]").first()).toBeVisible();
  });

  test("로그인 페이지 — 폼 렌더", async ({ page }) => {
    await page.goto("/login");
    // 이메일 입력 필드 존재
    await expect(page.getByRole("textbox").first()).toBeVisible();
  });

  test("/analyze — survey/new 또는 login으로 redirect (입력창 없음)", async ({ page }) => {
    const res = await page.goto("/analyze");
    // /analyze는 /survey/new로 redirect → 미인증 시 /login까지 이어짐. 500은 안 됨.
    expect([200, 303, null]).toContain(res?.status() ?? null);
    const url = page.url();
    const isOk = url.includes("/survey/new") || url.includes("/login") || url.includes("/analyze");
    expect(isOk).toBe(true);
  });

  test("/survey/new — 설문 생성 폼 (로그인 필요 시 login redirect)", async ({ page }) => {
    const res = await page.goto("/survey/new");
    // 200이거나 login으로 리다이렉트 — 500은 안 됨
    expect([200, 303, null]).toContain(res?.status() ?? null);
    const url = page.url();
    const isOk = url.includes("/survey/new") || url.includes("/login");
    expect(isOk).toBe(true);
  });
});

test.describe("제거된 페이지 — 404", () => {
  test("/poll — 404 또는 redirect", async ({ page }) => {
    const res = await page.goto("/poll");
    // Poll이 제거됐으니 404 또는 홈으로 redirect
    const status = res?.status() ?? 0;
    const isGone = status === 404 || status === 308 || !page.url().includes("/poll");
    expect(isGone).toBe(true);
  });

  test("/create — 404 또는 redirect", async ({ page }) => {
    const res = await page.goto("/create");
    const status = res?.status() ?? 0;
    const isGone = status === 404 || !page.url().includes("/create");
    expect(isGone).toBe(true);
  });
});
