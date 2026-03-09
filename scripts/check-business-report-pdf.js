/**
 * Ensures BusinessReport.pdf exists (public/ or project root) so the admin embed works.
 */
const fs = require("fs");
const path = require("path");

const cwd = process.cwd();
const inPublic = path.join(cwd, "public", "BusinessReport.pdf");
const inRoot = path.join(cwd, "BusinessReport.pdf");
if (fs.existsSync(inPublic) || fs.existsSync(inRoot)) {
  process.exit(0);
}
console.error(
  "Build failed: BusinessReport.pdf not found. Add it to public/ or the project root (Vega folder). See docs/DEPLOY-ADMIN.md."
);
process.exit(1);
