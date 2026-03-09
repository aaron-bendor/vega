import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PDF_FILENAME = "FinancialReport.pdf";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", PDF_FILENAME);
    if (!fs.existsSync(filePath)) {
      return new NextResponse(null, { status: 404 });
    }
    const buffer = fs.readFileSync(filePath);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="FinancialReport.pdf"',
      },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
