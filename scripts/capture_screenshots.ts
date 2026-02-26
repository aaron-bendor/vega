/**
 * Capture screenshots of the Vega prototype for local preview.
 * Requires the dev server to be running.
 *
 * Usage: PORT=3001 npx tsx scripts/capture_screenshots.ts
 * Or: BASE_URL=http://localhost:3001 npx tsx scripts/capture_screenshots.ts
 */

import { chromium } from "playwright";
import * as path from "path";
import * as fs from "fs";

const port = process.env.PORT ?? 3000;
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${port}`;
const OUTPUT_DIR = path.join(process.cwd(), "docs", "screenshots");

async function waitForServer(): Promise<void> {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/algorithms`);
      if (res.ok) return;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error("Server not ready. Start with: npm run dev");
}

async function getDemoIds(): Promise<{ versionId: string; algorithmId: string } | null> {
  const res = await fetch(`${BASE_URL}/api/algorithms`);
  if (!res.ok) throw new Error(`API failed: ${res.status}`);
  const versions = (await res.json()) as Array<{ id: string; algorithmId: string }>;
  if (!versions.length) {
    console.log("No seeded data (database may not be configured). Capturing static pages only.");
    return null;
  }
  return {
    versionId: versions[0].id,
    algorithmId: versions[0].algorithmId,
  };
}

async function main(): Promise<void> {
  console.log("Waiting for dev server at", BASE_URL, "...");
  await waitForServer();

  const demoIds = await getDemoIds();
  if (demoIds) {
    console.log("Demo IDs: versionId=", demoIds.versionId, "algorithmId=", demoIds.algorithmId);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  const capture = async (url: string, name: string, selector: string) => {
    await page.goto(`${BASE_URL}${url}`, { waitUntil: "networkidle" });
    await page.waitForSelector(selector, { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 500));
    const out = path.join(OUTPUT_DIR, `${name}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log("  Saved:", out);
  };

  try {
    console.log("\nCapturing screenshots...");

    await capture("/marketplace", "marketplace", "h1");
    if (demoIds) {
      await capture(`/algo/${demoIds.versionId}`, "algo", "h1");
      await capture(`/developer/algorithms/${demoIds.algorithmId}`, "developer_algo", "h1");
    } else {
      console.log("  Skipping /algo and /developer/algorithms/[id] (no seeded data)");
    }
    await capture("/portfolio", "portfolio", "h1");
    await capture("/developer", "developer", "h1");
    await capture("/developer/algorithms/new", "new_algo", "form");
  } finally {
    await browser.close();
  }

  const absPath = path.resolve(OUTPUT_DIR);
  console.log("\n✓ Screenshots saved to:");
  console.log("  ", absPath);
  console.log("\nFiles:", fs.readdirSync(OUTPUT_DIR).join(", "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
