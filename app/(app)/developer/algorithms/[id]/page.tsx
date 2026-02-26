import { notFound } from "next/navigation";
import Link from "next/link";
import { getAlgorithmById } from "@/lib/db/algorithms";
import { DeveloperAlgorithmEditor } from "./DeveloperAlgorithmEditor";

export default async function DeveloperAlgorithmPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const algo = await getAlgorithmById(id);
  if (!algo) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/developer"
        className="text-sm text-muted-foreground hover:underline mb-6 block"
      >
        ← Back to developer portal
      </Link>
      <DeveloperAlgorithmEditor algorithm={algo} />
    </div>
  );
}
