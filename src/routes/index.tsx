import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";

import { Intro } from "@/components/portfolio/Intro";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { Projects } from "@/components/portfolio/Projects";
import { About } from "@/components/portfolio/About";
import { Stack } from "@/components/portfolio/Stack";
import { Faq } from "@/components/portfolio/Faq";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";
import { CursorFollower } from "@/components/portfolio/CursorFollower";
import { Chatbox } from "@/components/portfolio/Chatbox";
import { StatsBar } from "@/components/portfolio/StatsBar";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Ayush Agarwal | Systems & Agent Engineer",
    meta: [
      {
        name: "description",
        content:
          "Systems & Agent Engineer designing and shipping production LLM systems, agents, and inference infrastructure. Selected work, technical writing, and contact.",
      },
      { property: "og:title", content: "Ayush Agarwal | Systems & Agent Engineer" },
      {
        property: "og:description",
        content:
          "Systems & Agent Engineer designing and shipping production LLM systems, agents, and inference infrastructure. Selected work, technical writing, and contact.",
      },
      { property: "og:url", content: "https://theayush.pages.dev/" },
      { property: "og:image", content: "https://theayush.pages.dev/portfolio-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ayush Agarwal | Systems & Agent Engineer" },
      {
        name: "twitter:description",
        content:
          "Systems & Agent Engineer designing and shipping production LLM systems, agents, and inference infrastructure. Selected work, technical writing, and contact.",
      },
      { name: "twitter:image", content: "https://theayush.pages.dev/portfolio-preview.webp" },
    ],
    links: [{ rel: "canonical", href: "https://theayush.pages.dev/" }],
  }),
  component: Portfolio,
});

const FAQ_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Veltrix's adversarial AI consensus loop work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Veltrix is an autonomous pipeline that orchestrates 18+ active APIs (content channels, competitor scrapers, database logs, alerting systems). Every social post drafts through a gated validation loop: Gemini is selectively invoked as the paid copywriting model only after free/low-cost Llama audits (Groq + Cerebras) approve the draft. A statistically-adaptive embedding check prevents duplicate topics.",
      },
    },
    {
      "@type": "Question",
      name: "What is Vcentre and how does it analyze competitor engagement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vcentre scrapes competitor accounts nightly using isolated Reels and Photos baseline calculations (so a viral Reel doesn't skew photo expectations). It filters posts clearing a 3x-median engagement threshold, routes them through a 10-provider LLM fallback chain, and generates creative briefs directly into the publishing bots' database.",
      },
    },
    {
      "@type": "Question",
      name: "What technology stack does Ayush Agarwal specialize in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For AI and pipelines, the primary languages are Python and TypeScript, deploying models with Gemini API, Groq, Cerebras, and state machine routing via LangGraph. E-commerce systems are built on React 19, TanStack Start, and Firestore rules. Hosting and databases use Cloudflare, Supabase, and SQLite.",
      },
    },
    {
      "@type": "Question",
      name: "Is Ayush available for remote internships, freelance, or contract work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Ayush starts his Computer Science Engineering (CSE) degree at VIT in August 2026 and is actively seeking remote part-time software engineering roles, high-velocity contracts, and freelance projects. Get in touch via the email or social links below.",
      },
    },
    {
      "@type": "Question",
      name: "How was the Vurlo e-commerce SaaS platform optimized for performance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vurlo was built solo in 10 days and achieved a 100/100 Lighthouse SEO score. It integrates server-side rendering (SSR) via TanStack Start, strict database validation rules for inventory locking, and lazy-loading client components to keep initial page loading times under 400ms.",
      },
    },
  ],
});

function Portfolio() {
  const [showIntro, setShowIntro] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      container.style.setProperty("--mouse-x", `${e.clientX}px`);
      container.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-background text-foreground overflow-hidden"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_JSON_LD }} />
      <div className="global-spotlight" />
      <a href="#top" className="skip-link">
        Skip to content
      </a>

      <AnimatePresence>{showIntro && <Intro onDone={() => setShowIntro(false)} />}</AnimatePresence>

      <ScrollProgress />
      <CursorFollower />
      <Chatbox />
      <Nav />

      <main>
        <Hero revealed={!showIntro} />
        <StatsBar />
        <Projects />
        <div className="hairline mx-auto max-w-6xl px-6" />
        <About />
        <div className="hairline mx-auto max-w-6xl px-6" />
        <Stack />
        <div className="hairline mx-auto max-w-6xl px-6" />
        <Faq />
        <div className="hairline mx-auto max-w-6xl px-6" />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
