import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence } from "motion/react";

import { Intro } from "@/components/portfolio/Intro";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { Projects } from "@/components/portfolio/Projects";
import { About } from "@/components/portfolio/About";
import { Stack } from "@/components/portfolio/Stack";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";

export const Route = createFileRoute("/")({
  component: Portfolio,
});

function Portfolio() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <a href="#top" className="skip-link">
        Skip to content
      </a>

      <AnimatePresence>{showIntro && <Intro onDone={() => setShowIntro(false)} />}</AnimatePresence>

      <ScrollProgress />
      <Nav />

      <main>
        <Hero revealed={!showIntro} />
        <div className="hairline mx-auto max-w-6xl px-6" />
        <Projects />
        <div className="hairline mx-auto max-w-6xl px-6" />
        <About />
        <div className="hairline mx-auto max-w-6xl px-6" />
        <Stack />
        <div className="hairline mx-auto max-w-6xl px-6" />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
