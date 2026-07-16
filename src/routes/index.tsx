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
        content: "Systems & Agent Engineer designing and shipping production LLM systems, agents, and inference infrastructure. Selected work, technical writing, and contact.",
      },
      { property: "og:title", content: "Ayush Agarwal | Systems & Agent Engineer" },
      {
        property: "og:description",
        content: "Systems & Agent Engineer designing and shipping production LLM systems, agents, and inference infrastructure. Selected work, technical writing, and contact.",
      },
      { property: "og:url", content: "https://theayush.pages.dev/" },
      { property: "og:image", content: "https://theayush.pages.dev/vurlo-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ayush Agarwal | Systems & Agent Engineer" },
      {
        name: "twitter:description",
        content: "Systems & Agent Engineer designing and shipping production LLM systems, agents, and inference infrastructure. Selected work, technical writing, and contact.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://theayush.pages.dev/" },
    ]
  }),
  component: Portfolio,
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
    <div ref={containerRef} className="relative min-h-screen bg-background text-foreground overflow-hidden">
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
