import { ArrowUpRight, ChevronDown, ExternalLink, Link2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useTransform, AnimatePresence, animate } from "motion/react";
import { Reveal } from "./Reveal";
import { DeviceFrame, PROJECT_VISUALS } from "./project-visuals";
import { TiltCard } from "./TiltCard";
import { revealVariants, EASE } from "@/lib/motion";
import { PROJECTS, type Project } from "@/lib/site-data";
import { playTick, playSwell, playExit } from "@/lib/sound";
import { PROJECT_DETAILS } from "@/lib/project-details";
import { toast } from "sonner";

function useSpotlight(glowColor: string = "rgba(6, 182, 212, 0.09)") {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const ref = useRef<HTMLElement>(null);
  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(320px circle at ${x}px ${y}px, ${glowColor}, transparent 60%)`,
  );
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };
  return { ref, onMove, background };
}

function Metrics({ metrics }: { metrics: Project["metrics"] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
      {metrics.map((m) => (
        <div key={m.k}>
          <dt className="font-mono text-[9px] uppercase tracking-widest text-subtle/80">{m.k}</dt>
          <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums text-foreground">
            {m.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** The strongest project — visual and content side by side, full width. */
function FeaturedProject({ p, onViewCaseStudy }: { p: Project; onViewCaseStudy: (p: Project) => void }) {
  const details = PROJECT_DETAILS[p.name];
  const glowColor = details?.theme.glow ? details.theme.glow.replace("0.15", "0.09") : "rgba(6, 182, 212, 0.09)";
  const { ref, onMove, background } = useSpotlight(glowColor);
  const Visual = PROJECT_VISUALS[p.visual];
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  return (
    <>
      <TiltCard>
        <motion.article
          ref={ref}
          onMouseMove={onMove}
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true, margin: "-60px" }}
          style={{ transformStyle: "preserve-3d" }}
          className="surface-card group relative grid gap-8 overflow-hidden p-6 md:grid-cols-2 md:gap-10 md:p-8"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background }}
          />

          <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="flex flex-col gap-5 self-center w-full relative z-10">
            <DeviceFrame label={p.visualLabel} className="relative overflow-hidden" noPadding={!!p.image} aspectClass={p.image ? "" : "aspect-[16/10]"}>
              {p.image ? (
                <div className="relative w-full h-auto">
                  <img
                    src={`${p.image}?v=1.2`}
                    alt={p.name}
                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                  {p.secondaryImage && (
                    <div className="absolute top-3 right-3 z-10 shrink-0 flex flex-col gap-1 items-center bg-black/60 backdrop-blur-md border border-white/10 p-1.5 rounded-lg shadow-lg select-none">
                      <button
                        onClick={() => setIsLightboxOpen(true)}
                        aria-label={`View ${p.secondaryLabel || 'admin panel'} screenshot`}
                        className="group/thumb relative block overflow-hidden rounded border border-border/80 bg-surface/50 p-0.5 transition-colors hover:border-secondary/40"
                      >
                        <img
                          src={`${p.secondaryImage}?v=1.3`}
                          alt="Admin screenshot thumbnail"
                          className="h-12 w-20 object-cover object-top transition-transform duration-300 group-hover/thumb:scale-105"
                        />
                      </button>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-white/70">
                        {p.secondaryLabel || 'admin panel'}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <Visual />
              )}
            </DeviceFrame>

            {p.name === "Vurlo" && (
              <ul className="flex flex-col gap-2.5 pl-4 font-mono text-[11px] text-muted-foreground/80 leading-relaxed select-none">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500/70 shrink-0 select-none">✓</span>
                  <span>Firebase Auth + real-time Firestore cart & orders</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500/70 shrink-0 select-none">✓</span>
                  <span>SEO-optimized — 100 Lighthouse score with schema.org structured data</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500/70 shrink-0 select-none">✓</span>
                  <span>Full admin console — products, orders, coupons, stock alerts</span>
                </li>
              </ul>
            )}
          </div>

          <div style={{ transform: "translateZ(15px)" }} className="relative flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="eyebrow">Featured</span>
              <span className="h-px w-6 bg-border" />
              <span className="font-mono text-xs text-subtle">
                {p.year} · {p.role}
              </span>
            </div>

            <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl text-foreground">
              {p.name}
            </h3>
            
            <p className="mt-1 text-[13px] text-subtle/85 font-normal tracking-wide leading-relaxed">
              {p.tagline}
            </p>
            
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-foreground/90 font-medium">
              {p.summary}
            </p>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] text-muted-foreground/80 font-mono"
                >
                  {s}
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-border pt-7">
              <Metrics metrics={p.metrics} />
            </div>

            <button
              onClick={() => onViewCaseStudy(p)}
              onMouseEnter={() => playTick(0)}
              className="mt-8 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-secondary cursor-pointer"
            >
              View Case Study
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </motion.article>
      </TiltCard>

      {isLightboxOpen && p.secondaryImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            aria-label="Close"
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img
            src={`${p.secondaryImage}?v=1.3`}
            alt={`${p.name} Admin screenshot`}
            className="max-h-[90vh] max-w-[90vw] md:max-w-[1024px] w-full rounded-lg border border-border object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

/** Supporting projects — compact, visual on top, one line of proof below. */
function CompactProject({ p, i, onViewCaseStudy }: { p: Project; i: number; onViewCaseStudy: (p: Project) => void }) {
  const details = PROJECT_DETAILS[p.name];
  const glowColor = details?.theme.glow ? details.theme.glow.replace("0.15", "0.09") : "rgba(6, 182, 212, 0.09)";
  const { ref, onMove, background } = useSpotlight(glowColor);
  const Visual = PROJECT_VISUALS[p.visual];
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  return (
    <>
      <TiltCard>
        <motion.article
          ref={ref}
          onMouseMove={onMove}
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true, margin: "-60px" }}
          custom={i}
          style={{ transformStyle: "preserve-3d" }}
          className="surface-card group relative flex flex-col overflow-hidden p-6"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background }}
          />

          <div style={{ transform: "translateZ(30px)" }}>
            <DeviceFrame label={p.visualLabel} className="relative overflow-hidden" noPadding={!!p.image} aspectClass={p.image ? "" : "aspect-[16/10]"}>
              {p.image ? (
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label={`View full ${p.name} screenshot`}
                  className="w-full h-auto block text-left outline-none cursor-zoom-in"
                >
                  <img
                    src={`${p.image}?v=1.2`}
                    alt={p.name}
                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                </button>
              ) : (
                <Visual />
              )}
            </DeviceFrame>
          </div>

          <div style={{ transform: "translateZ(15px)" }} className="relative mt-6 flex flex-1 flex-col">
            <div className="flex items-center gap-3 font-mono text-xs text-subtle">
              <span>{p.index}</span>
              <span className="h-px w-5 bg-border" />
              <span>{p.year}</span>
            </div>

            <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">{p.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>

            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="font-display text-sm font-semibold tabular-nums text-foreground">
                {p.metrics[0].v}
                <span className="ml-1.5 font-mono text-[10px] font-normal uppercase tracking-widest text-subtle">
                  {p.metrics[0].k}
                </span>
              </span>
              <button
                onClick={() => onViewCaseStudy(p)}
                onMouseEnter={() => playTick(0)}
                aria-label={`View ${p.name} case study`}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-secondary cursor-pointer"
              >
                <span>Case Study</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </motion.article>
      </TiltCard>

      {isLightboxOpen && p.image && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            aria-label="Close"
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img
            src={`${p.image}?v=1.2`}
            alt={`${p.name} screenshot`}
            className="max-h-[90vh] max-w-[90vw] md:max-w-[1024px] w-full rounded-lg border border-border object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

/** Animated circular SVG gauges for performance scores with count-up sync and completion glow */
function LighthouseDial({ score, label }: { score: number; label: string }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [justFinished, setJustFinished] = useState(false);

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  const strokeColor = score >= 90 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1.1,
      delay: 0.35,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setAnimatedScore(Math.round(v)),
      onComplete: () => {
        setJustFinished(true);
        setTimeout(() => setJustFinished(false), 550);
      },
    });
    return () => controls.stop();
  }, [score]);

  return (
    <div
      style={{ "--dial-glow": `${strokeColor}66` } as React.CSSProperties}
      className={`flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 shadow-md transition-all duration-500 hover:border-white/20 ${
        justFinished ? "shadow-[0_0_26px_var(--dial-glow)]" : ""
      }`}
    >
      <div className="relative h-20 w-20">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-white/5"
            strokeWidth="5.5"
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            style={{ 
              stroke: strokeColor,
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset
            }}
            strokeWidth="5.5"
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold tabular-nums text-foreground">
          {animatedScore}
        </div>
      </div>
      <span className="font-mono text-[9px] uppercase tracking-widest text-subtle">{label}</span>
    </div>
  );
}

/** Architecture pipeline node with mouse-tracking spotlight + staggered entrance */
function ArchitectureNode({
  node,
  idx,
  glow,
}: {
  node: { id: string; label: string; desc: string };
  idx: number;
  glow: string;
}) {
  const { ref, onMove, background } = useSpotlight();
  return (
    <motion.div
      ref={ref as any}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 260, damping: 26, delay: idx * 0.06 }}
      style={{ "--glow-color": glow } as React.CSSProperties}
      className="group/node relative overflow-hidden rounded-xl border border-white/10 bg-surface p-4 transition-colors duration-300 hover:border-secondary/40 hover:shadow-[0_0_15px_var(--glow-color)] cursor-default flex flex-col justify-between"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover/node:opacity-100"
        style={{ background }}
      />
      <div className="relative z-10">
        <span className="font-mono text-[9px] text-secondary font-bold uppercase tracking-wider block mb-1">
          0{idx + 1} // {node.id}
        </span>
        <h4 className="font-display font-semibold text-foreground text-sm">{node.label}</h4>
        <p className="mt-2 text-xs text-subtle leading-relaxed">{node.desc}</p>
      </div>
    </motion.div>
  );
}

/** Visualizes a failure sequence as a literal timeline instead of describing it in prose */
function ScenarioTimeline({ events }: { events: { t: string; event: string; danger?: boolean }[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-card p-6 shadow-lg">
      <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">
        What actually happens
      </span>
      <div className="relative pl-6 border-l border-white/10 space-y-5">
        {events.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 30 }}
            className="relative"
          >
            <span
              className={`absolute -left-[27px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                e.danger ? "bg-red-500/20 border-red-500/50" : "bg-card border-white/15"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${e.danger ? "bg-red-400 animate-pulse" : "bg-secondary"}`} />
            </span>
            <div className="flex flex-wrap items-baseline gap-2">
              <span
                className={`font-mono text-[10px] font-bold uppercase tracking-widest ${
                  e.danger ? "text-red-400" : "text-secondary"
                }`}
              >
                {e.t}
              </span>
              <p className={`text-xs leading-relaxed ${e.danger ? "text-red-200/95 font-medium" : "text-foreground/80"}`}>
                {e.event}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Numbered step sequence with optional file chips — used for both `solutionSteps` and `fixSteps` */
function StepSequence({
  steps,
  accent,
}: {
  steps: { step: string; detail?: string; file?: string }[];
  accent: string;
}) {
  return (
    <div className="relative pl-7 border-l border-white/10 space-y-6">
      {steps.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 28 }}
          className="relative"
        >
          <span
            style={{ "--accent": accent } as React.CSSProperties}
            className="absolute -left-[37px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-white/15 font-mono text-[10px] font-bold text-foreground"
          >
            {i + 1}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="font-display font-semibold text-foreground text-[13px]">{s.step}</h5>
            {s.file && (
              <code className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-secondary">
                {s.file}
              </code>
            )}
          </div>
          {s.detail && <p className="mt-1 text-xs leading-relaxed text-foreground/70">{s.detail}</p>}
        </motion.div>
      ))}
    </div>
  );
}

/** Expandable accordion challenge cards */
function ChallengeCard({
  index,
  challenge,
  active,
  onClick,
  accentGlow,
}: {
  index: number;
  challenge: {
    title: string;
    problem: string;
    difficulty: string;
    solution: string;
    fixSteps?: { step: string; detail?: string; file?: string }[];
    learned: string;
  };
  active: boolean;
  onClick: () => void;
  accentGlow: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface overflow-hidden transition-all duration-300 hover:border-white/20">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between p-5 text-left font-display font-semibold text-foreground hover:bg-white/[0.02]"
      >
        <span className="flex items-center gap-3">
          <span className="font-mono text-xs text-subtle">0{index + 1}.</span>
          {challenge.title}
        </span>
        <ChevronDown className={`h-4 w-4 text-subtle transition-transform duration-300 ${active ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 34, mass: 1 }}
          >
            <motion.div
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
              }}
              initial="hidden"
              animate="show"
              style={{ "--accent-glow": accentGlow } as React.CSSProperties}
              className="border-t border-white/5 bg-white/[0.03] backdrop-blur-md p-5 space-y-4 text-xs leading-relaxed text-muted-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]"
            >
              <motion.div
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="relative rounded-lg border-l-2 pl-3"
                style={{ borderColor: accentGlow }}
              >
                <span className="block font-mono text-[9px] uppercase tracking-widest text-subtle mb-1">Problem</span>
                <p className="text-foreground/90 font-medium text-[13px]">{challenge.problem}</p>
              </motion.div>
              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                >
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-subtle mb-1">Why it was difficult</span>
                  <p>{challenge.difficulty}</p>
                </motion.div>
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className="sm:col-span-2"
                >
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-subtle mb-3">The fix</span>
                  {challenge.fixSteps ? (
                    <StepSequence steps={challenge.fixSteps} accent={accentGlow} />
                  ) : (
                    <p>{challenge.solution}</p>
                  )}
                </motion.div>
              </div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="pt-2 border-t border-white/5"
              >
                <span className="block font-mono text-[9px] uppercase tracking-widest text-secondary/80 mb-1">What I learned</span>
                <p className="text-secondary/90 italic">"{challenge.learned}"</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Projects() {
  const [featured, ...rest] = PROJECTS;
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStage, setTransitionStage] = useState<'idle' | 'entering' | 'ready' | 'exiting'>('idle');
  const [statusText, setStatusText] = useState('');
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [showWorkspaceContent, setShowWorkspaceContent] = useState(false);

  // Workspace Scroll States
  const [activeSection, setActiveSection] = useState('overview');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState<number | null>(0); // Default open the first challenge card
  const workspaceScrollRef = useRef<HTMLDivElement>(null);

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'why-built', label: 'Why Built' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'features', label: 'Features' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'journey', label: 'Journey' },
    { id: 'performance', label: 'Performance' },
    { id: 'decisions', label: 'Decisions' },
    { id: 'gallery', label: 'Gallery' },
  ];

  // Dynamic details module lookup
  const details = activeProject ? PROJECT_DETAILS[activeProject.name] : null;

  // Scrollspy & scroll progress handler
  const handleWorkspaceScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setScrollProgress(progress);

    const scrollTop = target.scrollTop;
    const offsets = TABS.map(tab => {
      const el = document.getElementById(`ws-sec-${tab.id}`);
      return { id: tab.id, offsetTop: el ? el.offsetTop - 140 : 0 };
    });

    const current = offsets.reduce((acc, curr) => {
      if (scrollTop >= curr.offsetTop) {
        return curr.id;
      }
      return acc;
    }, TABS[0].id);

    setActiveSection(current);
  };

  // Click smooth scroll jump
  const scrollToSection = (id: string, index: number) => {
    const el = document.getElementById(`ws-sec-${id}`);
    if (el && workspaceScrollRef.current) {
      workspaceScrollRef.current.scrollTo({
        top: el.offsetTop - 110,
        behavior: 'smooth'
      });
      // Spatial panning audio trigger: map tab index to -1..1 range
      const pan = (index / (TABS.length - 1)) * 2 - 1;
      playTick(pan);
    }
  };

  // Transition stage timing handler
  const handleViewCaseStudy = (p: Project) => {
    if (isTransitioning) {
      return;
    }
    setIsTransitioning(true);
    setActiveProject(p);
    setTransitionStage('entering');
    setProgressBarWidth(0);
    playSwell(); // Synthesize ascending workspace portal hum

    // Timeline steps (Total: 2000ms)
    setStatusText("Opening Workspace...");
    setProgressBarWidth(30);

    setTimeout(() => {
      setStatusText("Loading Project...");
      setProgressBarWidth(60);
    }, 400);

    setTimeout(() => {
      setStatusText("Preparing Architecture...");
      setProgressBarWidth(85);
    }, 800);

    setTimeout(() => {
      setStatusText("Workspace Ready.");
      setProgressBarWidth(100);
    }, 1500);

    setTimeout(() => {
      setTransitionStage('ready');
      setShowWorkspaceContent(false);
      
      setTimeout(() => {
        setShowWorkspaceContent(true);
        setActiveSection('overview');
        setScrollProgress(0);
        setActiveChallenge(0); // Reset challenge accordion state

        setTimeout(() => {
          setIsTransitioning(false);
        }, 620);
      }, 30);
    }, 2000);
  };

  const handleExitWorkspace = () => {
    if (isTransitioning || !activeProject) return;
    setIsTransitioning(true);
    playExit(); // Synthesize descending power-down sound
    
    setShowWorkspaceContent(false);
    setProgressBarWidth(100); 
    
    setTimeout(() => {
      setTransitionStage('exiting');
      setStatusText("Closing Workspace...");
      setProgressBarWidth(0); 
      
      setTimeout(() => {
        setStatusText("Returning to Portfolio...");
      }, 750);

      setTimeout(() => {
        setTransitionStage('idle');
        setActiveProject(null);
        setIsTransitioning(false);
      }, 1500);
      
    }, 300);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll & close on Escape when workspace is active
  useEffect(() => {
    if (activeProject && transitionStage !== 'idle') {
      document.body.style.overflow = 'hidden';
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !isTransitioning) {
          handleExitWorkspace();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [activeProject, transitionStage, isTransitioning]);

  return (
    <section id="work" className="relative py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="eyebrow">Selected work · 2026</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                Systems shipped, <br className="hidden md:block" />
                not just experiments.
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
              Three projects out of twelve — the ones I'd re-ship tomorrow. Full case studies on
              request.
            </p>
          </div>
        </Reveal>

        <div className="mt-16">
          <FeaturedProject p={featured} onViewCaseStudy={handleViewCaseStudy} />
        </div>

        <div className={`mt-6 grid gap-6 ${
          rest.length === 1 
            ? "grid-cols-1 max-w-2xl mx-auto" 
            : rest.length === 2 
              ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto" 
              : "grid-cols-1 md:grid-cols-3"
        }`}>
          {rest.map((p, i) => (
            <CompactProject key={p.index} p={p} i={i} onViewCaseStudy={handleViewCaseStudy} />
          ))}
        </div>
      </div>

      {/* Workspace Portal Backdrop Overlay */}
      {mounted && activeProject && transitionStage !== 'idle' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Workspace Portal"
          className="animate-portal-in fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#09090b] p-4 backdrop-blur-[12px] select-none"
        >
          {/* Grid background layer */}
          <div className="absolute inset-0 workspace-grid pointer-events-none" />

          {/* Ambient project theme color fields */}
          {details && (
            <>
              <div
                aria-hidden
                style={{ backgroundColor: details.theme.glow, filter: 'blur(140px)' }}
                className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full opacity-60"
              />
              <div
                aria-hidden
                style={{ backgroundColor: details.theme.glow, filter: 'blur(140px)' }}
                className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full opacity-40"
              />
            </>
          )}

          {/* Loading stage */}
          {(transitionStage === 'entering' || transitionStage === 'exiting') && (
            <div className="relative z-10 flex flex-col items-center max-w-4xl px-6">
              <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2 text-center">
                {(transitionStage === 'entering' 
                  ? [
                      { text: "Opening.", weight: "font-semibold text-foreground" },
                      { text: "the", weight: "font-normal italic text-muted-foreground font-serif-accent" },
                      { text: `${activeProject.name}.`, weight: "font-semibold text-foreground" }
                    ]
                  : [
                      { text: "Closing.", weight: "font-semibold text-foreground" },
                      { text: "the", weight: "font-normal italic text-muted-foreground font-serif-accent" },
                      { text: "Workspace.", weight: "font-semibold text-foreground" }
                    ]
                ).map((w, idx) => (
                  <motion.span
                    key={`${transitionStage}-${w.text}-${idx}`}
                    initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 18,
                      delay: idx * 0.28,
                    }}
                    className={`font-display text-5xl tracking-tight sm:text-6xl md:text-8xl ${w.weight}`}
                  >
                    {w.text}
                  </motion.span>
                ))}
              </div>

              {/* Shiny-text status line */}
              <div 
                className="mt-8 min-h-[16px] select-none"
                style={{
                  animation: 'bootCardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
                  animationDelay: '0.2s'
                }}
              >
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-subtle shiny-text">
                  &gt; {statusText}
                </p>
              </div>

              {/* Thin, premium progress bar */}
              <div 
                className="mt-14 flex flex-col items-center"
                style={{
                  animation: 'bootCardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
                  animationDelay: '0.4s'
                }}
              >
                <div className="h-[1.5px] w-64 rounded-full overflow-hidden bg-white/10 relative">
                  {details ? (
                    <div 
                      className={`h-full bg-gradient-to-r ${details.theme.primary} ${details.theme.secondary}`}
                      style={{ 
                        width: `${progressBarWidth}%`,
                        boxShadow: `0 0 8px ${details.theme.glow}`,
                        transition: transitionStage === 'exiting' ? 'width 1500ms linear' : 'width 400ms cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  ) : (
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      style={{ 
                        width: `${progressBarWidth}%`,
                        boxShadow: '0 0 8px var(--color-secondary)',
                        transition: transitionStage === 'exiting' ? 'width 1500ms linear' : 'width 400ms cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  )}
                </div>
                <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.25em] text-subtle/85 flex items-center gap-1.5 select-none">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary/60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_4px_var(--color-secondary)]" />
                  </span>
                  <span>{transitionStage === 'entering' ? 'INITIALIZING_WORKSPACE' : 'CLOSING_SESSION'}</span>
                  <span>·</span>
                  <span className="tabular-nums font-bold text-foreground">{progressBarWidth}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Active Case Study Workspace Panel */}
          {transitionStage === 'ready' && details && (
            <div
              ref={workspaceScrollRef}
              onScroll={handleWorkspaceScroll}
              className={`relative z-10 flex h-full w-full max-w-6xl flex-col gap-10 overflow-y-auto px-4 pb-16 pt-32 text-left select-text md:px-8 md:pb-24 scroll-smooth workspace-scroll-mask ${
                showWorkspaceContent ? 'animate-workspace-in' : 'animate-workspace-out'
              }`}
            >
              {/* Sticky header with documentation links and scroll progress */}
              <div className="fixed inset-x-4 top-4 z-50 mx-auto max-w-6xl md:inset-x-8">
                <div className="relative flex items-center justify-between rounded-2xl border border-white/15 bg-card/90 px-5 py-3.5 backdrop-blur-xl shadow-2xl overflow-hidden">
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-40"
                    style={{
                      background: `conic-gradient(from 0deg, transparent, ${details.theme.glow}, transparent 30%)`,
                      maskImage: "linear-gradient(#000, #000)",
                      WebkitMaskImage: "linear-gradient(#000, #000)",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Thin Scroll Progress Bar across the top of the header border */}
                  <div className="absolute top-0 inset-x-0 h-[1.5px] rounded-t-2xl overflow-hidden bg-white/5 z-20">
                    <div 
                      className={`h-full bg-gradient-to-r ${details.theme.primary} ${details.theme.secondary}`}
                      style={{ width: `${scrollProgress}%` }}
                    />
                  </div>

                  <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 rounded-tl-md border-l border-t border-secondary/40 z-20" />
                  <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 rounded-tr-md border-r border-t border-secondary/40 z-20" />
                  
                  {/* Left elements: Exit workspace link and title */}
                  <div className="flex items-center gap-3 relative z-10">
                    <button
                      onClick={handleExitWorkspace}
                      onMouseEnter={() => playTick(0)}
                      className="group flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <span className="transition-transform group-hover:-translate-x-0.5">←</span> Exit Workspace
                    </button>
                    <span className="hidden h-3 w-px bg-white/10 sm:block" />
                    <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/80 sm:block">
                      {activeProject.index}.{activeProject.name}
                    </span>
                  </div>

                  {/* Document Navigation Tabs - scrollable on mobile, static on desktop */}
                  <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 max-w-[40%] sm:max-w-[50%] md:max-w-[60%] lg:max-w-none lg:overflow-x-visible relative z-10 whitespace-nowrap [mask-image:linear-gradient(to_right,black_85%,transparent)] lg:[mask-image:none]">
                    {TABS.map((tab, idx) => (
                      <button
                        key={tab.id}
                        onClick={() => scrollToSection(tab.id, idx)}
                        className={`relative rounded-lg px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-widest cursor-pointer transition-colors duration-200 flex-shrink-0 ${
                          activeSection === tab.id ? "text-foreground font-semibold" : "text-muted-foreground/80 hover:text-foreground"
                        }`}
                      >
                        {activeSection === tab.id && (
                          <motion.span
                            layoutId="ws-tab-pill"
                            className="absolute inset-0 rounded-lg bg-white/5 border border-white/10 shadow-inner"
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                          />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                      </button>
                    ))}
                  </nav>

                  {/* Status Indicator & Copy Link */}
                  <div className="flex items-center gap-4 relative z-10">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.href.split('#')[0]}#ws-sec-${activeSection}`);
                        toast.success("Section link copied");
                        playTick(0);
                      }}
                      className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Link2 className="h-3 w-3" /> <span className="hidden sm:inline">Copy Link</span>
                    </button>
                    <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-emerald-400/90">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      <span className="hidden sm:inline">Active Session</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 1: Overview */}
              <section id="ws-sec-overview" className="scroll-mt-32 space-y-12">
                <div className="border-b border-white/5 pb-6">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">01 . Project Overview</span>
                  <h3 className="font-display text-4xl font-semibold text-foreground mt-2">{activeProject.name}</h3>
                  <p className="mt-2 text-xs text-subtle">
                    {activeProject.name === "Vurlo" ? "Built in 10 Days • React 19 • TanStack Start" :
                     activeProject.name === "Veltrix" ? "Autonomous Run • Python • Gemini API" :
                     "Competitor Scan • FastAPI • Groq Fallbacks"}
                  </p>
                </div>
                
                <div className="grid gap-8 md:grid-cols-3">
                  {/* Left Column: Hero screenshot */}
                  <div className="md:col-span-2 space-y-6">
                    <DeviceFrame label={`${activeProject.name.toLowerCase()}/hero.webp`} noPadding className="border-white/10 shadow-2xl overflow-hidden bg-black/40">
                      {activeProject.image ? (
                        <img src={`${activeProject.image}?v=1.2`} alt="Hero view" className="w-full object-cover object-top max-h-[360px]" />
                      ) : (
                        <div className="aspect-[16/10] bg-black/30 flex items-center justify-center font-mono text-xs text-subtle">
                          Visual Screen Offline
                        </div>
                      )}
                    </DeviceFrame>
                  </div>

                  {/* Right Column: Project stats card */}
                  <div className="rounded-xl border border-white/10 bg-card p-6 flex flex-col justify-between gap-6 shadow-lg relative">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-mono text-[9px] uppercase tracking-widest text-subtle">Description</h4>
                        <p className="mt-2 text-xs text-foreground/80 leading-relaxed font-medium">{activeProject.summary}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                        <div>
                          <h5 className="font-mono text-[9px] uppercase tracking-widest text-subtle">Timeline</h5>
                          <p className="mt-0.5 text-xs text-foreground/90 font-semibold">
                            {activeProject.metrics.find((m) =>
                              m.k.toLowerCase().includes("build") ||
                              m.k.toLowerCase().includes("time")
                            )?.v || "10 Days"}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-mono text-[9px] uppercase tracking-widest text-subtle">Role</h5>
                          <p className="mt-0.5 text-xs text-foreground/90 font-semibold truncate">{activeProject.role}</p>
                        </div>
                        <div>
                          <h5 className="font-mono text-[9px] uppercase tracking-widest text-subtle">Status</h5>
                          <p className="mt-0.5 text-xs text-foreground/90 font-semibold">Production</p>
                        </div>
                        <div>
                          <h5 className="font-mono text-[9px] uppercase tracking-widest text-subtle">Year</h5>
                          <p className="mt-0.5 text-xs text-foreground/90 font-semibold">{activeProject.year}</p>
                        </div>
                        <div>
                          <h5 className="font-mono text-[9px] uppercase tracking-widest text-subtle">Deployment</h5>
                          <p className="mt-0.5 text-xs text-foreground/90 font-semibold">
                            {activeProject.name === "Vurlo" ? "Production SaaS" :
                             activeProject.name === "Veltrix" ? "2 posts / day (auto)" :
                             "Daily scan @ 2AM UTC"}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-mono text-[9px] uppercase tracking-widest text-subtle">Core Stack</h5>
                          <p className="mt-0.5 text-xs text-foreground/90 font-semibold truncate">
                            {activeProject.name === "Vurlo" ? "React 19 / Firebase" :
                             activeProject.name === "Veltrix" ? "Python / Playwright" :
                             "FastAPI / SQLite"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                      {activeProject.href && activeProject.href !== "#" && (
                        <a
                          href={activeProject.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-lg bg-secondary/10 border border-secondary/20 py-2 font-mono text-xs text-secondary font-semibold hover:bg-secondary/15 transition-all"
                        >
                          Visit Live Site <ArrowUpRight className="h-3 w-3" />
                        </a>
                      )}
                      {activeProject.name === "Vurlo" ? (
                        <a
                          href="https://github.com/theayushagarwal/vurlo-ecommerce"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/10 py-2 font-mono text-xs text-foreground hover:bg-white/10 transition-all"
                        >
                          View Source Code
                        </a>
                      ) : (
                        <div
                          className="flex items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/5 py-2 font-mono text-xs text-subtle/50 cursor-not-allowed select-none"
                        >
                          Private Repository
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Why I Built It */}
              <section id="ws-sec-why-built" className="scroll-mt-32 space-y-12">
                <div className="border-b border-white/5 pb-6">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">02 . Core Rationale</span>
                  <h3 className="font-display text-4xl font-semibold text-foreground mt-2">Why I Built It</h3>
                  <p className="mt-2 text-sm text-subtle">
                    Understanding the core problems, proposed solutions, and realized product achievements.
                  </p>
                </div>

                {/* The problem, stated as one line — not a setup paragraph */}
                <div className="max-w-3xl">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-red-400/80 font-bold">
                    The problem
                  </span>
                  <p className="mt-3 font-display text-xl md:text-2xl font-medium text-foreground/95 leading-snug">
                    {details.whyBuilt.problem}
                  </p>
                </div>

                {/* Visual failure timeline, if this project has one */}
                {details.whyBuilt.scenario && <ScenarioTimeline events={details.whyBuilt.scenario} />}

                {/* The fix — numbered steps if available, plain paragraph fallback otherwise */}
                <div className="rounded-xl border border-white/10 bg-card p-6 shadow-lg">
                  <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">
                    The fix, step by step
                  </span>
                  {details.whyBuilt.solutionSteps ? (
                    <StepSequence steps={details.whyBuilt.solutionSteps} accent={details.theme.glow} />
                  ) : (
                    <p className="text-xs leading-relaxed text-subtle">{details.whyBuilt.solution}</p>
                  )}
                </div>

                {/* Result — short line + stat row */}
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400/80 font-bold">
                    Result
                  </span>
                  <p className="mt-2 max-w-2xl text-sm text-foreground/90">{details.whyBuilt.result}</p>
                  {details.whyBuilt.resultStats && (
                    <dl className="mt-5 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                      {details.whyBuilt.resultStats.map((s) => (
                        <div key={s.label}>
                          <dt className="font-mono text-[9px] uppercase tracking-widest text-subtle/80">{s.label}</dt>
                          <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums text-foreground">
                            {s.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </section>

              {/* Section 3: Architecture */}
              <section id="ws-sec-architecture" className="scroll-mt-32 space-y-12">
                <div className="border-b border-white/5 pb-6">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">03 . System Pipeline</span>
                  <h3 className="font-display text-4xl font-semibold text-foreground mt-2">Architecture Pipelines</h3>
                  <p className="mt-2 text-sm text-subtle">
                    Visual system flow diagrams representing data pipelines and structured checks.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-card p-6 shadow-lg">
                  <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">Pipeline Data flow nodes (Glows on Hover)</span>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {details.architecture.map((node, idx) => (
                      <ArchitectureNode key={node.id} node={node} idx={idx} glow={details.theme.glow} />
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 4: Features */}
              <section id="ws-sec-features" className="scroll-mt-32 space-y-12">
                <div className="border-b border-white/5 pb-6">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">04 . Core Capabilities</span>
                  <h3 className="font-display text-4xl font-semibold text-foreground mt-2">Features & Capabilities</h3>
                  <p className="mt-2 text-sm text-subtle">
                    Key features and built-in components implemented inside the codebase.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-card p-6 shadow-lg">
                  <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">Feature Checklist</span>
                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {details.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 rounded-lg border border-white/5 bg-surface p-3 transition-colors hover:border-white/10">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">✓</span>
                        <span className="text-foreground/90 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 5: Engineering Challenges */}
              <section id="ws-sec-challenges" className="scroll-mt-32 space-y-12">
                <div className="border-b border-white/5 pb-6">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">03 . Technical Barriers</span>
                  <h3 className="font-display text-4xl font-semibold text-foreground mt-2">Solving Complex Bottlenecks</h3>
                  <p className="mt-2 text-sm text-subtle">
                    A deep dive into security rule architectures, race conditions, and verification solutions.
                  </p>
                </div>

                <div className="space-y-4 max-w-4xl">
                  {details.challenges.map((challenge, idx) => (
                    <ChallengeCard
                      key={challenge.title}
                      index={idx}
                      challenge={challenge}
                      active={activeChallenge === idx}
                      onClick={() => setActiveChallenge(activeChallenge === idx ? null : idx)}
                      accentGlow={details.theme.glow}
                    />
                  ))}
                </div>
              </section>

              {/* Section 6: Journey */}
              <section id="ws-sec-journey" className="scroll-mt-32 space-y-12">
                <div className="border-b border-white/5 pb-6">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">06 . Build Log Timeline</span>
                  <h3 className="font-display text-4xl font-semibold text-foreground mt-2">Development Journey</h3>
                  <p className="mt-2 text-sm text-subtle">
                    A chronological day-by-day log detailing core milestones and features added.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-card p-6 shadow-lg">
                  <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">Milestone timeline</span>
                  <div className="relative pl-6 border-l border-white/10 space-y-8 py-2">
                    {details.journey.map((step) => (
                      <div key={step.day} className="relative group">
                        <span className="absolute -left-[31px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-card border border-white/15">
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary transition-transform group-hover:scale-150" />
                        </span>
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">{step.day}</span>
                          <h4 className="font-display font-semibold text-foreground text-sm mt-0.5">{step.milestone}</h4>
                          <p className="text-xs text-subtle mt-1">{step.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 7: Performance — Lighthouse audit for websites, operational reliability for bots/pipelines */}
              <section id="ws-sec-performance" className="scroll-mt-32 space-y-12">
                {details.lighthouse ? (
                  <>
                    <div className="border-b border-white/5 pb-6">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">07 . Technical Audits</span>
                      <h3 className="font-display text-4xl font-semibold text-foreground mt-2">Performance & Audits</h3>
                      <p className="mt-2 text-sm text-subtle">
                        Audited system lighthouse stats for performance, accessibility, best practices, and SEO.
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-card p-6 shadow-lg flex flex-col justify-center">
                      <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">Lighthouse Audit (Active SVG Gauges)</span>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <LighthouseDial score={details.lighthouse.performance} label="Performance" />
                        <LighthouseDial score={details.lighthouse.accessibility} label="Accessibility" />
                        <LighthouseDial score={details.lighthouse.bestPractices} label="Best Practices" />
                        <LighthouseDial score={details.lighthouse.seo} label="SEO" />
                      </div>
                    </div>
                  </>
                ) : details.reliability ? (
                  <>
                    <div className="border-b border-white/5 pb-6">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">07 . System Reliability</span>
                      <h3 className="font-display text-4xl font-semibold text-foreground mt-2">Operational Metrics</h3>
                      <p className="mt-2 text-sm text-subtle">
                        No public-facing site to audit — these are the safeguards that keep an unattended pipeline honest.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {details.reliability.map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-xl border border-white/10 bg-card p-5 shadow-lg flex flex-col gap-2"
                        >
                          <span className="font-mono text-[9px] uppercase tracking-widest text-subtle">{stat.label}</span>
                          <span className="font-display text-3xl font-semibold text-foreground">{stat.value}</span>
                          <p className="text-xs text-subtle leading-relaxed">{stat.detail}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </section>

              {/* Section 8: Tech Decisions & Lessons */}
              <section id="ws-sec-decisions" className="scroll-mt-32 space-y-12">
                <div className="border-b border-white/5 pb-6">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">05 . Architecture Decisions</span>
                  <h3 className="font-display text-4xl font-semibold text-foreground mt-2">Trade-off Explanations</h3>
                  <p className="mt-2 text-sm text-subtle">
                    Concise rationales for technology selections and future roadmaps.
                  </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  {/* Stack Choices */}
                  <div className="space-y-4">
                    <span className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-subtle">Design Choices</span>
                    {details.decisions.map((dec) => (
                      <div key={dec.tech} className="rounded-xl border border-white/10 bg-surface p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="font-display font-semibold text-foreground text-sm">{dec.title}</h4>
                          <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[9px] text-secondary">{dec.tech}</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-subtle">{dec.explanation}</p>
                      </div>
                    ))}
                  </div>

                  {/* V2 Checklist */}
                  <div className="rounded-xl border border-white/10 bg-card p-6 shadow-lg">
                    <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">If I built V2...</span>
                    <div className="space-y-4">
                      <p className="text-xs text-subtle leading-relaxed font-medium italic mb-4">
                        "Evaluating scaling adjustments and cache controls shows true engineering maturity."
                      </p>
                      <ul className="grid gap-3 font-sans text-[13px] text-muted-foreground/90 leading-relaxed">
                        {details.lessons.map((lesson) => (
                          <li key={lesson} className="flex items-start gap-3 rounded-lg border border-white/5 bg-surface p-3 transition-colors hover:border-white/10">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 text-xs">✓</span>
                            <span className="text-foreground/90 font-medium">{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 10: Gallery */}
              <section id="ws-sec-gallery" className="scroll-mt-32 space-y-12">
                <div className="border-b border-white/5 pb-6">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">06 . Screenshots</span>
                  <h3 className="font-display text-4xl font-semibold text-foreground mt-2">Visual Gallery</h3>
                  <p className="mt-2 text-sm text-subtle">
                    Scrollable preview tracks showcasing panel responsive structures.
                  </p>
                </div>

                <div className="relative rounded-xl border border-white/10 bg-card p-6 shadow-lg">
                  <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">Horizontal Screenshot Scroll</span>
                  <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin select-none">
                    {details.gallery.map((item, idx) => (
                      <div key={`${item.label}-${idx}`} className="flex-none w-[85vw] sm:w-[480px]">
                        <DeviceFrame label={item.label} noPadding className="border-white/10 overflow-hidden shadow-md">
                          <img src={`${item.img}?v=1.2`} alt={item.label} className="w-full object-cover object-top max-h-[300px]" />
                        </DeviceFrame>
                      </div>
                    ))}
                    {activeProject.secondaryImage && (
                      <div className="flex-none w-[85vw] sm:w-[480px]">
                        <DeviceFrame label={activeProject.secondaryLabel || "Admin console"} noPadding className="border-white/10 overflow-hidden shadow-md">
                          <img src={`${activeProject.secondaryImage}?v=1.3`} alt="Secondary screenshot" className="w-full object-cover object-top max-h-[300px]" />
                        </DeviceFrame>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Section 11: End Workspace CTA */}
              <section className="border-t border-white/10 pt-16 pb-32 flex flex-col items-center text-center max-w-xl mx-auto space-y-6">
                <h4 className="font-display text-2xl font-semibold text-foreground">Finished exploring this session?</h4>
                <p className="text-xs text-subtle leading-relaxed">
                  End the workspace session to release resources and return back to the primary portfolio index.
                </p>
                <button
                  onClick={handleExitWorkspace}
                  onMouseEnter={() => playTick(0)}
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-600 px-6 py-3 font-mono text-xs font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] cursor-pointer"
                >
                  End Workspace Session 
                  <span className="text-[14px] leading-none transition-transform group-hover:translate-x-1">→</span>
                </button>
              </section>
            </div>
          )}
        </div>,
        document.body
      )}
    </section>
  );
}
