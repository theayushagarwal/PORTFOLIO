/**
 * Content model.
 * Kept separate from presentation so components stay pure/reusable
 * and copy can be edited without touching layout code.
 */

export const PROFILE = {
  name: "Ayush Agarwal",
  role: "Systems & Agent Engineer",
  location: "Vellore, IN",
  status: "17-year-old developer crafting high-fidelity products & interfaces",
  tagline: "Autonomous pipelines. Commerce engines. Interfaces that feel alive.",
  headline: {
    line1: "Building systems that ship.",
    line2: "Agents that work. Products",
    accent: "that scale.",
  },
  pitch:
    "I'm a developer and designer specialized in high-performance e-commerce engines, multi-model AI agent pipelines, and interfaces polished enough to ship.",
  bio: [
    "I'm 17, based in India, and I've spent the last year building things that were probably too ambitious for my age — a full ecommerce SaaS (vurlo.store) with Razorpay, Firebase security rules, an AI chatbot and full SEO, an autonomous Instagram pipeline with adversarial AI consensus, and a nightly competitor intelligence scraper. All three shipped in under a month, alongside this portfolio. I work in TypeScript and Python, design in Figma, and I'm joining VIT CSE in August.",
    "I care more about whether a system actually works than whether it looks impressive on a slide. Every project I've shipped has a failure mode I thought about — a circuit breaker, a fallback chain, a review gate. The polish matters, but only after the foundation doesn't break.",
  ],
  currently: "Shipped 3 production AI/SaaS projects in 30 days. Starting VIT CSE in August.",
  previously: "Freelance Designer · Two open-source teams.",
  email: "theayush.codes@gmail.com",
  socials: {
    github: "https://github.com/theayushagarwal",
    linkedin: "https://linkedin.com/in/ayushagarwal17",
    twitter: "https://x.com/theayushcodes",
    resume: "#",
  },
} as const;

export const HERO_STATS = [
  { k: "Infra cost", v: "₹0" },
  { k: "Lighthouse Score", v: "100" },
  { k: "Shipped products", v: "3" },
  { k: "Build time", v: "30 days" },
] as const;

export type Project = {
  index: string;
  name: string;
  tagline: string;
  summary: string;
  role: string;
  year: string;
  stack: string[];
  metrics: { k: string; v: string }[];
  href: string;
  visual: "agent-trace" | "terminal-evals" | "waveform" | "graph-network";
  visualLabel: string;
  image?: string;
  secondaryImage?: string;
  secondaryLabel?: string;
};
export const PROJECTS: Project[] = [
  {
    index: "01",
    name: "Vurlo",
    tagline:
      "Full-stack e-commerce SaaS platform with Razorpay payments, Firebase rules, and custom AI chatbot",
    summary:
      "I built and shipped a complete e-commerce SaaS platform solo at vurlo.store. It integrates Firebase Auth, granular Firestore security rules, Razorpay checkout, and an interactive AI chatbot helper. Engineered for performance with lazy-loading, product quick-view modals, and server-side SEO & GEO optimization, all managed via a custom admin panel.",
    role: "Founder & Full-Stack Engineer",
    year: "2026",
    stack: [
      "React 19",
      "TanStack Start",
      "Firebase Auth & Rules",
      "Razorpay",
      "Tailwind CSS",
      "Gemini API",
      "TypeScript",
    ],
    metrics: [
      { k: "Build Time", v: "10 days" },
      { k: "Lighthouse SEO", v: "100" },
      { k: "Best Practices", v: "96" },
      { k: "Accessibility", v: "86" },
    ],
    href: "https://vurlo.store",
    visual: "agent-trace",
    visualLabel: "vurlo.store",
    image: "/vurlo-preview.webp",
    secondaryImage: "/vurlo-admin.webp",
    secondaryLabel: "admin panel",
  },
  {
    index: "02",
    name: "Veltrix",
    tagline:
      "An Instagram growth account that writes, fact-checks, and publishes itself twice a day",
    summary:
      "Every post ships through an adversarial pipeline before it goes live: Gemini drafts the topic and caption, then Groq and Cerebras — two independent models — must both sign off before it's trusted. A statistically-adaptive embedding check catches duplicate topics without a hardcoded similarity cutoff, and a self-expiring checkpoint file carries each post across two separate GitHub Actions runners so it can sit for a 30-minute human review window before auto-publishing. Branded slides render through Jinja2 + headless Playwright at full carousel resolution.",
    role: "Solo developer",
    year: "2026",
    stack: [
      "Python",
      "Gemini API",
      "Groq",
      "Cerebras",
      "SQLite",
      "Supabase",
      "Playwright",
      "GitHub Actions",
      "Jinja2",
    ],
    metrics: [
      { k: "posts/day", v: "2 (auto)" },
      { k: "independent audits", v: "2 of 2 required" },
      { k: "formats", v: "4 (photo/carousel/reel/listicle)" },
      { k: "cost/post", v: "~$0.0002" },
    ],
    href: "",
    visual: "agent-trace",
    visualLabel: "pipeline.run",
    image: "/veltrix-preview.webp",
    secondaryImage: "/veltrix-logs-view.webp",
    secondaryLabel: "credentials board",
  },
  {
    index: "03",
    name: "Vcentre",
    tagline: "Competitor intelligence pipeline that turns viral outliers into creative briefs",
    summary:
      "Vcentre scrapes competitor Instagram accounts nightly and scores Reels and Photos as separate cohorts, so one viral Reel can't skew the baseline for an account's regular photos. A 12-hour cooldown and a circuit breaker guard every scrape, and only posts clearing a 3x-median threshold, an absolute floor, and a minimum engagement rate route through a 10-provider LLM fallback chain — Groq and Cerebras handle the bulk of the analysis for free, Gemini only synthesizes the final brief. Briefs write straight into the same database the posting bots read from, and a closed-loop feedback job scores each post's real performance back against the pattern that produced it.",
    role: "Solo developer",
    year: "2026",
    stack: [
      "Python",
      "Apify",
      "SQLite",
      "Supabase",
      "Groq",
      "Cerebras",
      "GitHub Actions",
      "FastAPI",
    ],
    metrics: [
      { k: "monthly cost", v: "$0" },
      { k: "outlier threshold", v: "3x median" },
      { k: "AI fallback chain", v: "10 providers" },
      { k: "cron cadence", v: "daily @ 2AM UTC" },
    ],
    href: "",
    visual: "graph-network",
    visualLabel: "outlier.scan",
    image: "/vcentre-preview.webp",
  },
];
export const STACK: { group: string; desc: string; items: string[] }[] = [
  {
    group: "AI Agents & Pipelines",
    desc: "State machine routing, adversarial review loops, multi-model consensus, and autonomous automation.",
    items: ["Python", "Gemini API", "Groq", "Cerebras", "LangGraph", "GitHub Actions"],
  },
  {
    group: "E-Commerce & SaaS Systems",
    desc: "Production transactional logic, payment routing, real-time sync, and granular database security.",
    items: ["React 19", "TanStack Start", "Firebase Auth", "Firestore Rules", "Razorpay Checkout"],
  },
  {
    group: "Data & Systems Infrastructure",
    desc: "Web scraping cohort analysis, embedding similarities, headless browsers, and serverless hosting.",
    items: ["SQLite", "Supabase", "FastAPI", "Playwright", "Jinja2 Templates", "Cloudflare Pages"],
  },
  {
    group: "Client & Interface Crafting",
    desc: "High-fidelity layouts, dynamic 3D physics, glassmorphic rendering, and fluid animations.",
    items: ["TypeScript", "Tailwind CSS", "Framer Motion", "Figma Design", "HTML5 & CSS3"],
  },
];

export const NAV_ITEMS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
] as const;
