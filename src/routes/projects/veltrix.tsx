import { createFileRoute } from "@tanstack/react-router";
import { PROJECTS } from "@/lib/site-data";
import { WorkspacePanel } from "@/components/portfolio/WorkspacePanel";

export const Route = createFileRoute("/projects/veltrix")({
  head: () => ({
    title: "Veltrix Case Study | Ayush Agarwal",
    meta: [
      {
        name: "description",
        content: "Deep dive into Veltrix: an autonomous Instagram publishing engine employing multi-model adversarial consensus (Gemini, Groq, Cerebras) for auto-posting carousels.",
      },
      { property: "og:title", content: "Veltrix Case Study | Ayush Agarwal" },
      {
        property: "og:description",
        content: "Deep dive into Veltrix: an autonomous Instagram publishing engine employing multi-model adversarial consensus (Gemini, Groq, Cerebras) for auto-posting carousels.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://theayush.pages.dev/projects/veltrix" },
      { property: "og:image", content: "https://theayush.pages.dev/veltrix-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Veltrix Case Study | Ayush Agarwal" },
      {
        name: "twitter:description",
        content: "Deep dive into Veltrix: an autonomous Instagram publishing engine employing multi-model adversarial consensus (Gemini, Groq, Cerebras) for auto-posting carousels.",
      },
      { name: "twitter:image", content: "https://theayush.pages.dev/veltrix-preview.webp" },
    ],
    links: [
      { rel: "canonical", href: "https://theayush.pages.dev/projects/veltrix" },
    ]
  }),
  component: VeltrixCaseStudy,
});

function VeltrixCaseStudy() {
  const project = PROJECTS.find((p) => p.name.toLowerCase() === "veltrix");
  if (!project) return null;
  return <WorkspacePanel project={project} />;
}
