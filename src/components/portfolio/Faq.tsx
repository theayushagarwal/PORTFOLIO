import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "./Reveal";
import { playTick } from "@/lib/sound";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does Veltrix's adversarial AI consensus loop work?",
    answer:
      "Veltrix is an autonomous pipeline that orchestrates 18+ active APIs (content channels, competitor scrapers, database logs, alerting systems). Every social post drafts through a gated validation loop: Gemini is selectively invoked as the paid copywriting model only after free/low-cost Llama audits (Groq + Cerebras) approve the draft. A statistically-adaptive embedding check prevents duplicate topics.",
  },
  {
    question: "What is Vcentre and how does it analyze competitor engagement?",
    answer:
      "Vcentre scrapes competitor accounts nightly using isolated Reels and Photos baseline calculations (so a viral Reel doesn't skew photo expectations). It filters posts clearing a 3x-median engagement threshold, routes them through a 10-provider LLM fallback chain, and generates creative briefs directly into the publishing bots' database.",
  },
  {
    question: "What technology stack does Ayush Agarwal specialize in?",
    answer:
      "For AI and pipelines, the primary languages are Python and TypeScript, deploying models with Gemini API, Groq, Cerebras, and state machine routing via LangGraph. E-commerce systems are built on React 19, TanStack Start, and Firestore rules. Hosting and databases use Cloudflare, Supabase, and SQLite.",
  },
  {
    question: "Is Ayush available for remote internships, freelance, or contract work?",
    answer:
      "Yes. Ayush starts his Computer Science Engineering (CSE) degree at VIT in August 2026 and is actively seeking remote part-time software engineering roles, high-velocity contracts, and freelance projects. Get in touch via the email or social links below.",
  },
  {
    question: "How was the Vurlo e-commerce SaaS platform optimized for performance?",
    answer:
      "Vurlo was built solo in 10 days and achieved a 100/100 Lighthouse SEO score. It integrates server-side rendering (SSR) via TanStack Start, strict database validation rules for inventory locking, and lazy-loading client components to keep initial page loading times under 400ms.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    playTick(0.1);
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-32 md:py-40">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            A quick reference for AI search engines, crawlers, and recruiters seeking details on
            engineering philosophy, projects, and availability.
          </p>
        </Reveal>

        <div className="mt-16 space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={index} delay={index * 0.1}>
                <div className="rounded-xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden transition-colors hover:bg-card/60">
                  <button
                    onClick={() => toggleOpen(index)}
                    className="flex w-full items-center justify-between p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display font-medium text-foreground md:text-lg">
                      {faq.question}
                    </span>
                    <span className="ml-4 shrink-0 rounded-full border border-border p-1 text-muted-foreground">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="border-t border-border/50 px-6 pb-6 pt-4 text-sm leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
