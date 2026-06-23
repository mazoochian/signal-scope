import { test, expect } from "@playwright/test";

const REPORT_NAMES = [
  "Executive NOC Summary",
  "WAN SLA Report",
  "Capacity Planning",
  "Configuration Compliance",
  "Inventory Lifecycle",
  "Incident Postmortem",
];

test.describe("Reports Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reports");
  });

  test("page header shows Reports", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Reports/i })).toBeVisible();
  });

  test("shows all 6 report template cards", async ({ page }) => {
    for (const name of REPORT_NAMES) {
      await expect(page.getByText(name)).toBeVisible();
    }
  });

  test("each report card shows frequency metadata", async ({ page }) => {
    // Weekly, Monthly, Quarterly, On demand
    await expect(page.getByText("Weekly").first()).toBeVisible();
    await expect(page.getByText("Monthly").first()).toBeVisible();
    await expect(page.getByText("Quarterly")).toBeVisible();
    await expect(page.getByText("On demand")).toBeVisible();
  });

  test("each report card shows format metadata", async ({ page }) => {
    await expect(page.getByText("PDF").first()).toBeVisible();
    await expect(page.getByText("Excel").first()).toBeVisible();
  });

  test("Run now buttons are present", async ({ page }) => {
    const runNowButtons = page.getByRole("button", { name: /Run now/i });
    const count = await runNowButtons.count();
    expect(count).toBe(6);
  });

  test("Edit buttons are present", async ({ page }) => {
    const editButtons = page.getByRole("button", { name: /Edit/i });
    const count = await editButtons.count();
    expect(count).toBe(6);
  });

  test("Recipients buttons are present", async ({ page }) => {
    const recipientButtons = page.getByRole("button", { name: /Recipients/i });
    const count = await recipientButtons.count();
    expect(count).toBe(6);
  });

  test("Next run dates are shown", async ({ page }) => {
    await expect(page.getByText("Mon 06:00").first()).toBeVisible();
  });
});
