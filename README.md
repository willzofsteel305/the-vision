# the-vision

Production-ready static portfolio for **IRON WILLZ**, built with HTML, CSS, and vanilla JavaScript for GitHub Pages.

## Structure

- `index.html`, `about.html`, `projects.html`, `contact.html` — site pages
- `404.html` — custom not-found page for GitHub Pages
- `assets/css/` — styling (`themes.css`, `main.css`, `animations.css`)
- `assets/js/` — shared and page-specific scripts (`main.js`, `scroll.js`, `projects.js`, `contact.js`)
- `assets/images/` — favicon, profile, and social preview image assets
- `data/projects.json` — source of truth for project cards

## Local usage

This is a static site, so you can run it with any static file server.

Example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Managing project cards

Edit `data/projects.json`. Supported fields:

- `title` (string)
- `category` (string)
- `description` (string)
- `stack` (string)
- `liveUrl` (optional, valid `http/https` URL)
- `sourceUrl` (optional, valid `http/https` URL)

If the JSON cannot be loaded, `projects.html` will automatically show fallback cards and a friendly error status.

## Contact form behavior

`contact.html` uses a **mailto** workflow (no backend required):

- validates required fields client-side
- includes a honeypot field + minimum submit delay as lightweight spam protection
- opens the visitor's email app with prefilled content
- shows success/error status text in-page

To route enquiries to another inbox, update `CONTACT_EMAIL` in `assets/js/contact.js`.

## Deployment notes

- Built for GitHub Pages relative paths.
- Keep images inside `assets/images/`.
- Keep project content in `data/projects.json`.

## Quick manual QA checklist

- Verify all footer links resolve (no `#` placeholders)
- Verify project links render only when `liveUrl`/`sourceUrl` exists
- Verify projects page shows loading/success/error states
- Verify contact form validation and status feedback
- Verify `404.html` renders on unknown routes
