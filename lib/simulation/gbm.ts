/**
 * Geometric Brownian Motion price generator.
 * S_{t+1} = S_t * exp((μ - 0.5 σ²) Δt + σ sqrt(Δt) ε_t)
 * Δt = 1/252, ε_t ~ N(0,1) from seeded RNG.
 */

function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function boxMuller(rng: () => number): () => number {
  return function () {
    let u1 = rng();
    const u2 = rng();
    while (u1 <= 1e-10) u1 = rng();
    const r = Math.sqrt(-2 * Math.log(u1));
    return r * Math.cos(2 * Math.PI * u2);
  };
}

export function generateGBMPrices(
  s0: number,
  mu: number,
  sigma: number,
  days: number,
  seed: number
): number[] {
  const dt = 1 / 252;
  const rng = boxMuller(seededRandom(seed));
  const prices: number[] = [s0];

  for (let t = 0; t < days - 1; t++) {
    const eps = rng();
    const drift = (mu - 0.5 * sigma * sigma) * dt;
    const diffusion = sigma * Math.sqrt(dt);
    const next = prices[t]! * Math.exp(drift + diffusion * eps);
    prices.push(next);
  }

  return prices;
}
