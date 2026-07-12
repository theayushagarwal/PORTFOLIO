import { Reveal } from "./Reveal";
import { PROFILE } from "@/lib/site-data";

export function About() {
  return (
    <section id="about" className="relative py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="eyebrow">About</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                Half design, <br />
                half code.
              </h2>
            </Reveal>
          </div>

          <div className="space-y-6 md:col-span-7 md:col-start-6">
            {PROFILE.bio.map((para, i) => (
              <Reveal key={para.slice(0, 12)} delay={i}>
                <p className="text-lg leading-relaxed text-muted-foreground">{para}</p>
              </Reveal>
            ))}

            <Reveal delay={3}>
              <div className="mt-10 grid grid-cols-2 gap-8 border-t border-border pt-8">
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
