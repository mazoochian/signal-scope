# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Sidebar Navigation >> clicking Devices link navigates to devices page
- Location: e2e/tests/navigation.spec.ts:54:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/devices"
Received: "http://localhost:3000/"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × unexpected value "http://localhost:3000/"

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
  - text: WAN Throughput 11.6 Gbps +6.2%
  - img
  - text: Mean Latency 15.5 ms -1.1ms
  - img
  - text: Packet Loss 0.115 % +0.01
  - img
  - text: SLA (24h) 99.982 % met
  - img
  - heading "WAN Aggregate Throughput" [level=2]
  - paragraph: 6 sites · MPLS + DIA + SD-WAN
  - text: Ingress Egress
  - img
  - img
  - text: 20G 15G 10G 5G 0 Peak In 15.2 Gbps Peak Out 9.9 Gbps Drops 0.115% 95th %ile 14.8 Gbps
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
  - text: CPU 72.2% Memory 82.7% Storage 44.0% Load Avg 95.8%
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
  3  | const NAV_ITEMS = [
  4  |   { label: "Overview", href: "/" },
  5  |   { label: "Topology", href: "/topology" },
  6  |   { label: "Alerts", href: "/alerts" },
  7  |   { label: "Service Assurance", href: "/services" },
  8  |   { label: "Devices", href: "/devices" },
  9  |   { label: "Interfaces", href: "/interfaces" },
  10 |   { label: "Wireless", href: "/wireless" },
  11 |   { label: "Flow & Telemetry", href: "/telemetry" },
  12 |   { label: "Discovery", href: "/discovery" },
  13 |   { label: "Configuration", href: "/configuration" },
  14 |   { label: "Inventory", href: "/inventory" },
  15 |   { label: "Reports", href: "/reports" },
  16 |   { label: "Settings", href: "/settings" },
  17 | ];
  18 | 
  19 | test.describe("Sidebar Navigation", () => {
  20 |   test("sidebar shows the application logo", async ({ page }) => {
  21 |     await page.goto("/");
  22 |     await expect(page.getByText("SignalScope")).toBeVisible();
  23 |   });
  24 | 
  25 |   test("sidebar shows user avatar info", async ({ page }) => {
  26 |     await page.goto("/");
  27 |     await expect(page.getByText("j.ramirez")).toBeVisible();
  28 |   });
  29 | 
  30 |   test("all nav items are present in sidebar", async ({ page }) => {
  31 |     await page.goto("/");
  32 |     for (const item of NAV_ITEMS) {
  33 |       await expect(page.getByRole("link", { name: item.label })).toBeVisible();
  34 |     }
  35 |   });
  36 | 
  37 |   test("alerts nav item shows badge 37", async ({ page }) => {
  38 |     await page.goto("/");
  39 |     await expect(page.getByText("37").first()).toBeVisible();
  40 |   });
  41 | 
  42 |   test("clicking Overview link stays on overview", async ({ page }) => {
  43 |     await page.goto("/alerts");
  44 |     await page.getByRole("link", { name: "Overview" }).click();
  45 |     await expect(page).toHaveURL("/");
  46 |   });
  47 | 
  48 |   test("clicking Alerts link navigates to alerts page", async ({ page }) => {
  49 |     await page.goto("/");
  50 |     await page.getByRole("link", { name: "Alerts" }).click();
  51 |     await expect(page).toHaveURL("/alerts");
  52 |   });
  53 | 
  54 |   test("clicking Devices link navigates to devices page", async ({ page }) => {
  55 |     await page.goto("/");
  56 |     await page.getByRole("link", { name: "Devices" }).click();
> 57 |     await expect(page).toHaveURL("/devices");
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  58 |   });
  59 | 
  60 |   test("clicking Topology link navigates to topology page", async ({ page }) => {
  61 |     await page.goto("/");
  62 |     await page.getByRole("link", { name: "Topology" }).click();
  63 |     await expect(page).toHaveURL("/topology");
  64 |   });
  65 | 
  66 |   test("each page loads without server error", async ({ page }) => {
  67 |     for (const item of NAV_ITEMS) {
  68 |       const response = await page.goto(item.href);
  69 |       expect(response?.status()).toBeLessThan(500);
  70 |     }
  71 |   });
  72 | 
  73 |   test("page title updates when navigating to Alerts", async ({ page }) => {
  74 |     await page.goto("/alerts");
  75 |     await expect(page).toHaveTitle(/Alerts/);
  76 |   });
  77 | 
  78 |   test("page title updates when navigating to Devices", async ({ page }) => {
  79 |     await page.goto("/devices");
  80 |     await expect(page).toHaveTitle(/Devices/);
  81 |   });
  82 | 
  83 |   test("page title on overview is Network Overview", async ({ page }) => {
  84 |     await page.goto("/");
  85 |     await expect(page).toHaveTitle(/Network Overview/);
  86 |   });
  87 | });
  88 | 
```