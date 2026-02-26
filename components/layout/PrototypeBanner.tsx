export const PROTOTYPE_BANNER_TEXT =
  "University prototype. Synthetic data. Paper trading only. Not investment advice.";

export function PrototypeBanner() {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 py-2 px-4 text-center text-sm text-amber-900 dark:text-amber-200">
      {PROTOTYPE_BANNER_TEXT}
    </div>
  );
}
