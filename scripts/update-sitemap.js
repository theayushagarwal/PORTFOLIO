import fs from 'fs';
import path from 'path';

const sitemapPath = path.resolve('public/sitemap.xml');
const currentDate = new Date().toISOString().split('T')[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://theayush.pages.dev/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://theayush.pages.dev/vurlo-preview.webp</image:loc>
      <image:title>Vurlo E-commerce storefront screenshot mockup</image:title>
    </image:image>
    <image:image>
      <image:loc>https://theayush.pages.dev/veltrix-preview.webp</image:loc>
      <image:title>Veltrix autonomous social engine control panel</image:title>
    </image:image>
    <image:image>
      <image:loc>https://theayush.pages.dev/vcentre-preview.webp</image:loc>
      <image:title>Vcentre competitor intelligence scraper dashboard</image:title>
    </image:image>
  </url>
</urlset>
`;

fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log(`Updated sitemap.xml with lastmod date: ${currentDate}`);
