import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out coordinate tracking using low-damping springs for buttery motion
  const mouseX = useSpring(x, { damping: 25, stiffness: 180, mass: 0.6 });
  const mouseY = useSpring(y, { damping: 25, stiffness: 180, mass: 0.6 });

  // Map mouse coordinate ratios (-0.5 to 0.5) to subtle tilt degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);

  // 1. Cache the bounding rect to prevent layout thrashing
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    // Calculate layout ONCE on enter
    rectRef.current = e.currentTarget.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // 2. If we don't have the rect yet (e.g. scrolled into view while hovering), get it
    if (!rectRef.current) {
      rectRef.current = e.currentTarget.getBoundingClientRect();
    }

    const rect = rectRef.current;

    // 3. Pure math on cached values (no DOM reading = zero lag)
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    // 4. Clear cache on exit so it recalculates next time
    rectRef.current = null;

    // Reset positions smoothly on exit
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: "1000px" }} className={className}>
      <motion.div
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform", // 5. Hint browser to keep this on a dedicated GPU layer
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
