import { test, expect } from "@playwright/test";

test.describe("Backend API Contracts", () => {
  test("GET /api/simulation/wan returns 80 ingress points and 4 stats", async ({ request }) => {
    const res = await request.get("http://localhost:4000/api/simulation/wan");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.ingress)).toBe(true);
    expect(body.ingress.length).toBe(80);
    expect(Array.isArray(body.egress)).toBe(true);
    expect(body.egress.length).toBe(80);
    expect(Array.isArray(body.stats)).toBe(true);
    expect(body.stats.length).toBe(4);
  });

  test("GET /api/simulation/kpis returns 6 KPI items with required fields", async ({ request }) => {
    const res = await request.get("http://localhost:4000/api/simulation/kpis");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.stats)).toBe(true);
    expect(body.stats.length).toBe(6);
    for (const stat of body.stats) {
      expect(stat).toHaveProperty("label");
      expect(stat).toHaveProperty("value");
      expect(stat).toHaveProperty("delta");
      expect(stat).toHaveProperty("tone");
      expect(stat).toHaveProperty("spark");
    }
  });

  test("GET /api/host-metrics returns valid numeric metrics in 0-100 range", async ({ request }) => {
    const res = await request.get("http://localhost:4000/api/host-metrics");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.cpu).toBe("number");
    expect(typeof body.mem).toBe("number");
    expect(typeof body.storage).toBe("number");
    expect(typeof body.load).toBe("number");
    expect(body.cpu).toBeGreaterThanOrEqual(0);
    expect(body.cpu).toBeLessThanOrEqual(100);
    expect(body.mem).toBeGreaterThanOrEqual(0);
    expect(body.mem).toBeLessThanOrEqual(100);
    expect(body.storage).toBeGreaterThanOrEqual(0);
    expect(body.storage).toBeLessThanOrEqual(100);
    expect(body.load).toBeGreaterThanOrEqual(0);
    expect(body.load).toBeLessThanOrEqual(100);
  });

  test("GET /api/host-metrics returns cores and model", async ({ request }) => {
    const res = await request.get("http://localhost:4000/api/host-metrics");
    const body = await res.json();
    expect(body.cores).toBeGreaterThan(0);
    expect(typeof body.model).toBe("string");
    expect(body.model.length).toBeGreaterThan(0);
  });

  test("GET /api/alerts returns alerts array and severityCounts", async ({ request }) => {
    const res = await request.get("http://localhost:4000/api/alerts");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.alerts)).toBe(true);
    expect(body.alerts.length).toBeGreaterThan(0);
    expect(Array.isArray(body.severityCounts)).toBe(true);
    expect(body.severityCounts.length).toBe(5);
  });

  test("GET /api/devices returns devices array with 10 items", async ({ request }) => {
    const res = await request.get("http://localhost:4000/api/devices");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.devices)).toBe(true);
    expect(body.devices.length).toBeGreaterThanOrEqual(10);
    expect(Array.isArray(body.vendorCounts)).toBe(true);
    expect(body.vendorCounts.length).toBe(5);
  });

  let createdDeviceId: number | null = null;

  test("POST /api/devices creates a device and returns it", async ({ request }) => {
    const res = await request.post("http://localhost:4000/api/devices", {
      data: {
        name: "playwright-test-device",
        ip: "10.99.88.77",
        vendor: "TestVendor",
        model: "TEST-001",
        role: "Core SW",
        site: "HQ-NYC",
        icon: "server",
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    createdDeviceId = body.id;
    expect(body.name).toBe("playwright-test-device");
    expect(body.ip).toBe("10.99.88.77");
  });

  test.afterAll(async ({ request }) => {
    if (createdDeviceId != null) {
      await request.delete(`http://localhost:4000/api/devices/${createdDeviceId}`);
    }
  });

  test("GET /api/notifications returns array with level field", async ({ request }) => {
    const res = await request.get("http://localhost:4000/api/notifications");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    for (const n of body) {
      expect(n).toHaveProperty("level");
      expect(["crit", "maj", "warn", "info"]).toContain(n.level);
      expect(n).toHaveProperty("title");
      expect(n).toHaveProperty("read");
    }
  });

  test("GET /api/simulation/snapshot returns array of device objects", async ({ request }) => {
    const res = await request.get("http://localhost:4000/api/simulation/snapshot");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(5);
    const first = body[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("cpu");
    expect(first).toHaveProperty("mem");
  });

  test("GET /api/topology returns nodes and edges", async ({ request }) => {
    const res = await request.get("http://localhost:4000/api/topology");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.nodes)).toBe(true);
    expect(body.nodes.length).toBeGreaterThanOrEqual(5);
    expect(Array.isArray(body.edges)).toBe(true);
  });

  test("PATCH /api/notifications/:id/read marks notification as read", async ({ request }) => {
    const res = await request.patch("http://localhost:4000/api/notifications/1/read");
    expect(res.status()).toBeLessThan(400);
  });
});
