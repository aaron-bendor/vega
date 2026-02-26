export function sma(prices: number[], window: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < window - 1) {
      out.push(prices[i]!);
    } else {
      let sum = 0;
      for (let j = 0; j < window; j++) sum += prices[i - j]!;
      out.push(sum / window);
    }
  }
  return out;
}
