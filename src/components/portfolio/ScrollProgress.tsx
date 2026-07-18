import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });
  return (
    <motion.div
      style={{
        scaleX,
        boxShadow: "0 0 10px rgba(139, 92, 246, 0.6)",
      }}
      className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-primary"
    />
  );
}
