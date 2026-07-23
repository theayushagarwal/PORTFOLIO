import { createFileRoute } from "@tanstack/react-router";
import { PROJECTS } from "@/lib/site-data";
import { WorkspacePanel } from "@/components/portfolio/WorkspacePanel";

export const Route = createFileRoute("/projects/veltrix")({
  head: () => ({
    title: "Veltrix Case Study | Ayush Agarwal",
    meta: [
      {
        name: "description",
        content:
          "Deep dive into Veltrix: an autonomous Instagram publishing engine orchestrating 18+ active API keys and employing multi-model adversarial consensus (Gemini, Groq, Cerebras).",
      },
      { property: "og:title", content: "Veltrix Case Study | Ayush Agarwal" },
      {
        property: "og:description",
        content:
          "Deep dive into Veltrix: an autonomous Instagram publishing engine orchestrating 18+ active API keys and employing multi-model adversarial consensus (Gemini, Groq, Cerebras).",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://theayush.pages.dev/projects/veltrix" },
      { property: "og:image", content: "https://theayush.pages.dev/veltrix-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Veltrix Case Study | Ayush Agarwal" },
      {
        name: "twitter:description",
        content:
          "Deep dive into Veltrix: an autonomous Instagram publishing engine orchestrating 18+ active API keys and employing multi-model adversarial consensus (Gemini, Groq, Cerebras).",
      },
      { name: "twitter:image", content: "https://theayush.pages.dev/veltrix-preview.webp" },
    ],
    links: [{ rel: "canonical", href: "https://theayush.pages.dev/projects/veltrix" }],
  }),
  component: VeltrixCaseStudy,
});

const VELTRIX_PROJECT_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "Veltrix",
  url: "https://theayush.pages.dev/projects/veltrix",
  description:
    "An autonomous publishing engine orchestrating 18+ APIs. Employs a multi-model adversarial consensus group (Gemini, Groq, Cerebras) to audit captions, and schedules Playwright slide renders.",
  programmingLanguage: ["Python"],
  codeRepository: "https://github.com/theayushagarwal/PORTFOLIO",
  author: {
    "@type": "Person",
    "@id": "https://theayush.pages.dev/#person",
  },
});

function VeltrixCaseStudy() {
  const project = PROJECTS.find((p) => p.name.toLowerCase() === "veltrix");
  if (!project) return null;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: VELTRIX_PROJECT_JSON_LD }}
      />
      <WorkspacePanel project={project} />
    </>
  );
}
