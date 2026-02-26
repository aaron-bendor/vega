/**
 * Deterministic seeded RNG. Used across simulation.
 */

export function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export function boxMuller(rng: () => number): () => number {
  return function () {
    let u1 = rng();
    const u2 = rng();
    while (u1 <= 1e-10) u1 = rng();
    const r = Math.sqrt(-2 * Math.log(u1));
    return r * Math.cos(2 * Math.PI * u2);
  };
}

export function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
