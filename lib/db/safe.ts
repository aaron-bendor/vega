/**
 * Safe DB access for demo mode when Postgres is not running.
 * Catches connection errors and returns empty data so pages still render.
 */

export class DatabaseUnavailableError extends Error {
  constructor(message = "Database not available") {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

export function isDbConnectionError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return (
      msg.includes("can't reach database") ||
      msg.includes("connection refused") ||
      msg.includes("connect econnrefused")
    );
  }
  return false;
}

export async function withDbOrThrow<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<{ data: T; dbAvailable: boolean }> {
  try {
    const data = await fn();
    return { data, dbAvailable: true };
  } catch (err) {
    if (isDbConnectionError(err)) {
      return { data: fallback, dbAvailable: false };
    }
    throw err;
  }
}
