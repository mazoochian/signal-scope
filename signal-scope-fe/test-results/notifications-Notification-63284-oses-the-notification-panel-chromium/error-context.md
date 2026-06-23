# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: notifications.spec.ts >> Notification Center >> close button closes the notification panel
- Location: e2e/tests/notifications.spec.ts:74:7

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const MOCK_NOTIFICATIONS = [
  4  |   { id: 1, level: "crit", source: "device", title: "BGP session down to AS65001", detail: "edge-rtr-nyc-01 · Gi0/2", time: "14:02:14", read: false },
  5  |   { id: 2, level: "maj", source: "device", title: "High CPU on core-sw-01", detail: "core-sw-01 · CPU 94%", time: "13:58:32", read: false },
  6  |   { id: 3, level: "warn", source: "app", title: "Collector lag detected", detail: "collector-eu-01 · 18s behind", time: "13:45:10", read: false },
  7  |   { id: 4, level: "info", source: "app", title: "Discovery scan complete", detail: "HQ-NYC · 412 devices", time: "13:30:00", read: true },
  8  | ];
  9  | 
  10 | test.describe("Notification Center", () => {
  11 |   test("bell icon is visible in top bar", async ({ page }) => {
  12 |     await page.goto("/");
  13 |     await expect(page.getByRole("button", { name: "Open notification center" })).toBeVisible();
  14 |   });
  15 | 
  16 |   test("unread badge is visible on bell when there are unread notifications", async ({ page }) => {
  17 |     // Mock the notifications endpoint to always return unread notifications
  18 |     await page.route("**/api/notifications", async (route) => {
  19 |       await route.fulfill({ json: MOCK_NOTIFICATIONS });
  20 |     });
  21 |     await page.goto("/");
  22 |     // Wait for the component to fetch notifications and render the badge
  23 |     await expect(page.locator(".pulse-ring")).toBeVisible({ timeout: 5000 });
  24 |   });
  25 | 
  26 |   test("clicking bell opens notification panel", async ({ page }) => {
  27 |     await page.goto("/");
  28 |     await page.getByRole("button", { name: "Open notification center" }).click();
  29 |     await expect(page.getByText("Notifications")).toBeVisible();
  30 |   });
  31 | 
  32 |   test("notification panel shows notification items", async ({ page }) => {
  33 |     await page.goto("/");
  34 |     await page.getByRole("button", { name: "Open notification center" }).click();
  35 |     await expect(page.getByText(/CRIT|MAJ|WARN|INFO/).first()).toBeVisible();
  36 |   });
  37 | 
  38 |   test("notification panel shows at least 3 notifications", async ({ page }) => {
  39 |     await page.goto("/");
  40 |     await page.getByRole("button", { name: "Open notification center" }).click();
  41 |     const items = page.locator("ul li").filter({ hasText: /CRIT|MAJ|WARN|INFO/ });
  42 |     const count = await items.count();
  43 |     expect(count).toBeGreaterThanOrEqual(3);
  44 |   });
  45 | 
  46 |   test("Mark all as read button is visible when unread notifications exist", async ({ page }) => {
  47 |     // Mock the notifications endpoint to always return unread notifications
  48 |     await page.route("**/api/notifications", async (route) => {
  49 |       await route.fulfill({ json: MOCK_NOTIFICATIONS });
  50 |     });
  51 |     await page.goto("/");
  52 |     await page.getByRole("button", { name: "Open notification center" }).click();
  53 |     await expect(page.getByRole("button", { name: /Mark all as read/i })).toBeVisible({ timeout: 5000 });
  54 |   });
  55 | 
  56 |   test("clicking mark all as read marks all as read", async ({ page }) => {
  57 |     // Mock notifications endpoint to return unread items
  58 |     await page.route("**/api/notifications", async (route) => {
  59 |       await route.fulfill({ json: MOCK_NOTIFICATIONS });
  60 |     });
  61 |     // Mock the mark-all-read endpoint
  62 |     await page.route("**/api/notifications/mark-all-read", async (route) => {
  63 |       await route.fulfill({ status: 200, json: {} });
  64 |     });
  65 |     await page.goto("/");
  66 |     await page.getByRole("button", { name: "Open notification center" }).click();
  67 |     const markAllBtn = page.getByRole("button", { name: /Mark all as read/i });
  68 |     await expect(markAllBtn).toBeVisible({ timeout: 5000 });
  69 |     await markAllBtn.click();
  70 |     // After marking all read, the "X unread" badge text should disappear
  71 |     await expect(page.getByText(/unread/)).not.toBeVisible({ timeout: 3000 });
  72 |   });
  73 | 
  74 |   test("close button closes the notification panel", async ({ page }) => {
> 75 |     await page.goto("/");
     |                ^ Error: page.goto: Target page, context or browser has been closed
  76 |     await page.getByRole("button", { name: "Open notification center" }).click();
  77 |     await expect(page.getByText("Notifications")).toBeVisible();
  78 |     await page.getByRole("button", { name: "Close notifications" }).click();
  79 |     await expect(page.getByText("Notifications")).not.toBeVisible();
  80 |   });
  81 | 
  82 |   test("notification items show title text", async ({ page }) => {
  83 |     // Mock to ensure the specific notification text is present
  84 |     await page.route("**/api/notifications", async (route) => {
  85 |       await route.fulfill({ json: MOCK_NOTIFICATIONS });
  86 |     });
  87 |     await page.goto("/");
  88 |     await page.getByRole("button", { name: "Open notification center" }).click();
  89 |     await expect(page.getByText("BGP session down to AS65001").first()).toBeVisible();
  90 |   });
  91 | 
  92 |   test("View all alerts link is in notification panel footer", async ({ page }) => {
  93 |     await page.goto("/");
  94 |     await page.getByRole("button", { name: "Open notification center" }).click();
  95 |     await expect(page.getByRole("link", { name: /View all alerts/i })).toBeVisible();
  96 |   });
  97 | });
  98 | 
```