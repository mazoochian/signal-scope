# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: topology.spec.ts >> Topology Page >> layer filter dropdown is present
- Location: e2e/tests/topology.spec.ts:28:7

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/topology", waiting until "load"

```

```
Error: browserContext.close: Test ended.
Browser logs:

<launching> /home/armin/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=/tmp/playwright_chromiumdev_profile-sGVbeC --remote-debugging-pipe --no-startup-window
<launched> pid=155760
[pid=155760][err] [0623/142824.251632:WARNING:sandbox/policy/linux/sandbox_linux.cc:404] InitializeSandbox() called with multiple threads in process gpu-process.
[pid=155760][err] [0623/142826.988660:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142830.146484:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142833.469128:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142834.029329:INFO:CONSOLE:2478] "[HMR] connected", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142836.641209:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142839.356012:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142839.870301:INFO:CONSOLE:2478] "[HMR] connected", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142842.590355:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142843.058871:INFO:CONSOLE:2478] "[HMR] connected", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142845.704923:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142846.296592:INFO:CONSOLE:2478] "[HMR] connected", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142849.533962:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142852.988053:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142856.937034:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142859.894763:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142903.421432:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142906.835293:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142907.365560:INFO:CONSOLE:2478] "[HMR] connected", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142910.487432:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142913.912737:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142917.542874:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142922.706466:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142925.783148:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142927.834243:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760][err] [0623/142928.031551:INFO:CONSOLE:2478] "[HMR] connected", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=155760] <gracefully close start>
```