/**
 * Content model.
 * Kept separate from presentation so components stay pure/reusable
 * and copy can be edited without touching layout code.
 */

export const PROFILE = {
  name: "Ayush Agarwal",
  role: "Design Engineer",
  location: "Bengaluru, IN",
  status: "17-year-old developer crafting high-fidelity products & interfaces",
  tagline: "Turning complexity into simplicity through AI and software.",
  headline: {
    line1: "Designing interfaces,",
    line2: "and engineering them",
    accent: "to feel alive.",
  },
  pitch:
    "I'm a developer and designer focused on building polished web applications. I care about speed, typography, and the tiny details of motion choreography.",
  bio: [
    "I'm a 17-year-old designer-engineer based in India. I love bridging the gap between beautiful aesthetics and clean, performant code. I spend my time coding in TypeScript, React, and Swift, while designing in Figma and experimenting with CSS/motion choreography.",
    "I focus on creating software that isn't just functional, but delightful to interact with. Whether it's crafting smooth transitions, designing layouts, or building robust backends, I care deeply about the final 10% of polish.",
  ],
  currently: "Building high-fidelity interfaces and creative tools.",
  previously: "Freelance Designer · Two open-source teams.",
  email: "hello@ayush.dev",
  socials: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/in/",
    twitter: "https://twitter.com/",
    resume: "#",
  },
} as const;

export const HERO_STATS = [
  { k: "Age", v: "17" },
  { k: "Main stack", v: "TS / React / Motion" },
  { k: "Projects built", v: "15+" },
  { k: "Based in", v: PROFILE.location },
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
    tagline: "A full-stack e-commerce storefront built solo, from landing page to checkout",
    summary: "I built and shipped this storefront solo in 10 days. TanStack Start server functions handle Razorpay signature verification securely, while Firestore listeners keep cart and order state live in real time. Built a custom admin console for products, orders, coupons, and stock requests—from scratch.",
    role: "Founder & Full-Stack Engineer",
    year: "2026",
    stack: ["React 19", "TanStack Start", "TanStack Router", "TanStack Query", "Tailwind CSS", "Firebase", "Razorpay"],
    metrics: [
      { k: "Build Time", v: "10 days" },
      { k: "Lighthouse SEO", v: "100" },
      { k: "Best Practices", v: "96" },
      { k: "Accessibility", v: "86" }
    ],
    href: "https://vurlo.store",
    visual: "agent-trace",
    visualLabel: "vurlo.store",
    image: "/vurlo-preview.png",
    secondaryImage: "/vurlo-admin.png",
    secondaryLabel: "admin panel",
  },
  {
    index: "02",
    name: "Veltrix",
    tagline: "An Instagram growth account that writes, fact-checks, and publishes itself twice a day",
    summary:
      "Every post ships through an adversarial pipeline before it goes live: Gemini drafts the topic and caption, then Groq and Cerebras — two independent models — must both sign off before it's trusted. A statistically-adaptive embedding check catches duplicate topics without a hardcoded similarity cutoff, and a self-expiring checkpoint file carries each post across two separate GitHub Actions runners so it can sit for a 30-minute human review window before auto-publishing. Branded slides render through Jinja2 + headless Playwright at full carousel resolution.",
    role: "Solo developer",
    year: "2025",
    stack: ["Python", "Gemini API", "Groq", "Cerebras", "SQLite", "Supabase", "Playwright", "GitHub Actions", "Jinja2"],
    metrics: [
      { k: "posts/day", v: "2 (auto)" },
      { k: "independent audits", v: "2 of 2 required" },
      { k: "formats", v: "4 (photo/carousel/reel/listicle)" },
      { k: "cost/post", v: "~$0.0002" }
    ],
    href: "https://github.com/ayush-agarwal/veltrix",
    visual: "agent-trace",
    visualLabel: "pipeline.run",
    image: "/veltrix-preview.png",
    secondaryImage: "/veltrix-logs-view.png",
    secondaryLabel: "execution logs",
  },
  {
    index: "03",
    name: "Vcentre",
    tagline: "Competitor intelligence pipeline that turns viral outliers into creative briefs",
    summary:
      "Vcentre scrapes competitor Instagram accounts nightly, looking for posts that broke pattern rather than just posts with high numbers. Reels and photos get scored as separate cohorts against a rolling median, so one viral reel doesn't skew the baseline for an account's regular posts. Anything that clears the threshold routes through a fallback chain of AI providers — GitHub Models first, then Groq or Cerebras — with Gemini reserved only for the final brief write-up to stay on the free tier. The output writes straight into the same database my posting bots read from, so a spotted trend can become a scheduled post without me touching it.",
    role: "Solo developer",
    year: "2026",
    stack: ["Python", "FastAPI", "SQLite", "Supabase", "Groq", "GitHub Actions", "Instaloader"],
    metrics: [
      { k: "monthly cost", v: "$0" },
      { k: "outlier threshold", v: "3x median" },
      { k: "AI providers", v: "5 (fallback chain)" },
      { k: "cron cadence", v: "daily @ 2AM UTC" }
    ],
    href: "https://github.com/ayush-agarwal/vcentre",
    visual: "graph-network",
    visualLabel: "outlier.scan",
    image: "/vcentre-preview.png",
  },
];
export const STACK: { group: string; items: string[] }[] = [
  {
    group: "Models & Inference",
    items: ["OpenAI", "Anthropic", "vLLM", "Ollama", "TGI", "Llama.cpp"],
  },
  {
    group: "Agents & Orchestration",
    items: ["LangGraph", "DSPy", "Temporal", "Inngest", "Modal"],
  },
  {
    group: "Retrieval & Data",
    items: ["pgvector", "Qdrant", "Turbopuffer", "DuckDB", "Postgres"],
  },
  {
    group: "Product & Systems",
    items: ["TypeScript", "Rust", "Python", "Next.js", "Swift", "React"],
  },
];

export const NAV_ITEMS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
] as const;
