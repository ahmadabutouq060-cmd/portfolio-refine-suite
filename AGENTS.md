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

- Preserve TanStack Start routing and existing portfolio components; extend them rather than importing the archive's application bootstrap, to retain working runtime behavior and repository history.
- Portfolio content is stored in Cloud tables with literal migration seeds; public loaders use an anonymous read-only server client and owner editing uses authenticated server functions plus RLS, so drafts and private files never leak.
- Administrator roles are assigned only by a protected verified-Google owner allowlist; clients cannot assign roles or change the allowlist, preventing self-promotion.
- Use a private media bucket with publication-aware access policies; uploaded files remain private until explicitly published and linked to published content.
- Keep theme colors in semantic CSS variables and render browser-persisted theme state only after hydration, preserving SSR consistency.
