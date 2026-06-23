import { test, expect } from "@playwright/test";

test.describe("Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings");
  });

  test("page header shows Settings", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  });

  test("Authentication panel is visible", async ({ page }) => {
    await expect(page.getByText("Authentication").first()).toBeVisible();
  });

  test("Authentication panel shows Azure AD", async ({ page }) => {
    await expect(page.getByText("Azure AD (OIDC)")).toBeVisible();
  });

  test("Authentication panel shows LDAP", async ({ page }) => {
    await expect(page.getByText("LDAP / Active Directory")).toBeVisible();
  });

  test("Authentication panel shows MFA", async ({ page }) => {
    await expect(page.getByText("MFA · TOTP + WebAuthn")).toBeVisible();
  });

  test("RBAC panel is visible", async ({ page }) => {
    await expect(page.getByText("RBAC Roles")).toBeVisible();
  });

  test("RBAC panel shows 5 roles", async ({ page }) => {
    const roles = ["NOC L1", "NOC L2", "Network Eng", "Change Mgr", "Auditor"];
    for (const role of roles) {
      await expect(page.getByText(role).first()).toBeVisible();
    }
  });

  test("Collectors panel is visible", async ({ page }) => {
    await expect(page.getByText(/Collector/i).first()).toBeVisible();
  });

  test("Collectors panel shows 4 collectors", async ({ page }) => {
    const collectorsPanel = page.locator("section, .panel").filter({ hasText: "Collector" }).first();
    await expect(collectorsPanel).toBeVisible();
    // 4 collector rows
    const rows = collectorsPanel.locator(".rounded-md.border");
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("Collectors panel shows 1 degraded collector", async ({ page }) => {
    await expect(page.getByText("degraded")).toBeVisible();
  });

  test("Integrations panel is visible", async ({ page }) => {
    await expect(page.getByText("Integrations").first()).toBeVisible();
  });

  test("Integrations panel shows Slack", async ({ page }) => {
    await expect(page.getByText("Slack")).toBeVisible();
  });

  test("Integrations panel shows PagerDuty", async ({ page }) => {
    await expect(page.getByText("PagerDuty")).toBeVisible();
  });

  test("Integrations panel shows ServiceNow", async ({ page }) => {
    await expect(page.getByText("ServiceNow")).toBeVisible();
  });
});
