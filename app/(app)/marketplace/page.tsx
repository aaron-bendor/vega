import { redirect } from "next/navigation";

export default async function MarketplaceRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; risk?: string }>;
}) {
  const params = await searchParams;
  const q = new URLSearchParams();
  if (params.tag) q.set("tag", params.tag);
  if (params.risk) q.set("risk", params.risk);
  const query = q.toString();
  redirect(`/vega-financial/marketplace${query ? `?${query}` : ""}`);
}
