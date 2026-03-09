"use client";

import { useEffect, useState } from "react";

/**
 * PDF URL for the Business Report embed.
 * - Production: uses Google Drive preview so the embed works when deployed.
 * - Local: uses /api/business-report (file in public/ or project root) when on localhost.
 * Override with NEXT_PUBLIC_BUSINESS_REPORT_PDF_URL in env if needed.
 */
const GOOGLE_DRIVE_PDF_PREVIEW =
  "https://drive.google.com/file/d/1aaNfKrkIzetBuxZ3uTjOds9IKGmc-4e-/preview";
const LOCAL_PDF_API = "/api/business-report";

function getPdfUrl(): string {
  const env = typeof process !== "undefined" && process.env.NEXT_PUBLIC_BUSINESS_REPORT_PDF_URL?.trim();
  if (env) return env;
  if (typeof window !== "undefined" && (window.location?.hostname === "localhost" || window.location?.hostname === "127.0.0.1")) {
    return LOCAL_PDF_API;
  }
  return GOOGLE_DRIVE_PDF_PREVIEW;
}

const PDF_URL = typeof window !== "undefined" ? getPdfUrl() : GOOGLE_DRIVE_PDF_PREVIEW;

export function AdminContent() {
  const [pdfAvailable, setPdfAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setPdfAvailable(null);
    fetch(PDF_URL, { method: "GET", cache: "no-store", mode: "cors" })
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
          PDF could not be loaded. For production: set{" "}
          <code className="text-sm">NEXT_PUBLIC_BUSINESS_REPORT_PDF_URL</code> in your host to a
          public PDF URL (e.g. Google Drive, S3, or a direct link). See docs/DEPLOY-ADMIN.md.
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
