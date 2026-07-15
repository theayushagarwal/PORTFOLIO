import { useEffect, useState, useRef } from "react";

export function CursorFollower() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide on touch screens
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    let rafId: number;
    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.classList?.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';
        
      setIsHovered(!!isClickable);
    };

    // Smooth lerp (linear interpolation) inside requestAnimationFrame for maximum smoothness
    const tick = () => {
      // Lerp coefficient: 0.15 creates a very smooth buttery delay
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${isHovered ? 1.4 : 1})`;
      }
      if (dotRef.current) {
        // Inner dot follows the cursor instantly
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${isHovered ? 0.4 : 1})`;
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
  }, [isVisible, isHovered]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer lagged ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[99999] h-5 w-5 rounded-full border border-primary/60 bg-primary/5 transition-transform duration-75 ease-out will-change-transform hidden md:block"
      />
      {/* Inner precise dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[99999] h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)] will-change-transform hidden md:block"
      />
    </>
  );
}
