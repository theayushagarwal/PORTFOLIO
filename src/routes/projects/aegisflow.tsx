import { createFileRoute } from "@tanstack/react-router";
import { PROJECTS } from "@/lib/site-data";
import { WorkspacePanel } from "@/components/portfolio/WorkspacePanel";

export const Route = createFileRoute("/projects/aegisflow")({
  head: () => ({
    title: "AegisFlow Case Study | Ayush Agarwal",
    meta: [
      { title: "AegisFlow Case Study | Ayush Agarwal" },
      {
        name: "description",
        content:
          "Case study of AegisFlow: a zero-dependency Python Bayesian HMM cluster scheduler achieving 99.58% node state accuracy, 87% fewer deadline misses, and 0.64 ms/step latency.",
      },
      { property: "og:title", content: "AegisFlow Case Study | Ayush Agarwal" },
      {
        property: "og:description",
        content:
          "Case study of AegisFlow: a zero-dependency Python Bayesian HMM cluster scheduler achieving 99.58% node state accuracy, 87% fewer deadline misses, and 0.64 ms/step latency.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://theayush.pages.dev/projects/aegisflow" },
      { property: "og:image", content: "https://theayush.pages.dev/portfolio-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AegisFlow Case Study | Ayush Agarwal" },
      {
        name: "twitter:description",
        content:
          "Case study of AegisFlow: a zero-dependency Python Bayesian HMM cluster scheduler achieving 99.58% node state accuracy, 87% fewer deadline misses, and 0.64 ms/step latency.",
      },
      { name: "twitter:image", content: "https://theayush.pages.dev/portfolio-preview.webp" },
      {
        name: "twitter:image:alt",
        content: "AegisFlow autonomous cluster telemetry and Bayesian HMM scheduler case study by Ayush Agarwal.",
      },
      {
        name: "keywords",
        content:
          "AegisFlow, Bayesian HMM, Cluster Scheduler, Distributed Systems, Python, Fault Tolerance, Triage Gating, Ayush Agarwal",
      },
    ],
    links: [{ rel: "canonical", href: "https://theayush.pages.dev/projects/aegisflow" }],
  }),
  component: AegisFlowCaseStudy,
});

const AEGISFLOW_PROJECT_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "AegisFlow",
  url: "https://theayush.pages.dev/projects/aegisflow",
  description:
    "Autonomous cluster telemetry and resilient scheduler using an Exact Bayesian Hidden Markov Model (99.58% accuracy), analytical triage gating (-87% deadline misses), and cold-restart EV barriers in pure Python.",
  programmingLanguage: ["Python"],
  codeRepository: "https://github.com/theayushagarwal/AegisFlow",
  author: {
    "@type": "Person",
    "@id": "https://theayush.pages.dev/#person",
  },
});

const AEGISFLOW_BREADCRUMB_JSON_LD = JSON.stringify({
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
      name: "AegisFlow",
      item: "https://theayush.pages.dev/projects/aegisflow",
    },
  ],
});

function AegisFlowCaseStudy() {
  const project = PROJECTS.find((p) => p.name.toLowerCase() === "aegisflow");
  if (!project) return null;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: AEGISFLOW_PROJECT_JSON_LD }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: AEGISFLOW_BREADCRUMB_JSON_LD }}
      />
      <WorkspacePanel project={project} />
    </>
  );
}
