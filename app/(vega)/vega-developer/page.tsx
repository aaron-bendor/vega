import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VegaDeveloperPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Vega Developer</h1>
      <p className="text-muted-foreground mb-8">
        Developer-facing prototype. Coming soon.
      </p>
      <Card className="max-w-md bg-card/90 backdrop-blur">
        <CardHeader>
          <CardTitle>Developer portal</CardTitle>
          <CardDescription>
            Create, publish, and manage algorithmic strategies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/developer">Open legacy developer portal</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
