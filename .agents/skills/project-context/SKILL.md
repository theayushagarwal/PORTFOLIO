---
name: project-context
description: Core project architecture, page routing layout, and stack context for this portfolio.
---

# Project Context

This workspace contains Ayush Agarwal's redesigned developer portfolio website.

## Technical Stack
- **Framework**: TanStack Start (SSR on React 19)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with Tailwind CSS utility classes
- **Animations**: Framer Motion
- **Hosting & Infrastructure**: Cloudflare Pages / Nitro serverless module
- **Audio Utilities**: Web Audio API synthesizer engine managed inside `src/lib/sound.ts`

## Key Page Routes
- **`src/routes/__root.tsx`**: The SSR layout root. Contains global `<head>` fallback elements, dynamic sitemap tags, document meta wrappers, and JSON-LD schema layouts.
- **`src/routes/index.tsx`**: Homepage route. Defines page-specific canonical links, descriptions, and the OpenGraph/Twitter sharing preview (`og:image: portfolio-preview.webp`).
- **`src/routes/projects/$projectId.tsx`**: Dynamic case study layout loader that opens the specific workspace overlay panel.

## Key Files & Modules
- **Site Metadata & Data Structures**:
  - `src/lib/site-data.ts`: Standard schema configuration, bio text, project logs tags.
  - `src/lib/project-details.ts`: Expanded case studies, technology explanations, lessons learned, and gallery labels.
- **Audio Routing**:
  - `src/lib/sound.ts`: Oscillator node pools, volume nodes, swell/tick/exit triggers.
- **Visual Wrappers**:
  - `src/components/portfolio/WorkspacePanel.tsx`: Case study visual shell, sitemap dynamic routing, loading/boot sequences.

## Image Asset Standards
- All screenshots/images must be stored in `/public/`.
- Images must be in `.webp` format at **85% quality** to keep file sizes small (ideally under 100KB).
- Implement `loading="lazy"` on all gallery `<img>` tags to improve Core Web Vitals performance.

## Build & Deployment Workflows
- **Build**: Running `npm run build` triggers a prebuild script `node scripts/update-sitemap.js` (which updates sitemap.xml with the current ISO date), then compiles Vite client/server bundles.
- **Deploy**: Commits pushed to the `main` branch are auto-deployed by Cloudflare Pages to `theayush.pages.dev`.
