# ChazaApp marketing website

Static marketing site for ChazaApp. All pages are plain HTML, CSS, and JS—no build step required.

**App linking:** The Flutter app opens these pages from **About** (Website, Privacy Policy, Terms, Contact) and **Help & Support** (Contact on website). URLs are defined in `lib/utils/constants.dart` as `Constants.websiteBaseUrl` and `Constants.websitePrivacyUrl`, etc. (using `.html` paths so they work on any static host).

## Pages

- **index.html** – Home / landing
- **features.html** – Features overview
- **download.html** – App download (store links)
- **about.html** – About ChazaApp
- **contact.html** – Contact form (mailto) and email
- **privacy.html** – Privacy policy (linked from app)
- **terms.html** – Terms of service (linked from app)

## Run locally

1. Open the `website` folder in a browser, or serve it with a local server.

   **Option A – open file (some links may not work if opened as file://)**  
   - Open `website/index.html` in your browser.

   **Option B – local HTTP server (recommended)**  
   From the project root:
   ```bash
   # Python 3
   python -m http.server 8000 --directory website

   # Node (npx)
   npx serve website -p 8000
   ```
   Then visit `http://localhost:8000`.

## Deploy

Deploy the `website` folder to any static host.

### Firebase Hosting

1. The project's `firebase.json` already includes a `hosting` config with `"public": "website"`.
2. Run: `firebase deploy` (only hosting: `firebase deploy --only hosting`).
3. After deploy, set your custom domain (e.g. www.chazaapp.com) in the Firebase Console if needed. The app uses `Constants.websiteBaseUrl`; update it in `lib/utils/constants.dart` if your live URL differs.

### Vercel / Netlify

- Set the project root to the repo and the **publish directory** (or equivalent) to `website`.
- No build command needed.

## Google indexing

The site is set up for search engine indexing:

- **robots.txt** – Allows all crawlers and points to `sitemap.xml`.
- **sitemap.xml** – Lists all 7 pages with priorities for discovery.
- **Canonical URLs** – Each page has a `<link rel="canonical">` to avoid duplicate content.
- **Per-page meta** – Unique `<title>` and `<meta name="description">` on every page.

If your live domain is not `https://www.chazaapp.com`, update: `robots.txt` (Sitemap URL), `sitemap.xml` (all `<loc>` URLs), and each HTML file’s `<link rel="canonical" href="...">`. After deploy, submit the sitemap in [Google Search Console](https://search.google.com/search-console) to speed up indexing.

## Customize before launch

1. **Store links** – In `download.html`, replace the Google Play and App Store URLs with your real app links.
2. **Contact email** – In `contact.html`, replace `support@chazaapp.com` with your support email in the form `action` and in the “email us directly” link.
3. **Privacy & Terms** – Review and edit `privacy.html` and `terms.html` (e.g. entity name, jurisdiction, contact details).
4. **Logo / images** – Add `images/logo.png`, favicon, or screenshots and reference them in the HTML if desired.
