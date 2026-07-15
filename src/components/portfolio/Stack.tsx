import { Reveal } from "./Reveal";
import { STACK } from "@/lib/site-data";

export function Stack() {
  return (
    <section id="stack" className="relative py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="eyebrow">Stack</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Tools I reach for.
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Boring where it should be boring, sharp where it matters. I choose latency and clarity
            over hype.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
          {STACK.map((g, i) => (
            <Reveal key={g.group} delay={i}>
              <div className="h-full bg-background p-8">
                <p className="eyebrow">{g.group}</p>
                <p className="mt-2 text-xs text-muted-foreground/80 leading-relaxed font-normal">{g.desc}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-secondary/40 hover:text-secondary"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
