"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, Home, Wallet, LayoutDashboard, Store, Code2, Lock, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlgorithmOption {
  id: string;
  name: string;
}

const PAGES: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/vega-financial", label: "Vega Financial", icon: Wallet },
  { href: "/vega-financial/portfolio", label: "Portfolio", icon: LayoutDashboard },
  { href: "/vega-financial/marketplace", label: "Marketplace", icon: Store },
  { href: "/vega-developer", label: "Developer", icon: Code2 },
  { href: "/private", label: "Private", icon: Lock },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [algorithms, setAlgorithms] = useState<AlgorithmOption[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchAlgorithms = useCallback(async () => {
    try {
      const res = await fetch("/api/algorithms");
      const data = await res.json();
      if (Array.isArray(data)) {
        setAlgorithms(
          data.map((v: { id: string; name: string }) => ({ id: v.id, name: v.name }))
        );
      } else {
        setAlgorithms([]);
      }
    } catch {
      setAlgorithms([]);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) {
            setQuery("");
            setSelectedIndex(0);
            fetchAlgorithms();
            setTimeout(() => inputRef.current?.focus(), 0);
          }
          return !o;
        });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fetchAlgorithms]);

  const filteredPages = PAGES.filter(
    (p) => !query.trim() || p.label.toLowerCase().includes(query.toLowerCase())
  );
  const filteredAlgos = algorithms.filter(
    (a) => !query.trim() || a.name.toLowerCase().includes(query.toLowerCase())
  );
  const totalItems = filteredPages.length + filteredAlgos.length;

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % Math.max(1, totalItems));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + totalItems) % Math.max(1, totalItems));
    } else if (e.key === "Enter") {
      e.preventDefault();
      let idx = 0;
      for (const p of filteredPages) {
        if (idx === selectedIndex) {
          handleSelect(p.href);
          return;
        }
        idx++;
      }
      for (const a of filteredAlgos) {
        if (idx === selectedIndex) {
          handleSelect(`/vega-financial/algorithms/${a.id}`);
          return;
        }
        idx++;
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  if (!open) return null;

  let index = 0;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/20"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        className="w-full max-w-lg rounded-lg border border-[rgba(51,51,51,0.12)] bg-white shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Quick navigation"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-2 border-b border-[rgba(51,51,51,0.12)] px-3">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            placeholder="Search pages or algorithms…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 h-12"
          />
          <kbd className="hidden sm:inline text-[10px] text-muted-foreground border border-[rgba(51,51,51,0.18)] rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto py-1">
          {filteredPages.length > 0 && (
            <div className="px-2 py-1.5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2 mb-1">
                Pages
              </p>
              {filteredPages.map((p) => {
                const isSelected = index === selectedIndex;
                index++;
                return (
                  <button
                    key={p.href}
                    type="button"
                    onClick={() => handleSelect(p.href)}
                    className={cn(
                      "w-full flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-[rgba(51,51,51,0.06)] text-foreground"
                        : "text-muted-foreground hover:bg-[rgba(51,51,51,0.04)] hover:text-foreground"
                    )}
                  >
                    <p.icon className="size-4 shrink-0" />
                    {p.label}
                  </button>
                );
              })}
            </div>
          )}
          {filteredAlgos.length > 0 && (
            <div className="px-2 py-1.5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2 mb-1">
                Algorithms
              </p>
              {filteredAlgos.map((a) => {
                const isSelected = index === selectedIndex;
                index++;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => handleSelect(`/vega-financial/algorithms/${a.id}`)}
                    className={cn(
                      "w-full flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-[rgba(51,51,51,0.06)] text-foreground"
                        : "text-muted-foreground hover:bg-[rgba(51,51,51,0.04)] hover:text-foreground"
                    )}
                  >
                    <BarChart3 className="size-4 shrink-0" />
                    <span className="truncate">{a.name}</span>
                  </button>
                );
              })}
            </div>
          )}
          {filteredPages.length === 0 && filteredAlgos.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">
              No results for “{query}”
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
