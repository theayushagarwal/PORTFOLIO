import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { TextScramble } from "./TextScramble";
import { EASE } from "@/lib/motion";
import { HERO_STATS, PROFILE } from "@/lib/site-data";

export function Hero({ revealed }: { revealed: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-40 pb-32 md:pt-56 md:pb-40">
      {/* Shifting Gradient Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden" aria-hidden>
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
      </div>

      {/* Fine dot-grid — structure, not glow. Fades toward the edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 dot-grid"
        style={{
          maskImage: "radial-gradient(60% 55% at 50% 30%, black, transparent)",
          WebkitMaskImage: "radial-gradient(60% 55% at 50% 30%, black, transparent)",
        }}
      />

      <motion.div style={{ y, opacity }} className="mx-auto max-w-6xl px-6">
        {/* Name + tagline — held back until the intro finishes fading, so it
            reads as an arrival rather than something that was sitting there
            the whole time. */}
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={
            revealed
              ? reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, filter: "blur(0px)" }
              : {}
          }
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        >
          <p className="shiny-text font-display text-lg font-semibold tracking-tight md:text-xl">
            <TextScramble text={PROFILE.name} delay={0.35} />
          </p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground md:text-base">
            {PROFILE.tagline}
          </p>
        </motion.div>

        <Reveal delay={1} className="mt-8 block">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
            </span>
            <p className="eyebrow">{PROFILE.status}</p>
          </div>
        </Reveal>

        <Reveal delay={2}>
          <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-[5.25rem]">
            {PROFILE.headline.line1}
            <br />
            <span className="text-muted-foreground">{PROFILE.headline.line2}</span>{" "}
            <span className="font-serif-accent font-normal italic">{PROFILE.headline.accent}</span>
          </h1>
        </Reveal>

        <Reveal delay={3}>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {PROFILE.pitch}
          </p>
        </Reveal>

        <Reveal delay={4}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <MagneticButton href="#work" variant="primary">
              View selected work
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
            <MagneticButton href="#contact" variant="ghost">
              Book a call
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={6}>
          <dl className="mt-24 grid grid-cols-2 gap-8 border-t border-border pt-8 md:grid-cols-4">
            {HERO_STATS.map((s) => (
              <div key={s.k} className="flex flex-col">
                <dt className="order-2 mt-1 text-xs uppercase tracking-widest text-subtle">
                  {s.k}
                </dt>
                <dd className="order-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </motion.div>
    </section>
  );
}
