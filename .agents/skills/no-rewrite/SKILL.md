---
name: no-rewrite
description: Prevents unnecessary file rewrites, scope creep, compilation errors, and SSR hydration mismatches.
---

# No Rewrite Guidelines

To maximize token efficiency, maintain codebase stability, and guarantee flawless server-side compilation:

## 1. Targeted Code Edits
- Never rewrite an entire file to fix a small issue. Always target specific functions, HTML nodes, or conditional expressions.
- Keep diffs localized, clean, and directly related to the user's active request.

## 2. Server-Side Rendering (SSR) & Hydration Safety
- **Guard Browser-Only Globals**: Never call browser-specific globals (such as `window`, `document`, `navigator`, or `AudioContext`) outside of `useEffect()` hooks, or without guarding them with `typeof window !== "undefined"` checks.
- **Hydration State Safety**: Ensure that the initial visual output from the server matches the client's output exactly. Avoid using dynamic random variables or local-storage checks on the first render frame.

## 3. Strict Compile & Verification Gate
- Always run `npm run build` locally after editing any component or route files.
- If compilation throws errors or warnings, resolve them immediately before making commits or marking the task as complete.
- Verify that changes do not break sitemap generation routines or dynamic routes.
