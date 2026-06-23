import { test, expect } from "@playwright/test";

test.describe("Interfaces Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/interfaces");
  });

  test("page header shows Interfaces", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Interfaces" })).toBeVisible();
  });

  test("shows summary stat chips", async ({ page }) => {
    // Summary chips from the interfaces API
    const chips = page.locator(".panel.flex.items-center.justify-between");
    const count = await chips.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("port matrix grid is visible", async ({ page }) => {
    // 48-port grid — each port is a small coloured div in a grid
    await expect(page.getByText("Port matrix")).toBeVisible();
  });

  test("port matrix has 48 port cells", async ({ page }) => {
    // The 48-port grid uses a 12-column grid
    const portsContainer = page.locator(".grid-cols-12");
    await expect(portsContainer).toBeVisible();
    const cells = portsContainer.locator("> div");
    const count = await cells.count();
    expect(count).toBe(48);
  });

  test("interface table has header row", async ({ page }) => {
    await expect(page.getByRole("columnheader", { name: "Port" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Description" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Speed" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Util" })).toBeVisible();
  });

  test("interface table has rows", async ({ page }) => {
    const tableRows = page.locator("tbody tr");
    const count = await tableRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("top utilized interfaces list is visible", async ({ page }) => {
    await expect(page.getByText("Top Utilized")).toBeVisible();
  });

  test("shows at least 4 top utilized interfaces", async ({ page }) => {
    const topList = page.locator("ul").filter({ hasText: "%" }).last();
    const items = topList.locator("li");
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });
});
