import { createFileRoute } from "@tanstack/react-router";
import { PROJECTS } from "@/lib/site-data";
import { WorkspacePanel } from "@/components/portfolio/WorkspacePanel";

export const Route = createFileRoute("/projects/carrel")({
  head: () => ({
    title: "Carrel Case Study | Ayush Agarwal",
    meta: [
      { title: "Carrel Case Study | Ayush Agarwal" },
      {
        name: "description",
        content:
          "Detailed case study of Carrel: a real-time collaborative code workspace built with Yjs CRDTs, binary WebSocket multiplexing, Fastify, SQLite WAL, and CodeMirror 6.",
      },
      { property: "og:title", content: "Carrel Case Study | Ayush Agarwal" },
      {
        property: "og:description",
        content:
          "Detailed case study of Carrel: a real-time collaborative code workspace built with Yjs CRDTs, binary WebSocket multiplexing, Fastify, SQLite WAL, and CodeMirror 6.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://theayush.pages.dev/projects/carrel" },
      { property: "og:image", content: "https://theayush.pages.dev/carrel-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Carrel Case Study | Ayush Agarwal" },
      {
        name: "twitter:description",
        content:
          "Detailed case study of Carrel: a real-time collaborative code workspace built with Yjs CRDTs, binary WebSocket multiplexing, Fastify, SQLite WAL, and CodeMirror 6.",
      },
      { name: "twitter:image", content: "https://theayush.pages.dev/carrel-preview.webp" },
      {
        name: "twitter:image:alt",
        content: "Carrel dark-mode collaborative editor showing synchronized Yjs remote carets and activity feed.",
      },
      {
        name: "keywords",
        content:
          "Carrel, Yjs CRDT, Collaborative Editor, WebSocket Multiplexing, Fastify, CodeMirror 6, TypeScript Monorepo, Ayush Agarwal",
      },
    ],
    links: [{ rel: "canonical", href: "https://theayush.pages.dev/projects/carrel" }],
  }),
  component: CarrelCaseStudy,
});

const CARREL_PROJECT_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "Carrel",
  url: "https://theayush.pages.dev/projects/carrel",
  description:
    "Real-time collaborative workspace for code and notes using Yjs CRDTs, 1-byte multiplexed binary WebSockets, Fastify, SQLite WAL snapshots, HMAC upgrade tickets, and CodeMirror 6.",
  programmingLanguage: ["TypeScript", "React"],
  codeRepository: "https://github.com/theayushagarwal/carrel",
  author: {
    "@type": "Person",
    "@id": "https://theayush.pages.dev/#person",
  },
});

const CARREL_BREADCRUMB_JSON_LD = JSON.stringify({
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
      name: "Carrel",
      item: "https://theayush.pages.dev/projects/carrel",
    },
  ],
});

function CarrelCaseStudy() {
  const project = PROJECTS.find((p) => p.name.toLowerCase() === "carrel");
  if (!project) return null;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: CARREL_PROJECT_JSON_LD }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: CARREL_BREADCRUMB_JSON_LD }}
      />
      <WorkspacePanel project={project} />
    </>
  );
}
