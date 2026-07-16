# Ayush Agarwal — Systems & Agent Engineer

High-performance AI agent architectures, e-commerce SaaS engines, and interactive web platforms.

[![Website](https://img.shields.io/badge/Website-theayush.pages.dev-blue?style=flat-square)](https://theayush.pages.dev/)
[![Lighthouse SEO](https://img.shields.io/badge/Lighthouse--SEO-100%2F100-success?style=flat-square)](https://theayush.pages.dev/)
[![Schema.org](https://img.shields.io/badge/Schema.org-Valid-success?style=flat-square)](https://validator.schema.org/#url=https%3A%2F%2Ftheayush.pages.dev%2F)

---

## ⚡ Technical Highlights of this Portfolio

This repository isn't just a static resume page — it is a production-grade **TanStack Start (React 19)** application implementing advanced search optimization, accessibility, and high-density interface design:

- **Full Server-Side Rendering (SSR)**: Case study layouts are fully hydrated and persistent in the raw HTML payload for search engines and AI scrapers to crawl, while rendering a premium loading/boot sequence for humans.
* **Spec-Compliant Entity Graphs**: 100% warnings-and-error-free Schema.org JSON-LD graph linking `Person`, `WebSite`, `FAQPage`, and `SoftwareSourceCode` entities.
* **AI Engine Optimization (GEO)**: 
  - Complete custom `/llms.txt` file configured to feed structured markdown data to training models.
  - Explicit user-agent allow rules for `GPTBot`, `ClaudeBot`, `PerplexityBot`, and `Google-Extended` in `robots.txt`.
* **Automated Asset Pipelines**: Dynamic sitemap (`sitemap.xml`) generation at compile time via node scripts mapping lastmod dates and image nodes.
* **Premium UX/UI**: Immersive glassmorphic components, SVG Lighthouse dials, mouse-tracking spotlights, and reactive positional audio feedback.

---

## 🛠️ The Tech Stack

- **Frontend & Routing**: React 19, TanStack Start (SSR), TanStack Router, TypeScript.
- **Styling & Animation**: Tailwind CSS, Framer Motion, Vanilla CSS variables.
- **Backend & AI Integrations**: Python, Go, Gemini API, Groq, Cerebras, Playwright, Jinja2, Firebase Admin, Supabase, SQLite.

---

## 📂 Shipped Projects Detailed Inside

### 1. [Vurlo (Full-Stack E-commerce SaaS)](https://theayush.pages.dev/projects/vurlo)
* **Code Repository**: [theayushagarwal/vurlo-ecommerce](https://github.com/theayushagarwal/vurlo-ecommerce)
* **Architecture**: Implements atomic Firestore transaction rules preventing inventory race conditions. Includes automated payment SDK abort fallbacks, server-side HMAC-SHA256 verification, and a Gemini-powered recommendation feed.

### 2. [Veltrix (Autonomous Social Media Engine)](https://theayush.pages.dev/projects/veltrix)
* **Architecture**: A pipeline that generates, reviews, and schedules visual content. Gemini Flash drafts drafts; Groq (Llama) and Cerebras act as adversarial consensus reviewers. Slide rendering is dynamically generated using Jinja2 templates inside headless Playwright instances.

### 3. [Vcentre (Competitor Intelligence Scraper)](https://theayush.pages.dev/projects/vcentre)
* **Architecture**: Scrapes competitor engagement data, normalizes outlier metrics against cohort-specific medians (Reels vs. Photos), and routes high-engagement content briefs to copy generation pipelines using a 10-provider LLM fallback chain.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Install dependencies
```bash
npm install
# or
bun install
```

### Development server
```bash
npm run dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) to view the development server.

### Build for production
```bash
npm run build
```
The output will be built inside the `.output/` folder, configured out-of-the-box for Cloudflare Pages/Workers deployment.
