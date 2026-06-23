# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wireless.spec.ts >> Wireless Page >> page header shows Wireless
- Location: e2e/tests/wireless.spec.ts:8:7

# Error details

```
Error: Channel closed
```

```
Error: page.goto: net::ERR_ABORTED at http://localhost:3000/wireless
Call log:
  - navigating to "http://localhost:3000/wireless", waiting until "load"

```

```
Error: browserContext.close: Target page, context or browser has been closed
```