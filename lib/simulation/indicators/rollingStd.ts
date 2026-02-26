export function rollingStd(prices: number[], window: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < window - 1) {
      out.push(0);
    } else {
      const slice = prices.slice(i - window + 1, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / window;
      const variance =
        slice.reduce((a, p) => a + (p - mean) ** 2, 0) / window;
      out.push(Math.sqrt(variance));
    }
  }
  return out;
}
