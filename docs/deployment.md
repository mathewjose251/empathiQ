# Deployment Options

## Fastest path right now

Use GitHub as the code host and Vercel as the validator-facing deployment target.

Why:

- the current `parent-portal` app is a real Next.js app, not only static HTML
- the teen Pack preview and admin moderation console use browser-side `/api` calls in normal mode
- Vercel supports the full Next.js app shape without needing a special export mode

## GitHub Pages option

GitHub Pages is not a good fit for the current app shape yet.

Why:

- the current app uses Next.js App Router route handlers under [app/api](/Users/mathewjose/Documents/empathiQ/apps/parent-portal/app/api)
- the teen Pack preview and admin moderation console rely on API-backed interactions in normal mode
- GitHub Pages only serves static files

We did add a static-preview behavior inside the interactive client components:

- [TeenMissionExperience.tsx](/Users/mathewjose/Documents/empathiQ/apps/parent-portal/app/_components/TeenMissionExperience.tsx)
- [AdminPackModerationConsole.tsx](/Users/mathewjose/Documents/empathiQ/apps/parent-portal/app/_components/AdminPackModerationConsole.tsx)

That means a future dedicated static-preview app is possible, but it is not fully wired as a Pages deployment in this repo today.

## What to choose

### Use Vercel if you want

- the current app to work normally
- Next.js server and API behavior
- the easiest public validation URL

### Use GitHub Pages if you want

- a free static preview link
- route-by-route design review
- no backend requirement for reviewers

Note:

This requires a separate static-preview build target, which we have not finalized yet.

## Vercel setup

1. Import the GitHub repository into Vercel.
2. Choose [apps/parent-portal](/Users/mathewjose/Documents/empathiQ/apps/parent-portal) as the project root directory.
3. Deploy.
4. Use the generated preview URL for validation.
