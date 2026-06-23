import { test, expect } from "@playwright/test";

test.describe("Configuration Management Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/configuration");
  });

  test("page header shows Configuration Management", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Configuration/i })).toBeVisible();
  });

  test("diff viewer panel is visible", async ({ page }) => {
    await expect(page.getByText(/Config Diff|Pending Change|Diff/i).first()).toBeVisible();
  });

  test("diff viewer shows + prefix on added lines", async ({ page }) => {
    await expect(page.getByText(/^\+/).first()).toBeVisible();
  });

  test("diff viewer shows - prefix on removed lines", async ({ page }) => {
    await expect(page.getByText(/^-/).first()).toBeVisible();
  });

  test("diff shows interface configuration", async ({ page }) => {
    // The hardcoded diff shows Cisco IOS config
    await expect(page.getByText(/TenGigabitEthernet|interface/i).first()).toBeVisible();
  });

  test("backup status panel shows 7 devices", async ({ page }) => {
    // BACKUP_STATUS array has 7 entries
    const backupPanel = page.locator("section, .panel").filter({ hasText: "backup status" }).first();
    await expect(backupPanel).toBeVisible();
    const deviceRows = backupPanel.locator("li");
    const count = await deviceRows.count();
    expect(count).toBe(7);
  });

  test("backup status shows device names", async ({ page }) => {
    await expect(page.getByText("core-sw-01").first()).toBeVisible();
    await expect(page.getByText("fw-edge-sea-01")).toBeVisible();
  });

  test("backup status shows drift badge on some devices", async ({ page }) => {
    await expect(page.getByText("drift").first()).toBeVisible();
  });

  test("backup status shows in sync for some devices", async ({ page }) => {
    await expect(page.getByText(/in sync/i).first()).toBeVisible();
  });

  test("Approve & push button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Approve.*push/i })).toBeVisible();
  });

  test("Request review button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Request review/i })).toBeVisible();
  });

  test("Reject button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Reject/i })).toBeVisible();
  });

  test("Version history button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Version history/i })).toBeVisible();
  });

  test("Backup all button is visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Backup all/i })).toBeVisible();
  });
});
