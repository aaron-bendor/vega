/**
 * Ensures public/BusinessReport.pdf exists before build.
 * If missing, the deploy build fails so the PDF 404 on production is caught early.
 */
const fs = require("fs");
const path = require("path");

const pdfPath = path.join(process.cwd(), "public", "BusinessReport.pdf");
if (!fs.existsSync(pdfPath)) {
  console.error(
    "Build failed: public/BusinessReport.pdf is missing. Add the file and commit it so the admin page can serve it in production. See docs/DEPLOY-ADMIN.md."
  );
  process.exit(1);
}
