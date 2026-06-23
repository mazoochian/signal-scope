import { test, expect } from "@playwright/test";

test.describe("Service Assurance Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/services");
  });

  test("page header shows Service Assurance", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Service Assurance/i })).toBeVisible();
  });

  test("shows at least 4 service cards", async ({ page }) => {
    // Services panel with individual service cards
    
    const cards = page.locator(".panel").filter({ has: page.getByText("MTTR") });
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("service cards show health percentage", async ({ page }) => {
    // health % is rendered as a large number
    await expect(page.getByText(/\d+%/).first()).toBeVisible();
  });

  test("service cards show MTTR metric", async ({ page }) => {
    await expect(page.getByText("MTTR").first()).toBeVisible();
  });

  test("service cards show status pills", async ({ page }) => {
    // StatusPill renders as a span with status text
    const pills = page.locator("span").filter({ hasText: /^(UP|WARN|DOWN|OK|DEGRADED)$/i });
    const count = await pills.count();
    expect(count).toBeGreaterThan(0);
  });

  test("service cards show SLA percentage", async ({ page }) => {
    await expect(page.getByText("SLA").first()).toBeVisible();
  });

  test("service cards show dependency chains", async ({ page }) => {
    // Dependency chains are rendered as chip sequences
    await expect(page.getByText(/→/).first()).toBeVisible();
  });

  test("error budget metric is visible", async ({ page }) => {
    await expect(page.getByText("Error Budget").first()).toBeVisible();
  });
});
