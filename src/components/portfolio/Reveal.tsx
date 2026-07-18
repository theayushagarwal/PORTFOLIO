import { useEffect, useRef, type ReactNode, type ElementType } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // Accepts a number (in steps) to stagger animations
  as?: ElementType;
  direction?: "up" | "left" | "right" | "light"; // Added light direction
}

export function Reveal({ children, className = "", delay = 0, as: Tag = "div", direction = "up" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add a small timeout if delay is passed, allowing CSS to handle the stagger
            if (delay > 0) {
              setTimeout(() => el.classList.add("in-view"), delay * 120);
            } else {
              el.classList.add("in-view");
            }
            observer.unobserve(el); // Run once and destroy observer for 0 overhead
          }
        });
      },
      { 
        threshold: 0.1, 
        rootMargin: "0px 0px -10% 0px" 
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  // Determine which CSS class to use based on direction
  const revealClass = 
    direction === "left" ? "reveal-3d-left" : 
    direction === "right" ? "reveal-3d-right" : 
    direction === "light" ? "reveal-light" :
    "reveal-3d";

  return (
    <Tag
      ref={ref as any}
      className={`${revealClass} ${className}`}
    >
      {children}
    </Tag>
  );
}
