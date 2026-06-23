import { test, expect } from "@playwright/test";

test.describe("Alerts Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/alerts");
  });

  test("page header shows Alerts", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Alerts" }).first()).toBeVisible();
  });

  test("shows 5 severity count chips", async ({ page }) => {
    const severities = ["Critical", "Major", "Minor", "Warning", "Info"];
    for (const sev of severities) {
      await expect(page.getByText(sev, { exact: true }).first()).toBeVisible();
    }
  });

  test("alert table has expected column headers", async ({ page }) => {
    await expect(page.getByRole("columnheader", { name: "Sev" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "ID" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Title" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Device" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Rule" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Age" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "RC" })).toBeVisible();
  });

  test("alert table shows at least one alert row", async ({ page }) => {
    // Alert IDs in the API start with "ALR-"
    await expect(page.getByText(/ALR-\d+/).first()).toBeVisible();
  });

  test("shows at least one ROOT cause row highlighted", async ({ page }) => {
    // ROOT rows have a "ROOT · N children" chip
    await expect(page.getByText(/ROOT · \d+ children/).first()).toBeVisible();
  });

  test("action buttons are visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Acknowledge/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Suppress/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Open runbook/ })).toBeVisible();
  });

  test("root cause panel is visible", async ({ page }) => {
    // The root cause chain panel has a title
    await expect(page.getByText("Root Cause")).toBeVisible();
  });

  test("Open Alerts panel title is visible", async ({ page }) => {
    await expect(page.getByText("Open Alerts")).toBeVisible();
  });

  test("status pills are visible in alert rows", async ({ page }) => {
    // Status pills appear as CRIT/WARN/etc
    const critPill = page.getByText("CRIT").first();
    await expect(critPill).toBeVisible();
  });
});
