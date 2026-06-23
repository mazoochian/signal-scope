import { test, expect } from "@playwright/test";

test.describe("Topology Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/topology");
  });

  test("page header shows Topology", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Topology" }).first()).toBeVisible();
  });

  test("SVG topology map is present", async ({ page }) => {
    await expect(page.locator("svg[viewBox]").first()).toBeVisible();
  });

  test("SVG has node circles", async ({ page }) => {
    const circles = page.locator("svg circle");
    const count = await circles.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("SVG has edge lines", async ({ page }) => {
    const lines = page.locator("svg line");
    const count = await lines.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("layer filter dropdown is present", async ({ page }) => {
    await expect(page.getByRole("option", { name: "Layer 2 + Layer 3" })).toBeAttached();
  });

  test("layer filter has multiple options", async ({ page }) => {
    const select = page.locator("select").first();
    const options = await select.locator("option").allTextContents();
    expect(options.length).toBeGreaterThanOrEqual(2);
  });

  test("path trace panel is visible", async ({ page }) => {
    await expect(page.getByText("Path Trace")).toBeVisible();
  });

  test("path trace shows hop entries", async ({ page }) => {
    // Path hops appear as numbered entries
    // Path hops are rendered as numbered spans (1, 2, 3...)
    const hops = page.locator('ol li');
    const count = await hops.count();
    expect(count).toBeGreaterThan(0);
  });

  test("selected device panel is visible", async ({ page }) => {
    // Device detail panel hardcoded to core-sw-01
    await expect(page.getByText("core-sw-01").first()).toBeVisible();
  });

  test("zoom buttons are present", async ({ page }) => {
    // Zoom+, Zoom-, Reset toolbar
    const zoomIn = page.locator("button").filter({ has: page.locator("svg") }).nth(0);
    await expect(zoomIn).toBeVisible();
  });

  test("node abbreviations are visible in SVG text", async ({ page }) => {
    // Node labels like CR, AG, FW, RT should appear as SVG text
    const svgTexts = page.locator("svg text");
    const count = await svgTexts.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });
});
