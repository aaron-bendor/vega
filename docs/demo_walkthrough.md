# Vega Financial — Demo Walkthrough

**~2 minute walkthrough** for presenting the university prototype.

---

## 1. Marketplace

Open `/marketplace`.

- **Prototype banner** at top: *"University prototype. Synthetic data. Paper trading only. Not investment advice."*
- Filter chips: All, Momentum, Mean Reversion, Trend Following, etc., Low/Medium/High
- Grid of algorithm cards with:
  - Name, short description
  - Tags (e.g. Momentum, Equity)
  - Risk level
  - Headline metrics: Return %, Sharpe, Max DD

**Say:** "Here we browse published algorithms. All data is synthetic. Paper trading only."

---

## 2. Algorithm detail

Click any card → `/algo/<id>`.

- Same prototype banner
- Algorithm name, verification badge (if verified)
- Metrics tiles: Cumulative return, Sharpe, Max drawdown, Volatility
- **Equity curve chart** (simulated backtest)
- **Drawdown chart**
- **Run backtest panel**: Horizon (63/126/252 days), Strategy (buy-and-hold / MA crossover), Starting capital, optional MA windows
- **Add to paper portfolio** with amount input

**Say:** "We can run a backtest with different parameters, or add this algorithm to our paper portfolio."

---

## 3. Run backtest (optional)

- Choose horizon 252, strategy "MA crossover", capital 10,000
- Click **Run backtest**
- New metrics and charts appear below
- All synthetic, deterministic by seed

---

## 4. Invest

- Enter amount (e.g. 5,000)
- Click **Add to paper portfolio**
- Redirects to portfolio

---

## 5. Portfolio

Open `/portfolio`.

- Total value, total invested
- Holdings list: algorithm name, tags, current simulated value
- Empty state if no holdings: link to marketplace

**Say:** "Holdings persist. Simulated value uses the latest backtest."

---

## 6. Developer publish

Open `/developer`.

- List of algorithms (draft and published)
- **Create algorithm** → `/developer/algorithms/new`

On the new page:

- Fill: name, description, universe, risk level, tags
- **Create draft**

On the algorithm edit page:

- Edit metadata
- **Preview backtest** (runs without publishing)
- **Publish new version** → creates immutable snapshot for marketplace

**Say:** "Publishing creates an immutable version. Investors only see metadata and aggregate metrics—no source code, no trades."

---

## Key messages

- **University prototype** — no real trading, no broker APIs, no crypto
- **Synthetic data** — GBM-generated prices, toy strategies
- **Paper trading only** — simulated positions
- **Not investment advice**
