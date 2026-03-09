"use client";

import { useState, useEffect } from "react";

const ADMIN_SESSION_KEY = "vega-admin-auth";
const ADMIN_PASSWORD = "VegaFinancialTheBest";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof sessionStorage === "undefined") return;
    const ok = sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
    setAuthenticated(ok);
  }, [mounted]);

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
      <p className="text-muted-foreground">You are logged in.</p>
    </div>
  );
}
