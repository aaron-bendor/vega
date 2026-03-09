"use client";

export function AdminContent() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Admin</h1>
      <p className="text-muted-foreground mb-4">You are logged in.</p>
      <a
        href="/api/admin/logout"
        className="inline-block py-2 px-4 rounded-md border border-input bg-background hover:bg-accent text-sm font-medium"
      >
        Log out
      </a>
    </div>
  );
}
