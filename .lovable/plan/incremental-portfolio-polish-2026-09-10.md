# Incremental Portfolio Polish

## Goal
Improve the uploaded portfolio in place while preserving its structure, sections, routing, real project data, GitHub URLs, and working interactions.

## Existing component map
- `Portfolio`: navbar, hero, About, Stack, Journey, Education, Focus, Contact, and Footer.
- `FeaturedProject`: Ri'aya presentation and screenshot.
- `ProjectCard`: AUShop, Flutter Expense Tracker, and Dice Roller cards.
- `ProjectDetails`: existing project details dialog.
- `TechBadge`: technology labels and icons.
- `GitHubButton`: existing GitHub and live-demo actions.
- `projects.ts`: the four real projects, descriptions, technologies, and original links.
- `styles.css`: current typography, palette, spacing, animation, and responsive rules.

## Changes
1. Bring the uploaded portfolio source into the current project without changing its architecture or routing.
2. Update the existing hero to emphasize “AHMAD / ABU TOUQ,” add the requested role line, retain the current professional introduction, use the provided portrait, show Flutter, Dart, Java, C++, and SQL with recognizable SVG icons, and relabel the existing actions to “View My Work” and “Get In Touch.”
3. Refine the existing navbar spacing, active state, mobile menu, AT/Ahmad Abu Touq branding, and add a linked GitHub icon without changing its navigation.
4. Preserve all four project records and exact GitHub URLs. Polish the existing featured project and cards, retain descriptions, show SVG technology icons and names, and use consistent “View on GitHub” and “Project Details” actions.
5. Replace only Ri'aya’s current image reference with the uploaded Ri'aya screenshot, preserving its exact aspect ratio and improving the existing frame, sharpness, sizing, shadow, and responsive behavior.
6. Improve the existing Stack presentation with the same reusable technology icon treatment, without adding technologies.
7. Replace Contact placeholders with GitHub and `ahmadabutouq116@gmail.com`. Add an intentionally empty LinkedIn constant so no LinkedIn link renders until the real URL is supplied.
8. Extend the existing Footer with GitHub, email, and conditional LinkedIn links while retaining its current content and back-to-top action.
9. Refine the current design tokens and styles only: typography hierarchy, line height, spacing, button polish, restrained hover/fade/lift effects, and layouts at 360, 390, 430, 768, 1024, and 1440 pixels.

## Technical details
- Reuse the current React components and Button component; no duplicated sections or replacement design system.
- Upload the two provided images through the project asset flow and import their asset pointers.
- Add a small social-data constant and reusable icon mapping; LinkedIn stays hidden while its URL is empty.
- Keep animations motion-safe and preserve the existing IntersectionObserver behavior.
- Verify the production build, project dialogs, navigation, all four GitHub destinations, image loading, absence of placeholder copy, and requested viewport widths.
