import fs from "fs";
import path from "path";

const sitemapPath = path.resolve("public/sitemap.xml");
const currentDate = new Date().toISOString().split("T")[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://theayush.pages.dev/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://theayush.pages.dev/projects/vurlo</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://theayush.pages.dev/projects/veltrix</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://theayush.pages.dev/projects/vcentre</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`;

fs.writeFileSync(sitemapPath, sitemapContent, "utf8");
console.log(`Updated sitemap.xml with lastmod date: ${currentDate}`);
