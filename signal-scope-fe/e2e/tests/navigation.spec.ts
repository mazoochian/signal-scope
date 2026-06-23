import { test, expect } from "@playwright/test";

const NAV_ITEMS = [
  { label: "Overview", href: "/" },
  { label: "Topology", href: "/topology" },
  { label: "Alerts", href: "/alerts" },
  { label: "Service Assurance", href: "/services" },
  { label: "Devices", href: "/devices" },
  { label: "Interfaces", href: "/interfaces" },
  { label: "Wireless", href: "/wireless" },
  { label: "Flow & Telemetry", href: "/telemetry" },
  { label: "Discovery", href: "/discovery" },
  { label: "Configuration", href: "/configuration" },
  { label: "Inventory", href: "/inventory" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
];

test.describe("Sidebar Navigation", () => {
  test("sidebar shows the application logo", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("SignalScope")).toBeVisible();
  });

  test("sidebar shows user avatar info", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("j.ramirez")).toBeVisible();
  });

  test("all nav items are present in sidebar", async ({ page }) => {
    await page.goto("/");
    for (const item of NAV_ITEMS) {
      await expect(page.getByRole("link", { name: item.label })).toBeVisible();
    }
  });

  test("alerts nav item shows badge 37", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("37").first()).toBeVisible();
  });

  test("clicking Overview link stays on overview", async ({ page }) => {
    await page.goto("/alerts");
    await page.getByRole("link", { name: "Overview" }).click();
    await expect(page).toHaveURL("/");
  });

  test("clicking Alerts link navigates to alerts page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Alerts" }).click();
    await expect(page).toHaveURL("/alerts");
  });

  test("clicking Devices link navigates to devices page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Devices" }).click();
    await expect(page).toHaveURL("/devices");
  });

  test("clicking Topology link navigates to topology page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Topology" }).click();
    await expect(page).toHaveURL("/topology");
  });

  test("each page loads without server error", async ({ page }) => {
    for (const item of NAV_ITEMS) {
      const response = await page.goto(item.href);
      expect(response?.status()).toBeLessThan(500);
    }
  });

  test("page title updates when navigating to Alerts", async ({ page }) => {
    await page.goto("/alerts");
    await expect(page).toHaveTitle(/Alerts/);
  });

  test("page title updates when navigating to Devices", async ({ page }) => {
    await page.goto("/devices");
    await expect(page).toHaveTitle(/Devices/);
  });

  test("page title on overview is Network Overview", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Network Overview/);
  });
});
