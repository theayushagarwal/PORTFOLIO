import { Reveal } from "./Reveal";
import { PROFILE } from "@/lib/site-data";

const MILESTONES = [
  { date: "June 2026", title: "Shipped Veltrix Bot", desc: "Engineered multi-model LLM consensus engine auto-publishing twice daily." },
  { date: "June 2026", title: "Initiated Vurlo SaaS", desc: "Designed full-stack e-commerce architecture, Firestore rules, and Razorpay routing." },
  { date: "July 2026", title: "Launched Vcentre Scraper", desc: "Created 10-provider LLM scraping pipeline and feedback scoring loop." },
  { date: "July 2026", title: "Crafted Portfolio Redesign", desc: "Developed glassmorphic 3D developer showcase with fluid animations." },
];

export function About() {
  return (
    <section id="about" className="relative py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="eyebrow">About</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                Built to ship. <br />
                Wired to scale.
              </h2>
            </Reveal>
          </div>

          <div className="space-y-6 md:col-span-7 md:col-start-6">
            {PROFILE.bio.map((para, i) => (
              <Reveal key={para.slice(0, 12)} delay={i}>
                <p className="text-lg leading-relaxed text-muted-foreground">{para}</p>
              </Reveal>
            ))}

            <Reveal delay={2}>
              <div className="mt-12 space-y-6">
                <p className="eyebrow">Milestones</p>
                <div className="relative pl-6 border-l border-border space-y-8 mt-4">
                  {MILESTONES.map((m, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[29px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full border border-primary bg-background">
                        <span className="h-1 w-1 rounded-full bg-primary" />
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-primary font-semibold">{m.date}</span>
                        <h4 className="font-display font-semibold text-foreground text-sm">{m.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={3}>
              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-border pt-8">
                <div>
                  <p className="eyebrow">Currently</p>
                  <p className="mt-2 text-sm text-foreground">{PROFILE.currently}</p>
                </div>
                <div>
                  <p className="eyebrow">Previously</p>
                  <p className="mt-2 text-sm text-foreground">{PROFILE.previously}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
