import { ArrowUpRight, FileText, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Reveal } from "./Reveal";
import { PROFILE } from "@/lib/site-data";

const SOCIAL_LINKS = [
  { icon: Mail, label: "Email", href: `mailto:${PROFILE.email}` },
  { icon: Github, label: "GitHub", href: PROFILE.socials.github },
  { icon: Linkedin, label: "LinkedIn", href: PROFILE.socials.linkedin },
  { icon: Twitter, label: "Twitter", href: PROFILE.socials.twitter },
  { icon: FileText, label: "Résumé", href: PROFILE.socials.resume },
];

export function Contact() {
  return (
    <section id="contact" className="relative py-32 md:py-48">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal>
              <p className="eyebrow">Contact</p>
              <h2 className="mt-6 font-display text-5xl font-semibold tracking-tight md:text-7xl">
                Have something <br />
                <span className="font-serif-accent font-normal italic text-muted-foreground">
                  worth building?
                </span>
              </h2>
            </Reveal>

            <Reveal delay={1}>
              <a
                href={`mailto:${PROFILE.email}`}
                className="link-underline mt-10 inline-flex items-center gap-2 font-display text-2xl text-foreground md:text-3xl"
              >
                {PROFILE.email}
                <ArrowUpRight className="h-6 w-6" />
              </a>
            </Reveal>
          </div>

          <div className="md:col-span-5">
            <Reveal delay={2}>
              <p className="text-sm text-muted-foreground">
                I take on a small number of engagements each quarter — usually founding-engineer
                contracts, technical due diligence, or targeted six-week builds. Replies within 24h.
              </p>

              <ul className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border">
                {SOCIAL_LINKS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      className="flex items-center justify-between bg-background px-5 py-4 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-secondary"
                    >
                      <span className="flex items-center gap-3">
                        <s.icon className="h-4 w-4" aria-hidden="true" />
                        {s.label}
                      </span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
