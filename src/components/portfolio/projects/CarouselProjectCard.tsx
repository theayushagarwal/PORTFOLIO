import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { DeviceFrame } from "../project-visuals";
import { PROJECT_VISUALS } from "../project-visuals";
import { revealVariants } from "@/lib/motion";
import { type Project } from "@/lib/site-data";
import { playTick } from "@/lib/sound";
import { PROJECT_DETAILS } from "@/lib/project-details";
import { useSpotlight } from "./widgets/useSpotlight";

const ACTIVE_THEMES = [
  { glow: "rgba(34, 211, 238, 0.025)", border: "rgba(34, 211, 238, 0.35)" }, // Vurlo (Cyan)
  { glow: "rgba(16, 185, 129, 0.025)", border: "rgba(16, 185, 129, 0.35)" }, // Veltrix (Emerald)
  { glow: "rgba(99, 102, 241, 0.025)", border: "rgba(99, 102, 241, 0.35)" }, // Vcentre (Indigo)
];

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

export function CarouselProjectCard({
  p,
  i,
  onViewCaseStudy,
  rotateX,
  rotateY,
  scale,
  opacity,
  z,
  shineX,
  isActive,
}: {
  p: Project;
  i: number;
  onViewCaseStudy: (p: Project) => void;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  z: MotionValue<number>;
  shineX: MotionValue<number>;
  isActive: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Interpolate numerical shine percentage to absolute left positioning
  const shineLeft = useTransform(shineX, (val) => `${val - 100}%`);

  const details = PROJECT_DETAILS[p.name];
  const glowColor = details?.theme.glow
    ? details.theme.glow.replace("0.15", "0.09")
    : "rgba(6, 182, 212, 0.09)";
  const { ref: spotlightRef, onMove } = useSpotlight();
  const Visual = PROJECT_VISUALS[p.visual];
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const tapStartRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const suppressNextClickRef = useRef(false);

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
      <div
        ref={cardRef}
        className={`w-[280px] sm:w-[480px] md:w-[580px] flex-shrink-0 snap-center py-6 ${
          isActive ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          className="pointer-events-none"
        >
          <motion.div
            style={{
              rotateX,
              rotateY,
              scale,
              opacity,
              z,
              transformStyle: "preserve-3d",
              willChange: "transform, opacity",
            }}
            className={`h-full ${isActive ? "pointer-events-auto" : "pointer-events-none"}`}
          >
            <motion.article
              ref={spotlightRef as React.RefObject<HTMLDivElement>}
              onMouseMove={onMove}
              variants={revealVariants}
              whileHover={
                typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches
                  ? "hover"
                  : undefined
              }
              style={
                {
                  transformStyle: "preserve-3d",
                  "--glow-color": glowColor,
                  borderColor: isActive ? ACTIVE_THEMES[i].border : undefined,
                  boxShadow: isActive ? `0 10px 30px -10px ${ACTIVE_THEMES[i].border}` : undefined,
                } as React.CSSProperties
              }
              className="surface-card group relative flex flex-col overflow-hidden p-6 md:p-8 h-full transition-all duration-500"
            >
              {/* Metallic Specular Shine Overlay */}
              <motion.div
                style={{
                  left: shineLeft,
                  background:
                    "linear-gradient(115deg, transparent 0%, rgba(255, 255, 255, 0.005) 30%, rgba(255, 255, 255, 0.07) 50%, rgba(255, 255, 255, 0.005) 70%, transparent 100%)",
                }}
                className="pointer-events-none absolute inset-y-0 w-[300%] z-10"
              />

              <motion.div
                aria-hidden
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 project-glow-element"
                style={{
                  background:
                    "radial-gradient(320px circle at var(--gx, -999px) var(--gy, -999px), var(--glow-color, rgba(6, 182, 212, 0.09)), transparent 60%)",
                }}
              />

              {/* Mockup visual area */}
              <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
                <DeviceFrame
                  label={p.visualLabel}
                  className="relative overflow-hidden"
                  noPadding={!!p.image}
                  aspectClass="aspect-[16/10] bg-slate-900/60"
                >
                  {p.image ? (
                    <button
                      onClick={() => setIsLightboxOpen(true)}
                      aria-label={`View full ${p.name} screenshot`}
                      className="w-full h-full block text-left outline-none cursor-zoom-in pointer-events-auto overflow-hidden"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover object-top block transition-transform duration-500 group-hover:scale-[1.04] group-hover:-translate-y-1.5"
                      />
                    </button>
                  ) : (
                    <Visual />
                  )}
                </DeviceFrame>
              </div>

              {/* Text metadata and specs */}
              <div
                style={{ transform: "translateZ(20px)" }}
                className="relative mt-6 flex flex-1 flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 font-mono text-xs text-subtle">
                    <span>{p.index}</span>
                    <span className="h-px w-5 bg-border" />
                    <span>{p.year}</span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                  <p className="mt-4 text-xs leading-relaxed text-subtle/90">{p.summary}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <span className="font-display text-sm font-semibold tabular-nums text-foreground">
                    {p.metrics[0].v}
                    <span className="ml-1.5 font-mono text-[9px] font-normal uppercase tracking-widest text-subtle">
                      {p.metrics[0].k}
                    </span>
                  </span>
                  <button
                    onPointerDown={(e) => {
                      if (e.pointerType === "touch") {
                        tapStartRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
                      }
                    }}
                    onPointerUp={(e) => {
                      if (e.pointerType !== "touch" || !tapStartRef.current) return;
                      const { x, y, t } = tapStartRef.current;
                      tapStartRef.current = null;
                      const movedTooFar = Math.hypot(e.clientX - x, e.clientY - y) > 10;
                      const heldTooLong = Date.now() - t > 500;
                      if (!movedTooFar && !heldTooLong) {
                        suppressNextClickRef.current = true;
                        onViewCaseStudy(p);
                        window.setTimeout(() => {
                          suppressNextClickRef.current = false;
                        }, 400);
                      }
                    }}
                    onClick={() => {
                      if (suppressNextClickRef.current) return;
                      onViewCaseStudy(p);
                    }}
                    onMouseEnter={() => playTick(0)}
                    aria-label={`View ${p.name} case study`}
                    style={{ touchAction: "manipulation" }}
                    className={`relative z-30 inline-flex items-center gap-1.5 text-xs text-foreground font-mono uppercase tracking-wider transition-colors hover:text-secondary cursor-pointer pointer-events-auto`}
                  >
                    <span>View Workspace</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            </motion.article>
          </motion.div>
        </div>
      </div>

      {isLightboxOpen && p.image && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm pointer-events-auto"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            aria-label="Close"
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
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
