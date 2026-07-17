<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Global Project Rules

- **Framework Integrity**: Never bypass the TanStack Router structure or dynamic sitemap generation.
- **Client/Server Code Boundary**: Always guard browser-only globals (like `window`, `document`, and `AudioContext`) with server check guards (`typeof window !== "undefined"`).
- **Responsive Layouts**: All new visual UI mockups, layout margins, or frames must scale dynamically across viewport widths using responsive flex/grid and Tailwind breakpoints.
