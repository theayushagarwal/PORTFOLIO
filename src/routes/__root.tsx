import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { initAudioOnFirstInteraction } from "../lib/sound";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow mb-4">404 — not found</p>
        <h1 className="text-4xl font-semibold text-foreground">
          This page slipped through the cracks
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The URL you followed doesn't match anything here.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow mb-4">Something broke</p>
        <h1 className="text-2xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try refreshing, or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium"
          >
            Try again
          </button>
          <a
            href="/"
            className="btn-ghost inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    title: "Ayush Agarwal | Systems & Agent Engineer",
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content:
          "Systems & Agent Engineer designing and shipping production LLM systems, agents, and inference infrastructure. Selected work, technical writing, and contact.",
      },
      { name: "author", content: "Ayush Agarwal" },
      { name: "theme-color", content: "#09090B" },
      {
        property: "og:title",
        content: "Ayush Agarwal | Systems & Agent Engineer",
      },
      {
        property: "og:description",
        content: "Building production LLM systems, agents, and inference infrastructure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ayush Agarwal | Systems & Agent Engineer" },
      {
        name: "twitter:description",
        content: "Building production LLM systems, agents, and inference infrastructure.",
      },
      { name: "color-scheme", content: "dark" },
      { name: "geo.region", content: "IN-TN" },
      { name: "geo.placename", content: "Vellore" },
      { name: "geo.position", content: "12.9165;79.1325" },
      { name: "ICBM", content: "12.9165, 79.1325" },
      { property: "og:url", content: "https://theayush.pages.dev/" },
      { property: "og:image", content: "https://theayush.pages.dev/vurlo-preview.webp" },
      { name: "twitter:image", content: "https://theayush.pages.dev/vurlo-preview.webp" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:locale", content: "en_US" },
      { property: "og:site_name", content: "Ayush Agarwal Portfolio" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://theayush.pages.dev/" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "preload", href: "/vurlo-preview.webp?v=1.2", as: "image", type: "image/webp" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const PERSON_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ayush Agarwal",
  jobTitle: "Systems & Agent Engineer",
  email: "theayush.codes@gmail.com",
  knowsAbout: [
    "AI Agents",
    "Systems Engineering",
    "Large Language Models",
    "Python",
    "TypeScript",
    "React",
    "TanStack Start",
    "Database Security",
    "Web Scraping"
  ],
  hasOccupation: {
    "@type": "Occupation",
    "name": "Systems & Agent Engineer",
    "description": "Designing and deploying production-grade AI systems, e-commerce engines, and web architectures globally.",
    "skills": "Python, TypeScript, React, Go, SQL",
    "estimatedSalary": [],
    "jobLocation": {
      "@type": "AdministrativeArea",
      "name": "Remote / Global"
    }
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Vellore Institute of Technology",
    alternateName: "VIT"
  },
  url: "https://theayush.pages.dev",
  sameAs: [
    "https://github.com/theayushagarwal",
    "https://linkedin.com/in/ayushagarwal17"
  ]
});

const WEBSITE_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Ayush Agarwal Portfolio",
  "url": "https://theayush.pages.dev",
  "description": "Portfolio of Ayush Agarwal, Systems & Agent Engineer.",
  "inLanguage": "en-US"
});

const FAQ_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does Veltrix's adversarial AI consensus loop work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Veltrix is an autonomous pipeline that orchestrates 18+ active APIs (content channels, competitor scrapers, database logs, alerting systems). Every social post drafts through a gated validation loop: Gemini is selectively invoked as the paid copywriting model only after free/low-cost Llama audits (Groq + Cerebras) approve the draft. A statistically-adaptive embedding check prevents duplicate topics."
      }
    },
    {
      "@type": "Question",
      "name": "What is Vcentre and how does it analyze competitor engagement?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vcentre scrapes competitor accounts nightly using isolated Reels and Photos baseline calculations (so a viral Reel doesn't skew photo expectations). It filters posts clearing a 3x-median engagement threshold, routes them through a 10-provider LLM fallback chain, and generates creative briefs directly into the publishing bots' database."
      }
    },
    {
      "@type": "Question",
      "name": "What technology stack does Ayush Agarwal specialize in?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For AI and pipelines, the primary languages are Python and TypeScript, deploying models with Gemini API, Groq, Cerebras, and state machine routing via LangGraph. E-commerce systems are built on React 19, TanStack Start, and Firestore rules. Hosting and databases use Cloudflare, Supabase, and SQLite."
      }
    },
    {
      "@type": "Question",
      "name": "Is Ayush available for remote internships, freelance, or contract work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Ayush starts his Computer Science Engineering (CSE) degree at VIT in August 2026 and is actively seeking remote part-time software engineering roles, high-velocity contracts, and freelance projects. Contact theayush.codes@gmail.com or use the form below to get in touch."
      }
    },
    {
      "@type": "Question",
      "name": "How was the Vurlo e-commerce SaaS platform optimized for performance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vurlo was built solo in 10 days and achieved a 100/100 Lighthouse SEO score. It integrates server-side rendering (SSR) via TanStack Start, strict database validation rules for inventory locking, and lazy-loading client components to keep initial page loading times under 400ms."
      }
    }
  ]
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: PERSON_JSON_LD }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: WEBSITE_JSON_LD }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_JSON_LD }} />
      </head>
      <body>
        <div className="noise-overlay" />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    initAudioOnFirstInteraction();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
