import { notFound } from "next/navigation";
import { getAlgorithmById } from "@/lib/db/algorithms";
import { DeveloperAlgorithmEditor } from "./DeveloperAlgorithmEditor";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

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
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Developer", href: "/developer" },
            { label: algo.name },
          ]}
        />
      </div>
      <DeveloperAlgorithmEditor algorithm={algo} />
    </div>
  );
}
