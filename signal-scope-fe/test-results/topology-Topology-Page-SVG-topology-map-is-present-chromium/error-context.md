# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: topology.spec.ts >> Topology Page >> SVG topology map is present
- Location: e2e/tests/topology.spec.ts:12:7

# Error details

```
Error: Channel closed
```

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('svg[viewBox]').first()
Expected: visible
Received: undefined

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('svg[viewBox]').first()

```

```
Error: browserContext.close: Target page, context or browser has been closed
```