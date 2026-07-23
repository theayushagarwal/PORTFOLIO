import { AnimatePresence, motion, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { EASE } from "@/lib/motion";
import { NAV_ITEMS, PROFILE } from "@/lib/site-data";
import { playTick } from "@/lib/sound";
import { CommandPaletteTrigger } from "./CommandPalette";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => scrollY.on("change", (y) => setScrolled(y > 20)), [scrollY]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // High-performance IntersectionObserver Scrollspy
  useEffect(() => {
    const sections = ["top", "work", "about", "stack", "contact"];

    // rootMargin offset simulates the previous 250px offset earlier detection beautifully
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sectionId) => {
      const el = document.getElementById(sectionId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
          scrolled || open ? "border-b border-border bg-background/70 backdrop-blur-xl" : ""
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" onMouseEnter={playTick} className="group flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary transition-colors group-hover:bg-secondary" />
            <span className="font-display text-sm font-semibold tracking-tight">
              {PROFILE.name}
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item, i) => {
              const pan = (i / (NAV_ITEMS.length - 1)) * 2 - 1;
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => playTick(pan)}
                  className={`relative text-sm font-medium transition-colors py-1 ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <CommandPaletteTrigger />
            <a
              href="#contact"
              onMouseEnter={playTick}
              className="btn-ghost hidden rounded-full px-4 py-1.5 text-xs font-medium md:inline-flex"
            >
              Get in touch
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              onMouseEnter={playTick}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-card md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-30 bg-background/95 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex h-full flex-col items-center justify-center gap-8 px-6">
              {NAV_ITEMS.map((item, i) => {
                const pan = (i / (NAV_ITEMS.length - 1)) * 2 - 1;
                const isActive = activeSection === item.href.slice(1);
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onMouseEnter={() => playTick(pan)}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 * i, ease: EASE }}
                    className={`font-display text-3xl font-semibold tracking-tight transition-colors ${
                      isActive ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </motion.a>
                );
              })}
              <motion.a
                href="#contact"
                onMouseEnter={playTick}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.08 * NAV_ITEMS.length,
                  ease: EASE,
                }}
                className="btn-primary mt-4 rounded-full px-6 py-3 text-sm font-medium"
              >
                Get in touch
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
