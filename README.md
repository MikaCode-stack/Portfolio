# Michaël Etiennette — Portfolio Website

A static, multi-page portfolio website built with **plain HTML, CSS and JavaScript** — no frameworks, no build tools required to run it, and nothing to deploy except the files themselves.

**Design:** Modern NGO / international-organisation style · Scout Purple `#4d006e` · *Caveat Brush* headings · *Montserrat* body text (both loaded automatically from Google Fonts).

---

## What's in the box

```
portfolio/
├── index.html              ← Home
├── about.html              ← About
├── scouting-journey.html   ← Scouting Journey
├── leadership.html         ← Leadership & Advocacy
├── projects.html           ← Projects & Impact
├── international.html       ← International Engagement
├── sdgs.html               ← SDGs & Policy
├── wood-badge.html         ← Wood Badge Portfolio
├── media.html              ← Media & Publications
├── gallery.html            ← Gallery
├── resources.html          ← Resources
├── contact.html            ← Contact
├── css/
│   └── style.css           ← All styling (one file)
├── js/
│   └── main.js             ← All behaviour (nav, tabs, gallery filter, form)
├── assets/
│   ├── images/             ← Put your photos here
│   └── resources/          ← Put downloadable files (PDF, PPTX…) here
├── _partials/              ← Source fragments used to generate the pages (optional)
└── build.py                ← Regenerates pages from _partials (optional)
```

> The `.html` files are ready to use as-is. `_partials/` and `build.py` are only needed if you want to edit the shared header/footer once and regenerate every page (see *Advanced* below). **You can ignore them otherwise.**

---

## Run it on your machine with VS Code

### Option A — Just open it (simplest)
1. Open the `portfolio` folder in VS Code (**File → Open Folder…**).
2. In the Explorer panel, right-click `index.html` → **Reveal in File Explorer / Finder**, then double-click it to open in your browser.

That's it. Because everything is static, no server is strictly required.

### Option B — Live Preview with auto-reload (recommended while editing)
1. In VS Code, open the **Extensions** panel (`Ctrl/Cmd + Shift + X`).
2. Search for **“Live Server”** (by Ritwick Dey) and click **Install**.
3. Open `index.html`, then either:
   - Click **“Go Live”** in the bottom-right status bar, **or**
   - Right-click `index.html` → **“Open with Live Server”.**
4. Your browser opens at something like `http://127.0.0.1:5500/index.html` and refreshes automatically whenever you save a file.

### Option C — One-line local server (no extensions)
If you have Python installed, open VS Code's terminal (**Terminal → New Terminal**) in the project folder and run:

```bash
python -m http.server 8000
```

Then visit **http://localhost:8000** in your browser. (Use `python3` instead of `python` on macOS/Linux if needed.)

---

## Using & editing the website

### Navigation
The top menu links every page together. On narrow screens it collapses into a **☰** button. The current page is highlighted automatically.

### Replacing placeholder text
All copy lives directly in the `.html` files. Open any page in VS Code and edit the text between the tags. Search for words like *“can be added here”* or *“can be linked here”* to find spots intended for your real content.

### Adding photos
1. Drop image files into `assets/images/`.
2. **Gallery** (`gallery.html`): each tile looks like this —
   ```html
   <figure class="gphoto" data-cat="leadership">
     <div class="ph">★</div>
     <figcaption class="cap">Your impact caption here.</figcaption>
   </figure>
   ```
   Replace the `<div class="ph">★</div>` line with an image:
   ```html
   <img src="assets/images/your-photo.jpg" alt="Short description">
   ```
   Keep the `data-cat` value (`leadership`, `youth`, `training`, `international`, `community`, `environment`) so the filter buttons keep working.
3. **About / Journey / Projects**: anywhere you see a `portrait-ph` or a *“Photos”* field, you can drop in an `<img src="assets/images/…">` the same way.

### Adding downloadable resources
1. Put files (PDF, PPTX, DOCX…) into `assets/resources/`.
2. In `resources.html`, point each **Download** link at the file:
   ```html
   <a class="btn btn--ghost" href="assets/resources/my-report.pdf" download>Download</a>
   ```

### Wood Badge portfolio
`wood-badge.html` has four **cluster tabs** (0–3), each with six expandable module cards. Click a module to expand it and fill in *Requirement, Explanation, Real Example, Evidence, Reflection, Lessons Learned* and *Supporting Documents*.

### Contact form
The form on `contact.html` is **display-only** by design (no accounts, no backend). On submit it shows a friendly confirmation message. To make it actually send email, paste the form into a free form service such as **Formspree**, **Getform** or **Google Forms**, and update the form's `action`. Also change the placeholder email `michael@example.com` (in `contact.html` and `js/main.js`) and the social links to your real profiles.

### Changing colours or fonts
Open `css/style.css` — the palette and fonts are defined once at the top under `:root`:
```css
--purple: #4d006e;   /* Scout Purple */
--gold:   #f2b705;   /* accent */
--font-head: 'Caveat Brush', cursive;
--font-body: 'Montserrat', system-ui, sans-serif;
```
Change a value there and it updates everywhere.

---

## Publishing it online (optional, all free)

Because the site is fully static, you can host it anywhere:

- **GitHub Pages** — push the folder to a repo, then enable Pages in the repo settings.
- **Netlify** — drag-and-drop the `portfolio` folder onto the Netlify dashboard.
- **Cloudflare Pages / Vercel** — point them at the folder or repo.

No configuration needed — just upload the files.

---

## Advanced: editing the shared header/footer once

The header (nav) and footer appear on every page. If you want to change them in **one** place instead of twelve, edit the fragments in `_partials/` and regenerate:

```bash
python build.py
```

This reads `_partials/header.html`, `_partials/footer.html` and each `_partials/body-*.html`, then rewrites the page `.html` files. (Requires Python 3; no extra packages.) If you'd rather not bother, just edit each `.html` file directly — the `_partials/` workflow is entirely optional.

---

## Notes
- The fonts load from Google Fonts over the internet, so headings show their decorative style when you're online. Offline, the browser falls back to a default font — the layout is unaffected.
- No tracking, no analytics, no cookies, no dependencies.
