import { createFileRoute } from "@tanstack/react-router";
import { PROJECTS } from "@/lib/site-data";
import { WorkspacePanel } from "@/components/portfolio/WorkspacePanel";

export const Route = createFileRoute("/projects/chronosync")({
  head: () => ({
    title: "Chronosync Case Study | Ayush Agarwal",
    meta: [
      { title: "Chronosync Case Study | Ayush Agarwal" },
      {
        name: "description",
        content:
          "Case study of Chronosync: an autonomous FastAPI + Playwright web monitor and visual regression Diff Studio with URL deduplication, 4-layer noise suppression, and 29 automated tests.",
      },
      { property: "og:title", content: "Chronosync Case Study | Ayush Agarwal" },
      {
        property: "og:description",
        content:
          "Case study of Chronosync: an autonomous FastAPI + Playwright web monitor and visual regression Diff Studio with URL deduplication, 4-layer noise suppression, and 29 automated tests.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://theayush.pages.dev/projects/chronosync" },
      { property: "og:image", content: "https://theayush.pages.dev/portfolio-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Chronosync Case Study | Ayush Agarwal" },
      {
        name: "twitter:description",
        content:
          "Case study of Chronosync: an autonomous FastAPI + Playwright web monitor and visual regression Diff Studio with URL deduplication, 4-layer noise suppression, and 29 automated tests.",
      },
      { name: "twitter:image", content: "https://theayush.pages.dev/portfolio-preview.webp" },
      {
        name: "twitter:image:alt",
        content: "Chronosync autonomous web monitoring and visual regression Diff Studio case study by Ayush Agarwal.",
      },
      {
        name: "keywords",
        content:
          "Chronosync, Visual Regression, Web Monitoring, FastAPI, Playwright, SQLite, Diff Studio, Pixel Heatmap, Ayush Agarwal",
      },
    ],
    links: [{ rel: "canonical", href: "https://theayush.pages.dev/projects/chronosync" }],
  }),
  component: ChronosyncCaseStudy,
});

const CHRONOSYNC_PROJECT_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "Chronosync",
  url: "https://theayush.pages.dev/projects/chronosync",
  description:
    "Autonomous web monitoring platform and visual regression Diff Studio using FastAPI, Playwright, SQLite, 4-layer noise suppression, and persistence-checked alerting.",
  programmingLanguage: ["Python", "JavaScript"],
  codeRepository: "https://github.com/theayushagarwal/Chronosync",
  author: {
    "@type": "Person",
    "@id": "https://theayush.pages.dev/#person",
  },
});

const CHRONOSYNC_BREADCRUMB_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://theayush.pages.dev",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Projects",
      item: "https://theayush.pages.dev/#projects",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Chronosync",
      item: "https://theayush.pages.dev/projects/chronosync",
    },
  ],
});

function ChronosyncCaseStudy() {
  const project = PROJECTS.find((p) => p.name.toLowerCase() === "chronosync");
  if (!project) return null;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: CHRONOSYNC_PROJECT_JSON_LD }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: CHRONOSYNC_BREADCRUMB_JSON_LD }}
      />
      <WorkspacePanel project={project} />
    </>
  );
}
