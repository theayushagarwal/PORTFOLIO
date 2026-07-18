---
name: Cosmic Obsidian Developer Desk
description: Sleek dark cosmic developer portfolio with glowing cyan and violet accent highlights and restrained tactical layouts.
colors:
  primary: "#8b5cf6"
  secondary: "#06b6d4"
  neutral-bg: "#07050f"
  neutral-surface: "#0d0a18"
  neutral-card: "#131020"
  neutral-text: "#fafafa"
  neutral-muted: "#a1a1aa"
  neutral-subtle: "#71717a"
  border: "rgba(255, 255, 255, 0.08)"
typography:
  display:
    fontFamily: "Inter Tight, Inter, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 5.25rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
  card:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Cosmic Obsidian Developer Desk

## 1. Overview

**Creative North Star: "Cosmic Obsidian Developer Desk"**

A high-fidelity developer showcase aesthetic built on a dark, layered cosmic color space. The design combines an industrial layout structure with fluid, high-performance interactions, replicating the experience of sitting at an advanced developer dashboard console.

The system rejects default beige "AI cream" palettes, plain uninspired grids, and generic outline borders. Spacing is tight and deliberate, using interactive hover states (cursor spotlighting, micro-glows, 3D card tilt) to breathe life into clean boundaries.

**Key Characteristics:**
- Deep dark background tinting (#07050f)
- Glowing violet (#8b5cf6) and cyan (#06b6d4) interactive anchors
- High-contrast typography pairing displaying tight sans-serif titles alongside monospace metadata labels
- Responsive 3D parallax scroll reveals and mouse-movement reflections that feel physically tactical

## 2. Colors

A dark, atmospheric color spectrum with vibrant cyberpunk glowing elements.

### Primary
- **Cosmic Violet** (#8b5cf6): The primary brand identifier. Used for glowing borders, button backgrounds, timeline indicators, and focal points.

### Secondary
- **Electric Cyan** (#06b6d4): The secondary highlight color. Used sparingly for status pulses, active tags, hover outlines, and key metric labels.

### Neutral
- **Cosmic Void** (#07050f): The base background color of the canvas.
- **Obsidian Surface** (#0d0a18): Background color for panel containers and overlays.
- **Tactical Card** (#131020): Background color for cards and secondary content block groupings.
- **Pure Bright Ink** (#fafafa): High-contrast foreground text color.
- **Dim Slate** (#a1a1aa): Color for body paragraphs and descriptive copy.
- **Deep Slate** (#71717a): Color for secondary labels and timestamps.

### Named Rules
**The Accent Economy Rule.** Accent colors must occupy less than 10% of any viewport. Their scarcity is what makes them draw the user's focus during high-value interactions.

**The Tinted Neutral Rule.** Dark neutrals are never absolute black (#000000); they are tinted with deep purple hues to maintain the cosmic character.

## 3. Typography

**Display Font:** Inter Tight (with Inter fallback)
**Body Font:** Inter (with system-ui fallback)
**Label/Mono Font:** JetBrains Mono

A high-contrast editorial developer pairing: heavy geometric display headlines with structural, clean monospace labels.

### Hierarchy
- **Display** (600, clamp(2.5rem, 7vw, 5.25rem), 1.02): Used for primary page title headlines in the Hero section.
- **Headline** (600, 3xl/4xl, 1.1): Used for main section titles (e.g. "Selected Work", "About").
- **Title** (600, xl/2xl, 1.2): Used for project names and card titles.
- **Body** (400, 15px, 1.6): Used for bios, summary narratives, and project taglines. Cap line length at 70ch.
- **Label** (400, 11px, tracking-widest, uppercase): Used for eyebrows, metrics indicators, and tech stack tags.

### Named Rules
**The Balance Wrap Rule.** Headline and Display headings always employ `text-wrap: balance` to prevent awkward orphaned words and uneven line wrapping.

## 4. Elevation

The system is flat by default, opting for crisp solid borders and subtle backdrop-filters instead of heavy drop shadows.

### Shadow Vocabulary
- **Ambient Accent Glow** (`box-shadow: 0 0 30px rgba(139, 92, 246, 0.09)`): Used under highlighted cards to simulate glowing monitor ambient backlighting.

### Named Rules
**The Restrained Elevation Rule.** Components are flat at rest. Depth is strictly interactive and triggered by user presence (3D card tilt and cursor spotlight position mapping).

## 5. Components

### Buttons
- **Shape:** Rounded corners (12px radius, `var(--radius-lg)`).
- **Primary:** Violet background with white text, micro-glow on hover, and smooth interactive scale transition.
- **Ghost:** Borderless with slate text, fading to cyan outline highlights on hover.

### Cards / Containers
- **Corner Style:** Rounded corners (12px radius, `var(--radius-lg)`).
- **Background:** Dark Obsidian Card fill (#131020).
- **Interactive State:** Hover zooms visual contents by 4% (`scale-[1.04]`), triggers cursor spotlight, and translates content elements forward on the Z-axis.

### Inputs / Fields
- **Style:** Dark outline input field (#131020) with transparent border.
- **Focus:** Violet border ring (#8b5cf6) with 2px offset.

### Navigation
- **Style:** Sticky top glassmorphic navbar with backdrop-filter blur (12px). Link hover states trigger a light text color transition synced with subtle tick sound effects.

## 6. Do's and Don'ts

### Do:
- **Do** wrap project articles inside `<Reveal>` components to animate them using GPU-accelerated 3D scroll entrances.
- **Do** restrict wide letter-spacing tracking strictly to labels using JetBrains Mono.
- **Do** guard all browser-only globals (like `window` or `document`) with `typeof window !== "undefined"` checks.

### Don't:
- **Don't** use plain, flat layouts or generic template themes without micro-glows or cosmic neutral backgrounds.
- **Don't** add side-stripe colored borders on cards as decorative highlights.
- **Don't** include sketchy SVG illustrations or hand-drawn graphics.
- **Don't** load heavy JS libraries for page scroll animations; use CSS Compositor properties (opacity, scale, blur, perspective) driven by IntersectionObserver toggles.
