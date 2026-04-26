# AiCamDashboard

The web UI for AiCam. A Next.js app that reads from the Flask API and renders the lab's entry data as cards, tables, and charts.

**Author:** Ye Min Htet
**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Recharts, react-data-table-component, react-icons
**Runs on:** `<raspberrypi.address>:3000`, managed by pm2

For the big picture, see the [root README](../README.md). For the API it consumes, see [`AiCamApi/README.md`](../AiCamApi/README.md) and [`API_REFERENCE.md`](../API_REFERENCE.md).

---

## What this does

Pulls numbers from the API and makes them look like something. That's the whole job.

The landing page is a grid of tiles, each linking to one analytics view. Each view fetches its data via a thin wrapper around `fetch`, keeps the response in local state with `useEffect`, and hands it to some mix of summary cards, charts, and tables.

There's no state management library, no server-side data fetching, no caching layer. Every page refetches on mount. For a dashboard that gets checked a few times a day by a handful of people, that's fine.

### Pages

| Route | What it shows | API call |
|---|---|---|
| `/` | Landing page — grid of links to the other pages | none |
| `/summary` | Total days, total entries, averages, min/max, projections | `GET /api/stats/summary` |
| `/history` | Filterable, sortable table of daily records | `GET /api/history` |
| `/dailyAvg` | Daily average (optionally per month) with per-hour / per-week estimates | `GET /api/stats/daily-avg` |
| `/peak` | Top N busiest days as a table + horizontal bar chart | `GET /api/stats/peak` |
| `/trend` | Direction + % change + area chart over selectable time window | `GET /api/stats/trend` |
| `/analytics` | **Not implemented** — link exists on landing page, route 404s | n/a |

---

## ⚠️ Before you run — check the API URL

Open `lib/api.ts` and find:

```typescript
const API_BASE_URL = "http://localhost:5001/api";
```

In our lab this works **only because the dashboard and the Flask API both run on `192.168.1.126`**, so from the browser's point of view (or from the Next.js server-side fetch, depending on where the call happens) `localhost:5001` resolves correctly.

If you ever:
- Run the dashboard from a different machine than the API, or
- Access the dashboard from someone else's browser (which hits *their* localhost, not the server's)

...you'll need to change this to the API server's real address:

```typescript
const API_BASE_URL = "http://<raspberrypi_api_server.address>:5001/api";
```

**Important gotcha:** these API calls are made from the **client side** (look for `'use client'` at the top of the page files). That means the URL is resolved by the user's browser, not by the Next.js server. `localhost:5001` in the browser means *their* machine's port 5001 — not the server's. So in practice, for the dashboard to work for anyone other than someone sitting at the `192.168.1.126` machine, this value **needs to be the real IP**, not `localhost`.

This is one of the first things to fix — see [`EXTENDING.md`](../EXTENDING.md) for moving it to an environment variable.

---

## Installation

### 1. Node.js

Next.js 16 needs Node 18.18+ or 20+. Node 20 LTS is a safe bet:

```bash
# if you don't already have a recent Node
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # should print v20.x
```

### 2. Dependencies

```bash
cd AiCamDashboard
npm install
```

This pulls everything listed in `package.json`:

- **next** `16.2.4` — framework
- **react** / **react-dom** `19.2.4` — the UI library
- **recharts** `^3.8.1` — the charts on `/peak`, `/trend`, and `/dailyAvg`
- **react-data-table-component** `^7.7.1` — the table on `/peak`
- **react-icons** `^5.6.0` — icons on the landing page and nav bars
- **tailwindcss** `^4` — styling (v4 uses the new `@tailwindcss/postcss` pipeline)
- **typescript**, **eslint**, and type packages as dev dependencies

### 3. Confirm the API is reachable

Before starting the dashboard, make sure the Flask API is actually running:

```bash
curl http://<raspberrypi_api_server.address>:5001/api/stats/summary
```

If you get a JSON response (even one that says `"No data found"`), the API is up. If you get a connection-refused error, go fix the API first.

---

## Running it

### Development

```bash
npm run dev
```

This starts Next.js on `http://localhost:3000` with hot reload. Good for active development. Shouldn't be used in production — it has no optimizations and leaks memory over long runs.

### Production (manual)

```bash
npm run build    # compiles the app into .next/
npm run start    # serves the built app on port 3000
```

`build` is slow (30–90 seconds depending on the machine). You only need to run it once per code change. `start` is what actually serves traffic.

### Production (pm2)

```bash
npm run build
pm2 start npm --name AiCamDashboard -- start
pm2 save
pm2 startup      # follow the command it prints so pm2 comes back on reboot
```

That `-- start` syntax tells pm2 to run `npm start`. The `--` separates pm2's flags from the flags passed to npm.

Useful commands:

```bash
pm2 logs AiCamDashboard       # tail logs
pm2 restart AiCamDashboard    # after rebuilding
pm2 stop AiCamDashboard
pm2 delete AiCamDashboard
pm2 monit
```

**Workflow after a code change:**

```bash
git pull
npm run build
pm2 restart aicam-dashboard
```

Three steps. If you skip `build`, pm2 restarts the old version.

---

## Project structure

```
AiCamDashboard/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root HTML shell + fonts
│   ├── globals.css               # Tailwind v4 import + CSS variables
│   ├── page.tsx                  # Landing page (/)
│   ├── summary/page.tsx          # /summary
│   ├── history/page.tsx          # /history
│   ├── dailyAvg/page.tsx         # /dailyAvg
│   ├── peak/page.tsx             # /peak
│   ├── trend/page.tsx            # /trend
│   └── analytics/                # reserved for future use (empty)
├── Components/                   # Reusable UI pieces (see below)
├── lib/
│   ├── api.ts                    # API client (api.stats.summary() etc.)
│   └── fetchHandler.ts           # generic fetch wrapper with timeout
├── public/                       # static assets (favicon etc.)
├── package.json
├── tsconfig.json
└── next.config.js
```

**Naming convention note:** the components live under `Components/` (capital C), not the more conventional `components/`. Imports use `@/Components/Foo` — this matches the path alias in `tsconfig.json`. Don't rename it without updating the aliases and every import.

---

## The API client

Everything API-related goes through `lib/api.ts`:

```typescript
// lib/api.ts
export const api = {
  stats: {
    summary:  async ()             => fetchHandler(`${BASE}/stats/summary`),
    dailyAvg: async (month?)       => fetchHandler(`${BASE}/stats/daily-avg`, { searchParams: { month } }),
    peak:     async (n?)           => fetchHandler(`${BASE}/stats/peak`,      { searchParams: { n } }),
    trend:    async (days?)        => fetchHandler(`${BASE}/stats/trend`,     { searchParams: { days } }),
  },
  history:    async (params)       => fetchHandler(`${BASE}/history`,         { searchParams: params })
}
```

Pages import it and use it directly:

```typescript
useEffect(() => {
  api.stats.summary().then(setData).finally(() => setLoading(false))
}, [])
```

Under the hood, `fetchHandler`:

1. Appends `searchParams` to the URL as query strings, skipping `undefined` values.
2. Sets JSON headers.
3. Aborts after 5 seconds via `AbortController`.
4. On a non-OK response, throws with the status and body.
5. On timeout, throws `Request timed out`.
6. **On any other error**, it **returns** `{ error: "..." }` instead of throwing.

That last behavior is a footgun. Pages that do `.then(setData)` will happily set their state to `{ error: "..." }`, and then everywhere that tries to read `data.total_days` gets `undefined` and renders zero. The app won't crash, but it will silently show wrong data when the API is down. A proper fix is in [`EXTENDING.md`](../EXTENDING.md).

---

## Components

Everything under `Components/` is shared between pages. Brief rundown:

### Layout & navigation

- **`NavBar`** — top bar on the landing page. Just the app name and an icon.
- **`NavToHome`** — top bar on every analytics page. Back button + page title pill.
- **`CardLink`** — the colored tiles on the landing page. Wraps a `next/link` with an icon, title, description.

### Forms & inputs

- **`DatePicker`** — thin wrapper around `<input type="date">` with label, hint, and error states. Returns `undefined` when cleared.
- **`EntryPicker`** — same idea but for integer inputs. Used for min/max entries on `/history`.
- **`MonthPicker`** — custom dropdown listing the last 4 months in `YYYY-MM` format (despite a comment that says 24 — that's a bug). Used on `/dailyAvg`.
- **`SortButtonGroup`** — two-button toggle for ascending / descending sort. Used on `/history`.
- **`Button`** — plain styled button used for the day-range selectors on `/peak` and `/trend`.

### Data display

- **`SummaryCard`** — a label + big number + sublabel card. Used on `/summary`.
- **`Card`** — polymorphic card with four `type`s (`period`, `direction`, `change`, `entry`). Used on `/trend`.
- **`InsightCard`** — bulleted list of insights with colored dots. Used on `/summary` and `/dailyAvg`.
- **`ProjectionCard`** — the per-day / per-week / per-month / per-year projection grid on `/summary`.
- **`RangeBreakdown`** — min/avg/max bar visualization on `/summary`.
- **`HistoryTable`** — the table on `/history`. Handmade (not react-data-table). Has loading skeleton and empty state built in.
- **`MonthlyChart`** — the bar chart on `/dailyAvg`. **Currently uses hardcoded demo data**, not a real API call. See "Known quirks" below.

---

## Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. The whole color palette is inline in class names — there's no shared theme file beyond the CSS variables at the top of `globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}
```

(These are basically unused — the actual UI overrides them with `bg-black` on every page.)

A few colors show up repeatedly and should probably be design tokens if anyone does a refactor:

- `#ff4d1c` — orange (Summary / brand)
- `#7e57c2` — purple (History)
- `#4bcc17` — green (Daily Average)
- `#ffbf00` — amber (Peak)
- `#22d3ee` — cyan (Trend)
- `#808080` — gray (Analytics, unimplemented)

Each page uses its color as an accent on the title, the `NavToHome` pill, and chart fills.

---

## Environment variables

**None.** The API URL is hardcoded in `lib/api.ts`. There's no `.env` file.

This is the single biggest thing to fix — see [`EXTENDING.md`](../EXTENDING.md#moving-the-api-url-into-an-env-var).

---

## Known quirks

Listed in the root README too; repeating here for visibility:

- **`"Create Next App"` metadata.** `app/layout.tsx` still has the default Next.js metadata. Change to `title: "AiCam Dashboard"` or similar.
- **"ENRTY INTELLIGENCE SYSTEM" typo** on the landing page. `app/page.tsx`, line with the orange subtitle text.
- **`MonthlyChart` is dummy data.** The five months of averages it shows (`Jan: 68.2`, `Feb: 74.5`, ...) are hardcoded in `Components/MonthlyChart.tsx`. It's not connected to the backend.
- **`MonthPicker` generates 4 months, not 24.** The comment says "last 24 months" but the loop is `for (let i = 0; i < 4; i++)`. Change to `24` if you want a longer window.
- **`/trend` has a hardcoded `avg={123.45}`** on the `type='period'` Card. Placeholder from early development, never wired up.
- **`/analytics` route doesn't exist.** The landing page links to it, but there's no page file. Clicking 404s. Either build the page or remove the link.
- **`fetchHandler` silently returns error objects** on non-timeout failures. Pages render zeros instead of showing an error state.
- **`/history` starts with hardcoded `seedData`.** The table shows five fake rows (`2024-06-01` through `2024-06-05`) for the split-second before the real API call resolves. Easy to remove; just set the initial state to `[]`.

---

## Troubleshooting

**Dashboard loads but all numbers are zero**

The API call failed. Open the browser dev tools network tab and look for the request to `/api/stats/summary` (or whichever page you're on). Common causes:

1. **API is down.** Check `pm2 logs aicam-api` on the API server.
2. **Wrong API URL.** If you're viewing the dashboard from a different machine than `192.168.1.126`, `localhost:5001` in `api.ts` is pointing at the wrong machine. Change it to the API server's IP.
3. **CORS blocked.** You'll see a red CORS error in the browser console. Check that the Flask API has `CORS(app)` enabled (it does by default, but someone may have locked it down).
4. **`fetchHandler` returning `{error: ...}`.** See the known-quirks section — the app doesn't show an error state, just zeros. Actual error is in the browser console.

**`Module not found: Can't resolve '@/Components/...'`**

Path alias issue. Check `tsconfig.json` — it should have:

```json
"paths": { "@/*": ["./*"] }
```

If that got wiped, reimporting with relative paths works as a temporary fix.

**`npm run build` fails with a type error**

You're on a version of Node that doesn't like something in the codebase, or TypeScript got upgraded. Delete `node_modules/` and `.next/` and reinstall:

```bash
rm -rf node_modules .next
npm install
npm run build
```

**pm2 keeps restarting the dashboard in a loop**

The build probably failed or the port is already in use. Check:

```bash
pm2 logs AiCamDashboard --err
lsof -i :3000
```

**Browser shows "Connection refused" for every page**

pm2 isn't actually running it. `pm2 list` should show `AiCamDashboard` as `online`. If it says `errored`, look at the logs.

---

## What's worth improving

Short list, roughly in order of impact:

1. **Move `API_BASE_URL` to an env var.** `process.env.NEXT_PUBLIC_API_URL` — read once in `lib/api.ts`. See [`EXTENDING.md`](../EXTENDING.md).
2. **Make `fetchHandler` throw on all errors** instead of returning `{error: ...}`. Pages then wrap calls in try/catch and render proper error states.
3. **Wire `MonthlyChart` to real data.** It takes the same month regex as `/api/stats/daily-avg`; either extend that endpoint to return a per-month breakdown, or add a new endpoint.
4. **Build the `/analytics` page**, or remove the link from the landing page. Having a dead link in the UI is worse than the feature not existing at all.
5. **Fix the typo** (`ENRTY` → `ENTRY`), update the `<title>`, remove the `seedData` placeholder in `/history`, remove the `avg={123.45}` on `/trend`. All one-liners.
6. **Extract the color palette** into CSS variables or a Tailwind theme, so the per-page accents become semantic instead of magic hex strings.
7. **Add a loading state everywhere.** Some pages show "Loading..." while fetching; others just show zeros. Be consistent.
8. **Server components for the fetches.** Next.js 16 App Router makes this easy, and it would mean the data is rendered on the server before the page hits the browser — faster first paint, better SEO (if that ever matters), and the client's browser wouldn't need to be able to reach the API directly.

See [`EXTENDING.md`](../EXTENDING.md) for how to approach these.

---

— Ye Min Htet
