# Admin & Business Report PDF

The `/admin` page embeds the **Business Report** PDF. It works locally (file in `public/` or project root). **On production it only works if you use an external PDF URL.**

---

## Production (deployed site): use an external PDF URL

Deployed apps (e.g. Vercel) often don’t have the PDF file in the build, so the embed will 404 unless you point it at a URL.

### 1. Host the PDF somewhere public

Choose one:

- **Google Drive**  
  Upload the PDF → Share → “Anyone with the link” → get a link.  
  For embedding, use a direct-download form, e.g.  
  `https://drive.google.com/uc?export=download&id=YOUR_FILE_ID`

- **Vercel Blob / AWS S3 / Cloudflare R2 / any file host**  
  Upload the file and copy the **public** URL to the PDF.

- **Another server or CDN**  
  Any URL that returns the PDF with `Content-Type: application/pdf` when opened in a browser.

### 2. Set the URL in your host’s environment

In your hosting dashboard (e.g. Vercel → Project → **Settings** → **Environment Variables**):

- **Name:** `NEXT_PUBLIC_BUSINESS_REPORT_PDF_URL`
- **Value:** the full URL to the PDF (e.g. `https://…/BusinessReport.pdf`)

Save and **redeploy** (or push a new commit so the host rebuilds).

### 3. Check

- Open `https://vegafinancial.uk/admin` (or your production URL).
- Log in; the Business Report should load in the embed and “Open in new tab” should work.

---

## Local development

No env var needed. Put `BusinessReport.pdf` in either:

- `public/BusinessReport.pdf`, or  
- the project root (Vega folder),

and the app will serve it via `/api/business-report` and the embed will work.

---

## Summary

| Environment   | What to do |
|---------------|------------|
| **Production** | Set `NEXT_PUBLIC_BUSINESS_REPORT_PDF_URL` to a public PDF URL and redeploy. |
| **Local**      | Keep the PDF in `public/` or project root; no env var required. |
