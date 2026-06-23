import { test, expect } from "@playwright/test";

test.describe("Devices Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/devices");
  });

  test("page header shows Devices", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Devices" })).toBeVisible();
  });

  test("shows 5 vendor count chips", async ({ page }) => {
    // vendorCounts from API has 5 items
    const vendorChips = page.locator(".panel.flex.items-center.justify-between");
    await expect(vendorChips).toHaveCount(5);
  });

  test("device table header row has expected columns", async ({ page }) => {
    await expect(page.getByRole("columnheader", { name: "Device" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "IP" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Role" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Site" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "CPU" })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Mem" })).toBeVisible();
  });

  test("shows 10 device rows", async ({ page }) => {
    // API returns 10 devices
    const tableRows = page.locator("tbody tr");
    const count = await tableRows.count();
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test("device table contains core-sw-01", async ({ page }) => {
    await expect(page.getByText("core-sw-01")).toBeVisible();
  });

  test("device table contains edge router", async ({ page }) => {
    await expect(page.getByText(/edge-rtr/).first()).toBeVisible();
  });

  test("search filter input is present", async ({ page }) => {
    await expect(page.getByPlaceholder("Filter name, IP, MAC, vendor…")).toBeVisible();
  });

  test("Add Device button is present", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Add device/ }).first()).toBeVisible();
  });
});

test.describe("Add Device Dialog", () => {
  const testDeviceName = `test-device-${Date.now()}`;
  let createdDeviceId: number | null = null;

  test.beforeEach(async ({ page }) => {
    await page.goto("/devices");
  });

  test.afterAll(async ({ request }) => {
    if (createdDeviceId != null) {
      await request.delete(`http://localhost:4000/api/devices/${createdDeviceId}`);
    }
  });

  test("opens dialog on button click", async ({ page }) => {
    await page.getByRole("button", { name: /Add device/ }).first().click();
    await expect(page.getByRole("heading", { name: "Add device" })).toBeVisible();
  });

  test("dialog shows all required fields", async ({ page }) => {
    await page.getByRole("button", { name: /Add device/ }).first().click();
    await expect(page.getByPlaceholder("core-sw-03")).toBeVisible();
    await expect(page.getByPlaceholder("10.0.0.5")).toBeVisible();
    await expect(page.getByPlaceholder("Cisco")).toBeVisible();
    await expect(page.getByPlaceholder("C9300-48P")).toBeVisible();
    // Role, Site, Icon are selects
    await expect(page.getByRole("combobox").nth(0)).toBeVisible();
    await expect(page.getByRole("combobox").nth(1)).toBeVisible();
    await expect(page.getByRole("combobox").nth(2)).toBeVisible();
  });

  test("Cancel button closes dialog", async ({ page }) => {
    await page.getByRole("button", { name: /Add device/ }).first().click();
    await expect(page.getByRole("heading", { name: "Add device" })).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("heading", { name: "Add device" })).not.toBeVisible();
  });

  test("shows error when required fields are empty", async ({ page }) => {
    await page.getByRole("button", { name: /Add device/ }).first().click();
    // Dialog is now open; click the submit button inside the dialog form
    await page.locator('form button[type="submit"]').click();
    await expect(page.getByText("Name, IP, Vendor and Model are required.")).toBeVisible();
  });

  test("accepts valid submission and closes dialog", async ({ page, request }) => {
    await page.getByRole("button", { name: /Add device/ }).first().click();
    await page.getByPlaceholder("core-sw-03").fill(testDeviceName);
    await page.getByPlaceholder("10.0.0.5").fill("192.168.99.1");
    await page.getByPlaceholder("Cisco").fill("TestVendor");
    await page.getByPlaceholder("C9300-48P").fill("TEST-MODEL");
    await page.locator('form button[type="submit"]').click();
    // Dialog should close on success
    await expect(page.getByRole("heading", { name: "Add device" })).not.toBeVisible({ timeout: 8000 });
    // Capture the ID for cleanup
    const devRes = await request.get("http://localhost:4000/api/devices");
    const { devices } = await devRes.json();
    const created = devices.find((d: { name: string; id: number }) => d.name === testDeviceName);
    if (created) createdDeviceId = created.id;
  });
});
