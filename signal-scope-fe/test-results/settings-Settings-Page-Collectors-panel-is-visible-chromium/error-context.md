# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: settings.spec.ts >> Settings Page >> Collectors panel is visible
- Location: e2e/tests/settings.spec.ts:39:7

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/settings", waiting until "load"

```

```
Error: browserContext.close: Test ended.
Browser logs:

<launching> /home/armin/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=/tmp/playwright_chromiumdev_profile-Iu0L95 --remote-debugging-pipe --no-startup-window
<launched> pid=156263
[pid=156263][err] [0623/142826.036731:WARNING:sandbox/policy/linux/sandbox_linux.cc:404] InitializeSandbox() called with multiple threads in process gpu-process.
[pid=156263][err] [0623/142828.198322:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142832.180272:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142832.803129:INFO:CONSOLE:2478] "[HMR] connected", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142835.918438:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142836.548826:INFO:CONSOLE:2478] "[HMR] connected", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142838.820126:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142839.250424:INFO:CONSOLE:2478] "[HMR] connected", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142842.659628:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142843.160256:INFO:CONSOLE:2478] "[HMR] connected", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142846.608750:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142847.145592:INFO:CONSOLE:2478] "[HMR] connected", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142847.617071:INFO:CONSOLE:2478] "[Fast Refresh] rebuilding", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142847.656074:INFO:CONSOLE:2478] "[Fast Refresh] done in 139ms", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142848.015608:INFO:CONSOLE:2478] "[Fast Refresh] rebuilding", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142848.057990:INFO:CONSOLE:2478] "[Fast Refresh] done in 147ms", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142850.938689:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142851.503330:INFO:CONSOLE:2478] "[HMR] connected", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142851.813326:INFO:CONSOLE:2478] "[Fast Refresh] rebuilding", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142851.850710:INFO:CONSOLE:2478] "[Fast Refresh] done in 143ms", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142855.938367:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142856.776070:INFO:CONSOLE:2478] "[HMR] connected", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142900.052253:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142903.591111:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142904.064252:INFO:CONSOLE:2478] "[HMR] connected", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142907.443806:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142910.612734:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142914.471629:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142917.634275:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142922.549876:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263][err] [0623/142925.623874:INFO:CONSOLE:2478] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:3000/_next/static/chunks/199z_next_dist_14nek_7._.js (2478)
[pid=156263] <gracefully close start>
[pid=156263][err] [0623/142925.792346:WARNING:content/common/zygote/zygote_communication_linux.cc:301] Error reading message from zygote: Connection reset by peer (104)
```