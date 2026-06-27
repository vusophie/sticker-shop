# Sticker Shop — Full-Stack Implementation Plan

A step-by-step plan to design, build, secure, and ship a sticker e-commerce site, written for someone who knows UI development and is leveling up into full-stack + DevSecOps.

---

## 0. Two corrections before we start

**React Native → Next.js.** React Native builds native iOS/Android apps, not websites — there's no "hosting a React Native app online" the way you'd host a site. For the web storefront, you want **Next.js**, which is React for the web. The good news: the React component knowledge transfers almost entirely. (If you want a mobile app *later*, React Native becomes the right tool — and at that point you could even reuse your business logic. But it's a separate project, not this one.)

**"Cheapest possible" and "Kubernetes" pull in different directions.** Running Kubernetes 24/7 for a low-traffic store isn't actually cheap — even Google's GKE free tier only waives the cluster *management* fee; you still pay for the compute nodes underneath it, generally somewhere around $5–15/month minimum for the smallest viable setup, and that can climb if you forget to scale things down. So this plan splits the difference:

- **Production hosting** uses serverless/managed platforms (Cloudflare Pages, Cloud Run or Render) that scale to zero and cost effectively nothing at your traffic level. This is what real customers hit.
- **Kubernetes** shows up as a deliberate **learning + portfolio track**: you'll containerize the backend with Docker (which you need anyway) and deploy it to a local cluster (kind/k3d/minikube — completely free, runs on your laptop) with real Deployment/Service/Ingress manifests you can show in your portfolio repo and write about. If you want a cloud K8s deployment for a demo video or screenshots, spin up a single GKE Autopilot cluster, capture what you need, and tear it down — that keeps the cost near-zero instead of an always-on bill.

This isn't a downgrade of your goals — it's the difference between "I ran Kubernetes once and it cost me $80" and "I understand why production doesn't need it yet, and I can speak to that tradeoff in an interview," which is actually the more senior answer.

---

## 1. Recommended stack

| Layer | Tool | Why | Cost |
|---|---|---|---|
| Frontend framework | Next.js (React) + TypeScript | Industry-standard, huge ecosystem, great accessibility primitives | Free (open source) |
| Styling | Tailwind CSS | Fast to build an accessible, consistent design system | Free |
| Frontend hosting | **Cloudflare Pages** | Free tier explicitly allows commercial/revenue use, unlimited bandwidth, free SSL | $0 |
| Backend | Node.js + Express + TypeScript | Matches your existing Node experience; simple, well-documented | Free |
| ORM | Prisma | Type-safe SQL, makes Postgres approachable, prevents SQL-injection by construction | Free |
| Database | **Neon Postgres** | Generous free tier, scale-to-zero, branching (great for testing schema changes safely) | $0 to start |
| File/image storage | **Cloudflare R2** | S3-compatible, 10GB free, **zero egress fees** (this matters — most providers charge to serve images out) | $0 to start |
| Backend hosting | **Render** (simplest) or **Google Cloud Run** (more "real" serverless, no sleep weirdness) | Both run your Docker image directly; pick Render first for simplicity, move to Cloud Run once you want to practice GCP | $0 to start |
| Payments | **Stripe Checkout** (hosted page) | Stripe hosts the actual card entry form, so card data never touches your server — this is the single biggest security win available to you | No monthly fee; ~2.9% + $0.30 CAD per sale |
| Containerization | Docker | Required learning goal; also makes Render/Cloud Run/K8s deploys consistent | Free |
| Orchestration (learning) | Kubernetes via kind/k3d locally, optional GKE Autopilot for a demo | Portfolio/learning goal, kept separate from production cost | $0 locally |
| CI/CD | GitHub Actions | Free for public repos, generous free minutes for private | $0 |
| Error monitoring | Sentry (free tier) | Tells you when something breaks in production before a customer does | $0 |
| Uptime monitoring | UptimeRobot (free tier) | Pings your site, alerts you if it goes down | $0 |

**One important caveat:** Vercel's free Hobby tier is excellent for Next.js but is explicitly **non-commercial only** per their terms — a store taking real payments doesn't qualify. That's why Cloudflare Pages is the recommendation above. If you'd rather use Vercel for its Next.js-specific polish, that's fine too, just budget for Pro ($20/month) once you take it live.

---

## 2. Data model (sketch)

You'll want roughly these Postgres tables (Prisma will generate the SQL from a schema file, you won't hand-write DDL):

- `Product` — id, name, description, price_cents, image_url, is_active
- `ProductVariant` (optional) — size/finish options per product, stock_count
- `Order` — id, stripe_session_id, status, total_cents, email, created_at
- `OrderItem` — order_id, product_id, quantity, price_cents_at_purchase

Keep `price_cents` (integers) rather than floats — this avoids classic floating-point rounding bugs in money math.

---

## 3. Phased build plan

### Phase 0 — Accounts & repo setup
- Create accounts: GitHub, Cloudflare, Render, Neon, Stripe (test mode first, no real business details needed yet)
- `npx create-next-app@latest` for the frontend, plain `npm init` + Express scaffold for the backend
- One GitHub repo with `/frontend` and `/backend` folders (a "monorepo" — keeps related code together, simpler for a solo project)
- Set up `.gitignore` properly from day one — `.env`, `node_modules`, secrets never get committed

### Phase 1 — Design & content
- Wireframe the core pages: home/catalog, product detail, cart, checkout success/cancel
- Pick an accessible color palette — check contrast ratios (4.5:1 minimum for normal text) before you commit to colors
- Photograph/design your stickers, prep optimized images (WebP, multiple sizes)

### Phase 2 — Backend foundation
- Express + TypeScript scaffold
- Prisma schema + connect to Neon (free tier, no credit card)
- Build read endpoints first: `GET /api/products`, `GET /api/products/:id`
- Write Jest tests for these as you go, not after

### Phase 3 — Frontend foundation
- Build the catalog and product pages against your real API (not mock data — catching integration issues early is cheaper than catching them in Phase 9)
- Cart state: React Context or Zustand (lighter than Redux for a project this size)
- Every interactive element keyboard-operable from the start — it's much harder to retrofit later

### Phase 4 — Payments (the part you're trusting Stripe with, not yourself)
- Use **Stripe Checkout**, not Stripe Elements — Checkout is Stripe's fully hosted payment page. You redirect the customer to Stripe, they pay there, Stripe redirects back. Your server never sees a card number, which removes the vast majority of payment-related security burden (formally: it keeps you in PCI SAQ-A, the lightest compliance tier).
- Backend creates a Checkout Session server-side (`POST /api/checkout-session`) with your product/price data — never trust a price sent from the browser.
- Set up a **Stripe webhook** endpoint (`POST /api/webhooks/stripe`) so Stripe tells your server when payment actually succeeds — this is how you mark an order paid and decrement inventory, not the client-side redirect (which a user could fake by just navigating to the success URL).
- Build and test this entirely in **Stripe test mode** with test card numbers before going anywhere near live keys.

### Phase 5 — Accessibility pass
- Run automated checks: axe DevTools browser extension, or `@axe-core/playwright` in CI
- Manually tab through the entire purchase flow with no mouse
- Check every image has meaningful alt text (or `alt=""` if purely decorative)
- Test with a screen reader at least once (VoiceOver on Mac, NVDA on Windows — both free) — you already have real accessibility experience from your job, this is the same discipline applied to your own product

### Phase 6 — Containerize the backend
- Write a multi-stage Dockerfile (build stage compiles TypeScript, runtime stage is small and doesn't include dev dependencies)
- Run the container as a **non-root user** — a surprising number of real-world container compromises rely on root-by-default images
- Add a `.dockerignore` (node_modules, .env, .git)

### Phase 7 — Kubernetes (learning track)
- Install kind or k3d locally (lightweight local Kubernetes, free, runs as a Docker container itself)
- Write a Deployment manifest for your backend image, a Service to expose it, and optionally an Ingress
- Deploy locally, `kubectl port-forward` to confirm it works, screenshot/record it for your portfolio
- Optional stretch: spin up GKE Autopilot, deploy the same manifests, take it down when done — this gives you "real cloud Kubernetes" experience without an ongoing bill

### Phase 8 — CI/CD pipeline
GitHub Actions workflow that runs on every push:
1. Install deps, lint, type-check
2. Run Jest tests
3. Build the Docker image
4. **Scan the image for known vulnerabilities** (Trivy — free, open source) — fail the build on critical findings
5. `npm audit` for dependency vulnerabilities; enable GitHub Dependabot alerts on the repo too
6. On merge to main: deploy frontend to Cloudflare Pages, backend to Render/Cloud Run

### Phase 9 — Go live
- Buy a domain (cheapest registrars run ~$10–15/year — this is realistically the only thing in this whole stack you can't get to $0)
- Point DNS through Cloudflare (free, gives you their CDN + basic DDoS protection + WAF for the whole site automatically)
- Switch Stripe from test mode to live mode, update environment variables
- Do one real test purchase yourself, with a real card, for a small/refundable amount

### Phase 10 — Security hardening pass
See the dedicated checklist below — work through it before Phase 9 if you can, but definitely before real traffic.

### Phase 11 — Monitoring
- Sentry for error tracking (free tier is enough for a personal project)
- UptimeRobot pinging your site every few minutes, free, emails you if it's down

### Phase 12 — Portfolio polish
- README with the architecture diagram, the decisions you made and why (the tradeoffs in this doc are exactly the kind of thing to write up — "here's why I didn't run Kubernetes in production" is a more impressive sentence than it sounds)
- Short write-up of your security approach specifically, since that's a differentiator most portfolio projects skip entirely

---

## 4. Security & DevSecOps checklist

This is your stated top concern, so treat this section as the one to revisit most often.

**Application layer**
- [ ] Validate and sanitize every input, client *and* server side (use a schema library like `zod` on both ends so you write the validation rules once and share the types)
- [ ] Never trust client-sent prices/totals — always recompute from your database on the server before creating a Stripe Checkout Session
- [ ] Use Prisma (or any ORM) for all database queries — never string-concatenate SQL, which is how SQL injection happens
- [ ] Add `helmet.js` to Express for sensible default security headers (clickjacking protection, etc.)
- [ ] Lock CORS to your actual frontend domain only — don't leave it wide open to `*`
- [ ] Rate-limit your API (`express-rate-limit`) — blunts brute-force and scraping attempts cheaply

**Secrets & infrastructure**
- [ ] `.env` files never committed — ever. Use `.env.example` with dummy values for documentation.
- [ ] Real secrets live in GitHub Actions secrets / Render or Cloud Run environment variables, not in code
- [ ] Separate Stripe **test** and **live** API keys, and make it structurally hard to mix them up (e.g. different env files per environment)
- [ ] Docker images run as a non-root user; use a minimal base image (`node:alpine`)
- [ ] Scan container images for vulnerabilities in CI (Trivy) before they ever deploy
- [ ] Keep dependencies patched — Dependabot alerts on, review and merge security PRs promptly

**Payments**
- [ ] Card data never touches your server — Stripe Checkout's hosted page handles it
- [ ] Order status is only ever confirmed via the Stripe **webhook**, never via the browser redirect alone
- [ ] Verify the webhook signature (Stripe gives you a signing secret for exactly this — it proves the request really came from Stripe)

**Network & platform**
- [ ] HTTPS everywhere — Cloudflare, Render, and Cloud Run all provision this automatically, you shouldn't need to touch a certificate
- [ ] Run the whole site through Cloudflare's proxy for free DDoS mitigation and a basic WAF
- [ ] Don't expose your database to the public internet — connect only from your backend's private network/connection string

**Process**
- [ ] Run a free OWASP ZAP baseline scan against your staging site before launch
- [ ] Don't log secrets, full card numbers, or full customer PII to your error monitor
- [ ] Have a backup of your database (Neon supports point-in-time recovery on paid tiers; for free tier, schedule a periodic `pg_dump` somewhere safe)

You won't need user accounts/login for v1 — guest checkout via Stripe is simpler, and **every account system you don't build is an entire category of attack surface you don't have to defend.** Add an admin-only login later, scoped narrowly to just you managing inventory.

---

## 5. Accessibility (WCAG) checklist

You already do this professionally, so this is mostly "apply your day job to your own project":

- [ ] Semantic HTML throughout (`<nav>`, `<main>`, `<button>` not `<div onclick>`)
- [ ] Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text/UI components
- [ ] Every interactive element reachable and operable by keyboard alone, with a visible focus state
- [ ] All form fields have associated `<label>`s; errors announced via `aria-describedby`
- [ ] All meaningful images have alt text; decorative images have `alt=""`
- [ ] Skip-to-content link for keyboard users
- [ ] Respect `prefers-reduced-motion` for any animation
- [ ] Automated testing in CI (axe-core) so regressions get caught before merge, not after launch

---

## 6. Realistic cost summary

| Item | Cost |
|---|---|
| Frontend hosting (Cloudflare Pages) | $0 |
| Backend hosting (Render free tier) | $0 (sleeps after 15 min idle — fine for low traffic; upgrade to $7/mo Starter later if you want always-on) |
| Database (Neon free tier) | $0 |
| Image storage (Cloudflare R2) | $0 (under 10GB) |
| Local Kubernetes learning | $0 |
| Domain name | ~$10–15/year |
| Stripe | $0 fixed, ~2.9% + $0.30 CAD per sale |
| **Total to launch** | **~$1/month**, realistically just the domain |

---

## 7. Suggested learning order

If a tool above is new to you, this is roughly the order that builds on itself best::
1. TypeScript fundamentals (if not already comfortable)
2. Next.js basics (you already know React, this is mostly routing/data-fetching conventions)
3. Express + REST API basics
4. Prisma + Postgres
5. Stripe Checkout integration (their docs and quickstart are genuinely excellent)
6. Docker fundamentals (build, run, multi-stage builds)
7. GitHub Actions basics
8. Kubernetes basics (kind/k3d locally) — last, since it depends on everything above already working in a container

Good luck — this is a genuinely solid portfolio piece because it touches frontend, backend, data, payments, containers, CI/CD, and security all in one coherent project. That breadth is exactly what a full-stack interview wants to see.