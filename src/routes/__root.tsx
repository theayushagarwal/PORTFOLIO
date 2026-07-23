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
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Ayush Portfolio" },
      {
        property: "og:title",
        content: "Ayush Agarwal | Systems & Agent Engineer",
      },
      {
        property: "og:description",
        content:
          "Systems & Agent Engineer designing and shipping production LLM systems, agents, and inference infrastructure. Selected work, technical writing, and contact.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ayush Agarwal | Systems & Agent Engineer" },
      {
        name: "twitter:description",
        content:
          "Systems & Agent Engineer designing and shipping production LLM systems, agents, and inference infrastructure. Selected work, technical writing, and contact.",
      },
      { name: "color-scheme", content: "dark" },
      { property: "og:url", content: "https://theayush.pages.dev/" },
      { property: "og:image", content: "https://theayush.pages.dev/vurlo-preview.webp" },
      { property: "og:image:width", content: "1024" },
      { property: "og:image:height", content: "553" },
      {
        property: "og:image:alt",
        content:
          "Screenshot mockup of Vurlo e-commerce storefront dashboard featuring premium aesthetic room decor and lighting products in India.",
      },
      { name: "twitter:image", content: "https://theayush.pages.dev/vurlo-preview.webp" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { property: "og:locale", content: "en_US" },
      { property: "og:site_name", content: "Ayush Agarwal Portfolio" },
      { name: "geo.region", content: "IN-TN" },
      { name: "geo.placename", content: "Vellore" },
      { name: "geo.position", content: "12.9692;79.1559" },
      { name: "ICBM", content: "12.9692, 79.1559" },
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
  "@id": "https://theayush.pages.dev/#person",
  name: "Ayush Agarwal",
  jobTitle: "Systems & Agent Engineer",
  contactPoint: {
    "@type": "ContactPoint",
    email: "theayush.codes@gmail.com",
    contactType: "professional",
  },
  knowsAbout: [
    "AI Agents",
    "Systems Engineering",
    "Large Language Models",
    "Python",
    "TypeScript",
    "React",
    "TanStack Start",
    "Database Security",
    "Web Scraping",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Systems & Agent Engineer",
    description:
      "Designing and deploying production-grade AI systems, e-commerce engines, and web architectures globally.",
    skills: "Python, TypeScript, React, Go, SQL",
    occupationLocation: {
      "@type": "AdministrativeArea",
      name: "Remote / Global",
    },
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Vellore Institute of Technology",
    alternateName: "VIT",
  },
  url: "https://theayush.pages.dev",
  sameAs: ["https://github.com/theayushagarwal", "https://linkedin.com/in/ayushagarwal17"],
});

const WEBSITE_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://theayush.pages.dev/#website",
  name: "Ayush Agarwal Portfolio",
  alternateName: ["Ayush Agarwal", "Ayush Agarwal AI Engineer", "Ayush Agarwal Systems Engineer"],
  url: "https://theayush.pages.dev",
  description: "Portfolio of Ayush Agarwal, Systems & Agent Engineer.",
  inLanguage: "en-US",
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Ayush Agarwal | Systems & Agent Engineer</title>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: PERSON_JSON_LD }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: WEBSITE_JSON_LD }} />
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
