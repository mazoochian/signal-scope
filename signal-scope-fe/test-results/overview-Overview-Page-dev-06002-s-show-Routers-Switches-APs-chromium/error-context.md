# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: overview.spec.ts >> Overview Page >> device type boxes show Routers, Switches, APs
- Location: e2e/tests/overview.spec.ts:99:7

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("Overview Page", () => {
  4   |   test.beforeEach(async ({ page }) => {
> 5   |     await page.goto("/");
      |                ^ Error: page.goto: Target page, context or browser has been closed
  6   |   });
  7   | 
  8   |   test("page header shows Network Overview", async ({ page }) => {
  9   |     await expect(page.getByRole("heading", { name: "Network Overview" })).toBeVisible();
  10  |   });
  11  | 
  12  |   test("shows 6 KPI cards with expected labels", async ({ page }) => {
  13  |     const labels = ["Devices Up", "Critical Alerts", "WAN Throughput", "Mean Latency", "Packet Loss", "SLA"];
  14  |     for (const label of labels) {
  15  |       await expect(page.getByText(label)).toBeVisible();
  16  |     }
  17  |   });
  18  | 
  19  |   test("KPI cards show non-empty values", async ({ page }) => {
  20  |     // Wait for KpiStripLive to load
  21  |     const kpiSection = page.locator(".grid").first();
  22  |     await expect(kpiSection).toBeVisible();
  23  |     // Devices Up should have a numeric value
  24  |     await expect(page.getByText(/^\d[\d,]+$/).first()).toBeVisible();
  25  |   });
  26  | 
  27  |   test("WAN Aggregate Throughput panel is visible", async ({ page }) => {
  28  |     await expect(page.getByText("WAN Aggregate Throughput")).toBeVisible();
  29  |   });
  30  | 
  31  |   test("WAN panel shows 4 stat chips", async ({ page }) => {
  32  |     await expect(page.getByText("Peak In")).toBeVisible();
  33  |     await expect(page.getByText("Peak Out")).toBeVisible();
  34  |     await expect(page.getByText("Drops")).toBeVisible();
  35  |     await expect(page.getByText("95th %ile")).toBeVisible();
  36  |   });
  37  | 
  38  |   test("Active Alerts panel is visible with items", async ({ page }) => {
  39  |     await expect(page.getByText("Active Alerts")).toBeVisible();
  40  |     // There should be alert items (from /overview endpoint)
  41  |     await expect(page.getByText("View all")).toBeVisible();
  42  |   });
  43  | 
  44  |   test("Site Health panel shows 6 sites", async ({ page }) => {
  45  |     await expect(page.getByText("Site Health")).toBeVisible();
  46  |     // Overview endpoint provides 6 sites; each has availability %
  47  |     const siteItems = page.locator("ul").filter({ hasText: "%" });
  48  |     await expect(siteItems.first()).toBeVisible();
  49  |   });
  50  | 
  51  |   test("Top Talkers panel is visible", async ({ page }) => {
  52  |     await expect(page.getByText("Top Talkers")).toBeVisible();
  53  |     await expect(page.getByText("Source").first()).toBeVisible();
  54  |     await expect(page.getByText("App").first()).toBeVisible();
  55  |     await expect(page.getByText("Mbps").first()).toBeVisible();
  56  |   });
  57  | 
  58  |   test("Resource Utilization panel shows metric bars", async ({ page }) => {
  59  |     await expect(page.getByText("Resource Utilization")).toBeVisible();
  60  |     await expect(page.getByText("CPU").first()).toBeVisible();
  61  |     await expect(page.getByText("Memory").first()).toBeVisible();
  62  |     await expect(page.getByText("Storage")).toBeVisible();
  63  |     await expect(page.getByText("Load Avg")).toBeVisible();
  64  |   });
  65  | 
  66  |   test("Resource Utilization shows percentage values", async ({ page }) => {
  67  |     // The bars show X.X% — wait for ResourceLive to hydrate
  68  |     await page.waitForTimeout(1000);
  69  |     const pctPattern = /\d+\.\d%/;
  70  |     const pctEl = page.getByText(pctPattern).first();
  71  |     await expect(pctEl).toBeVisible();
  72  |   });
  73  | 
  74  |   test("Service Assurance panel is visible", async ({ page }) => {
  75  |     await expect(page.getByText("Service Assurance").first()).toBeVisible();
  76  |     // Service panel shows Metric boxes - at least one service card should be visible
  77  |     await expect(page.getByText(/End-to-end business services/i)).toBeVisible();
  78  |   });
  79  | 
  80  |   test("Live Syslog panel is visible", async ({ page }) => {
  81  |     await expect(page.getByText("Live Syslog")).toBeVisible();
  82  |   });
  83  | 
  84  |   test("poll interval picker is present with correct options", async ({ page }) => {
  85  |     const picker = page.locator("select").filter({ hasText: "Off" });
  86  |     await expect(picker).toBeVisible();
  87  |     // Options are rendered inside the select — check via evaluate
  88  |     const optionValues = await picker.evaluate((el: HTMLSelectElement) =>
  89  |       Array.from(el.options).map((o) => o.text)
  90  |     );
  91  |     expect(optionValues).toContain("Off");
  92  |     expect(optionValues).toContain("5s");
  93  |     expect(optionValues).toContain("10s");
  94  |     expect(optionValues).toContain("30s");
  95  |     expect(optionValues).toContain("1m");
  96  |     expect(optionValues).toContain("5m");
  97  |   });
  98  | 
  99  |   test("device type boxes show Routers, Switches, APs", async ({ page }) => {
  100 |     await expect(page.getByText("Routers")).toBeVisible();
  101 |     await expect(page.getByText("Switches")).toBeVisible();
  102 |     await expect(page.getByText("APs")).toBeVisible();
  103 |   });
  104 | });
  105 | 
```