---
name: architect
description: Decomposes complex tasks, orchestrates parallel subagents, and applies the Planner-Worker-Judge loop.
---

# Architect & Coordination Skill

Use this skill when tackling complex modifications (e.g. adding new UI features, interactive backdrops, or refactoring layouts).

## 1. Task Decomposition (Planner Phase)
- Before modifying files, break the overall goal into modular sub-tasks (e.g., CSS layout styling, interactive animation physics, state hooks).
- Identify dependencies: determine what files must be modified first (e.g., core utility functions) before downstream visual components are updated.

## 2. Multi-Agent Delegation (Worker Phase)
- If a sub-task is a large research lookup (such as scanning CSS properties or checking external configuration setups), delegate it immediately by spinning up a `research` subagent using the `invoke_subagent` tool.
- If multiple modules are unrelated (e.g., editing `site-data.ts` and compressing asset images), work in parallel or delegate code tasks to a `self` subagent, allowing concurrent executions.

### When to Use Parallel Subagents (Specific Examples)
- **Image Compression + Data Updates**: Running image compression scripts while editing metadata files in parallel.
- **Styling Stylesheets + Site-Data Configs**: Writing custom background styling rules in CSS files while updating project descriptions in `site-data.ts` concurrently.

### When NOT to Spawn Subagents
- **Simple Edits**: Do not spawn subagents for single-file tweaks or tasks taking under ~5 minutes of execution time. Doing them inline is faster and saves token context.
- **Build Errors**: Fixing a build compilation error must always be done sequentially so you can inspect compiler feedback before writing the fix.

## 3. Merge & Verification (Judge Phase)
- Once sub-tasks complete, compile the client and server bundles locally via `npm run build` to verify there are no compilation errors or warnings.
- Run a manual inspection to check layout responsiveness and visual alignments.
