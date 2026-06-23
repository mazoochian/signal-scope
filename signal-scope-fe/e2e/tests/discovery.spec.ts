import { test, expect } from "@playwright/test";

test.describe("Discovery Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/discovery");
  });

  test("page header shows Discovery", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Discovery/i }).first()).toBeVisible();
  });

  test("active discovery jobs panel is visible", async ({ page }) => {
    await expect(page.getByText("Active discovery jobs")).toBeVisible();
  });

  test("active jobs show progress bars", async ({ page }) => {
    const jobsPanel = page.locator("section, .panel, li.rounded-md").filter({ hasText: "Active discovery jobs" }).first();
    await expect(jobsPanel).toBeVisible();
    // Progress bars are divs with inline width% style inside .rounded-full container
    const progressFills = page.locator(".rounded-full [style*='width']");
    const count = await progressFills.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("recently discovered devices panel is visible", async ({ page }) => {
    await expect(page.getByText("Recently Discovered")).toBeVisible();
  });

  test("recently discovered list shows IP addresses", async ({ page }) => {
    await expect(page.getByText(/\d+\.\d+\.\d+\.\d+/).first()).toBeVisible();
  });

  test("recently discovered list has multiple entries", async ({ page }) => {
    // API returns 5 recently discovered devices
    const recentPanel = page.locator("section, .panel").filter({ hasText: "Recently Discovered" }).first();
    const rows = recentPanel.locator("tr, li");
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("jobs show subnet ranges", async ({ page }) => {
    // Job data contains subnet info like 10.0.0.0/24
    await expect(page.getByText(/\/\d+/).first()).toBeVisible();
  });
});
