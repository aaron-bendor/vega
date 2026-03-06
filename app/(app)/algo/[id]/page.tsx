import { redirect } from "next/navigation";

export default async function AlgoRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/vega-financial/algorithms/${id}`);
}
