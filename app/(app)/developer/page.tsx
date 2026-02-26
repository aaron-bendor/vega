import Link from "next/link";

export const dynamic = "force-dynamic";
import { getOrCreateDemoDeveloper, listAlgorithmsForDeveloper } from "@/lib/db/algorithms";
import { withDbOrThrow } from "@/lib/db/safe";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DeveloperPage() {
  const { data: dev, dbAvailable } = await withDbOrThrow(
    () => getOrCreateDemoDeveloper(),
    null as unknown as Awaited<ReturnType<typeof getOrCreateDemoDeveloper>>
  );
  const { data: algorithms } = await withDbOrThrow(
    () => (dev ? listAlgorithmsForDeveloper(dev.id) : Promise.resolve([])),
    []
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Developer Portal</h1>
        {!dbAvailable && (
          <div className="rounded-lg border border-[rgba(51,51,51,0.12)] bg-[rgba(51,51,51,0.04)] px-4 py-2 text-sm text-muted-foreground">
            Database not configured. Run migrations and seed to see your algorithms.
          </div>
        )}
        <Button asChild>
          <Link href="/developer/algorithms/new">Create algorithm</Link>
        </Button>
      </div>

      {algorithms.length === 0 ? (
        <p className="text-muted-foreground">
          No algorithms yet. Create your first draft to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {algorithms.map((algo) => (
            <Card key={algo.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      <Link
                        href={`/developer/algorithms/${algo.id}`}
                        className="hover:underline"
                      >
                        {algo.name}
                      </Link>
                    </CardTitle>
                    <CardDescription>{algo.shortDesc}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {algo.versions.length} version{algo.versions.length !== 1 ? "s" : ""}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/developer/algorithms/${algo.id}`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
