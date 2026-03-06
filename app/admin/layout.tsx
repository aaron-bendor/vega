import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
          ← Home
        </Link>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
