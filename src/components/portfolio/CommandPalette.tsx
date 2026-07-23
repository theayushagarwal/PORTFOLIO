import { useEffect, useState } from "react";
import { Command, Search, Copy, ExternalLink, ArrowRight, Code, Cpu, Database, User, Mail, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { PROFILE } from "@/lib/site-data";

interface CommandItem {
  id: string;
  title: string;
  category: "Projects" | "Navigation" | "Contact & Socials";
  icon: any;
  action: () => void;
  badge?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global keydown listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Listen to custom window trigger event
  useEffect(() => {
    const handleCustomTrigger = () => setOpen(true);
    window.addEventListener("open-command-palette", handleCustomTrigger);
    return () => window.removeEventListener("open-command-palette", handleCustomTrigger);
  }, []);

  const items: CommandItem[] = [
    {
      id: "proj-vurlo",
      title: "Vurlo — E-commerce SaaS Storefront",
      category: "Projects",
      icon: Code,
      badge: "Razorpay + Firebase",
      action: () => {
        window.location.href = "/projects/vurlo";
      },
    },
    {
      id: "proj-veltrix",
      title: "Veltrix — Autonomous Instagram AI Pipeline",
      category: "Projects",
      icon: Cpu,
      badge: "Gemini + Adversarial AI",
      action: () => {
        window.location.href = "/projects/veltrix";
      },
    },
    {
      id: "proj-vcentre",
      title: "Vcentre — Competitor Intelligence Scraper",
      category: "Projects",
      icon: Database,
      badge: "Nightly Analytics",
      action: () => {
        window.location.href = "/projects/vcentre";
      },
    },
    {
      id: "copy-email",
      title: `Copy Email (${PROFILE.email})`,
      category: "Contact & Socials",
      icon: Copy,
      badge: "1-Click Copy",
      action: () => {
        navigator.clipboard.writeText(PROFILE.email);
        toast.success("Email copied to clipboard!", {
          description: PROFILE.email,
        });
      },
    },
    {
      id: "nav-stack",
      title: "Jump to Tech Stack & Infrastructure",
      category: "Navigation",
      icon: ArrowRight,
      action: () => {
        document.getElementById("stack")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "nav-about",
      title: "Jump to About & Bio",
      category: "Navigation",
      icon: User,
      action: () => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "nav-contact",
      title: "Jump to Contact Form",
      category: "Navigation",
      icon: Mail,
      action: () => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "open-github",
      title: "Open GitHub Profile",
      category: "Contact & Socials",
      icon: ExternalLink,
      badge: "GitHub",
      action: () => {
        window.open(PROFILE.socials.github, "_blank");
      },
    },
    {
      id: "open-linkedin",
      title: "Open LinkedIn Profile",
      category: "Contact & Socials",
      icon: ExternalLink,
      badge: "LinkedIn",
      action: () => {
        window.open(PROFILE.socials.linkedin, "_blank");
      },
    },
  ];

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Handle arrow key navigation inside modal
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].action();
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl shadow-cyan-950/40 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleModalKeyDown}
        tabIndex={0}
      >
        {/* Search Header */}
        <div className="flex items-center border-b border-slate-800 px-4 py-3">
          <Search className="h-5 w-5 text-cyan-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search projects, tech stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No matching commands found.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-colors ${
                    isSelected ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isSelected ? "text-cyan-400" : "text-slate-400"}`} />
                    <span className="font-medium">{item.title}</span>
                  </div>

                  {item.badge && (
                    <span className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950/60 px-4 py-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">↑↓</kbd> Navigate</span>
            <span><kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">↵</kbd> Select</span>
          </div>
          <span><kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}

export function CommandPaletteTrigger() {
  const trigger = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <button
      onClick={trigger}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-2.5 sm:px-3 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors"
      title="Open Command Palette (Cmd+K)"
    >
      <Command className="h-3.5 w-3.5 text-cyan-400" />
      <span className="hidden sm:inline font-mono text-[11px]">⌘K</span>
    </button>
  );
}
