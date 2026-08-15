# Trending Now — Sports, Entertainment & More

A hand-curated directory: **10 recommended sites each** for Cricket, Football, Other Sports, Hollywood, Bollywood, South Cinema, Bike Racing (MotoGP), Formula Racing (F1), and Bikes & Reviews — 90 links total, animated, filterable, for finding your next trending blog topic.

Black background, neon lime/magenta/orange color-coding by category, bold italic display type, drifting glow animation — every card is a plain link out to that publication's own site.

The top banner now runs a **3-slide background slider** (auto-crossfade + slow Ken Burns zoom) behind the "Trending Blogs" heading, the heading itself animates in **letter by letter** with a gradient shimmer on "BLOGS," and each of the three sections (Sports / Entertainment / Racing) has its own **watermark background image plus a few slowly drifting icons** behind the cards.

**Purely static** — `index.html`, `style.css`, `script.js`, plus six small SVG images in `assets/`. No build step, no backend, no fetching, no API calls of any kind.

## How it's different from the other "Wire" builds

This one isn't live data at all — it's a fixed, hand-picked reading list (like a "best sites to follow" article), so there's nothing to fetch, no GitHub Action needed, and no hourly refresh. Everything lives in the `SITES` array at the top of `script.js`.

## Run it

Just open `index.html` in a browser, or serve it with any static server:

```bash
python3 -m http.server 8000
```

## Host it on GitHub Pages

1. Push these three files (plus this README) to a GitHub repo.
2. **Settings → Pages → Build and deployment → Source → Deploy from a branch** → pick your branch, `/ (root)` → Save.
3. Your Pages URL is live within a minute or two. That's it — no Actions, no workflows, no secrets.

## Customizing

- **Add/remove/re-rank a site:** edit an entry in the `SITES` array in `script.js` — `{ rank, category, name, url, blurb }`.
- **Add a whole new category:** add it to `CATEGORIES` (with an `id`, `label`, `supergroup` of `Sports` / `Entertainment` / `Racing`, and an emoji `icon`), then add matching entries to `SITES`.
- **Add a new supergroup:** add its name to `SUPERGROUPS` and give it a color in the `:root` block of `style.css` (`--yourgroup` / `--yourgroup-dim`), plus a `.tone-yourgroup` rule for chips and cards.
- **Restyle:** all colors, spacing, and fonts are CSS custom properties at the top of `style.css`.
- **Swap the banner slides:** replace `assets/hero-bg-1.svg` / `-2.svg` / `-3.svg` with your own images (any format — jpg/png/svg all work) and update the three `url(...)` paths in the `.hero-bg-slider` block in `index.html`. Add a 4th slide by copying one of the `<span class="hero-bg-slide">` lines — `initHeroSlider()` in `script.js` picks up however many slides are present. Slide timing is the `6000` (ms) value in that same function.
- **Swap a section's background image or icons:** edit the `SUPERGROUP_DECOR` object near the top of `script.js` — `bg` is the path to that supergroup's watermark image (`assets/cat-*.svg`), `icons` is the small set of emoji that drift behind its cards.
- **Adjust the heading animation:** letter stagger speed and the shimmer sweep live in the `.hero-title.is-split` rules in `style.css`; both respect `prefers-reduced-motion` automatically.
