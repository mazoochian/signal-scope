import { test, expect } from "@playwright/test";

const MOCK_NOTIFICATIONS = [
  { id: 1, level: "crit", source: "device", title: "BGP session down to AS65001", detail: "edge-rtr-nyc-01 · Gi0/2", time: "14:02:14", read: false },
  { id: 2, level: "maj", source: "device", title: "High CPU on core-sw-01", detail: "core-sw-01 · CPU 94%", time: "13:58:32", read: false },
  { id: 3, level: "warn", source: "app", title: "Collector lag detected", detail: "collector-eu-01 · 18s behind", time: "13:45:10", read: false },
  { id: 4, level: "info", source: "app", title: "Discovery scan complete", detail: "HQ-NYC · 412 devices", time: "13:30:00", read: true },
];

test.describe("Notification Center", () => {
  test("bell icon is visible in top bar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Open notification center" })).toBeVisible();
  });

  test("unread badge is visible on bell when there are unread notifications", async ({ page }) => {
    // Mock the notifications endpoint to always return unread notifications
    await page.route("**/api/notifications", async (route) => {
      await route.fulfill({ json: MOCK_NOTIFICATIONS });
    });
    await page.goto("/");
    // Wait for the component to fetch notifications and render the badge
    await expect(page.locator(".pulse-ring")).toBeVisible({ timeout: 5000 });
  });

  test("clicking bell opens notification panel", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open notification center" }).click();
    await expect(page.getByText("Notifications")).toBeVisible();
  });

  test("notification panel shows notification items", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open notification center" }).click();
    await expect(page.getByText(/CRIT|MAJ|WARN|INFO/).first()).toBeVisible();
  });

  test("notification panel shows at least 3 notifications", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open notification center" }).click();
    const items = page.locator("ul li").filter({ hasText: /CRIT|MAJ|WARN|INFO/ });
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("Mark all as read button is visible when unread notifications exist", async ({ page }) => {
    // Mock the notifications endpoint to always return unread notifications
    await page.route("**/api/notifications", async (route) => {
      await route.fulfill({ json: MOCK_NOTIFICATIONS });
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Open notification center" }).click();
    await expect(page.getByRole("button", { name: /Mark all as read/i })).toBeVisible({ timeout: 5000 });
  });

  test("clicking mark all as read marks all as read", async ({ page }) => {
    // Mock notifications endpoint to return unread items
    await page.route("**/api/notifications", async (route) => {
      await route.fulfill({ json: MOCK_NOTIFICATIONS });
    });
    // Mock the mark-all-read endpoint
    await page.route("**/api/notifications/mark-all-read", async (route) => {
      await route.fulfill({ status: 200, json: {} });
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Open notification center" }).click();
    const markAllBtn = page.getByRole("button", { name: /Mark all as read/i });
    await expect(markAllBtn).toBeVisible({ timeout: 5000 });
    await markAllBtn.click();
    // After marking all read, the "X unread" badge text should disappear
    await expect(page.getByText(/unread/)).not.toBeVisible({ timeout: 3000 });
  });

  test("close button closes the notification panel", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open notification center" }).click();
    await expect(page.getByText("Notifications")).toBeVisible();
    await page.getByRole("button", { name: "Close notifications" }).click();
    await expect(page.getByText("Notifications")).not.toBeVisible();
  });

  test("notification items show title text", async ({ page }) => {
    // Mock to ensure the specific notification text is present
    await page.route("**/api/notifications", async (route) => {
      await route.fulfill({ json: MOCK_NOTIFICATIONS });
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Open notification center" }).click();
    await expect(page.getByText("BGP session down to AS65001").first()).toBeVisible();
  });

  test("View all alerts link is in notification panel footer", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open notification center" }).click();
    await expect(page.getByRole("link", { name: /View all alerts/i })).toBeVisible();
  });
});
