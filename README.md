# Newco Studio website

The public website of Newco Studio: Studio (our platform for building AI solutions fast), our two products (the
methodology editor and Estimé), use cases, tailoring to your field, and a contact page. Static HTML, CSS and
JavaScript, bilingual (French by default, English), served by GitHub Pages.

The Estimé product site is a separate, independent repository (`newco-studio/estime`). The two sites share no files;
the only link between them is one outbound link each way, set in [`config.js`](config.js).

## Pages

Each topic lives on one page only.

| File | What |
|---|---|
| `index.html` | Home, kept short: one line and one sentence, the three 30-second videos (Studio, Éditeur méthodologique, Estimé), three cards to the pages below, a one-line contact call to action |
| `studio.html` | Studio's role (the platform we build our AI products on), the platform diagram (HTML and SVG), the feature tiles, and adapting Studio to your field (methodologies, compliance) |
| `produits.html` | The two products: the Éditeur méthodologique (its modes and deliverable formats) and Estimé (with the link to the Estimé site), then the use cases |
| `contact.html` | The e-mail address (info@newco-studio.com) and "Bureaux à Québec et au Saguenay"; no form, no street address, no phone |
| `404.html` | Page not found (GitHub Pages serves it for unknown paths) |

The navigation is Studio, Produits, Contact and an outbound Estimé link.

## Structure

```
config.js          the one setting that names another site (ESTIME_URL)
app.js             language switch, menu, outbound links, videos, tabs, lightbox
styles.css         brand tokens (navy, orange, Inter) and layout
images/            logos, favicons, og-image.jpg, shots/ (screenshots), use-cases/ (illustrations)
videos/            the 30-second videos (see below); empty in the repository for now
.nojekyll          GitHub Pages serves the files as they are
```

All paths are relative, so the site works at a domain root and under a sub-path.

## Languages

Every text exists in both languages in the HTML (`<span class="fr">` / `<span class="en">`); `body[data-lang]` shows
one. The choice comes from `?lang=fr|en`, then the visitor's last choice (`localStorage`), else French. Attributes that
change with the language (`src`, `alt`, `poster`, `aria-label`, meta `content`) carry the French value and a
`data-<attribute>-en` value, listed in `data-i18n`.

## Videos

The home page plays three 30-second videos, chosen by language:

| Video | French | English |
|---|---|---|
| Studio | `videos/studio-30s-fr.mp4` | `videos/studio-30s-en.mp4` |
| Methodology editor | `videos/editeur-30s-fr.mp4` | `videos/editeur-30s-en.mp4` |
| Estimé | `videos/estime-30s-fr.mp4` | `videos/estime-30s-en.mp4` |

Until a file exists, its card shows the poster (a screenshot) and, on play, "Video coming soon". To add them, copy the
MP4 files (H.264 + AAC, `+faststart`, ideally under 10 MB each) into `videos/` and push; no code change. Keep each
file under GitHub's 100 MB limit.

## Images

- `images/shots/` — the Studio video poster (a brand frame), the methodology editor mockups (fictitious data) and one
  Estimé screenshot (project and firm names replaced). Each exists in `-fr` and `-en`. The Studio section's platform
  diagram is HTML and SVG in `studio.html`, not an image.
- `images/use-cases/` — the isometric illustrations from the previous site.
- `images/og-image.jpg` — the social preview (1200 × 630).

Never add a screenshot that shows a real client, project or person.

## Local preview

```bash
python3 -m http.server 8000      # then open http://localhost:8000/
```

## Deployment

GitHub Pages, from the `main` branch, root folder (Settings › Pages). This repository, `newco-studio.github.io`, is the
organisation site: it serves `https://newco-studio.github.io/`. Every push to `main` is live within a minute or two.

## Link to the Estimé site

`config.js` holds the Estimé site's address:

```js
window.SITE_CONFIG = {
  ESTIME_URL: 'https://newco-studio.github.io/estime/'
};
```

Every Estimé link (`data-ext="ESTIME_URL"`) reads it at load time and adds `?lang=` so the visitor keeps their
language. Nothing else in this repository names the Estimé site.

## Move to a custom domain

Example: `newco-studio.com` for this site. Two files change: `CNAME` here, and `config.js` in the Estimé repository.

1. **Add a `CNAME` file** at the root of this repository containing only the domain, for example
   `newco-studio.com` (or `www.newco-studio.com`), commit and push.
2. **Create the DNS records** at the domain's DNS provider:
   - apex domain (`newco-studio.com`): four `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
     `185.199.111.153`, and four `AAAA` records `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`,
     `2606:50c0:8003::153`;
   - `www` (or any subdomain used): a `CNAME` record to `newco-studio.github.io`.
   Using both (apex and `www`) lets GitHub redirect one to the other.
3. **Recommended:** verify the domain for the organisation (organisation Settings › Pages › Verified domains, a `TXT`
   record) so nobody else can claim it on GitHub Pages.
4. **In this repository's Settings › Pages**, enter the custom domain (it should match `CNAME`), wait for the DNS check
   to pass, then tick **Enforce HTTPS** (the certificate can take up to an hour).
5. **Update the link on the other site:** in the Estimé repository, set `NEWCO_URL` in `config.js` to the new address
   (for example `https://newco-studio.com/`), push.
6. Check: open the new address, switch languages, follow the Estimé link and back.

Note: a custom domain on this organisation site also applies to the organisation's project sites that have none of
their own. Until the Estimé site gets its own domain, `https://newco-studio.github.io/estime/` redirects to
`https://<this domain>/estime/`; links keep working, but update `ESTIME_URL` here to the final address when the Estimé
site moves (see its README).

## Licence

Content, images and code © 2026 Newco Studio (9546-1935 Québec inc.). All rights reserved. The Inter typeface is served
by Google Fonts under the SIL Open Font License.
