# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: telemetry.spec.ts >> Flow & Telemetry Page >> conversations table has rows
- Location: e2e/tests/telemetry.spec.ts:42:7

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/telemetry", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Flow & Telemetry Page", () => {
  4  |   test.beforeEach(async ({ page }) => {
> 5  |     await page.goto("/telemetry");
     |                ^ Error: page.goto: Target page, context or browser has been closed
  6  |   });
  7  | 
  8  |   test("page header shows Flow & Telemetry", async ({ page }) => {
  9  |     await expect(page.getByRole("heading", { name: /Flow.*Telemetry/i })).toBeVisible();
  10 |   });
  11 | 
  12 |   test("aggregate throughput panel is visible", async ({ page }) => {
  13 |     await expect(page.getByText("Aggregate Flow Throughput")).toBeVisible();
  14 |   });
  15 | 
  16 |   test("flow stat chips are visible", async ({ page }) => {
  17 |     // Flow stats are shown as rounded-md boxes below the throughput chart
  18 |     const statsArea = page.locator(".grid-cols-4");
  19 |     await expect(statsArea).toBeVisible();
  20 |     const chipDivs = statsArea.locator(".rounded-md");
  21 |     const count = await chipDivs.count();
  22 |     expect(count).toBeGreaterThanOrEqual(2);
  23 |   });
  24 | 
  25 |   test("top applications panel is visible", async ({ page }) => {
  26 |     await expect(page.getByText("Top Applications")).toBeVisible();
  27 |   });
  28 | 
  29 |   test("top applications list has entries", async ({ page }) => {
  30 |     const appsPanel = page.locator("section, .panel").filter({ hasText: "Top Applications" }).first();
  31 |     const appItems = appsPanel.locator("li, [role='listitem']");
  32 |     const count = await appItems.count();
  33 |     expect(count).toBeGreaterThan(0);
  34 |   });
  35 | 
  36 |   test("conversations table is visible", async ({ page }) => {
  37 |     await expect(page.getByText("Conversations").first()).toBeVisible();
  38 |     await expect(page.getByRole("columnheader", { name: "Source" })).toBeVisible();
  39 |     await expect(page.getByRole("columnheader", { name: "Bytes" })).toBeVisible();
  40 |   });
  41 | 
  42 |   test("conversations table has rows", async ({ page }) => {
  43 |     const tableRows = page.locator("tbody tr");
  44 |     const count = await tableRows.count();
  45 |     expect(count).toBeGreaterThan(0);
  46 |   });
  47 | 
  48 |   test("streaming telemetry subscriptions panel is visible", async ({ page }) => {
  49 |     await expect(page.getByText("Streaming Telemetry")).toBeVisible();
  50 |   });
  51 | });
  52 | 
```