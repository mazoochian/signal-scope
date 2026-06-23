# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: devices.spec.ts >> Add Device Dialog >> Cancel button closes dialog
- Location: e2e/tests/devices.spec.ts:74:7

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/devices", waiting until "load"

```

```
Error: write EPIPE
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Devices Page", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/devices");
  6  |   });
  7  | 
  8  |   test("page header shows Devices", async ({ page }) => {
  9  |     await expect(page.getByRole("heading", { name: "Devices" })).toBeVisible();
  10 |   });
  11 | 
  12 |   test("shows 5 vendor count chips", async ({ page }) => {
  13 |     // vendorCounts from API has 5 items
  14 |     const vendorChips = page.locator(".panel.flex.items-center.justify-between");
  15 |     await expect(vendorChips).toHaveCount(5);
  16 |   });
  17 | 
  18 |   test("device table header row has expected columns", async ({ page }) => {
  19 |     await expect(page.getByRole("columnheader", { name: "Device" })).toBeVisible();
  20 |     await expect(page.getByRole("columnheader", { name: "IP" })).toBeVisible();
  21 |     await expect(page.getByRole("columnheader", { name: "Role" })).toBeVisible();
  22 |     await expect(page.getByRole("columnheader", { name: "Site" })).toBeVisible();
  23 |     await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible();
  24 |     await expect(page.getByRole("columnheader", { name: "CPU" })).toBeVisible();
  25 |     await expect(page.getByRole("columnheader", { name: "Mem" })).toBeVisible();
  26 |   });
  27 | 
  28 |   test("shows 10 device rows", async ({ page }) => {
  29 |     // API returns 10 devices
  30 |     const tableRows = page.locator("tbody tr");
  31 |     const count = await tableRows.count();
  32 |     expect(count).toBeGreaterThanOrEqual(10);
  33 |   });
  34 | 
  35 |   test("device table contains core-sw-01", async ({ page }) => {
  36 |     await expect(page.getByText("core-sw-01")).toBeVisible();
  37 |   });
  38 | 
  39 |   test("device table contains edge router", async ({ page }) => {
  40 |     await expect(page.getByText(/edge-rtr/).first()).toBeVisible();
  41 |   });
  42 | 
  43 |   test("search filter input is present", async ({ page }) => {
  44 |     await expect(page.getByPlaceholder("Filter name, IP, MAC, vendor…")).toBeVisible();
  45 |   });
  46 | 
  47 |   test("Add Device button is present", async ({ page }) => {
  48 |     await expect(page.getByRole("button", { name: /Add device/ }).first()).toBeVisible();
  49 |   });
  50 | });
  51 | 
  52 | test.describe("Add Device Dialog", () => {
  53 |   test.beforeEach(async ({ page }) => {
> 54 |     await page.goto("/devices");
     |     ^ Error: write EPIPE
  55 |   });
  56 | 
  57 |   test("opens dialog on button click", async ({ page }) => {
  58 |     await page.getByRole("button", { name: /Add device/ }).first().click();
  59 |     await expect(page.getByRole("heading", { name: "Add device" })).toBeVisible();
  60 |   });
  61 | 
  62 |   test("dialog shows all required fields", async ({ page }) => {
  63 |     await page.getByRole("button", { name: /Add device/ }).first().click();
  64 |     await expect(page.getByPlaceholder("core-sw-03")).toBeVisible();
  65 |     await expect(page.getByPlaceholder("10.0.0.5")).toBeVisible();
  66 |     await expect(page.getByPlaceholder("Cisco")).toBeVisible();
  67 |     await expect(page.getByPlaceholder("C9300-48P")).toBeVisible();
  68 |     // Role, Site, Icon are selects
  69 |     await expect(page.getByRole("combobox").nth(0)).toBeVisible();
  70 |     await expect(page.getByRole("combobox").nth(1)).toBeVisible();
  71 |     await expect(page.getByRole("combobox").nth(2)).toBeVisible();
  72 |   });
  73 | 
  74 |   test("Cancel button closes dialog", async ({ page }) => {
  75 |     await page.getByRole("button", { name: /Add device/ }).first().click();
  76 |     await expect(page.getByRole("heading", { name: "Add device" })).toBeVisible();
  77 |     await page.getByRole("button", { name: "Cancel" }).click();
  78 |     await expect(page.getByRole("heading", { name: "Add device" })).not.toBeVisible();
  79 |   });
  80 | 
  81 |   test("shows error when required fields are empty", async ({ page }) => {
  82 |     await page.getByRole("button", { name: /Add device/ }).first().click();
  83 |     // Dialog is now open; click the submit button inside the dialog form
  84 |     await page.locator('form button[type="submit"]').click();
  85 |     await expect(page.getByText("Name, IP, Vendor and Model are required.")).toBeVisible();
  86 |   });
  87 | 
  88 |   test("accepts valid submission and closes dialog", async ({ page }) => {
  89 |     await page.getByRole("button", { name: /Add device/ }).first().click();
  90 |     await page.getByPlaceholder("core-sw-03").fill("test-device-01");
  91 |     await page.getByPlaceholder("10.0.0.5").fill("192.168.99.1");
  92 |     await page.getByPlaceholder("Cisco").fill("TestVendor");
  93 |     await page.getByPlaceholder("C9300-48P").fill("TEST-MODEL");
  94 |     await page.locator('form button[type="submit"]').click();
  95 |     // Dialog should close on success
  96 |     await expect(page.getByRole("heading", { name: "Add device" })).not.toBeVisible({ timeout: 8000 });
  97 |   });
  98 | });
  99 | 
```