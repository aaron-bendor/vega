# Admin & Business Report PDF — Deploy Checklist

The `/admin` page shows an embedded **Business Report** PDF. For it to work on production (e.g. vegafinancial.uk), the PDF must be included in the deployed artefact.

## Why production returns 404 for the PDF

- The app serves the PDF as a **static asset** at **`/BusinessReport.pdf`** (from `public/BusinessReport.pdf`).
- If the live site returns **404** for `https://vegafinancial.uk/BusinessReport.pdf`, the file is not in the deployment. Common causes:
  1. **Deployed commit is old** — the commit that is deployed does not include `public/BusinessReport.pdf`, or the host is serving a cached/older build.
  2. **PDF not pushed** — the PDF is only in your local repo; the commit with `public/BusinessReport.pdf` was never pushed to the remote that the host builds from.

## What to do

### 1. Confirm the PDF is in the repo and in the right commit

```bash
# File should be tracked (no output = not ignored)
git check-ignore -v public/BusinessReport.pdf
# Should show "not ignored" or similar; if it says .gitignore:*.pdf then the exception !public/BusinessReport.pdf is missing.

# See which commit last added/updated the PDF
git log -1 --oneline -- public/BusinessReport.pdf
```

Ensure `public/BusinessReport.pdf` is present and committed, and that you have pushed that commit to the branch your host builds from (e.g. `main`).

### 2. Confirm the host is building the correct commit

- In your hosting dashboard (Vercel, Netlify, etc.), open the latest deployment.
- Check the **commit SHA** or **branch** that was built.
- That commit must be the one (or a descendant of the one) that contains `public/BusinessReport.pdf`. If the dashboard shows an older commit, trigger a new deploy from the correct branch/commit.

### 3. Redeploy the correct commit

- Push the latest commit that includes `public/BusinessReport.pdf`, then trigger a new deployment (e.g. “Redeploy” in the dashboard, or push again).
- Or in the dashboard, start a deployment from the branch that has the PDF.

### 4. Verify after deploy

- **PDF (static):**  
  `https://vegafinancial.uk/BusinessReport.pdf`  
  → Should return **200** and the PDF (not 404).

- **Admin page:**  
  `https://vegafinancial.uk/admin`  
  → Log in with the admin password; the embedded Business Report should load.

## Summary

- **Local/repo:** The PDF is included if `public/BusinessReport.pdf` is tracked and committed.
- **Live site:** The PDF is included only if the **deployed** commit contains that file and the host has built that commit.  
  If the PDF is missing on production, fix the deployed commit and redeploy; the app is already configured to serve it at `/BusinessReport.pdf`.
