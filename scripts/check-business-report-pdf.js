/**
 * Ensures the admin PDF embed can work: either the file exists locally, or the production URL env is set.
 */
const fs = require("fs");
const path = require("path");

if (process.env.NEXT_PUBLIC_BUSINESS_REPORT_PDF_URL?.trim()) {
  process.exit(0);
}
const cwd = process.cwd();
const inPublic = path.join(cwd, "public", "BusinessReport.pdf");
const inRoot = path.join(cwd, "BusinessReport.pdf");
if (fs.existsSync(inPublic) || fs.existsSync(inRoot)) {
  process.exit(0);
}
console.error(
  "Build failed: BusinessReport.pdf not found. Add it to public/ or project root, or set NEXT_PUBLIC_BUSINESS_REPORT_PDF_URL. See docs/DEPLOY-ADMIN.md."
);
process.exit(1);
