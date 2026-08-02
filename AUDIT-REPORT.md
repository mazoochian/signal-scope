# SignalScope — Security & Quality Audit

**Scope:** `signal-scope-be` (NestJS API, 87 TS files / ~6,000 LOC) and `signal-scope-fe` (Next.js 16 dashboard, 71 TS/TSX files / ~8,800 LOC), plus the root `docker-compose.yml` and `.env` that wire them together.
**Date:** 2026-07-12 (re-verified against the working tree the same day — every finding below was individually confirmed still present; none have been fixed. The re-check added M8, two L6 items, and corrected details in C1.)
**Method:** Full read of both source trees, `tsc --noEmit`, `jest`, `npm audit`. No code was changed. Nothing was deployed or executed against a live environment.

**Bottom line:** the architecture is sound and the RBAC design is genuinely good, but the deployment is not safe to expose. Three findings are critical: the JWT signing secret falls back to a hardcoded default that is never overridden anywhere in the deployment, an unauthenticated endpoint returns OAuth client secrets and bot tokens, and the Docker healthcheck points at an endpoint that requires authentication — which means the compose stack cannot currently start the frontend at all.

Findings are ordered by severity. Each one names the file and line so they can be worked in isolation.

---

## Critical

### C1. JWT secret is never configured; the API signs tokens with a public default

`signal-scope-be/src/auth/auth.module.ts:9`

```ts
JwtModule.register({
  secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  signOptions: { expiresIn: '7d' },
})
```

`JWT_SECRET` is set in **no production surface**: it is absent from `docker-compose.yml`'s `api.environment` block, from the root `.env`, from `.env.example`, and — crucially — from `signal-scope-be/.env.production`, which is the file `main.ts` loads when `NODE_ENV=production`. (`signal-scope-be/.env` does set a dev value, `signal-scope-dev-jwt-secret-change-in-production`, but that file is only loaded in non-production runs — and it's committed to the repo, so it's public anyway.) So every Docker deployment signs and verifies tokens with the literal string `dev-secret-change-me`.

Note the fallback is duplicated in **three** modules — `auth/auth.module.ts:11`, `users/users.module.ts:9`, and `oidc/oidc.module.ts:10` each call `JwtModule.register` with their own copy. Fixing only one would leave the app verifying tokens against two different secrets depending on which module handled the request.

Because `JwtAuthGuard` trusts the JWT payload's `sub` and the app then loads that user, anyone who knows this default (it is in a public GitHub repo) can mint a valid token for any user id and role and get full superadmin access. This is a complete authentication bypass, not a hardening gap.

**Fix:** define the secret in **one** place (a shared config module, or have `users`/`oidc` import the exported `JwtModule` from `AuthModule` instead of registering their own), require the variable and refuse to boot without it — `if (!process.env.JWT_SECRET) throw new Error(...)` — rather than defaulting. Then add `JWT_SECRET` to `docker-compose.yml`, `.env.example`, and the deployment `.env`. Rotating the secret invalidates all existing tokens, which is the desired outcome here.

Two sibling variables have the same "silently defaults to localhost" problem and should be handled in the same change: `FRONTEND_URL` (`auth.controller.ts:73`, used for the post-OIDC redirect) and `API_PUBLIC_URL` (`oidc.service.ts:243`, used to build the OAuth `redirect_uri`). Neither is set in any production surface, so OIDC login on a real domain will redirect to `http://localhost:3000` and the IdP will reject the callback URL.

### C2. `GET /api/oidc/providers` is public and leaks OAuth client secrets and bot tokens

`signal-scope-be/src/oidc/oidc.controller.ts:10-14` marks the route `@Public()`. It calls `OidcService.listProviders()` (`oidc.service.ts:43-46`), which is a bare `SELECT *` mapped through `rowToProvider` — and that mapper copies `client_secret` and `bot_token` straight into the response.

This is not theoretical: `signal-scope-fe/lib/auth-client.ts` declares `clientSecret` and `botToken` on `OidcProviderDto`, and the login page (`app/login/page.tsx:25`) calls `getOidcProviders()` before the user has authenticated. Any anonymous visitor who opens the login page — or just curls the endpoint — receives every configured identity provider's OAuth client secret and every Telegram bot token.

A leaked OAuth client secret lets an attacker impersonate the application to the IdP. A leaked Telegram bot token is full control of the bot.

**Fix:** the login page only needs `id`, `name`, `providerType`, `isEnabled`, `buttonText`, and `botUsername`. Split the DTO: return that public subset from the `@Public()` route, and keep the full record (secrets included) behind the existing `@Permission('oidc', 'write')` admin route. Treat any secret currently in the database as compromised and rotate it.

### C3. The Docker healthcheck targets an authenticated endpoint, so the stack cannot come up

`docker-compose.yml:42`

```yaml
test: ["CMD", "wget", "-qO-", "http://localhost:4000/api/overview"]
```

The most recent commit (`75d1b7c`, "Fix API health check URL to /api/overview") pointed the healthcheck here, but `GET /api/overview` is guarded: `OverviewController` carries `@Permission('dashboard', 'read')`, and `JwtAuthGuard` is registered globally as an `APP_GUARD` in `app.module.ts:60`. With no cookie and no bearer token, the request returns **401**. `wget` exits non-zero on 401, so the healthcheck fails on every interval, `api` never reaches `healthy`, and because `frontend` declares `depends_on: api: condition: service_healthy`, **the frontend container never starts**.

**Fix:** point the healthcheck at the one route that is actually public — `AppController` is `@Controller()` + `@Get()` + `@Public()`, which under `setGlobalPrefix('api')` resolves to `GET /api`. Better still, add a dedicated `@Public() @Get('health')` route that also pings the database, so "healthy" means something.

---

## High

### H1. No request validation anywhere in the API

There is no `ValidationPipe`, no `class-validator`, and no DTO validation of any kind — the interfaces in `*.service.ts` are TypeScript compile-time shapes only, erased at runtime. `main.ts` never calls `app.useGlobalPipes(...)`.

This is not speculative. Running the test suite surfaced live 500s from malformed bodies reaching Postgres:

```
ERROR [ExceptionsHandler] null value in column "ip" of relation "devices" violates not-null constraint
    at DevicesService.create (src/devices/devices.service.ts:93:22)
ERROR [ExceptionsHandler] null value in column "metric" of relation "sla_parameters" violates not-null constraint
    at SlaService.create (src/sla/sla.service.ts:33:22)
```

Every write endpoint has this shape. Beyond the 500s (which leak schema details in the error body), it means role strings, severities, cron expressions, and email addresses all reach the database unvalidated.

**Fix:** add `class-validator`/`class-transformer`, annotate the DTOs, and install a global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`. `whitelist` also mitigates H2.

### H2. An `admin` can mint a `superadmin` account

`signal-scope-be/src/users/users.controller.ts:44-48` — `POST /users` is gated by `@Permission('users', 'write')` and passes `CreateUserDto` (which includes `role`) straight to `UsersService.create`, with no check on the requested role.

The codebase is clearly aware of this boundary elsewhere: `update()` (line 70) and `remove()` (line 84) both explicitly refuse to touch a `superadmin` target unless the caller is a superadmin. Creation has no equivalent guard, so any role holding `users:write` — `admin`, per the permission matrix — can simply create a brand-new superadmin account and log in as it. That defeats the superadmin protections on the other two routes.

**Fix:** in `create()`, reject `dto.role === 'superadmin'` unless `me.role === 'superadmin'`, mirroring the existing checks. Also consider rejecting any role the caller doesn't outrank.

### H3. Login has no rate limiting or lockout

`POST /api/auth/login` (`auth.controller.ts:25`) is `@Public()`, and `@nestjs/throttler` is not a dependency. bcrypt cost 10 slows an attacker down but does not stop credential stuffing or a targeted brute force, and there is no lockout, no backoff, and no audit trail of failed attempts (see M6).

**Fix:** add `@nestjs/throttler` with a strict per-IP limit on the auth routes (e.g. 5 attempts / 15 min), and log failures.

### H4. Integration secrets are stored and served in plaintext

`integrations.service.ts:53-61` writes the full config blob — including the SMTP `password` (`EmailConfig.password`) and the Slack/Telegram `botToken` — into `integration_configs.config` as unencrypted JSONB. `GET /api/integrations/email` (`integrations.controller.ts:26-28`) returns it verbatim to anyone with `integrations:read`, and the settings UI renders it into a form field.

This is narrower than C2 (it is permission-gated, not public), but it means read-only access to the integrations panel is equivalent to owning the SMTP account and the Slack/Telegram bots.

**Fix:** encrypt secrets at rest with a key from the environment, and never return them on read — send back a sentinel (`"********"`) and treat that sentinel as "unchanged" on write. That is the standard pattern and it works cleanly with the existing save flow.

---

## Medium

### M1. Every client-side poll is unauthenticated and silently fails

`signal-scope-fe/lib/use-poller.ts:15` issues `fetch(url)` with no `credentials: 'include'`. The same omission is in `components/ui/notification-center.tsx` (lines 37, 57, 63 — the initial load, mark-read, and mark-all-read calls).

The API is on a different origin from the frontend (`localhost:4000` vs `localhost:3000`), so without `credentials: 'include'` the browser sends no `ss-token` cookie. Every one of these requests gets a 401, and every one of them ends in `.catch(() => {})` — so the failure is invisible. The consequences in the running app:

- The live KPI strip, the WAN chart, and the host-metrics tile (`components/overview/*-live.tsx`) never update past their SSR-rendered initial data.
- The notification center is permanently empty, and its mark-read buttons do nothing.

The stale Playwright artifacts under `signal-scope-fe/test-results/` for `notifications-*` and `overview-*` are consistent with this.

`lib/api.ts` gets this right (line 26: `if (!isServer) fetchOptions.credentials = 'include'`) — these three call sites just bypass it.

**Fix:** add `credentials: 'include'` to `use-poller.ts` and the notification-center fetches, or better, route them through the existing `apiFetch` helper so there is one place that knows about auth.

### M2. Alert IDs collide after a restart, silently dropping alerts

`signal-scope-be/src/simulation/alert-evaluator.ts:114` — `private counter = 90300;` is re-initialised on every boot, and `nextId()` just increments it. The insert at line 191 uses `ON CONFLICT (id) DO NOTHING`.

So after a restart, the evaluator starts handing out `ALR-90300`, `ALR-90301`, … again. Those ids already exist from the previous run, the insert is silently swallowed by the conflict clause, but line 198 still does `this.openAlerts.set(key, id)` — so the in-memory state believes the alert is open while the database never recorded it. The alert never surfaces in the UI, and the subsequent "clear" updates a row belonging to an older, unrelated alert.

**Fix:** use a database sequence or a UUID for the alert id. At minimum, seed `counter` from `SELECT MAX(id)` on startup and check the insert's `rowCount` before mutating `openAlerts`.

### M3. OIDC account linking trusts unverified email addresses

`oidc.service.ts:203` — `findOrCreateOidcUser` falls back to matching an existing local account **by email address** when no `user_idp_links` row exists, and it never checks `info.email_verified`.

If any configured IdP allows a user to set an arbitrary or unverified email, an attacker registers `admin@yourcompany.com` at that IdP, signs in through it, and is silently linked to the existing local `admin` account — inheriting its role. The blast radius scales with how permissive the least-trustworthy configured provider is, and providers are admin-configurable at runtime.

**Fix:** require `info.email_verified === true` before matching on email, and consider making email-based auto-linking opt-in per provider rather than the default.

### M4. OIDC state store is in-memory and never pruned

`oidc.service.ts:31` — a module-level `Map` holds the CSRF `state` values. Expired entries are checked on use but never swept, so the map grows without bound for every authorization request that is started and never completed (a trivial unauthenticated memory-growth vector). It also means OIDC login breaks entirely as soon as the API runs more than one replica, since the callback may land on a different instance than the one that issued the state. The code comment on that line already flags this ("for dev; use Redis in production") — it just hasn't been actioned.

**Fix:** move to Redis, or to a short-lived signed cookie, which avoids the shared-store requirement altogether.

### M5. Frontend middleware checks for a cookie, not a valid session

`signal-scope-fe/middleware.ts:5-16` treats *any* non-empty `ss-token` cookie as authenticated. A forged, expired, or garbage cookie passes the middleware; the page then renders and its SSR `apiFetch` 401s, producing an error page instead of a redirect to `/login`. This is a UX and correctness issue rather than a privilege boundary (the API is still the real enforcement point), but the failure mode is confusing.

**Fix:** verify the token in the middleware (via `jose`, which runs on the edge runtime), or catch the 401 in the layout and redirect.

### M6. No audit logging

Nothing records who logged in, who changed a role, who added an access grant, or who edited an integration's credentials. For an NMS with a five-tier RBAC model and superadmin protections, the absence of an audit trail undercuts the access control that is otherwise carefully built. Notably, the settings UI advertises "audit" in its overview subtitle (`app/settings/page.tsx`, `TAB_SUBTITLES.overview`) — the feature is described but not implemented.

### M7. Dependency vulnerabilities

Backend (`npm audit --omit=dev`): **8 vulnerabilities (2 high, 6 moderate)** — `qs` prototype pollution reachable through `body-parser` → `express`. `npm audit fix` resolves these without a breaking change.

Frontend (`npm audit`): **3 vulnerabilities (1 high, 2 moderate)** — `xlsx` (SheetJS) has a prototype-pollution and a ReDoS advisory with **no fix available in any published version**, and `next` pulls a vulnerable `postcss`. The `xlsx` one deserves a decision rather than an upgrade: it is used for report export, and the maintained replacement is `exceljs`.

### M8. Disabling an OIDC provider does not disable logging in through it

`buildAuthorizationUrl` (`oidc.service.ts:110`) is the **only** place that checks `provider.isEnabled`. The two routes that actually mint sessions never do:

- `handleCallback` (`oidc.service.ts:124`) — an attacker who obtained an authorization code before the provider was disabled (or who drives the IdP's authorize endpoint directly, since `client_id` is public) can still complete the code exchange. The in-memory state store partially gates this, but only until C1 is fixed... the state itself is issued by `buildAuthorizationUrl`, so a request started seconds before the admin hits "disable" still lands.
- `handleTelegram` (`oidc.service.ts:159`) — worse, because there is no state handshake at all: `POST /api/auth/telegram/:providerId` verifies the HMAC against the stored `bot_token` and signs in the user. Disabling the Telegram provider in the admin UI has **no effect**; login through it keeps working indefinitely.

An admin who disables a compromised or decommissioned provider will reasonably believe they've cut off that login path. They haven't.

**Fix:** check `isEnabled` at the top of `handleCallback` and `handleTelegram` (and arguably in `getProvider` callers generally), not just when building the authorize URL.

---

## Low / Quality

### L1. Fabricated telemetry presented as real data

Several endpoints return hardcoded numbers that the UI renders as if they were measurements. This is the single biggest *quality* problem in the codebase, because it is invisible from the frontend:

- `interfaces.service.ts:57-58` — interface utilisation and error counts are picked from two literal arrays (`UTIL`, `ERRORS`) indexed by row position; `getSummary` returns a hardcoded `throughput: '14.8 Gbps'` (line 110).
- `devices.service.ts:70-74` — `getVendorCounts` multiplies the real per-vendor counts by hardcoded fudge factors (`Cisco: 61, Juniper: 18, …`) to "pad with the wider fleet totals the UI expects".
- `reports.service.ts:158` — availability is derived from current status alone (`up → 100%`, `warn → 95%`, `down → 0%`), which is not an availability calculation; `alertSummary` returns `mttr: 0` unconditionally (line 145).
- `alerts.service.ts:67-73` — `rootCauseChain` is a static five-element array.

If any of this is deliberate demo scaffolding, it should be behind an explicit `DEMO_MODE` flag rather than indistinguishable from real queries. If it isn't, these are the highest-value functional gaps in the product.

### L2. Fragile (but currently not injectable) SQL string interpolation

Two places build SQL by interpolation rather than parameters:

- `reports.service.ts:61, 89, 112, 121, 127` — `INTERVAL '${interval}'`. This is **safe today** only because `rangeInterval()` maps its input through a closed set to one of three literal strings; an unrecognised value falls through to `'30 days'`. It is one careless edit away from being a real injection, and the value now also arrives from a stored `report_email_subscriptions.range` column (`sendReportEmail`, line 311) that has no validation on write.
- `interfaces.service.ts:96` — `device_id = ${deviceId}`. Safe because the controller coerces with `Number()`, but a non-numeric query param becomes `NaN` and produces a 500 rather than a clean 400.

Neither is exploitable as written. Both should be parameterised anyway — the safety here depends on a property of a function three call-frames away, which is exactly the kind of invariant that breaks silently.

### L3. Stale scaffold test fails

`src/app.controller.spec.ts` is the unmodified Nest scaffold and now fails, because `AppService` grew constructor dependencies (`SimulationService`, `EmailNotificationsService`) that the test module doesn't provide:

```
● AppController › root › should return "Hello World!"
  Nest can't resolve dependencies of the AppService (?, EmailNotificationsService).
```

Current state: **1 failed, 84 passed, 85 total**. Delete it, or give it the providers it needs. A permanently red suite trains people to ignore the suite.

### L4. The RBAC integration test needs a live database

`src/test/permissions.spec.ts` (384 lines, and genuinely the best test in the repo — it exercises all five roles against every guarded route) boots the full `AppModule` against the **real** database and seeds users into it. That makes `npm test` non-hermetic and unrunnable in CI without a Postgres service, and it writes to whatever database the ambient env points at.

**Fix:** point it at a disposable test database (testcontainers, or a compose-provided `signalscope_test`) rather than the ambient one.

### L5. `app/settings/page.tsx` is 1,729 lines

It holds seven tabs (profile, OIDC, users & groups, collectors, integrations, discovery, overview), each with its own forms, fetch logic, and local state, in one client component. It is by a wide margin the largest file in either project — the next biggest is `app/reports/page.tsx` at 1,135. Split it per-tab; each tab is already a clean seam.

### L6. Smaller items

- **Telegram hash comparison is not constant-time** (`oidc.service.ts:171`): `expected !== hash` on hex strings. Use `crypto.timingSafeEqual` (after checking lengths). Low practical risk given the HMAC construction, but it's a two-line fix on an authentication boundary.
- **`RolesGuard` and `@Roles()` are dead code** (`auth/guards/roles.guard.ts`, `roles.decorator.ts`): nothing in `src/` references either — authorization runs entirely through `PermissionsGuard`. Delete them so nobody mistakes them for an active enforcement path.
- **`escapeHtml` doesn't escape `'`** (`email-notifications.service.ts:480`). Not currently exploitable — every call site interpolates into element text, not into a single-quoted attribute — but it's an incomplete primitive sitting next to code that does interpolate unescaped values into `style="..."` attributes.
- **No `helmet`**, so no security headers (HSTS, `X-Content-Type-Options`, CSP) on API responses.
- **CORS silently opens up if `CORS_ORIGIN` is unset** (`main.ts:16`): `origin: undefined` makes the `cors` package reflect `*`. Docker sets a default, so this only bites outside compose — but it should fail loudly rather than fall back.
- **`snapshotAll` swallows every error and still counts success** (`configuration.service.ts:150`): `.catch(() => {})` followed by an unconditional `snapshotted++`, so the reported count is the device count, not the success count.
- **`hasDrift` is not drift detection** (`configuration.service.ts:53`): it returns `status === 'warn' || status === 'down'`, which is device health, not configuration drift.
- **23 uses of `any`** across the frontend and pervasive `(req as any).user` in the backend. A typed `AuthedRequest` interface would remove the latter entirely and is a ~20-minute change.
- **`host-metrics.service.ts:53` shells out to `df -P /` via `execSync`** on a timer. No injection risk (the command is a literal), but it blocks the event loop on every call and won't work on non-Linux hosts — the whole service already assumes Linux `/proc`, which is fine in Docker but should be stated.

---

## What's actually good

Worth stating plainly, because it should be preserved through the fixes:

- **The RBAC model is well designed.** The `SATISFIES` action-implication table in `permissions.service.ts:11-17` is the right abstraction, the role/resource matrix is database-driven and cached rather than hardcoded, and the guard composition (`JwtAuthGuard` → `PermissionsGuard`, both global, with an explicit `@Public()` opt-out) is exactly the right shape. Coverage is near-complete: I checked every controller, and every route outside `auth`/`app`/`permissions` carries an explicit `@Permission`. The `permissions` controller does its role checks inline instead, which is inconsistent but not wrong.
- **Parameterised queries are the norm.** With the two exceptions in L2, every query uses `$1`-style placeholders. There is no SQL injection in this codebase today.
- **The self-access bypass logic is carefully thought through** (`users.controller.ts:34-48`) — users can read and edit their own profile but not their own role, and superadmin targets are protected on update and delete. C2/H2 are gaps in that model, not an absence of one.
- **Passwords are bcrypt-hashed at cost 10**, never logged, and never returned in a DTO (`toDto` deliberately omits `passwordHash`).
- **The auth cookie is correct**: `httpOnly`, `sameSite: 'lax'`, `secure` in production.
- **Telegram's login signature is verified properly** (`oidc.service.ts:169-174`) — correct HMAC-SHA256 over the sorted check-string, with an `auth_date` freshness window.
- **`JwtAuthGuard` re-loads the user from the database on every request and enforces `isActive`** (`jwt-auth.guard.ts:37-38`), so deactivating an account takes effect immediately rather than at token expiry — a mistake many codebases make with 7-day tokens.
- Both projects **typecheck clean** (`tsc --noEmit`, zero errors in each), and the alert evaluator's hysteresis and escalation-group logic (`alert-evaluator.ts`) is a thoughtful piece of engineering.

---

## Suggested order of work

1. **C1** (JWT secret) — everything else is moot while any anonymous user can forge a superadmin token. Bundle `FRONTEND_URL` and `API_PUBLIC_URL` into the same change.
2. **C3** (healthcheck) — one line; without it the stack doesn't run, so nothing else can be verified end-to-end.
3. **C2** (OIDC secret leak) + **H4** (integration secrets) — same shape of fix, and both require rotating whatever is already in the database. Fold **M8** (disabled providers still authenticate) into the same pass over `oidc.service.ts`; it's a two-line guard in each of two methods.
4. **H1** (ValidationPipe) — a `whitelist: true` pipe also closes part of **H2**.
5. **H2** (superadmin escalation), **H3** (login rate limit).
6. **M1** (broken auth on client polls) — the most visible functional bug in the product.
7. **M2** (alert ID collisions), then the rest of Medium.
8. **L1** (fabricated telemetry) needs a product decision before it needs code.
