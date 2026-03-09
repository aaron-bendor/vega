import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PDF_FILENAME = "BusinessReport.pdf";

/** Try public/ first, then project root (Vega folder), so the PDF works in either place. */
function findPdfPath(): string | null {
  const cwd = process.cwd();
  const inPublic = path.join(cwd, "public", PDF_FILENAME);
  const inRoot = path.join(cwd, PDF_FILENAME);
  if (fs.existsSync(inPublic)) return inPublic;
  if (fs.existsSync(inRoot)) return inRoot;
  return null;
}

export async function GET() {
  try {
    const filePath = findPdfPath();
    if (!filePath) {
      return new NextResponse(null, { status: 404 });
    }
    const buffer = fs.readFileSync(filePath);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="BusinessReport.pdf"',
      },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
