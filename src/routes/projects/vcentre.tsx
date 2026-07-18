import { createFileRoute } from "@tanstack/react-router";
import { PROJECTS } from "@/lib/site-data";
import { WorkspacePanel } from "@/components/portfolio/WorkspacePanel";

export const Route = createFileRoute("/projects/vcentre")({
  head: () => ({
    title: "Vcentre Case Study | Ayush Agarwal",
    meta: [
      {
        name: "description",
        content:
          "Detailed case study of Vcentre: a competitor intelligence crawler that flags viral outlier posts, routes them through a 10-provider LLM fallback chain, and outputs creative briefs.",
      },
      { property: "og:title", content: "Vcentre Case Study | Ayush Agarwal" },
      {
        property: "og:description",
        content:
          "Detailed case study of Vcentre: a competitor intelligence crawler that flags viral outlier posts, routes them through a 10-provider LLM fallback chain, and outputs creative briefs.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://theayush.pages.dev/projects/vcentre" },
      { property: "og:image", content: "https://theayush.pages.dev/vcentre-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Vcentre Case Study | Ayush Agarwal" },
      {
        name: "twitter:description",
        content:
          "Detailed case study of Vcentre: a competitor intelligence crawler that flags viral outlier posts, routes them through a 10-provider LLM fallback chain, and outputs creative briefs.",
      },
      { name: "twitter:image", content: "https://theayush.pages.dev/vcentre-preview.webp" },
    ],
    links: [{ rel: "canonical", href: "https://theayush.pages.dev/projects/vcentre" }],
  }),
  component: VcentreCaseStudy,
});

function VcentreCaseStudy() {
  const project = PROJECTS.find((p) => p.name.toLowerCase() === "vcentre");
  if (!project) return null;
  return <WorkspacePanel project={project} />;
}
