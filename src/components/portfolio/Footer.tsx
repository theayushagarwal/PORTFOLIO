import { ArrowUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/30 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 font-mono text-xs text-subtle md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="text-foreground font-semibold">Ayush Agarwal</p>
          <p>© 2026 · Crafted in Bengaluru, India</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-wider">
          <a href="https://github.com/theayushagarwal" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
          <span>·</span>
          <a href="https://linkedin.com/in/ayushagarwal17" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
          <span>·</span>
          <a href="mailto:hello@ayush.dev" className="hover:text-primary transition-colors">Email</a>
        </div>

        <div className="flex items-center gap-4">
          <p className="hidden md:block text-[10px] text-subtle/80">Built with TanStack Start · Motion</p>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground border border-border/80 rounded-full px-3 py-1 bg-surface/30 hover:bg-surface/50"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
