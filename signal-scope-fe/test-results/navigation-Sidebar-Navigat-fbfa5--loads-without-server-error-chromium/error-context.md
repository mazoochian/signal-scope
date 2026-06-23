# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Sidebar Navigation >> each page loads without server error
- Location: e2e/tests/navigation.spec.ts:66:7

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/discovery", waiting until "load"

```

```
Error: write EPIPE
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const NAV_ITEMS = [
  4  |   { label: "Overview", href: "/" },
  5  |   { label: "Topology", href: "/topology" },
  6  |   { label: "Alerts", href: "/alerts" },
  7  |   { label: "Service Assurance", href: "/services" },
  8  |   { label: "Devices", href: "/devices" },
  9  |   { label: "Interfaces", href: "/interfaces" },
  10 |   { label: "Wireless", href: "/wireless" },
  11 |   { label: "Flow & Telemetry", href: "/telemetry" },
  12 |   { label: "Discovery", href: "/discovery" },
  13 |   { label: "Configuration", href: "/configuration" },
  14 |   { label: "Inventory", href: "/inventory" },
  15 |   { label: "Reports", href: "/reports" },
  16 |   { label: "Settings", href: "/settings" },
  17 | ];
  18 | 
  19 | test.describe("Sidebar Navigation", () => {
  20 |   test("sidebar shows the application logo", async ({ page }) => {
  21 |     await page.goto("/");
  22 |     await expect(page.getByText("SignalScope")).toBeVisible();
  23 |   });
  24 | 
  25 |   test("sidebar shows user avatar info", async ({ page }) => {
  26 |     await page.goto("/");
  27 |     await expect(page.getByText("j.ramirez")).toBeVisible();
  28 |   });
  29 | 
  30 |   test("all nav items are present in sidebar", async ({ page }) => {
  31 |     await page.goto("/");
  32 |     for (const item of NAV_ITEMS) {
  33 |       await expect(page.getByRole("link", { name: item.label })).toBeVisible();
  34 |     }
  35 |   });
  36 | 
  37 |   test("alerts nav item shows badge 37", async ({ page }) => {
  38 |     await page.goto("/");
  39 |     await expect(page.getByText("37").first()).toBeVisible();
  40 |   });
  41 | 
  42 |   test("clicking Overview link stays on overview", async ({ page }) => {
  43 |     await page.goto("/alerts");
  44 |     await page.getByRole("link", { name: "Overview" }).click();
  45 |     await expect(page).toHaveURL("/");
  46 |   });
  47 | 
  48 |   test("clicking Alerts link navigates to alerts page", async ({ page }) => {
  49 |     await page.goto("/");
  50 |     await page.getByRole("link", { name: "Alerts" }).click();
  51 |     await expect(page).toHaveURL("/alerts");
  52 |   });
  53 | 
  54 |   test("clicking Devices link navigates to devices page", async ({ page }) => {
  55 |     await page.goto("/");
  56 |     await page.getByRole("link", { name: "Devices" }).click();
  57 |     await expect(page).toHaveURL("/devices");
  58 |   });
  59 | 
  60 |   test("clicking Topology link navigates to topology page", async ({ page }) => {
  61 |     await page.goto("/");
  62 |     await page.getByRole("link", { name: "Topology" }).click();
  63 |     await expect(page).toHaveURL("/topology");
  64 |   });
  65 | 
  66 |   test("each page loads without server error", async ({ page }) => {
  67 |     for (const item of NAV_ITEMS) {
> 68 |       const response = await page.goto(item.href);
     |                        ^ Error: write EPIPE
  69 |       expect(response?.status()).toBeLessThan(500);
  70 |     }
  71 |   });
  72 | 
  73 |   test("page title updates when navigating to Alerts", async ({ page }) => {
  74 |     await page.goto("/alerts");
  75 |     await expect(page).toHaveTitle(/Alerts/);
  76 |   });
  77 | 
  78 |   test("page title updates when navigating to Devices", async ({ page }) => {
  79 |     await page.goto("/devices");
  80 |     await expect(page).toHaveTitle(/Devices/);
  81 |   });
  82 | 
  83 |   test("page title on overview is Network Overview", async ({ page }) => {
  84 |     await page.goto("/");
  85 |     await expect(page).toHaveTitle(/Network Overview/);
  86 |   });
  87 | });
  88 | 
```