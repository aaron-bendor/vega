/**
 * Deterministic seed from versionId, horizon, strategyId, parameters.
 */

export function computeSeed(
  versionId: string,
  horizon: number,
  strategyId: string,
  parameters: Record<string, unknown>
): string {
  const paramStr = JSON.stringify(parameters ?? {});
  return `${versionId}-${horizon}-${strategyId}-${paramStr}`;
}
