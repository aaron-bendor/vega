# Vega Financial — University Prototype

A university prototype for algorithmic trading simulation. **Synthetic data only. Paper trading only. Not investment advice.**

This repo is the coded web app that the [Framer marketing UI](https://ivory-action-817994.framer.app/) links to for graphs, simulations, marketplace, and developer publishing.

## Stack

- Next.js App Router + TypeScript
- Tailwind + shadcn/ui
- Prisma + Postgres
- Zod validation
- Recharts for charts

## Prerequisites

- Node.js 18+
- PostgreSQL
- npm or pnpm

## Real data demo (Stooq)

**See real-data equity curves, drawdown, and metrics** using Stooq daily OHLC. Works offline after the first download.

```bash
# 1. Prefetch Stooq data (use quotes so ^ is not shell-interpreted)
npm run stooq:prefetch -- --symbols "^spx,spy.us,qqq.us,tlt.us,gld.us" --start 2019-01-01 --end 2024-12-31

# 2. Precompute demo runs (for demo mode when DB is unavailable)
npm run demo:precompute

# 3. Start the app (PORT optional, defaults to 3000)
PORT=3001 npm run dev
```

Then open:
- [http://localhost:3001/marketplace](http://localhost:3001/marketplace)
- [http://localhost:3001/algo/demo-1](http://localhost:3001/algo/demo-1)
- Click **Run backtest** to see equity curve, drawdown, and metrics based on real Stooq bars.

**Cache location:** `data/stooq/cache/`. If charts are blank, ensure cache exists or use the **Download data** button on the algo page.

---

## Local demo (DB mode)

**See the app running locally with seeded data.** Follow these steps:

### 1. Install dependencies

```bash
npm install
# or: pnpm install
```

### 2. Configure database

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your Postgres connection string.

### 3. Run migrations and seed

```bash
npm run prisma:migrate
npm run prisma:seed
# or: pnpm prisma migrate dev && pnpm prisma db seed
```

### 4. Start the dev server

```bash
npm run dev
# or: pnpm dev
```

### 5. Open these URLs in your browser

| URL | What you should see |
|-----|---------------------|
| [http://localhost:3000/marketplace](http://localhost:3000/marketplace) | Prototype banner, filter chips (All, Momentum, Mean Reversion, etc.), grid of algorithm cards with name, tags, risk, cached return/Sharpe/max drawdown |
| [http://localhost:3000/algo/\<id\>](http://localhost:3000/algo/clxyz) | Replace `\<id\>` with a version ID from any marketplace card link. Prototype banner, algorithm name, metrics tiles, equity curve chart, drawdown chart, Run backtest panel (horizon, strategy, capital), Add to paper portfolio |
| [http://localhost:3000/portfolio](http://localhost:3000/portfolio) | Prototype banner, total value / total invested (or empty state if no holdings), list of holdings with algorithm name, tags, current value |
| [http://localhost:3000/developer](http://localhost:3000/developer) | List of your algorithms (draft + published), Create algorithm button, version counts |
| [http://localhost:3000/developer/algorithms/new](http://localhost:3000/developer/algorithms/new) | Form: name, description, universe, risk level, tags. Create draft button |
| [http://localhost:3000/developer/algorithms/\<id\>](http://localhost:3000/developer/algorithms/clxyz) | Replace `\<id\>` with an algorithm ID (from a card on /developer). Edit draft form, Preview backtest panel, Published versions list, Publish new version button |

**Tip:** To get IDs: click any marketplace card (the URL contains the version id), or run `curl -s http://localhost:3000/api/algorithms | head -c 500` to see the first version. Or run `npm run screenshots` (see below) to capture screenshots automatically.

---

## Setup

### 1. Install dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure environment

Copy the example env file and set your database URL:

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your Postgres connection string:

```
DATABASE_URL="postgresql://user:password@localhost:5432/vegafinancial?schema=public"
```

### 3. Run migrations and seed

```bash
npm run prisma:migrate
npm run prisma:seed
# or
pnpm prisma migrate dev
pnpm prisma db seed
```

### 4. Start the dev server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Screenshots (optional)

Capture UI screenshots automatically. **Requires the dev server to be running.**

```bash
# Install Chromium (once)
npm run screenshots:install

# Capture screenshots
npm run screenshots
```

Screenshots are saved to `docs/screenshots/`:
- `marketplace.png`
- `algo.png`
- `portfolio.png`
- `developer.png`
- `new_algo.png`
- `developer_algo.png`

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run prisma:migrate` | Run migrations (`prisma migrate dev`) |
| `npm run prisma:seed` | Seed database (`prisma db seed`) |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run test` | Run simulation unit tests |
| `npm run screenshots:install` | Install Playwright Chromium browser |
| `npm run screenshots` | Capture UI screenshots (dev server must be running) |
| `npm run stooq:prefetch` | Download and cache Stooq daily CSV (e.g. `-- --symbols "^spx,spy.us" --start 2019-01-01 --end 2024-12-31`) |
| `npm run stooq:clear` | Remove Stooq cache files |
| `npm run demo:precompute` | Precompute backtests for demo algorithms (run after stooq:prefetch) |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home |
| `/marketplace` | Browse published algorithms (primary Framer link) |
| `/algo/[id]` | Algorithm detail, backtest, invest |
| `/portfolio` | Paper portfolio holdings |
| `/developer` | Developer portal |
| `/developer/algorithms/new` | Create draft algorithm |
| `/developer/algorithms/[id]` | Edit draft, preview backtest, publish |

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/algorithms` | GET, POST | List published versions, create draft |
| `/api/algorithms/[id]` | GET, PATCH | Get/update draft |
| `/api/algorithms/[id]/publish` | POST | Publish immutable version |
| `/api/backtests` | POST | Run backtest |
| `/api/backtests/[id]` | GET | Get backtest run |
| `/api/invest` | POST | Create simulated investment |

## Deploy to Vercel

1. Push to GitHub and import in Vercel.
2. Add `DATABASE_URL` in Vercel environment variables (use a Postgres provider such as Vercel Postgres, Neon, or Supabase).
3. Add build commands:
   - Build: `npm run build` (or `pnpm build`)
   - Install: `npm install` (or `pnpm install`)
4. Add a **postbuild** or **build** step to run migrations:
   - `npx prisma generate`
   - `npx prisma migrate deploy`
5. After first deploy, run the seed manually:
   - `npx prisma db seed`
   - (Or use a one-off script / Vercel cron if needed.)

## Project structure

```
app/                 # Next.js App Router pages and API
components/          # React components
lib/
  db/               # Prisma and data access
  simulation/      # Pure TypeScript simulation engine
  validation/      # Zod schemas
  utils/           # Formatting, labels
prisma/            # Schema, migrations, seed
.cursor/rules/     # Cursor AI rules
```

## Simulation architecture

The app focuses on **simulated algorithms** with synthetic market data.

- **Data provider abstraction** (`lib/marketdata/`): `SyntheticProvider` (default), `StooqCsvProvider` (optional)
- **Scenario engine** (`lib/simulation/markets/`): TREND, RANGE, CRASH, RECOVERY with Markov regime switching
- **Strategy templates** (`lib/simulation/templates/`): buy_and_hold, ma_crossover, bollinger_reversion, rsi_momentum, vol_target_overlay
- **Demo mode**: When DB is unavailable, marketplace loads from `data/demo/algorithms.json`
- **Backtests** run offline with deterministic seeds

### Optional: calibrate from Stooq

To derive realistic μ, σ from historical data (one-time, not a runtime dependency):

```bash
npx tsx scripts/calibrate-from-stooq.ts ^spx 2019-01-01 2024-12-31
```

Use Stooq symbols: `^spx` (S&P 500), `spy.us`, `qqq.us`, `tlt.us`, `gld.us`. Writes `data/calibration/*.json`.

## Scope and safety

- **Closed-loop only**: synthetic prices, toy strategies, paper trading
- **No** real-money execution, broker APIs, crypto issuance, PFOF
- **No** monetisation or investor eligibility gating
- Investor view never shows source code or individual trades
