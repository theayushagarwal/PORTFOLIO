import { ArrowUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 font-mono text-xs text-subtle md:flex-row md:items-center md:justify-between">
        <p>© 2026 Ayush Agarwal · Crafted in Bengaluru</p>
        <p>Built with TanStack Start · Motion · Tailwind</p>
        <a
          href="#top"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          Back to top
          <ArrowUp className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
