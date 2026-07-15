import { HERO_STATS } from "@/lib/site-data";
import { Reveal } from "./Reveal";

export function StatsBar() {
  return (
    <section className="border-y border-border/60 bg-background/25 py-10 backdrop-blur-sm select-none relative z-10">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <dl className="grid grid-cols-2 gap-y-8 gap-x-6 sm:grid-cols-4 text-center sm:text-left">
            {HERO_STATS.map((s) => (
              <div key={s.k} className="flex flex-col gap-1.5">
                <dd className="font-display text-3xl font-semibold tabular-nums text-foreground">
                  {s.v}
                </dd>
                <dt className="text-[10px] uppercase tracking-widest text-subtle font-mono">
                  {s.k}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
