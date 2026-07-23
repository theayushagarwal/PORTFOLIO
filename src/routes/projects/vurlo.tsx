import { createFileRoute } from "@tanstack/react-router";
import { PROJECTS } from "@/lib/site-data";
import { WorkspacePanel } from "@/components/portfolio/WorkspacePanel";

export const Route = createFileRoute("/projects/vurlo")({
  head: () => ({
    title: "Vurlo Case Study | Ayush Agarwal",
    meta: [
      {
        name: "description",
        content:
          "Detailed case study of Vurlo, a full-stack e-commerce SaaS platform engineered in 10 days with secure stock transactions, coupon logic, and Lighthouse SEO 100/100.",
      },
      { property: "og:title", content: "Vurlo Case Study | Ayush Agarwal" },
      {
        property: "og:description",
        content:
          "Detailed case study of Vurlo, a full-stack e-commerce SaaS platform engineered in 10 days with secure stock transactions, coupon logic, and Lighthouse SEO 100/100.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://theayush.pages.dev/projects/vurlo" },
      { property: "og:image", content: "https://theayush.pages.dev/vurlo-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Vurlo Case Study | Ayush Agarwal" },
      {
        name: "twitter:description",
        content:
          "Detailed case study of Vurlo, a full-stack e-commerce SaaS platform engineered in 10 days with secure stock transactions, coupon logic, and Lighthouse SEO 100/100.",
      },
      { name: "twitter:image", content: "https://theayush.pages.dev/vurlo-preview.webp" },
    ],
    links: [{ rel: "canonical", href: "https://theayush.pages.dev/projects/vurlo" }],
  }),
  component: VurloCaseStudy,
});

const VURLO_PROJECT_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "Vurlo",
  url: "https://theayush.pages.dev/projects/vurlo",
  description:
    "A production-grade e-commerce SaaS platform solo-built in 10 days. Features real-time stock-locking transactions, custom admin analytics panel, and sub-400ms load times.",
  programmingLanguage: ["TypeScript", "React", "CSS"],
  codeRepository: "https://github.com/theayushagarwal/vurlo-ecommerce",
  author: {
    "@type": "Person",
    "@id": "https://theayush.pages.dev/#person",
  },
});

function VurloCaseStudy() {
  const project = PROJECTS.find((p) => p.name.toLowerCase() === "vurlo");
  if (!project) return null;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: VURLO_PROJECT_JSON_LD }}
      />
      <WorkspacePanel project={project} />
    </>
  );
}
