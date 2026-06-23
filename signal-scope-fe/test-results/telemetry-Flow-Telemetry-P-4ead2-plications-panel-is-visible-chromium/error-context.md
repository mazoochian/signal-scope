# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: telemetry.spec.ts >> Flow & Telemetry Page >> top applications panel is visible
- Location: e2e/tests/telemetry.spec.ts:25:7

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/telemetry", waiting until "load"

```

```
Error: browserContext.close: Target page, context or browser has been closed
```