import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { MagneticButton } from "./MagneticButton";
import { TextScramble } from "./TextScramble";
import { EASE } from "@/lib/motion";
import { PROFILE } from "@/lib/site-data";
import { HeroCanvas } from "./HeroCanvas";

export function Hero({ revealed }: { revealed: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Bold 3D Kinetic Entrance Stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.1,
      },
    },
  };

  const nameVariants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: EASE },
    },
  };

  const headlineVariants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 45, rotateX: 18, filter: "blur(14px)", transformOrigin: "bottom left" },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: { duration: 1.05, ease: EASE },
    },
  };

  const subVariants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: EASE },
    },
  };

  const buttonVariants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 24, scale: 0.92, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.75, ease: EASE },
    },
  };

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 perspective-1000">
      {/* 3D Interactive Particle Mesh Canvas */}
      <HeroCanvas />

      {/* Shifting Gradient Mesh */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden mesh-container scroll-parallax-y"
        aria-hidden
      >
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={revealed ? "visible" : "hidden"}
        >
          {/* Name + Tagline */}
          <motion.div variants={nameVariants}>
            <p className="shiny-text font-display text-lg font-semibold tracking-tight md:text-xl">
              <TextScramble text={PROFILE.name} delay={0.2} trigger={revealed} />
            </p>
            <p className="mt-1.5 max-w-md text-sm text-muted-foreground md:text-base">
              {PROFILE.tagline}
            </p>
          </motion.div>

          {/* Status Eyebrow */}
          <motion.div variants={subVariants} className="mt-5 flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
            </span>
            <p className="eyebrow">{PROFILE.status}</p>
          </motion.div>

          {/* 3D Kinetic Headline */}
          <motion.div variants={headlineVariants} className="perspective-1000">
            <h1 className="mt-5 max-w-4xl text-3xl sm:text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl lg:text-[5.25rem]">
              {PROFILE.headline.line1}
              <br />
              <span className="text-muted-foreground">{PROFILE.headline.line2}</span>{" "}
              <span className="font-serif-accent font-normal italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-rose-400">
                {PROFILE.headline.accent}
              </span>
            </h1>
          </motion.div>

          {/* Pitch Paragraph */}
          <motion.div variants={subVariants}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {PROFILE.pitch}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={buttonVariants} className="mt-7 flex flex-wrap items-center gap-3">
            <MagneticButton href="#work" variant="primary">
              View selected work
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
            <MagneticButton href="#contact" variant="ghost">
              Let's talk
            </MagneticButton>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
