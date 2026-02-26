export function rsi(prices: number[], window: number): number[] {
  const out: number[] = [50];
  for (let i = 1; i < prices.length; i++) {
    const changes = [];
    for (let j = Math.max(1, i - window + 1); j <= i; j++) {
      const ch = (prices[j]! - prices[j - 1]!) / (prices[j - 1]! || 1);
      changes.push(ch);
    }
    let gains = 0;
    let losses = 0;
    for (const c of changes) {
      if (c > 0) gains += c;
      else losses -= c;
    }
    const avgGain = gains / changes.length;
    const avgLoss = losses / changes.length;
    if (avgLoss === 0) {
      out.push(100);
    } else {
      const rs = avgGain / avgLoss;
      out.push(100 - 100 / (1 + rs));
    }
  }
  return out;
}
