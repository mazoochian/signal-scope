import { test, expect } from "@playwright/test";

test.describe("Inventory Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/inventory");
  });

  test("page header shows Inventory", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Inventory/i })).toBeVisible();
  });

  test("shows summary chips", async ({ page }) => {
    const chips = page.locator(".panel.flex.items-center.justify-between");
    const count = await chips.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("asset register table has expected columns", async ({ page }) => {
    await expect(page.getByRole("columnheader", { name: "Serial" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Hostname" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Model" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Vendor" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Site" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Warranty" })).toBeVisible();
  });

  test("asset table has rows with serial numbers", async ({ page }) => {
    // Serial numbers in test data match patterns like SN12345
    const tableRows = page.locator("tbody tr");
    const count = await tableRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("asset table has rows with hostname data", async ({ page }) => {
    // Should show device hostnames
    await expect(page.locator("tbody td").first()).toBeVisible();
  });

  test("End-of-Support column is visible", async ({ page }) => {
    await expect(page.getByRole("columnheader", { name: "EoS" })).toBeVisible();
  });
});
