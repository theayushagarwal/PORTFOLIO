import fs from "fs";
import path from "path";

const sitemapPath = path.resolve("public/sitemap.xml");
const sitemapPagesPath = path.resolve("public/sitemap-pages.xml");
const rssPath = path.resolve("public/rss.xml");
const now = new Date();
const currentDate = now.toISOString().split("T")[0];
const rfcDate = now.toUTCString();

const routes = [
  { loc: "https://theayush.pages.dev/", changefreq: "weekly", priority: "1.0" },
  { loc: "https://theayush.pages.dev/projects/vurlo", changefreq: "monthly", priority: "0.8" },
  { loc: "https://theayush.pages.dev/projects/carrel", changefreq: "monthly", priority: "0.8" },
  { loc: "https://theayush.pages.dev/projects/aegisflow", changefreq: "monthly", priority: "0.8" },
  { loc: "https://theayush.pages.dev/projects/chronosync", changefreq: "monthly", priority: "0.8" },
  { loc: "https://theayush.pages.dev/projects/veltrix", changefreq: "monthly", priority: "0.8" },
  { loc: "https://theayush.pages.dev/projects/vcentre", changefreq: "monthly", priority: "0.8" },
];

const urlEntries = routes
  .map(
    (r) => `  <url>
    <loc>${r.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join("\n");

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getPublicFileBytes(fileName) {
  try {
    return fs.statSync(path.resolve("public", fileName)).size;
  } catch {
    return 0;
  }
}

const rssItems = [
  {
    title: "Carrel — Real-Time Collaborative Workspace With 1-Byte WebSocket Multiplexing",
    link: "https://theayush.pages.dev/projects/carrel",
    pubDate: "Wed, 25 Nov 2026 09:00:00 GMT",
    imageFile: "carrel-preview.webp",
    categories: ["TypeScript", "Yjs CRDT", "WebSockets", "Fastify"],
    description:
      "3-package TypeScript monorepo collaborative editor multiplexing Yjs CRDT binary sync, awareness, and JSON control frames over a single WebSocket, with HMAC upgrade tickets, concurrency-4 async scrypt throttling, 5000ms host grace succession, and CodeMirror 6.",
    highlights: [
      "1-byte binary WebSocket multiplexing (sync frame 0, awareness frame 1, JSON control frame 2)",
      "Single-use nonce HMAC tickets + concurrency-4 async scrypt rate limiting",
      "Deterministic 5000ms host grace succession & CodeMirror 6 with 80ms lerped remote carets",
    ],
  },
  {
    title: "AegisFlow — Cutting Cluster Deadline Misses by 87% With a 0.64 ms/step Bayesian HMM",
    link: "https://theayush.pages.dev/projects/aegisflow",
    pubDate: "Tue, 24 Nov 2026 09:00:00 GMT",
    imageFile: "portfolio-preview.webp",
    categories: ["Python", "Bayesian Inference", "Distributed Systems"],
    description:
      "Zero-dependency pure Python cluster scheduler inferring latent node health via an Exact 3-state Bayesian HMM (99.58% accuracy, 0.000% false condemnations), analytical triage gating (-87% deadline misses, 98.3% on-time rate), cold-restart EV barriers (0.00 churn), and 31/31 passing invariants.",
    highlights: [
      "Exact 3-state Bayesian HMM detecting node degradation in 0.13–0.35 steps (99.58% accuracy)",
      "87% reduction in deadline misses (98.3% on-time completion) & 96% of theoretical Oracle ceiling",
      "Cold-restart expected-value barrier guaranteeing 0.00 unnecessary migrations at 0.64 ms/step",
    ],
  },
  {
    title: "Chronosync — Autonomous FastAPI + Playwright Web Monitor & Visual Regression Diff Studio",
    link: "https://theayush.pages.dev/projects/chronosync",
    pubDate: "Mon, 23 Nov 2026 09:00:00 GMT",
    imageFile: "portfolio-preview.webp",
    categories: ["Python", "FastAPI", "Playwright", "Visual Regression"],
    description:
      "Headless Playwright web monitoring engine with canonical URL deduplication (pages vs watches), outage/CAPTCHA classification, 4-layer dynamic noise suppression with 2-check persistence, interactive Diff Studio (swipe slider, pixel heatmap, SVG price history), and 29 automated tests.",
    highlights: [
      "URL normalization & pages-vs-watches split (1 scheduled fetch for N subscribers)",
      "Outage & CAPTCHA gating before diffing + 4-layer dynamic noise suppression",
      "Interactive Visual Diff Studio (swipe slider, pixel heatmap, unified diff) & 29 tests in ~1.5s",
    ],
  },
  {
    title: "Vurlo — Full-Stack E-Commerce SaaS With Atomic Firestore Stock Locking",
    link: "https://theayush.pages.dev/projects/vurlo",
    pubDate: "Sun, 19 Jul 2026 09:00:00 GMT",
    imageFile: "vurlo-preview.webp",
    categories: ["React 19", "TanStack Start", "Firebase", "E-Commerce"],
    description:
      "Production e-commerce SaaS platform built solo in 10 days with atomic Firestore stock-locking transactions, Razorpay HMAC-SHA256 verification, multi-point payment rollbacks, and 100/100 Lighthouse SEO.",
    highlights: [
      "Atomic Firestore check-and-decrement transactions eliminating checkout race conditions",
      "Server-side Razorpay HMAC-SHA256 verification with multi-point rollback handlers",
      "100/100 Lighthouse SEO & sub-400ms SSR load latency built solo in 10 days",
    ],
  },
  {
    title: "Veltrix — Autonomous Multi-Model Adversarial AI Social Engine",
    link: "https://theayush.pages.dev/projects/veltrix",
    pubDate: "Thu, 16 Jul 2026 09:00:00 GMT",
    imageFile: "veltrix-preview.webp",
    categories: ["Python", "AI Agents", "Multi-Model Consensus", "Playwright"],
    description:
      "Autonomous publishing pipeline orchestrating 18+ APIs with dual independent LLM audits (Groq + Cerebras) gating Gemini copywriting, statistically adaptive embedding deduplication, and headless Playwright 4K rendering at ~$0.0002/post.",
    highlights: [
      "Adversarial dual-vendor LLM audit gate (Groq + Cerebras) before Gemini copywriting",
      "Adaptive embedding similarity deduplication & 30-minute human review checkpoint",
      "Jinja2 + headless Playwright 4K carousel rendering at ~$0.0002/post",
    ],
  },
  {
    title: "Vcentre — Competitor Intelligence Pipeline With Cohort Baselines & 10-Provider LLM Chain",
    link: "https://theayush.pages.dev/projects/vcentre",
    pubDate: "Tue, 14 Jul 2026 09:00:00 GMT",
    imageFile: "vcentre-preview.webp",
    categories: ["Python", "FastAPI", "SQLite", "Analytics"],
    description:
      "Nightly competitor intelligence crawler splitting Reels and Photos into isolated cohort baselines, gating outliers at 3x median, routing via a 10-provider LLM fallback chain, and feeding closed-loop briefs into SQLite/Supabase.",
    highlights: [
      "Format-isolated cohort medians (Reels vs Photos) with 3x-median outlier gate",
      "12-hour scrape cooldown + 2-hit/24h circuit breaker protecting Apify credits",
      "10-provider LLM fallback chain outputting structured creative briefs nightly",
    ],
  },
];

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Ayush Agarwal — Systems &amp; Agent Engineering Case Studies</title>
    <link>https://theayush.pages.dev/</link>
    <description>Deep-dive technical case studies on distributed systems, CRDT workspaces, Bayesian schedulers, visual regression tooling, and multi-model AI pipelines by Ayush Agarwal (VIT Vellore Class of 2030).</description>
    <language>en-us</language>
    <lastBuildDate>${rfcDate}</lastBuildDate>
    <atom:link href="https://theayush.pages.dev/rss.xml" rel="self" type="application/rss+xml" />
${rssItems
  .map((item) => {
    const imageUrl = `https://theayush.pages.dev/${item.imageFile}`;
    const byteLength = getPublicFileBytes(item.imageFile);
    const htmlContent = `<p><img src="${imageUrl}" alt="${escapeXml(item.title)}" /></p><p>${escapeXml(item.description)}</p><ul>${item.highlights.map((h) => `<li>${escapeXml(h)}</li>`).join("")}</ul><p><a href="${item.link}">Read the full interactive case study on theayush.pages.dev</a></p>`;

    return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <author>theayush.codes@gmail.com (Ayush Agarwal)</author>
      <description>${escapeXml(item.description)}</description>
      <content:encoded><![CDATA[${htmlContent}]]></content:encoded>
      <media:content url="${imageUrl}" medium="image" type="image/webp" />
${byteLength > 0 ? `      <enclosure url="${imageUrl}" length="${byteLength}" type="image/webp" />\n` : ""}${item.categories.map((c) => `      <category>${escapeXml(c)}</category>`).join("\n")}
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>
`;

fs.writeFileSync(sitemapPath, sitemapContent, "utf8");
fs.writeFileSync(sitemapPagesPath, sitemapContent, "utf8");
fs.writeFileSync(rssPath, rssXml, "utf8");
console.log(`Updated sitemap.xml, sitemap-pages.xml, and rss.xml with lastmod date: ${currentDate}`);
