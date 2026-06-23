# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: notifications.spec.ts >> Notification Center >> clicking bell opens notification panel
- Location: e2e/tests/notifications.spec.ts:26:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Notifications')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Notifications')

```

```yaml
- complementary:
  - text: SignalScope NMS · v4.2
  - navigation:
    - text: Operate
    - list:
      - listitem:
        - link "Overview":
          - /url: /
      - listitem:
        - link "Topology":
          - /url: /topology
      - listitem:
        - link "Alerts 37":
          - /url: /alerts
      - listitem:
        - link "Service Assurance":
          - /url: /services
    - text: Monitor
    - list:
      - listitem:
        - link "Devices":
          - /url: /devices
      - listitem:
        - link "Interfaces":
          - /url: /interfaces
      - listitem:
        - link "Wireless":
          - /url: /wireless
      - listitem:
        - link "Flow & Telemetry":
          - /url: /telemetry
    - text: Manage
    - list:
      - listitem:
        - link "Discovery":
          - /url: /discovery
      - listitem:
        - link "Configuration":
          - /url: /configuration
      - listitem:
        - link "Inventory":
          - /url: /inventory
      - listitem:
        - link "Reports":
          - /url: /reports
    - text: System
    - list:
      - listitem:
        - link "Settings":
          - /url: /settings
  - text: JR j.ramirez NOC Engineer · L2
- banner:
  - text: global / Network Overview
  - textbox "Search devices, IPs, interfaces, MAC, alerts…"
  - text: ⌘K 1,284 up 23 warn 7 down poll 12s
  - combobox:
    - option "Off"
    - option "5s"
    - option "10s" [selected]
    - option "30s"
    - option "1m"
    - option "5m"
  - button "Open notification center"
  - button "Add device"
- heading "Network Overview" [level=1]
- paragraph: Real-time NOC view · 1,314 monitored devices · 6 sites · 4 collectors online
- button "Last 1h"
- button "Export"
- main:
  - text: Devices Up 1,452 +9
  - img
  - text: Critical Alerts 5 +0
  - img
  - text: WAN Throughput 12.8 Gbps +6.2%
  - img
  - text: Mean Latency 16.9 ms -1.1ms
  - img
  - text: Packet Loss 0.120 % +0.01
  - img
  - text: SLA (24h) 99.982 % met
  - img
  - heading "WAN Aggregate Throughput" [level=2]
  - paragraph: 6 sites · MPLS + DIA + SD-WAN
  - text: Ingress Egress
  - img
  - img
  - text: 20G 15G 10G 5G 0 Peak In 15.2 Gbps Peak Out 9.9 Gbps Drops 0.120% 95th %ile 14.8 Gbps
  - heading "Active Alerts" [level=2]
  - paragraph: Correlated · 37 open
  - link "View all":
    - /url: /alerts
  - list:
    - listitem: CRIT BGP session down to AS65001 edge-rtr-nyc-01 · Gi0/2 · 2m Root
    - listitem: CRIT Interface flap storm detected core-sw-dca-02 · 4m Child
    - listitem: MAJ CPU sustained > 85% agg-rtr-lax-01 · 11m —
    - listitem: MAJ PoE budget 92% on stack-3 acc-sw-hq-09 · 17m —
    - listitem: MIN Config drift vs baseline fw-edge-sea-01 · 32m —
    - listitem: WARN Optic Rx low (-18.2 dBm) core-sw-fra-01 · Te1/49 · 44m —
  - heading "Site Health" [level=2]
  - paragraph: Last 60 min · availability heat
  - list:
    - listitem: HQ — New York 99.99%
    - listitem: DC — Ashburn 99.97%
    - listitem: Campus — Austin 99.92%
    - listitem: Edge — Frankfurt 99.84%
    - listitem: POP — Singapore 99.78%
    - listitem: Branch — Lima 98.42%
  - heading "Top Talkers" [level=2]
  - paragraph: NetFlow · last 5 min
  - table:
    - rowgroup:
      - row "Source App Mbps":
        - columnheader "Source"
        - columnheader "App"
        - columnheader "Mbps"
    - rowgroup:
      - row "10.42.18.21 HTTPS 842.1":
        - cell "10.42.18.21"
        - cell "HTTPS"
        - cell "842.1"
      - row "10.42.19.105 SMB 611.3":
        - cell "10.42.19.105"
        - cell "SMB"
        - cell "611.3"
      - row "172.16.4.88 RTP 402.7":
        - cell "172.16.4.88"
        - cell "RTP"
        - cell "402.7"
      - row "10.42.7.13 Backup 318.9":
        - cell "10.42.7.13"
        - cell "Backup"
        - cell "318.9"
      - row "10.99.0.4 BGP 212.5":
        - cell "10.99.0.4"
        - cell "BGP"
        - cell "212.5"
      - row "192.168.50.2 VPN 184.0":
        - cell "192.168.50.2"
        - cell "VPN"
        - cell "184.0"
  - heading "Resource Utilization" [level=2]
  - paragraph: This server · live
  - text: CPU 73.1% Memory 84.0% Storage 44.0% Load Avg 96.5%
  - paragraph: AMD Ryzen 7 6800H with Radeon Graphics
  - text: 184 Routers 612 Switches 518 APs
  - heading "Service Assurance" [level=2]
  - paragraph: End-to-end business services
  - text: Corporate Internet Healthy core-rtr → fw-edge → ISP-A MOS — Loss 0.01% Jitter 1.2ms
  - img
  - text: Voice (SIP/RTP) Degraded sbc-01 → core-sw → carrier MOS 4.1 Loss 0.4% Jitter 9.8ms
  - img
  - text: Datacenter East-West Healthy spine ←→ leaf · VXLAN MOS — Loss 0.00% Jitter 0.3ms
  - img
  - text: Guest Wi-Fi Healthy wlc → ap-fleet → fw-guest MOS — Loss 0.02% Jitter 2.1ms
  - img
  - heading "Live Syslog" [level=2]
  - paragraph: Streaming · all collectors
  - list:
    - listitem: "14:02:17 INFO edge-rtr-nyc-01: BGP neighbor 10.0.0.5 Established"
    - listitem: "14:02:14 WARN core-sw-dca-02: %LINEPROTO-5-UPDOWN Te1/0/24 down"
    - listitem: "14:02:11 CRIT agg-rtr-lax-01: %SYS-2-CPU_HOG sustained > 85%"
    - listitem: "14:02:08 INFO ap-hq-fl3-22: client e4:5f:01:.. joined SSID corp"
    - listitem: "14:02:05 INFO fw-edge-sea-01: SSL VPN session start user=t.young"
    - listitem: "14:02:01 WARN core-sw-fra-01: optic Te1/49 rx_power=-18.2dBm"
    - listitem: "14:01:58 INFO collector-eu-01: poll cycle complete 412 devices 3.8s"
    - listitem: "14:01:55 INFO discovery: 2 new neighbors via LLDP on acc-sw-hq-09"
    - listitem: "14:01:52 MAJ stack-3: PoE budget at 92% (732W / 800W)"
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const MOCK_NOTIFICATIONS = [
  4  |   { id: 1, level: "crit", source: "device", title: "BGP session down to AS65001", detail: "edge-rtr-nyc-01 · Gi0/2", time: "14:02:14", read: false },
  5  |   { id: 2, level: "maj", source: "device", title: "High CPU on core-sw-01", detail: "core-sw-01 · CPU 94%", time: "13:58:32", read: false },
  6  |   { id: 3, level: "warn", source: "app", title: "Collector lag detected", detail: "collector-eu-01 · 18s behind", time: "13:45:10", read: false },
  7  |   { id: 4, level: "info", source: "app", title: "Discovery scan complete", detail: "HQ-NYC · 412 devices", time: "13:30:00", read: true },
  8  | ];
  9  | 
  10 | test.describe("Notification Center", () => {
  11 |   test("bell icon is visible in top bar", async ({ page }) => {
  12 |     await page.goto("/");
  13 |     await expect(page.getByRole("button", { name: "Open notification center" })).toBeVisible();
  14 |   });
  15 | 
  16 |   test("unread badge is visible on bell when there are unread notifications", async ({ page }) => {
  17 |     // Mock the notifications endpoint to always return unread notifications
  18 |     await page.route("**/api/notifications", async (route) => {
  19 |       await route.fulfill({ json: MOCK_NOTIFICATIONS });
  20 |     });
  21 |     await page.goto("/");
  22 |     // Wait for the component to fetch notifications and render the badge
  23 |     await expect(page.locator(".pulse-ring")).toBeVisible({ timeout: 5000 });
  24 |   });
  25 | 
  26 |   test("clicking bell opens notification panel", async ({ page }) => {
  27 |     await page.goto("/");
  28 |     await page.getByRole("button", { name: "Open notification center" }).click();
> 29 |     await expect(page.getByText("Notifications")).toBeVisible();
     |                                                   ^ Error: expect(locator).toBeVisible() failed
  30 |   });
  31 | 
  32 |   test("notification panel shows notification items", async ({ page }) => {
  33 |     await page.goto("/");
  34 |     await page.getByRole("button", { name: "Open notification center" }).click();
  35 |     await expect(page.getByText(/CRIT|MAJ|WARN|INFO/).first()).toBeVisible();
  36 |   });
  37 | 
  38 |   test("notification panel shows at least 3 notifications", async ({ page }) => {
  39 |     await page.goto("/");
  40 |     await page.getByRole("button", { name: "Open notification center" }).click();
  41 |     const items = page.locator("ul li").filter({ hasText: /CRIT|MAJ|WARN|INFO/ });
  42 |     const count = await items.count();
  43 |     expect(count).toBeGreaterThanOrEqual(3);
  44 |   });
  45 | 
  46 |   test("Mark all as read button is visible when unread notifications exist", async ({ page }) => {
  47 |     // Mock the notifications endpoint to always return unread notifications
  48 |     await page.route("**/api/notifications", async (route) => {
  49 |       await route.fulfill({ json: MOCK_NOTIFICATIONS });
  50 |     });
  51 |     await page.goto("/");
  52 |     await page.getByRole("button", { name: "Open notification center" }).click();
  53 |     await expect(page.getByRole("button", { name: /Mark all as read/i })).toBeVisible({ timeout: 5000 });
  54 |   });
  55 | 
  56 |   test("clicking mark all as read marks all as read", async ({ page }) => {
  57 |     // Mock notifications endpoint to return unread items
  58 |     await page.route("**/api/notifications", async (route) => {
  59 |       await route.fulfill({ json: MOCK_NOTIFICATIONS });
  60 |     });
  61 |     // Mock the mark-all-read endpoint
  62 |     await page.route("**/api/notifications/mark-all-read", async (route) => {
  63 |       await route.fulfill({ status: 200, json: {} });
  64 |     });
  65 |     await page.goto("/");
  66 |     await page.getByRole("button", { name: "Open notification center" }).click();
  67 |     const markAllBtn = page.getByRole("button", { name: /Mark all as read/i });
  68 |     await expect(markAllBtn).toBeVisible({ timeout: 5000 });
  69 |     await markAllBtn.click();
  70 |     // After marking all read, the "X unread" badge text should disappear
  71 |     await expect(page.getByText(/unread/)).not.toBeVisible({ timeout: 3000 });
  72 |   });
  73 | 
  74 |   test("close button closes the notification panel", async ({ page }) => {
  75 |     await page.goto("/");
  76 |     await page.getByRole("button", { name: "Open notification center" }).click();
  77 |     await expect(page.getByText("Notifications")).toBeVisible();
  78 |     await page.getByRole("button", { name: "Close notifications" }).click();
  79 |     await expect(page.getByText("Notifications")).not.toBeVisible();
  80 |   });
  81 | 
  82 |   test("notification items show title text", async ({ page }) => {
  83 |     // Mock to ensure the specific notification text is present
  84 |     await page.route("**/api/notifications", async (route) => {
  85 |       await route.fulfill({ json: MOCK_NOTIFICATIONS });
  86 |     });
  87 |     await page.goto("/");
  88 |     await page.getByRole("button", { name: "Open notification center" }).click();
  89 |     await expect(page.getByText("BGP session down to AS65001").first()).toBeVisible();
  90 |   });
  91 | 
  92 |   test("View all alerts link is in notification panel footer", async ({ page }) => {
  93 |     await page.goto("/");
  94 |     await page.getByRole("button", { name: "Open notification center" }).click();
  95 |     await expect(page.getByRole("link", { name: /View all alerts/i })).toBeVisible();
  96 |   });
  97 | });
  98 | 
```