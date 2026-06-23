import { test, expect } from "@playwright/test";

test.describe("Wireless Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/wireless");
  });

  test("page header shows Wireless", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Wireless" })).toBeVisible();
  });

  test("shows 4 summary chips", async ({ page }) => {
    const chips = page.locator(".panel.flex.items-center.justify-between");
    const count = await chips.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("summary chips include Clients label", async ({ page }) => {
    await expect(page.getByText("Clients", { exact: true }).first()).toBeVisible();
  });

  test("AP table header is visible", async ({ page }) => {
    await expect(page.getByText("Access Points")).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "AP" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Clients" })).toBeVisible();
  });

  test("AP table has rows", async ({ page }) => {
    const tableRows = page.locator("tbody tr");
    const count = await tableRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("clients 24h chart panel is visible", async ({ page }) => {
    await expect(page.getByText("Clients · 24h")).toBeVisible();
  });

  test("SSID distribution panel is visible", async ({ page }) => {
    await expect(page.getByText("SSID Distribution")).toBeVisible();
  });

  test("SSID distribution shows at least 2 bars", async ({ page }) => {
    const ssidPanel = page.locator("section, .panel").filter({ hasText: "SSID Distribution" });
    const bars = ssidPanel.locator("[style*='width']");
    const count = await bars.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("AP rows show channel utilisation %", async ({ page }) => {
    await expect(page.getByText("Util").first()).toBeVisible();
  });
});
