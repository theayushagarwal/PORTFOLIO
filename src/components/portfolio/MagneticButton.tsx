import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A button/link that nudges toward the cursor on hover — a few px, never
 * more. Falls back to a static element for touch devices and when the user
 * prefers reduced motion.
 */
export function MagneticButton({
  href,
  children,
  className,
  variant = "primary",
  onClick,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
  onClick?: () => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  // Create secondary springs and transforms for the inner text to create an elastic parallax drift
  const textX = useSpring(x, { stiffness: 240, damping: 18, mass: 0.5 });
  const textY = useSpring(y, { stiffness: 240, damping: 18, mass: 0.5 });
  const innerX = useTransform(textX, (v) => v * 0.3);
  const innerY = useTransform(textY, (v) => v * 0.3);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.25);
    y.set(relY * 0.35);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium",
        variant === "primary" ? "btn-primary" : "btn-ghost",
        className,
      )}
    >
      <motion.span style={reduceMotion ? {} : { x: innerX, y: innerY }} className="inline-flex items-center gap-2">
        {children}
      </motion.span>
    </motion.a>
  );
}
