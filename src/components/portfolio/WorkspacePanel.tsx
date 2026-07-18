import { ArrowUpRight, Link2, Minus, Plus } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { DeviceFrame } from "./project-visuals";
import { PROJECT_DETAILS } from "@/lib/project-details";
import { playTick, playSwell, playExit, resumeAudio } from "@/lib/sound";
import { type Project } from "@/lib/site-data";
import {
  LighthouseDial,
  ArchitectureNode,
  ScenarioTimeline,
  StepSequence,
  ChallengeCard,
} from "./Projects";

export function WorkspacePanel({ project }: { project: Project }) {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [transitionStage, setTransitionStage] = useState<"entering" | "ready" | "exiting">(
    "entering",
  );
  const [statusText, setStatusText] = useState("Initializing Session...");
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [showWorkspaceContent, setShowWorkspaceContent] = useState(false);

  // Workspace Scroll States
  const [activeSection, setActiveSection] = useState("overview");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState<number | null>(0); // Default open the first challenge card
  const workspaceScrollRef = useRef<HTMLDivElement>(null);

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "why-built", label: "Why Built" },
    { id: "architecture", label: "Architecture" },
    { id: "features", label: "Features" },
    { id: "challenges", label: "Challenges" },
    { id: "journey", label: "Journey" },
    { id: "performance", label: "Performance" },
    { id: "decisions", label: "Decisions" },
    { id: "gallery", label: "Gallery" },
  ];

  const details = PROJECT_DETAILS[project.name];

  // Scrollspy & scroll progress handler
  const handleWorkspaceScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setScrollProgress(progress);

    const scrollTop = target.scrollTop;
    const offsets = TABS.map((tab) => {
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
        behavior: "smooth",
      });
      const pan = (index / (TABS.length - 1)) * 2 - 1;
      playTick(pan);
    }
  };

  // Run the entrance sequence on mount
  useEffect(() => {
    playSwell();
    setProgressBarWidth(30);
    setStatusText("Opening Workspace...");

    const t1 = setTimeout(() => {
      setStatusText("Loading Project...");
      setProgressBarWidth(60);
    }, 400);

    const t2 = setTimeout(() => {
      setStatusText("Preparing Architecture...");
      setProgressBarWidth(85);
    }, 800);

    const t3 = setTimeout(() => {
      setStatusText("Workspace Ready.");
      setProgressBarWidth(100);
    }, 1400);

    const t4 = setTimeout(() => {
      setTransitionStage("ready");
      setShowWorkspaceContent(true);
      setIsTransitioning(false);
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [project.name]);

  const handleExitWorkspace = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    playExit();
    setShowWorkspaceContent(false);
    setProgressBarWidth(100);

    setTimeout(() => {
      setTransitionStage("exiting");
      setStatusText("Closing Workspace...");
      setProgressBarWidth(0);

      setTimeout(() => {
        setStatusText("Returning to Portfolio...");
      }, 750);

      setTimeout(() => {
        navigate({ to: "/" });
      }, 1500);
    }, 300);
  };

  // Escape key handler to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isTransitioning) {
        handleExitWorkspace();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTransitioning]);

  if (!details) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Workspace Portal"
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#09090b] p-4 select-none animate-portal-in"
    >
      {/* Grid background layer */}
      <div className="absolute inset-0 workspace-grid pointer-events-none" />

      {/* Ambient project theme color fields */}
      <div
        aria-hidden
        style={{ backgroundColor: details.theme.glow, filter: "blur(140px)" }}
        className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full opacity-60"
      />
      <div
        aria-hidden
        style={{ backgroundColor: details.theme.glow, filter: "blur(140px)" }}
        className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full opacity-40"
      />

      {/* Loading stage - rendered as absolute overlay when entering/exiting */}
      {(transitionStage === "entering" || transitionStage === "exiting") && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#09090b] px-6 select-none">
          <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2 text-center">
            {(transitionStage === "entering"
              ? [
                  { text: "Opening.", weight: "font-semibold text-foreground" },
                  {
                    text: "the",
                    weight: "font-normal italic text-muted-foreground font-serif-accent",
                  },
                  { text: `${project.name}.`, weight: "font-semibold text-foreground" },
                ]
              : [
                  { text: "Closing.", weight: "font-semibold text-foreground" },
                  {
                    text: "the",
                    weight: "font-normal italic text-muted-foreground font-serif-accent",
                  },
                  { text: "Workspace.", weight: "font-semibold text-foreground" },
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
              animation: "bootCardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
              animationDelay: "0.2s",
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
              animation: "bootCardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
              animationDelay: "0.4s",
            }}
          >
            <div className="h-[1.5px] w-64 rounded-full overflow-hidden bg-white/10 relative">
              <div
                className={`h-full bg-gradient-to-r ${details.theme.primary} ${details.theme.secondary}`}
                style={{
                  width: `${progressBarWidth}%`,
                  boxShadow: `0 0 8px ${details.theme.glow}`,
                  transition:
                    transitionStage === "exiting"
                      ? "width 1500ms linear"
                      : "width 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>
            <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.25em] text-subtle/85 flex items-center gap-1.5 select-none">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_4px_var(--color-secondary)]" />
              </span>
              <span>
                {transitionStage === "entering" ? "INITIALIZING_WORKSPACE" : "CLOSING_SESSION"}
              </span>
              <span>·</span>
              <span className="tabular-nums font-bold text-foreground">{progressBarWidth}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Active Case Study Workspace Content - Rendered always for SSR indexing */}
      <div
        ref={workspaceScrollRef}
        onScroll={handleWorkspaceScroll}
        style={{
          opacity: transitionStage === "ready" ? 1 : 0,
          pointerEvents: transitionStage === "ready" ? "auto" : "none",
        }}
        className={`relative z-10 flex h-full w-full max-w-6xl flex-col gap-10 overflow-y-auto px-4 pb-16 pt-32 text-left select-text md:px-8 md:pb-24 scroll-smooth workspace-scroll-mask transition-opacity duration-500 ${
          transitionStage === "ready" && showWorkspaceContent ? "animate-workspace-in" : ""
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
                <span className="transition-transform group-hover:-translate-x-0.5">←</span> Exit
                Workspace
              </button>
              <span className="hidden h-3 w-px bg-white/10 sm:block" />
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/80 sm:block">
                {project.index}.{project.name}
              </span>
            </div>

            {/* Document Navigation Tabs - scrollable on mobile, static on desktop */}
            <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 max-w-[40%] sm:max-w-[50%] md:max-w-[60%] lg:max-w-none lg:overflow-x-visible relative z-10 whitespace-nowrap [mask-image:linear-gradient(to_right,black_85%,transparent)] lg:[mask-image:none]">
              {TABS.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id, idx)}
                  className={`relative rounded-lg px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-widest cursor-pointer transition-colors duration-200 flex-shrink-0 ${
                    activeSection === tab.id
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground/80 hover:text-foreground"
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
                  navigator.clipboard.writeText(
                    `${window.location.href.split("#")[0]}#ws-sec-${activeSection}`,
                  );
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
            <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">
              01 . Project Overview
            </span>
            <h3 className="font-display text-4xl font-semibold text-foreground mt-2">
              {project.name}
            </h3>
            <p className="mt-2 text-xs text-subtle">
              {project.name === "Vurlo"
                ? "Built in 10 Days • React 19 • TanStack Start"
                : project.name === "Veltrix"
                  ? "Autonomous Run • Python • Gemini API"
                  : "Competitor Scan • FastAPI • Groq Fallbacks"}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Left Column: Hero screenshot */}
            <div className="md:col-span-2 space-y-6">
              <DeviceFrame
                label={`${project.name.toLowerCase()}/hero.webp`}
                noPadding
                className="border-white/10 shadow-2xl overflow-hidden bg-black/40"
              >
                {project.image ? (
                  <img
                    src={`${project.image}?v=1.2`}
                    alt="Hero view"
                    className="w-full object-cover object-top max-h-[360px]"
                  />
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
                  <h4 className="font-mono text-[9px] uppercase tracking-widest text-subtle">
                    Description
                  </h4>
                  <p className="mt-2 text-xs text-foreground/80 leading-relaxed font-medium">
                    {project.summary}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <h5 className="font-mono text-[9px] uppercase tracking-widest text-subtle">
                      Timeline
                    </h5>
                    <p className="mt-0.5 text-xs text-foreground/90 font-semibold font-mono">
                      {project.metrics.find(
                        (m) =>
                          m.k.toLowerCase().includes("build") || m.k.toLowerCase().includes("time"),
                      )?.v || "10 Days"}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-mono text-[9px] uppercase tracking-widest text-subtle">
                      Role
                    </h5>
                    <p className="mt-0.5 text-xs text-foreground/90 font-semibold truncate">
                      {project.role}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-mono text-[9px] uppercase tracking-widest text-subtle">
                      Status
                    </h5>
                    <p className="mt-0.5 text-xs text-foreground/90 font-semibold">Production</p>
                  </div>
                  <div>
                    <h5 className="font-mono text-[9px] uppercase tracking-widest text-subtle">
                      Year
                    </h5>
                    <p className="mt-0.5 text-xs text-foreground/90 font-semibold">
                      {project.year}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-mono text-[9px] uppercase tracking-widest text-subtle">
                      Deployment
                    </h5>
                    <p className="mt-0.5 text-xs text-foreground/90 font-semibold">
                      {project.name === "Vurlo"
                        ? "Production SaaS"
                        : project.name === "Veltrix"
                          ? "2 posts / day (auto)"
                          : "Daily scan @ 2AM UTC"}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-mono text-[9px] uppercase tracking-widest text-subtle">
                      Core Stack
                    </h5>
                    <p className="mt-0.5 text-xs text-foreground/90 font-semibold truncate">
                      {project.name === "Vurlo"
                        ? "React 19 / Firebase"
                        : project.name === "Veltrix"
                          ? "Python / Playwright"
                          : "FastAPI / SQLite"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                {project.href && project.href !== "#" && (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-secondary/10 border border-secondary/20 py-2 font-mono text-xs text-secondary font-semibold hover:bg-secondary/15 transition-all"
                  >
                    Visit Live Site <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
                {project.name === "Vurlo" ? (
                  <a
                    href="https://github.com/theayushagarwal/vurlo-ecommerce"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/10 py-2 font-mono text-xs text-foreground hover:bg-white/10 transition-all"
                  >
                    View Source Code
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/5 py-2 font-mono text-xs text-subtle/50 cursor-not-allowed select-none">
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
            <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">
              02 . Core Rationale
            </span>
            <h3 className="font-display text-4xl font-semibold text-foreground mt-2">
              Why I Built It
            </h3>
            <p className="mt-2 text-sm text-subtle">
              Understanding the core problems, proposed solutions, and realized product
              achievements.
            </p>
          </div>

          <div className="max-w-3xl">
            <span className="font-mono text-[9px] uppercase tracking-widest text-red-400/80 font-bold">
              The problem
            </span>
            <p className="mt-3 font-display text-xl md:text-2xl font-medium text-foreground/95 leading-snug">
              {details.whyBuilt.problem}
            </p>
          </div>

          {details.whyBuilt.scenario && <ScenarioTimeline events={details.whyBuilt.scenario} />}

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

          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400/80 font-bold">
              Result
            </span>
            <p className="mt-2 max-w-2xl text-sm text-foreground/90">{details.whyBuilt.result}</p>
            {details.whyBuilt.resultStats && (
              <dl className="mt-5 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                {details.whyBuilt.resultStats.map((s) => (
                  <div key={s.label}>
                    <dt className="font-mono text-[9px] uppercase tracking-widest text-subtle/80">
                      {s.label}
                    </dt>
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
            <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">
              03 . System Pipeline
            </span>
            <h3 className="font-display text-4xl font-semibold text-foreground mt-2">
              Architecture Pipelines
            </h3>
            <p className="mt-2 text-sm text-subtle">
              Visual system flow diagrams representing data pipelines and structured checks.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-card p-6 shadow-lg">
            <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">
              Pipeline Data flow nodes (Glows on Hover)
            </span>
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
            <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">
              04 . Core Capabilities
            </span>
            <h3 className="font-display text-4xl font-semibold text-foreground mt-2">
              Features & Capabilities
            </h3>
            <p className="mt-2 text-sm text-subtle">
              Key features and built-in components implemented inside the codebase.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-card p-6 shadow-lg">
            <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">
              Feature Checklist
            </span>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {details.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 rounded-lg border border-white/5 bg-surface p-3 transition-colors hover:border-white/10"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    ✓
                  </span>
                  <span className="text-foreground/90 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 5: Engineering Challenges */}
        <section id="ws-sec-challenges" className="scroll-mt-32 space-y-12">
          <div className="border-b border-white/5 pb-6">
            <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">
              03 . Technical Barriers
            </span>
            <h3 className="font-display text-4xl font-semibold text-foreground mt-2">
              Solving Complex Bottlenecks
            </h3>
            <p className="mt-2 text-sm text-subtle">
              A deep dive into security rule architectures, race conditions, and verification
              solutions.
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
            <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">
              06 . Build Log Timeline
            </span>
            <h3 className="font-display text-4xl font-semibold text-foreground mt-2">
              Development Journey
            </h3>
            <p className="mt-2 text-sm text-subtle">
              A chronological day-by-day log detailing core milestones and features added.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-card p-6 shadow-lg">
            <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">
              Milestone timeline
            </span>
            <div className="relative pl-6 border-l border-white/10 space-y-8 py-2">
              {details.journey.map((step) => (
                <div key={step.day} className="relative group">
                  <span className="absolute -left-[31px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-card border border-white/15">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary transition-transform group-hover:scale-150" />
                  </span>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">
                      {step.day}
                    </span>
                    <h4 className="font-display font-semibold text-foreground text-sm mt-0.5">
                      {step.milestone}
                    </h4>
                    <p className="text-xs text-subtle mt-1">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 7: Performance */}
        <section id="ws-sec-performance" className="scroll-mt-32 space-y-12">
          {details.lighthouse ? (
            <>
              <div className="border-b border-white/5 pb-6">
                <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">
                  07 . Technical Audits
                </span>
                <h3 className="font-display text-4xl font-semibold text-foreground mt-2">
                  Performance & Audits
                </h3>
                <p className="mt-2 text-sm text-subtle">
                  Audited system lighthouse stats for performance, accessibility, best practices,
                  and SEO.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-card p-6 shadow-lg flex flex-col justify-center">
                <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">
                  Lighthouse Audit (Active SVG Gauges)
                </span>
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
                <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">
                  07 . System Reliability
                </span>
                <h3 className="font-display text-4xl font-semibold text-foreground mt-2">
                  Operational Metrics
                </h3>
                <p className="mt-2 text-sm text-subtle">
                  No public-facing site to audit — these are the safeguards that keep an unattended
                  pipeline honest.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {details.reliability.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-card p-5 shadow-lg flex flex-col gap-2"
                  >
                    <span className="font-mono text-[9px] uppercase tracking-widest text-subtle">
                      {stat.label}
                    </span>
                    <span className="font-display text-3xl font-semibold text-foreground">
                      {stat.value}
                    </span>
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
            <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">
              05 . Architecture Decisions
            </span>
            <h3 className="font-display text-4xl font-semibold text-foreground mt-2">
              Trade-off Explanations
            </h3>
            <p className="mt-2 text-sm text-subtle">
              Concise rationales for technology selections and future roadmaps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <span className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-subtle">
                Design Choices
              </span>
              {details.decisions.map((dec) => (
                <div
                  key={dec.tech}
                  className="rounded-xl border border-white/10 bg-surface p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-display font-semibold text-foreground text-sm">
                      {dec.title}
                    </h4>
                    <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[9px] text-secondary">
                      {dec.tech}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-subtle">{dec.explanation}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/10 bg-card p-6 shadow-lg">
              <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">
                If I built V2...
              </span>
              <div className="space-y-4">
                <p className="text-xs text-subtle leading-relaxed font-medium italic mb-4">
                  "Evaluating scaling adjustments and cache controls shows true engineering
                  maturity."
                </p>
                <ul className="grid gap-3 font-sans text-[13px] text-muted-foreground/90 leading-relaxed">
                  {details.lessons.map((lesson) => (
                    <li
                      key={lesson}
                      className="flex items-start gap-3 rounded-lg border border-white/5 bg-surface p-3 transition-colors hover:border-white/10"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 text-xs">
                        ✓
                      </span>
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
            <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">
              06 . Screenshots
            </span>
            <h3 className="font-display text-4xl font-semibold text-foreground mt-2">
              Visual Gallery
            </h3>
            <p className="mt-2 text-sm text-subtle">
              Scrollable preview tracks showcasing panel responsive structures.
            </p>
          </div>

          <div className="relative rounded-xl border border-white/10 bg-card p-6 shadow-lg">
            <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">
              Horizontal Screenshot Scroll
            </span>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin select-none">
              {details.gallery.map((item, idx) => (
                <div key={`${item.label}-${idx}`} className="flex-none w-[85vw] sm:w-[480px]">
                  <DeviceFrame
                    label={item.label}
                    noPadding
                    className="border-white/10 overflow-hidden shadow-md"
                  >
                    <img
                      src={`${item.img}?v=1.2`}
                      alt={item.label}
                      loading="lazy"
                      className="w-full object-cover object-top max-h-[300px]"
                    />
                  </DeviceFrame>
                </div>
              ))}
              {project.secondaryImage && (
                <div className="flex-none w-[85vw] sm:w-[480px]">
                  <DeviceFrame
                    label={project.secondaryLabel || "Admin console"}
                    noPadding
                    className="border-white/10 overflow-hidden shadow-md"
                  >
                    <img
                      src={`${project.secondaryImage}?v=1.3`}
                      alt="Secondary screenshot"
                      loading="lazy"
                      className="w-full object-cover object-top max-h-[300px]"
                    />
                  </DeviceFrame>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 11: End Workspace CTA */}
        <section className="border-t border-white/10 pt-16 pb-32 flex flex-col items-center text-center max-w-xl mx-auto space-y-6">
          <h4 className="font-display text-2xl font-semibold text-foreground">
            Finished exploring this session?
          </h4>
          <p className="text-xs text-subtle leading-relaxed">
            End the workspace session to release resources and return back to the primary portfolio
            index.
          </p>
          <button
            onClick={handleExitWorkspace}
            onMouseEnter={() => playTick(0)}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-amber-600 px-6 py-3 font-mono text-xs font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] cursor-pointer"
          >
            End Workspace Session
            <span className="text-[14px] leading-none transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </section>
      </div>
    </div>
  );
}
