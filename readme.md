# WEBZY — Your Vision. Our Design.

A dependency-free, responsive marketing site for **WEBZY**, a web design and digital studio. The site is a premium static build: no framework, no build step, and no tracking scripts. Open it with any static server and deploy the folder as-is.

---

## 1. Quick start

From the project root:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Then open <http://127.0.0.1:4173/>.

On Windows, `py -m http.server 4173 --bind 127.0.0.1` works the same way. Opening `index.html` directly from the filesystem mostly works, but a local server is recommended so root-relative links, fonts and the 404 page behave like production.

There is **no package manager, build command or dependency install**.

---

## 2. Project structure

```text
WEBZY/
├─ index.html                 Homepage: hero, services, work, pricing, why, process, studio, contact
├─ privacy.html               Privacy information
├─ 404.html                   Branded error page (root-relative paths)
├─ robots.txt
├─ work/
│  ├─ restaurant.html         Maison Nº
│  ├─ automotive.html         VANTA
│  ├─ photography.html        MIRA
│  ├─ architecture.html       Atelier Nord
│  ├─ ecommerce.html          Form & Field
│  └─ corporate.html          Northstar
└─ assets/
   ├─ css/
   │  ├─ base.css             Tokens, header, menu, buttons, forms, footer, a11y
   │  ├─ home.css             Homepage layout and sections
   │  ├─ mockups.css          Laptop/phone frames and six concept mini-sites
   │  └─ detail.css           Case-study, legal and 404 styles
   ├─ js/
   │  ├─ config.js            Editable email, Instagram, form endpoint and copy
   │  └─ main.js              Menu, reveals, parallax, validation, form delivery
   ├─ fonts/                  Self-hosted WOFF2 files + OFL licence notices
   └─ img/                    Logo assets, favicons, photography, social cards
```

The six case-study pages are static HTML. They share the homepage header, mobile menu and footer, with paths rewritten for the `work/` directory.

---

## 3. Configure before publishing

Everything editable lives in **`assets/js/config.js`**. The business email, Instagram profile and FormSubmit form are configured.

| Setting | Shipped value | What to do |
| --- | --- | --- |
| `contactEmail` | `webzysite@hotmail.com` | Live business address. When changing it, also update the static no-JS fallbacks in the HTML files. |
| `emailPlaceholder` | `false` | Leave `false`; set `true` only if the address becomes a placeholder again. |
| `instagramUrl` | `https://www.instagram.com/webzysite/` | Live profile URL. |
| `instagramHandle` | `@webzysite` | Live handle. |
| `instagramPlaceholder` | `false` | Leave `false`. |
| `whatsappNumber` | `""` | Country code + number, digits only (e.g. `38344123456`). While empty, the floating WhatsApp button and the WhatsApp contact line stay hidden. |
| `whatsappMessage` | Albanian greeting | Pre-filled text when a visitor opens the WhatsApp chat. |
| `formEndpoint` | `https://formsubmit.co/ajax/webzysite@hotmail.com` | Live FormSubmit AJAX endpoint. One-time activation is required. |
| `formFormat` | `"formdata"` | Use `"json"` only if the endpoint requires JSON. |
| `subject` | `Kërkesë e re për projekt — WEBZY` | Change the inbox subject if needed. |
| `successTitle` | `Faleminderit!` | Heading shown after a confirmed submission. |
| `successMessage` | Albanian confirmation copy | Shown after a confirmed 2xx response. |
| `errorMessage` | Failure copy | Shown after a failed request or non-2xx response. |

The contact email is filled at runtime by `main.js` into every `data-email-link` / `data-email-text` target, including the pricing strip, contact block, footer, privacy page, 404 page and case studies. Each page also contains the same address as a no-JavaScript fallback, so update both the config and those static fallbacks if the address changes.

All developer-facing setup notes have been removed from the published pages. The form shows a success state only after FormSubmit accepts the submission.

### Placeholder checklist

- [x] Business email set in `assets/js/config.js` with `emailPlaceholder: false`.
- [x] Instagram URL and handle set to `@webzysite`, with `instagramPlaceholder: false`.
- [x] FormSubmit endpoint added and the activation email triggered.
- [ ] FormSubmit activation link clicked, then a live submission delivered to `webzysite@hotmail.com`.
- [x] Privacy page updated with FormSubmit and the Outlook/Hotmail destination.
- [ ] Confirm the live test email arrived in `webzysite@hotmail.com` (check spam too).
- [x] Canonical URLs, absolute social-image URLs and `sitemap.xml` added for `https://webzysite.com`.
- [ ] Privacy policy reviewed for the operator's jurisdiction and business details.
- [ ] PayPal payment links re-tested after any package copy or price change.

---

## 4. Pricing and PayPal payment links

The homepage includes a `#pricing` section placed after Selected Work. It presents four fixed-scope packages in a 4-column grid (2 columns below 1180px, 1 column below 980px):

| Package | Price | PayPal payment link |
| --- | --- | --- |
| WEBZY Standard | **490€** | <https://www.paypal.com/ncp/payment/4J3B26WPKXFYC> |
| WEBZY Standard Biznes (highlighted, `MË E ZGJEDHURA`) | **790€** | <https://www.paypal.com/ncp/payment/9YCFX9JPB2GJJ> |
| WEBZY Standard Pro | **1,290€** | <https://www.paypal.com/ncp/payment/K9H7PBU6E4EPU> |
| WEBZY Standard Store | **1,790€** | <https://www.paypal.com/ncp/payment/FN9A47P9P8AKC> |

Each card ends with a black, white-text anchor reading **“💳 Paguaj me Kartelë - 490€ / 790€ / 1,290€ / 1,790€”**. The links use `target="_blank"` and `rel="noopener noreferrer"`; an `.sr-only` note tells screen-reader users that PayPal opens in a new tab.

### Fixed pricing

The amount is defined inside each PayPal payment link. It is **not** an editable checkout field, so the customer cannot change the price. If a package price changes, create or update the corresponding PayPal link first, then update both the visible amount and the `href` in `index.html` — the two must always agree.

Payment buttons are plain anchors, not a checkout integration. No cart, order state or payment confirmation is handled by this website. Do not describe a package as purchased until PayPal confirms the transaction.

### Payment disclosures

Because payments leave the site, `privacy.html` documents that:

- PayPal processes card and payment data under its own privacy statement;
- WEBZY does not receive or store full card numbers;
- the package and amount are fixed in the payment link and are reviewable before confirmation;
- external Instagram and PayPal links are governed by those services' own policies.

Keep these disclosures aligned with the live PayPal configuration. If a different payment provider is introduced, update the pricing section, this README and the privacy page together.

The supporting address **`webzysite@hotmail.com`** appears directly below the packages and is generated from `config.js`, so it stays in sync with the rest of the site.

---

## 5. Inquiry form and FormSubmit

The contact form POSTs to the FormSubmit AJAX endpoint:

```text
https://formsubmit.co/ajax/webzysite@hotmail.com
```

The endpoint is stored as `formEndpoint` in `assets/js/config.js`. FormSubmit forwards accepted submissions to **`webzysite@hotmail.com`** (Outlook/Hotmail). The visitor's email address is sent in the `email` field, which FormSubmit uses as the reply-to address.

### One-time activation

FormSubmit requires the recipient to confirm the address before submissions are delivered. The first POST triggered an activation email to `webzysite@hotmail.com`. Open that email, click the **Activate Form** link, then submit the form again. Until activation is complete, FormSubmit returns HTTP 200 with `success: "false"` and the form shows an activation notice instead of a success message.

After activation, FormSubmit may issue a random alias that can replace the plain email in the endpoint. If an alias is provided, put it in `formEndpoint` so the address is not exposed in source.

### Success state

After FormSubmit returns `success: "true"`, the form shows:

> **Faleminderit!** Mesazhi u dërgua me sukses. Do të ju kontaktoj brenda 24 orëve.

The success state is never shown for a failed request. FormSubmit can return HTTP 200 with `success: "false"`; the form checks the JSON flag, so activation requirements, rejected submissions and network failures all produce an error or setup notice instead of a false confirmation.

### What is sent

```text
name, email, business, websiteType, budget, description, consent,
_subject, page, submittedAt
```

`_gotcha` is a honeypot and is removed before sending. `_captcha=false` disables FormSubmit's CAPTCHA so AJAX submissions work, and `_template=table` formats the notification email. The form records the visitor's consent choice, the page URL and an ISO submission timestamp. `formFormat` remains `"formdata"`.

### Changing the endpoint

1. Use the FormSubmit activation email or account tools to obtain the confirmed endpoint or alias.
2. Replace `formEndpoint` in `assets/js/config.js`.
3. Keep the form field names unchanged so the notification email remains readable.
4. Publish, submit a real inquiry and confirm it arrives with a working reply-to address.
5. Test a failure case (temporarily use an invalid endpoint) and confirm the error message appears.

### CORS and static hosting

FormSubmit's AJAX endpoint sends `Access-Control-Allow-Origin: *` and accepts cross-origin form posts from static sites. Test from the deployed HTTPS origin as well as `127.0.0.1`; some providers apply different spam rules to production traffic.

### Spam

The build includes a hidden honeypot and disables CAPTCHA for AJAX. FormSubmit applies its own spam filtering, but consider enabling reCAPTCHA or rate limiting if the form is abused. Client-side validation is a usability aid, not a security boundary.

---

## 6. Privacy page

`privacy.html` is a general, plain-language policy covering the inquiry form and the PayPal-paid packages. It explains:

- what the form collects and why;
- that FormSubmit processes the inquiry and forwards it to WEBZY's Outlook/Hotmail inbox, and that this website does not store submissions;
- that package payments are completed on PayPal, which processes the card and transaction data, and that WEBZY does not receive full card numbers;
- hosting logs, providers, retention, cookies, external Instagram and PayPal links, and rights;
- security, children, changes and contact.

**It is not legal advice.** Before publishing:

1. Confirm the Instagram profile `@webzysite` is live and publicly reachable.
2. Confirm FormSubmit's provider name, privacy-policy link and processing details still match the live form.
3. Confirm the retention wording matches the operator's actual practice.
4. Add the legal entity name and jurisdiction if required locally.
5. Confirm the PayPal business account and the privacy statement link match the live payment setup.
6. Have the final policy reviewed where appropriate.

The policy states that this website does not store inquiries; FormSubmit handles each submission and forwards it to the Outlook/Hotmail inbox. Re-check that wording whenever the form provider changes, and re-check the payment section whenever the packages, prices or payment provider change.

---

## 7. Social metadata and SEO

- Every page has a unique `<title>`, meta description, one `<h1>`, Open Graph and Twitter card metadata.
- `assets/img/og-cover.jpg` is the homepage card; each case study has its own **1200 × 630 JPEG** card (`og-restaurant.jpg`, `og-automotive.jpg`, etc.).
- Social images and canonical links are **relative** in this local build. Social scrapers require absolute URLs, so after the domain is live:
  - add `<link rel="canonical" href="https://your-domain/">` to each page;
  - change `og:image` / `twitter:image` to absolute URLs;
  - add the production domain to `robots.txt` with a `Sitemap:` line if a sitemap is published.
- The 404 page is intentionally `noindex` and uses root-relative paths. Deploy it at a **domain root**. If the site lives in a subfolder, rewrite those paths.
- No analytics, pixels, cookies or third-party embeds are included.

---

## 8. Deployment

The site is plain HTML/CSS/JS and can be deployed to any static host.

### Netlify

1. Drag the `WEBZY` folder into Netlify, or connect its repository.
2. No build command; publish directory is the project root.
3. `404.html` is picked up automatically as the custom error page.
4. Add the custom domain and HTTPS.

### Vercel

1. Import the folder/repository as a static project.
2. Framework preset: **Other**; no build command; output directory `.`.
3. Add the domain; `404.html` is used for missing routes.

### Cloudflare Pages / GitHub Pages

- Upload/publish the folder as static assets.
- Cloudflare Pages uses `404.html` automatically.
- GitHub Pages serves `404.html` for missing paths; root-relative links require a custom domain or a repository root deployment.
- Ensure `.webp`, `.woff2`, `.jpg` and `.png` are served with the correct MIME types. All common static hosts do this by default.

### Caching (optional)

Fingerprinted assets are not used, so keep caching conservative:

```text
HTML            → no-cache or short max-age
/assets/img/*   → long max-age
/assets/fonts/* → long max-age, immutable
/assets/css/*   → short max-age or revalidate
/assets/js/*    → short max-age or revalidate
```

If you add a CDN cache rule, purge it after editing `config.js`, CSS or HTML.

---

## 9. Content integrity

- All six portfolio pieces are clearly labelled **Concept Project** and described as self-initiated design studies.
- Brands, menus, products and scenarios inside the mockups are fictional.
- There are no invented clients, testimonials, results, statistics, team members, offices, company history or credentials.
- The contact page does not claim response times that have not been agreed.
- Service descriptions are capability descriptions, not performance guarantees.
- Package contents, prices and maintenance periods are fixed commitments; confirm them against the live PayPal links before publishing.

Keep these disclosures if the work section is expanded. If real client work is added later, label it separately and obtain permission for names, logos and imagery.

---

## 10. Photography, fonts and logo

### Photography

Concept imagery is licensed stock photography from **Pexels** and **Unsplash**, used as illustrative art direction rather than client work. Neither licence requires individual attribution; known credits are recorded here for reference:

- `auto-01` — Julius Weidenauer, Pexels #14487132
- `auto-02` — ClickerHappy, Pexels #9378
- `photo-02` — Creation Hill, Pexels #1681010
- `shop-02` — Kaboompics, Pexels #6952333

Other images are from the same stock libraries. Before replacing or redistributing an image outside this site, check the source licence and model/property releases where relevant.

### Fonts

Self-hosted, licensed under the **SIL Open Font License 1.1**:

- Instrument Sans
- Instrument Serif
- JetBrains Mono

The licence text and notices are in `assets/fonts/OFL.txt`. The WOFF2 files are subset to Latin and may not contain every glyph or language; check before localising the site.

### Logo

The WEBZY logo was processed from the supplied original into transparent PNG assets:

- `webzy-logo.png` — stacked full logo
- `webzy-mark.png` — symbol only
- `webzy-wordmark.png` — wordmark only
- `favicon-48/96/192/512.png`, `apple-touch-icon.png`, `/favicon.ico`, `/site.webmanifest` — browser, Google Search and app icons (Google needs a square multiple of 48px)

Shapes, proportions and letterforms were preserved. Keep the supplied original as the brand master.

---

## 11. Accessibility and QA

The build targets **WCAG 2.1 AA**:

- semantic landmarks, skip link and a single `<h1>` per page;
- visible focus styles and full keyboard operation;
- accessible mobile menu with focus trap, Escape to close and focus return;
- form labels, descriptions, inline errors, `aria-invalid`, `aria-busy` and a focusable status region;
- contrast-checked colours, readable type sizes and responsive reflow;
- descriptive alt text, decorative images marked empty, lazy loading below the fold;
- `prefers-reduced-motion` support: reveals become visible, parallax and transitions are disabled, scrolling is instant.

QA performed on the nine pages:

- link and fragment checker: no missing local targets, fragments, duplicate IDs, extra `<h1>`s or alt/button issues;
- responsive checks at **320, 390, 768, 1024 and 1440 px**: no horizontal overflow, one `<h1>` per page, meta descriptions present;
- axe-core: **0 violations** at 1440 and 390 across all nine pages;
- form tests: empty fields, invalid email, stubbed JSON success with the exact Albanian message, stubbed JSON rejection, payload keys; the live FormSubmit endpoint returned its activation notice (no false success);
- mobile menu tests: open/close, focus trap, Escape and focus return — including the Pricing item;
- reduced-motion tests: all content visible, animations disabled;
- pricing checks: all four cards in order after Selected Work, exact visible button labels, exact PayPal URLs, `target="_blank"`, `rel="noopener noreferrer"`, black background with white text, highlighted Standard Biznes card and email strip;
- privacy checks: payment and form metadata, FormSubmit and PayPal disclosures, external privacy links and the live business email.

Visual review covered the pricing section at **320, 390 and 1440 px**, plus the privacy page and 404 page at desktop and mobile sizes. No console errors, failed requests or missing assets were observed.

Re-run these checks after changing copy, config, CSS, pricing or form markup.

---

## 12. Browser support

Current and previous major versions of Chrome, Edge, Firefox and Safari; iOS Safari and Android Chrome. The site uses modern CSS (`clamp()`, custom properties, `aspect-ratio`, `backdrop-filter`) with graceful degradation where possible. JavaScript is progressive: content remains readable if scripts fail, but the mobile menu and form require JS.

---

## 13. Known limitations

- **Form delivery depends on FormSubmit.** One-time activation is required, and no backend is bundled. If the endpoint is unavailable, the form shows an error and offers the direct email address.
- **Payments are handled entirely by PayPal.** No cart, order state or on-site checkout is bundled; package prices and payment links must be kept in sync manually.
- **Social/canonical URLs are relative** until a domain is set.
- **Privacy text is a template**, not jurisdiction-specific legal advice.
- **404 paths assume domain-root deployment.**
- **No CMS.** Copy is edited directly in HTML and `config.js`.
- **Concept work only.** No real client results are claimed.

---

## 14. Credits

Design and build: WEBZY. Photography: Pexels / Unsplash contributors. Type: Instrument Sans and Instrument Serif by Instrument, JetBrains Mono by JetBrains, under the SIL OFL. Logo: supplied WEBZY original.
