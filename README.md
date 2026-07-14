# The Vision Portfolio

`the-vision` is a static, multi-page personal portfolio site designed for GitHub Pages.

## Structure

```text
/
  index.html
  about.html
  projects.html
  contact.html
  assets/
    css/
    js/
    images/
  data/
    projects.json
```

## Pages

- `index.html` — homepage
- `about.html` — background and approach
- `projects.html` — loads project cards from `data/projects.json`
- `contact.html` — static contact page (clearly marked as non-submitting)

## Local usage

Because this is a static site, you can open the HTML files directly, or serve the directory with a local static server:

```bash
cd /home/runner/work/the-vision/the-vision
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Editing projects

Update project entries in `/data/projects.json`. The projects page fetches this file at runtime.
