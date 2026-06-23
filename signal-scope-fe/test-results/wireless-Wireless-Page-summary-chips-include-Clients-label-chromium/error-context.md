# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wireless.spec.ts >> Wireless Page >> summary chips include Clients label
- Location: e2e/tests/wireless.spec.ts:18:7

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/wireless", waiting until "load"

```

```
Error: write EPIPE
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Wireless Page", () => {
  4  |   test.beforeEach(async ({ page }) => {
> 5  |     await page.goto("/wireless");
     |     ^ Error: write EPIPE
  6  |   });
  7  | 
  8  |   test("page header shows Wireless", async ({ page }) => {
  9  |     await expect(page.getByRole("heading", { name: "Wireless" })).toBeVisible();
  10 |   });
  11 | 
  12 |   test("shows 4 summary chips", async ({ page }) => {
  13 |     const chips = page.locator(".panel.flex.items-center.justify-between");
  14 |     const count = await chips.count();
  15 |     expect(count).toBeGreaterThanOrEqual(4);
  16 |   });
  17 | 
  18 |   test("summary chips include Clients label", async ({ page }) => {
  19 |     await expect(page.getByText("Clients", { exact: true }).first()).toBeVisible();
  20 |   });
  21 | 
  22 |   test("AP table header is visible", async ({ page }) => {
  23 |     await expect(page.getByText("Access Points")).toBeVisible();
  24 |     await expect(page.getByRole("columnheader", { name: "AP" })).toBeVisible();
  25 |     await expect(page.getByRole("columnheader", { name: "Clients" })).toBeVisible();
  26 |   });
  27 | 
  28 |   test("AP table has rows", async ({ page }) => {
  29 |     const tableRows = page.locator("tbody tr");
  30 |     const count = await tableRows.count();
  31 |     expect(count).toBeGreaterThan(0);
  32 |   });
  33 | 
  34 |   test("clients 24h chart panel is visible", async ({ page }) => {
  35 |     await expect(page.getByText("Clients · 24h")).toBeVisible();
  36 |   });
  37 | 
  38 |   test("SSID distribution panel is visible", async ({ page }) => {
  39 |     await expect(page.getByText("SSID Distribution")).toBeVisible();
  40 |   });
  41 | 
  42 |   test("SSID distribution shows at least 2 bars", async ({ page }) => {
  43 |     const ssidPanel = page.locator("section, .panel").filter({ hasText: "SSID Distribution" });
  44 |     const bars = ssidPanel.locator("[style*='width']");
  45 |     const count = await bars.count();
  46 |     expect(count).toBeGreaterThanOrEqual(2);
  47 |   });
  48 | 
  49 |   test("AP rows show channel utilisation %", async ({ page }) => {
  50 |     await expect(page.getByText("Util").first()).toBeVisible();
  51 |   });
  52 | });
  53 | 
```