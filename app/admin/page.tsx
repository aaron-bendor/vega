"use client";

import { useState, useEffect } from "react";

const ADMIN_SESSION_KEY = "vega-admin-auth";
const ADMIN_PASSWORD = "VegaFinancialTheBest";

const PDF_URL = "/api/financial-report";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [pdfAvailable, setPdfAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof sessionStorage === "undefined") return;
    const ok = sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
    setAuthenticated(ok);
  }, [mounted]);

  useEffect(() => {
    if (!authenticated) return;
    setPdfAvailable(null);
    fetch(PDF_URL, { method: "GET", cache: "no-store" })
      .then((r) => setPdfAvailable(r.ok))
      .catch(() => setPdfAvailable(false));
  }, [authenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password === ADMIN_PASSWORD) {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      }
      setAuthenticated(true);
      setPassword("");
    } else {
      setError("Incorrect password.");
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="max-w-sm mx-auto mt-16">
        <h1 className="text-2xl font-semibold mb-2">Admin</h1>
        <p className="text-muted-foreground mb-6">This page is password protected.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="sr-only">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Admin</h1>
      <p className="text-muted-foreground mb-6">
        Financial report (embedded below).{" "}
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
          FinancialReport.pdf not found. Add the file to the <code className="text-sm">public/</code> folder
          (as <code className="text-sm">public/FinancialReport.pdf</code>).
        </p>
      )}
      <div className="rounded-lg border bg-muted/30 overflow-hidden" style={{ minHeight: "70vh" }}>
        <object
          data={PDF_URL}
          type="application/pdf"
          width="100%"
          height="100%"
          style={{ minHeight: "70vh" }}
          aria-label="Financial Report PDF"
        >
          <iframe
            src={PDF_URL}
            title="Financial Report"
            className="w-full border-0"
            style={{ minHeight: "70vh" }}
          />
        </object>
      </div>
    </div>
  );
}
