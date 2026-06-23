import { test, expect } from "@playwright/test";

test.describe("Flow & Telemetry Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/telemetry");
  });

  test("page header shows Flow & Telemetry", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Flow.*Telemetry/i })).toBeVisible();
  });

  test("aggregate throughput panel is visible", async ({ page }) => {
    await expect(page.getByText("Aggregate Flow Throughput")).toBeVisible();
  });

  test("flow stat chips are visible", async ({ page }) => {
    // Flow stats are shown as rounded-md boxes below the throughput chart
    const statsArea = page.locator(".grid-cols-4");
    await expect(statsArea).toBeVisible();
    const chipDivs = statsArea.locator(".rounded-md");
    const count = await chipDivs.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("top applications panel is visible", async ({ page }) => {
    await expect(page.getByText("Top Applications")).toBeVisible();
  });

  test("top applications list has entries", async ({ page }) => {
    const appsPanel = page.locator("section, .panel").filter({ hasText: "Top Applications" }).first();
    const appItems = appsPanel.locator("li, [role='listitem']");
    const count = await appItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test("conversations table is visible", async ({ page }) => {
    await expect(page.getByText("Conversations").first()).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Source" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Bytes" })).toBeVisible();
  });

  test("conversations table has rows", async ({ page }) => {
    const tableRows = page.locator("tbody tr");
    const count = await tableRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("streaming telemetry subscriptions panel is visible", async ({ page }) => {
    await expect(page.getByText("Streaming Telemetry")).toBeVisible();
  });
});
