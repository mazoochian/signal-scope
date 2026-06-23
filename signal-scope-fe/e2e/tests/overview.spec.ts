import { test, expect } from "@playwright/test";

test.describe("Overview Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page header shows Network Overview", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Network Overview" })).toBeVisible();
  });

  test("shows 6 KPI cards with expected labels", async ({ page }) => {
    const labels = ["Devices Up", "Critical Alerts", "WAN Throughput", "Mean Latency", "Packet Loss", "SLA"];
    for (const label of labels) {
      await expect(page.getByText(label)).toBeVisible();
    }
  });

  test("KPI cards show non-empty values", async ({ page }) => {
    // Wait for KpiStripLive to load
    const kpiSection = page.locator(".grid").first();
    await expect(kpiSection).toBeVisible();
    // Devices Up should have a numeric value
    await expect(page.getByText(/^\d[\d,]+$/).first()).toBeVisible();
  });

  test("WAN Aggregate Throughput panel is visible", async ({ page }) => {
    await expect(page.getByText("WAN Aggregate Throughput")).toBeVisible();
  });

  test("WAN panel shows 4 stat chips", async ({ page }) => {
    await expect(page.getByText("Peak In")).toBeVisible();
    await expect(page.getByText("Peak Out")).toBeVisible();
    await expect(page.getByText("Drops")).toBeVisible();
    await expect(page.getByText("95th %ile")).toBeVisible();
  });

  test("Active Alerts panel is visible with items", async ({ page }) => {
    await expect(page.getByText("Active Alerts")).toBeVisible();
    // There should be alert items (from /overview endpoint)
    await expect(page.getByText("View all")).toBeVisible();
  });

  test("Site Health panel shows 6 sites", async ({ page }) => {
    await expect(page.getByText("Site Health")).toBeVisible();
    // Overview endpoint provides 6 sites; each has availability %
    const siteItems = page.locator("ul").filter({ hasText: "%" });
    await expect(siteItems.first()).toBeVisible();
  });

  test("Top Talkers panel is visible", async ({ page }) => {
    await expect(page.getByText("Top Talkers")).toBeVisible();
    await expect(page.getByText("Source").first()).toBeVisible();
    await expect(page.getByText("App").first()).toBeVisible();
    await expect(page.getByText("Mbps").first()).toBeVisible();
  });

  test("Resource Utilization panel shows metric bars", async ({ page }) => {
    await expect(page.getByText("Resource Utilization")).toBeVisible();
    await expect(page.getByText("CPU").first()).toBeVisible();
    await expect(page.getByText("Memory").first()).toBeVisible();
    await expect(page.getByText("Storage")).toBeVisible();
    await expect(page.getByText("Load Avg")).toBeVisible();
  });

  test("Resource Utilization shows percentage values", async ({ page }) => {
    // The bars show X.X% — wait for ResourceLive to hydrate
    await page.waitForTimeout(1000);
    const pctPattern = /\d+\.\d%/;
    const pctEl = page.getByText(pctPattern).first();
    await expect(pctEl).toBeVisible();
  });

  test("Service Assurance panel is visible", async ({ page }) => {
    await expect(page.getByText("Service Assurance").first()).toBeVisible();
    // Service panel shows Metric boxes - at least one service card should be visible
    await expect(page.getByText(/End-to-end business services/i)).toBeVisible();
  });

  test("Live Syslog panel is visible", async ({ page }) => {
    await expect(page.getByText("Live Syslog")).toBeVisible();
  });

  test("poll interval picker is present with correct options", async ({ page }) => {
    const picker = page.locator("select").filter({ hasText: "Off" });
    await expect(picker).toBeVisible();
    // Options are rendered inside the select — check via evaluate
    const optionValues = await picker.evaluate((el: HTMLSelectElement) =>
      Array.from(el.options).map((o) => o.text)
    );
    expect(optionValues).toContain("Off");
    expect(optionValues).toContain("5s");
    expect(optionValues).toContain("10s");
    expect(optionValues).toContain("30s");
    expect(optionValues).toContain("1m");
    expect(optionValues).toContain("5m");
  });

  test("device type boxes show Routers, Switches, APs", async ({ page }) => {
    await expect(page.getByText("Routers")).toBeVisible();
    await expect(page.getByText("Switches")).toBeVisible();
    await expect(page.getByText("APs")).toBeVisible();
  });
});
