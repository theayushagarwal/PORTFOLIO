import type { Variants } from "motion/react";

/** The one easing curve used across the entire site. Confident, no overshoot. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Standard scroll-reveal: fade + rise, staggered by index. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASE,
      delay: i * 0.07,
    },
  }),
};

/** Softer variant for large display type — a touch of blur sells "premium". */
export const revealBlurVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: EASE,
      delay: i * 0.07,
    },
  }),
};
