/**
 * Content model.
 * Kept separate from presentation so components stay pure/reusable
 * and copy can be edited without touching layout code.
 */

export const PROFILE = {
  name: "Ayush Agarwal",
  role: "Systems & Agent Engineer",
  location: "Vellore, IN",
  status: "17-year-old developer · B.Tech CSE @ VIT Vellore (Batch 2026–2030, Class of 2030)",
  tagline: "Autonomous pipelines. Commerce engines. Interfaces that feel alive.",
  headline: {
    line1: "Building systems that ship.",
    line2: "Agents that work. Products",
    accent: "that scale.",
  },
  pitch:
    "I'm a developer and designer specialized in high-performance e-commerce engines, multi-model AI agent pipelines, and interfaces polished enough to ship.",
  bio: [
    "I'm 17, based in India, and I've spent the last year building systems that were probably too ambitious for my age — a full ecommerce SaaS (vurlo.store) with Razorpay and atomic Firestore locks, a Yjs CRDT collaborative code workspace (Carrel), a Bayesian HMM cluster scheduler (AegisFlow), a Playwright visual regression studio (Chronosync), and autonomous multi-model AI pipelines (Veltrix & Vcentre). I work in TypeScript and Python, design in Figma, and I'm currently studying Computer Science Engineering at VIT Vellore (Batch 2026–2030, Class of 2030, graduating in 2030).",
    "I care more about whether a system actually works than whether it looks impressive on a slide. Every project I've shipped has a failure mode I thought about — a circuit breaker, an EV restart barrier, a fallback chain, a review gate. The polish matters, but only after the foundation doesn't break.",
  ],
  currently: "6 shipped systems across distributed TS & Python AI. 17yo CSE undergrad at VIT Vellore (Batch 2026–2030, Class of 2030).",
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
  { k: "Shipped systems", v: "6" },
  { k: "Initial 3 build", v: "30 days" },
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
  repoUrl?: string;
  deployment?: string;
  coreStack?: string;
  subtitle?: string;
  visual:
    | "agent-trace"
    | "terminal-evals"
    | "waveform"
    | "graph-network"
    | "hmm-scheduler"
    | "diff-studio";
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
    repoUrl: "https://github.com/theayushagarwal/vurlo-ecommerce",
    deployment: "Production SaaS",
    coreStack: "React 19 / Firebase",
    subtitle: "Built in 10 Days • React 19 • TanStack Start",
    visual: "agent-trace",
    visualLabel: "vurlo.store",
    image: "/vurlo-preview.webp",
    secondaryImage: "/vurlo-admin.webp",
    secondaryLabel: "admin panel",
  },
  {
    index: "02",
    name: "Carrel",
    tagline:
      "Real-time collaborative code & notes workspace with Yjs CRDTs and binary WebSocket multiplexing",
    summary:
      "A hardened TypeScript monorepo workspace built around raw WebSocket binary frame multiplexing (sync, awareness, and control) over Yjs CRDTs, Fastify, and SQLite WAL snapshots. Features deterministic host-succession state machines, single-use nonce HMAC tickets, scrypt concurrency limiting, and a CodeMirror 6 editor with 80ms lerp remote carets.",
    role: "Systems & Full-Stack Engineer",
    year: "2026",
    stack: [
      "TypeScript",
      "Fastify",
      "Yjs CRDT",
      "WebSockets",
      "better-sqlite3",
      "React",
      "CodeMirror 6",
      "Playwright",
    ],
    metrics: [
      { k: "Caret Lerp", v: "80 ms" },
      { k: "WS Frames", v: "3 muxed" },
      { k: "Scrypt Limit", v: "4 concurrent" },
      { k: "Host Grace", v: "5000 ms" },
    ],
    href: "",
    repoUrl: "https://github.com/theayushagarwal/carrel",
    deployment: "Monorepo / Docker",
    coreStack: "Fastify / Yjs / CodeMirror 6",
    subtitle: "CRDT Workspace • Binary WebSockets • Fastify + SQLite",
    visual: "terminal-evals",
    visualLabel: "carrel.ws",
    image: "/carrel-preview.webp",
    secondaryImage: "/carrel-roles.webp",
    secondaryLabel: "host handover & presence",
  },
  {
    index: "03",
    name: "AegisFlow",
    tagline:
      "Autonomous cluster telemetry and Bayesian HMM scheduler that cuts deadline misses by 87%",
    summary:
      "Zero-dependency Python distributed cluster scheduler designed for latent node degradation and sudden crashes. An exact Bayesian Hidden Markov Model infers hidden node health in 0.13–0.35 steps with 99.58% accuracy, while mathematical triage gating and a cold-restart expected-value barrier hold unnecessary migrations at 0.00 and capture 96% of the Oracle ceiling.",
    role: "AI Systems Engineer",
    year: "2026",
    stack: [
      "Python",
      "Bayesian HMM",
      "Telemetry Inference",
      "Invariant Testing",
      "HTML Dashboard",
    ],
    metrics: [
      { k: "Miss Reduction", v: "-87%" },
      { k: "On-Time Rate", v: "98.3%" },
      { k: "Step Latency", v: "0.64 ms" },
      { k: "Invariants", v: "31 / 31" },
    ],
    href: "",
    repoUrl: "https://github.com/theayushagarwal/AegisFlow",
    deployment: "0.64 ms/step Engine",
    coreStack: "Pure Python / Bayesian HMM",
    subtitle: "Bayesian HMM • 99.58% State Accuracy • Zero Dependencies",
    visual: "hmm-scheduler",
    visualLabel: "aegis.hmm",
    image: "/aegisflow-preview.webp",
  },
  {
    index: "04",
    name: "Chronosync",
    tagline:
      "Autonomous Playwright web monitor and visual regression studio with 4-layer noise suppression",
    summary:
      "Full-stack change detection platform built on FastAPI, Playwright, and SQLite. Normalizes URLs across multi-user watches, filters dynamic clock/CSRF noise, requires two consecutive checks before alerting, and renders an interactive Diff Studio with a draggable split-screen slider, pixel heatmap, unified text diff, and SVG price tracking.",
    role: "Solo Developer",
    year: "2026",
    stack: [
      "Python",
      "FastAPI",
      "Playwright",
      "SQLite",
      "Docker",
      "Vanilla JS",
      "Groq API",
      "GitHub Actions",
    ],
    metrics: [
      { k: "Unit & Flow Tests", v: "29 / 29" },
      { k: "Noise Layers", v: "4 gates" },
      { k: "URL Dedup", v: "1 fetch / N" },
      { k: "Test Runtime", v: "~1.5s" },
    ],
    href: "",
    repoUrl: "https://github.com/theayushagarwal/Chronosync",
    deployment: "Docker + FastAPI",
    coreStack: "FastAPI / Playwright / SQLite",
    subtitle: "Visual Regression Studio • Noise Suppression • 29 Tests",
    visual: "diff-studio",
    visualLabel: "chronosync.diff",
    image: "/chronosync-preview.webp",
  },
  {
    index: "05",
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
    repoUrl: "https://github.com/theayushagarwal/vmatrix",
    deployment: "2 posts / day (auto)",
    coreStack: "Python / Playwright",
    subtitle: "Autonomous Run • Python • Multi-Model Consensus",
    visual: "agent-trace",
    visualLabel: "pipeline.run",
    image: "/veltrix-preview.webp",
    secondaryImage: "/veltrix-logs-view.webp",
    secondaryLabel: "credentials board",
  },
  {
    index: "06",
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
    repoUrl: "https://github.com/theayushagarwal/vmatrix",
    deployment: "Daily scan @ 2AM UTC",
    coreStack: "FastAPI / SQLite",
    subtitle: "Competitor Scan • FastAPI • Groq Fallbacks",
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
