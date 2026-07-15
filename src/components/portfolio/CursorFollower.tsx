import { useEffect, useRef } from "react";

export function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  // All mutable state lives in refs — never triggers a React re-render
  const mouse = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const hovered = useRef(false);
  const visible = useRef(false);

  useEffect(() => {
    // Hide entirely on touch screens — no cursor to follow
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (!visible.current) {
        visible.current = true;
        // Snap elements into view without waiting for RAF
        if (ringRef.current) ringRef.current.style.opacity = "1";
        if (dotRef.current) dotRef.current.style.opacity = "1";
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      // Avoid expensive getComputedStyle — check tag and closest only
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        !!target.closest("a") ||
        !!target.closest("button");
      hovered.current = isClickable;
    };

    let rafId: number;
    const tick = () => {
      // Lerp the ring toward the cursor
      pos.current.x += (mouse.current.x - pos.current.x) * 0.12;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.12;

      const scale = hovered.current ? 1.5 : 1;
      const dotScale = hovered.current ? 0.4 : 1;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.current.x}px,${pos.current.y}px,0) translate(-50%,-50%) scale(${scale})`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px,${mouse.current.y}px,0) translate(-50%,-50%) scale(${dotScale})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []); // ← empty deps: effect runs ONCE, never torn down

  return (
    <>
      {/* Outer spring-lagged ring — hidden until first mouse move */}
      <div
        ref={ringRef}
        style={{ opacity: 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[99999] h-5 w-5 rounded-full border border-primary/50 bg-primary/5 will-change-transform hidden md:block"
      />
      {/* Inner instant dot */}
      <div
        ref={dotRef}
        style={{ opacity: 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[99999] h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--color-primary)] will-change-transform hidden md:block"
      />
    </>
  );
}
