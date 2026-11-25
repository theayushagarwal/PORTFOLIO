import fs from "fs";
import path from "path";

const sitemapPath = path.resolve("public/sitemap.xml");
const sitemapPagesPath = path.resolve("public/sitemap-pages.xml");
const currentDate = new Date().toISOString().split("T")[0];

const routes = [
  { loc: "https://theayush.pages.dev/", changefreq: "weekly", priority: "1.0" },
  { loc: "https://theayush.pages.dev/projects/vurlo", changefreq: "monthly", priority: "0.8" },
  { loc: "https://theayush.pages.dev/projects/carrel", changefreq: "monthly", priority: "0.8" },
  { loc: "https://theayush.pages.dev/projects/aegisflow", changefreq: "monthly", priority: "0.8" },
  { loc: "https://theayush.pages.dev/projects/chronosync", changefreq: "monthly", priority: "0.8" },
  { loc: "https://theayush.pages.dev/projects/veltrix", changefreq: "monthly", priority: "0.8" },
  { loc: "https://theayush.pages.dev/projects/vcentre", changefreq: "monthly", priority: "0.8" },
];

const urlEntries = routes
  .map(
    (r) => `  <url>
    <loc>${r.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join("\n");

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

fs.writeFileSync(sitemapPath, sitemapContent, "utf8");
fs.writeFileSync(sitemapPagesPath, sitemapContent, "utf8");
console.log(`Updated sitemap.xml and sitemap-pages.xml with lastmod date: ${currentDate}`);
