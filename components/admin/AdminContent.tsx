"use client";

import { useEffect, useState } from "react";

const PDF_URL = "/BusinessReport.pdf";

export function AdminContent() {
  const [pdfAvailable, setPdfAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setPdfAvailable(null);
    fetch(PDF_URL, { method: "GET", cache: "no-store" })
      .then((r) => setPdfAvailable(r.ok))
      .catch(() => setPdfAvailable(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Admin</h1>
      <p className="text-muted-foreground mb-6">
        Business report (embedded below).{" "}
        <a
          href={PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:no-underline"
        >
          Open in new tab
        </a>
      </p>
      {pdfAvailable === false && (
        <p className="text-destructive mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3">
          BusinessReport.pdf not found. Add the file to the{" "}
          <code className="text-sm">public/</code> folder (as{" "}
          <code className="text-sm">public/BusinessReport.pdf</code>).
        </p>
      )}
      <div
        className="rounded-lg border bg-muted/30 overflow-hidden"
        style={{ minHeight: "70vh" }}
      >
        <object
          data={PDF_URL}
          type="application/pdf"
          width="100%"
          height="100%"
          style={{ minHeight: "70vh" }}
          aria-label="Business Report PDF"
        >
          <iframe
            src={PDF_URL}
            title="Business Report"
            className="w-full border-0"
            style={{ minHeight: "70vh" }}
          />
        </object>
      </div>
      <div className="mt-4">
        <a
          href="/api/admin/logout"
          className="inline-block py-2 px-4 rounded-md border border-input bg-background hover:bg-accent text-sm font-medium"
        >
          Log out
        </a>
      </div>
    </div>
  );
}
