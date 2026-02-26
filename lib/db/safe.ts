/**
 * Safe DB access for demo mode when Postgres is not running or DATABASE_URL is missing.
 * Catches connection and init errors and returns empty data so pages still render.
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

/** True if the error means the DB is unavailable (connection or missing DATABASE_URL). */
export function isDbUnavailableError(err: unknown): boolean {
  if (err instanceof Error) {
    if (isDbConnectionError(err)) return true;
    if (err.name === "PrismaClientInitializationError") return true;
    const msg = err.message.toLowerCase();
    if (msg.includes("environment variable not found") || msg.includes("database_url"))
      return true;
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
    if (isDbUnavailableError(err)) {
      return { data: fallback, dbAvailable: false };
    }
    throw err;
  }
}
