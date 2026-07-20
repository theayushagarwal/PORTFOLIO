import { lazy, Suspense } from "react";
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import { Reveal } from "./Reveal";
import { PROJECTS, type Project } from "@/lib/site-data";
import { playTick } from "@/lib/sound";
import { CarouselProjectCard } from "./projects/CarouselProjectCard";

const ACTIVE_THEMES = [
  { glow: "rgba(34, 211, 238, 0.025)", border: "rgba(34, 211, 238, 0.35)" }, // Vurlo (Cyan)
  { glow: "rgba(16, 185, 129, 0.025)", border: "rgba(16, 185, 129, 0.35)" }, // Veltrix (Emerald)
  { glow: "rgba(99, 102, 241, 0.025)", border: "rgba(99, 102, 241, 0.35)" }, // Vcentre (Indigo)
];

const WorkspacePanel = lazy(() =>
  import("./projects/WorkspacePanel").then((module) => ({
    default: module.WorkspacePanel,
  })),
);

export function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const scrollTimeoutRef = useRef<number | null>(null);

  // 3D Carousel Motion values for smooth compositor animations per card
  const cardRotations = [useMotionValue(0), useMotionValue(-25), useMotionValue(-25)];
  const cardRotateXs = [useMotionValue(0), useMotionValue(-8), useMotionValue(-8)];
  const cardScales = [useMotionValue(1), useMotionValue(0.85), useMotionValue(0.85)];
  const cardOpacities = [useMotionValue(1), useMotionValue(0.55), useMotionValue(0.55)];
  const cardZs = [useMotionValue(0), useMotionValue(-120), useMotionValue(-120)];
  const cardShines = [useMotionValue(0), useMotionValue(-150), useMotionValue(-150)];

  // Caching card centers to avoid reading layouts on scroll frames
  const cardCentersRef = useRef<number[]>([]);

  // Scrollspy & scroll progress handler
  useEffect(() => {
    const container = carouselContainerRef.current;
    if (!container) return;

    // Cache card centers and total scroll limit
    const updateLayout = () => {
      const cardElements = container.getElementsByClassName("snap-center");
      const centers = [];
      for (let i = 0; i < cardElements.length; i++) {
        const el = cardElements[i] as HTMLElement;
        centers.push(el.offsetLeft + el.clientWidth / 2);
      }
      cardCentersRef.current = centers;
    };

    const handleScroll = () => {
      // Instantly kill all active spotlight glows by firing synthetic mouseleave on card articles.
      const articles = container.querySelectorAll("article");
      articles.forEach((el) => el.dispatchEvent(new MouseEvent("mouseleave", { bubbles: false })));

      // Toggle carousel-scrolling class to disable mouse events and fade out glows on scroll
      container.classList.add("carousel-scrolling");
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        container.classList.remove("carousel-scrolling");
      }, 150);

      // Recalculate on the fly if not set yet
      if (cardCentersRef.current.length === 0) {
        updateLayout();
      }

      const scrollLeft = container.scrollLeft;
      const clientWidth = container.clientWidth;
      const containerCenter = scrollLeft + clientWidth / 2;
      const centers = cardCentersRef.current;

      // Update each card's raw transforms locally relative to the viewport center
      for (let i = 0; i < cardRotations.length; i++) {
        const center = centers[i] || 0;
        const distance = center - containerCenter;
        const maxDist = clientWidth * 0.65;
        const ratio = Math.max(-1, Math.min(1, distance / maxDist)); // ranges -1 to 1

        cardRotations[i].set(ratio * -25); // rotateY
        cardRotateXs[i].set(Math.abs(ratio) * -8); // rotateX
        cardScales[i].set(1 - Math.abs(ratio) * 0.15); // scale
        cardOpacities[i].set(1 - Math.abs(ratio) * 0.45); // opacity
        cardZs[i].set(Math.abs(ratio) * -120); // translateZ
        cardShines[i].set(ratio * 150); // shine X percentage shift
      }

      // Update active dots index using robust closest-to-center element detection
      let closestIndex = 0;
      let minDistance = Infinity;
      for (let i = 0; i < centers.length; i++) {
        const center = centers[i] || 0;
        const distance = Math.abs(center - containerCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      setActiveCarouselIndex((prev) => {
        if (prev !== closestIndex && closestIndex >= 0 && closestIndex < PROJECTS.length) {
          return closestIndex;
        }
        return prev;
      });
    };

    // Initial calculations
    updateLayout();
    handleScroll();

    // Recalculate after mount tick intervals to ensure rendering positions resolve correctly
    const renderTimeouts = [150, 400, 1000].map((delay) =>
      window.setTimeout(() => {
        updateLayout();
        handleScroll();
      }, delay),
    );

    const handleResize = () => {
      updateLayout();
      handleScroll();
    };

    // Listen to scroll for card changes & motion values
    container.addEventListener("scroll", handleScroll, { passive: true });

    // Only read layout dimensions on resize, NOT on every scroll frame
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      renderTimeouts.forEach((t) => window.clearTimeout(t));
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeProject) return;

      const container = carouselContainerRef.current;
      if (!container) return;

      const cardElements = container.getElementsByClassName("snap-center");
      if (cardElements.length === 0) return;

      if (e.key === "ArrowRight") {
        const nextIndex = Math.min(activeCarouselIndex + 1, PROJECTS.length - 1);
        const nextEl = cardElements[nextIndex] as HTMLElement;
        if (nextEl) {
          const targetScrollLeft =
            nextEl.offsetLeft - (container.clientWidth - nextEl.clientWidth) / 2;
          animate(container.scrollLeft, targetScrollLeft, {
            type: "tween",
            ease: [0.22, 1, 0.36, 1],
            duration: 0.5,
            onUpdate: (latest) => {
              container.scrollLeft = latest;
            },
          });
          playTick(0.1);
        }
      } else if (e.key === "ArrowLeft") {
        const prevIndex = Math.max(activeCarouselIndex - 1, 0);
        const prevEl = cardElements[prevIndex] as HTMLElement;
        if (prevEl) {
          const targetScrollLeft =
            prevEl.offsetLeft - (container.clientWidth - prevEl.clientWidth) / 2;
          animate(container.scrollLeft, targetScrollLeft, {
            type: "tween",
            ease: [0.22, 1, 0.36, 1],
            duration: 0.5,
            onUpdate: (latest) => {
              container.scrollLeft = latest;
            },
          });
          playTick(-0.1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCarouselIndex, activeProject]);

  const handleViewCaseStudy = (p: Project) => {
    setActiveProject(p);
  };

  return (
    <section id="work" className="relative py-32 md:py-40">
      {/* Ambient background glow bleed */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-colors duration-1000 ease-out"
        style={{
          background: `radial-gradient(600px circle at 50% 50%, ${ACTIVE_THEMES[activeCarouselIndex]?.glow || "rgba(34, 211, 238, 0)"}, transparent 70%)`,
        }}
      />

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

            {/* Editorial Sliding Card Counter */}
            <div className="hidden md:flex flex-col items-end gap-1 font-mono">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60">
                Active Case Study
              </span>
              <div className="flex items-baseline gap-2 select-none">
                <div className="h-[48px] overflow-hidden text-5xl font-bold tracking-tight text-foreground flex flex-col">
                  <div
                    className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col"
                    style={{ transform: `translateY(-${activeCarouselIndex * 48}px)` }}
                  >
                    <span className="h-[48px] flex items-center justify-end leading-none">01</span>
                    <span className="h-[48px] flex items-center justify-end leading-none">02</span>
                    <span className="h-[48px] flex items-center justify-end leading-none">03</span>
                  </div>
                </div>
                <span className="text-muted-foreground/20 text-2xl font-light">/</span>
                <span className="text-muted-foreground/50 text-xl font-medium">03</span>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="relative mt-12">
          {/* Left/Right Fading Overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[8vw] z-20 bg-gradient-to-r from-[#07050f] via-[#07050f]/80 to-transparent hidden md:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[8vw] z-20 bg-gradient-to-l from-[#07050f] via-[#07050f]/80 to-transparent hidden md:block" />

          {/* Scroll Container */}
          <div
            ref={carouselContainerRef}
            className="flex gap-6 md:gap-12 overflow-x-auto snap-x snap-mandatory scrollbar-none py-8 px-[12vw] sm:px-[20vw] md:px-[25vw] lg:px-[26vw]"
            style={{ touchAction: "pan-x pan-y" }}
          >
            {PROJECTS.map((p, i) => (
              <CarouselProjectCard
                key={p.index}
                p={p}
                i={i}
                onViewCaseStudy={handleViewCaseStudy}
                rotateX={cardRotateXs[i]}
                rotateY={cardRotations[i]}
                scale={cardScales[i]}
                opacity={cardOpacities[i]}
                z={cardZs[i]}
                shineX={cardShines[i]}
                isActive={activeCarouselIndex === i}
              />
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="mt-6 flex justify-center gap-2 relative z-20">
          {PROJECTS.map((p, idx) => (
            <button
              key={p.index}
              onClick={() => {
                const container = carouselContainerRef.current;
                if (!container) return;
                const cardElements = container.getElementsByClassName("snap-center");
                const targetEl = cardElements[idx] as HTMLElement;
                if (targetEl) {
                  const targetScrollLeft =
                    targetEl.offsetLeft - (container.clientWidth - targetEl.clientWidth) / 2;
                  animate(container.scrollLeft, targetScrollLeft, {
                    type: "tween",
                    ease: [0.22, 1, 0.36, 1],
                    duration: 0.5,
                    onUpdate: (latest) => {
                      container.scrollLeft = latest;
                    },
                  });
                  playTick((idx / (PROJECTS.length - 1)) * 2 - 1);
                }
              }}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeCarouselIndex === idx
                  ? "w-8 bg-primary"
                  : "w-2.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to project ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Workspace Portal Backdrop Overlay */}
      <Suspense fallback={null}>
        {activeProject && (
          <WorkspacePanel project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </Suspense>
    </section>
  );
}
