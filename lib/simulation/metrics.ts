/**
 * Metrics from equity curve.
 * R = V_T / V_0 - 1
 * σ_ann = sqrt(252) * sd(r_t)
 * Sharpe (rf=0) = sqrt(252) * mean(r_t) / sd(r_t)
 * MDD = max_t (1 - V_t / max_{u≤t} V_u)
 */

export function computeMetrics(equity: number[]): {
  cumulativeReturn: number;
  sharpeRatio: number | null;
  maxDrawdown: number;
  annualisedVolatility: number;
} {
  if (equity.length < 2) {
    return {
      cumulativeReturn: 0,
      sharpeRatio: null,
      maxDrawdown: 0,
      annualisedVolatility: 0,
    };
  }

  const v0 = equity[0]!;
  const vT = equity[equity.length - 1]!;
  const cumulativeReturn = v0 > 0 ? vT / v0 - 1 : 0;

  const returns: number[] = [];
  for (let i = 1; i < equity.length; i++) {
    const prev = equity[i - 1]!;
    if (prev > 0) returns.push(equity[i]! / prev - 1);
    else returns.push(0);
  }

  const meanRet = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((a, r) => a + (r - meanRet) ** 2, 0) / returns.length;
  const vol = Math.sqrt(variance);
  const sharpeRatio =
    vol > 0 ? (Math.sqrt(252) * meanRet) / vol : null;
  const annualisedVolatility = vol * Math.sqrt(252);

  let peak = equity[0]!;
  let mdd = 0;
  for (const v of equity) {
    if (v > peak) peak = v;
    if (peak > 0) mdd = Math.min(mdd, v / peak - 1);
  }

  return {
    cumulativeReturn,
    sharpeRatio,
    maxDrawdown: mdd,
    annualisedVolatility,
  };
}
