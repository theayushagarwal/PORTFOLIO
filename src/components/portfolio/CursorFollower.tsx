import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";

export function CursorFollower() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Buttery-smooth spring values for the outer ring lag effect
  const ringX = useSpring(mouseX, { stiffness: 220, damping: 22, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 220, damping: 22, mass: 0.5 });

  useEffect(() => {
    // Hide on touch screens
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    // Listen to hovering on links, buttons, clickables
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

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer lagged ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovered ? 1.5 : 1,
        }}
        className="pointer-events-none fixed left-0 top-0 z-[99999] h-5 w-5 rounded-full border border-primary/60 bg-primary/5 transition-all duration-300 hidden md:block"
      />
      {/* Inner precise dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovered ? 0.5 : 1,
        }}
        className="pointer-events-none fixed left-0 top-0 z-[99999] h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)] hidden md:block"
      />
    </>
  );
}
