# AGENTS.md

## Purpose

This repository is a project matching product for people who want to find someone to work with.

Current product intent:

- One side publishes projects that need collaborators.
- The other side advertises individual profiles looking for the right project.
- Technical and non-technical users should both feel welcome.
- The app should be agnostic: shops, startups, local ideas, personal projects, creative work, research, and similar projects are all valid.

Important caveat:

- The **product language** should be project / collaborator oriented.
- The **physical schema** still uses technical table names like `Project`, `DevelopmentTool`, and `Communication`.
- Do not assume the database vocabulary matches the UI vocabulary.

## Stack

- Next.js `16.2.3`
- React `19.2.5`
- App Router for UI routes
- Pages Router kept for API routes under `pages/api`
- Better Auth with Google OAuth
- Supabase as the primary datastore
- TanStack Query for client data fetching
- Tailwind CSS v4
- Local shadcn-style UI primitives under `components/UI`

## Commands

- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Start production build: `npm run start`
- Better Auth schema migration: `npm run auth:migrate`
- Data migration helper: `npm run migrate:data`

Notes:

- `npm run build` uses `next build --webpack`.
- This is intentional. Turbopack was previously problematic on this codebase.

## Dev Server Notes

- `next.config.js` includes:
  - `allowedDevOrigins: ['192.168.0.55']`
- If dev-origin behavior changes, restart the dev server after editing `next.config.js`.

## Route Architecture

### App Router UI

Main UI routes live under `app/`:

- `/` -> `app/page.jsx`
- `/about` -> `app/about/page.jsx`
- `/privacy` -> `app/privacy/page.jsx`
- `/auth/signin` -> `app/auth/signin/page.jsx`
- `/dashboard` -> `app/dashboard/page.jsx`
- `/projects` -> `app/projects/page.jsx`
- `/projects/[id]` -> `app/projects/[id]/page.jsx`
- `/projects/create-project` -> `app/projects/create-project/page.jsx`
- `/projects/update/[id]` -> `app/projects/update/[id]/page.jsx`
- `/collaborators` -> `app/collaborators/page.jsx`
- `/settings` -> `app/settings/page.jsx`
- `/user/[id]` -> `app/user/[id]/page.jsx`

### API Routes

UI auth endpoint:

- `app/api/better-auth/[...all]/route.js`

Pages Router API routes remain under `pages/api/`.

Key endpoints:

- `pages/api/project/[id].js`
- `pages/api/project/createProject.js`
- `pages/api/project/delete/[id].js`
- `pages/api/project/getAllProjects.js`
- `pages/api/project/getProjectsByEmail.js`
- `pages/api/project/update/[id].js`
- `pages/api/project/update/putUserProject.js`
- `pages/api/search/[slug].js`
- `pages/api/user/[id].js`
- `pages/api/user/connect/[id].js`
- `pages/api/user/delete/[id].js`
- `pages/api/user/getAllUsers.js`
- `pages/api/user/getUserInformation.js`
- `pages/api/user/putUserSettings.js`

Important product route note:

- `app/projects/[id]/page.jsx` no longer uses Giscus / GitHub comments
- project detail pages now use native product actions and guidance instead of public discussion threads

## Auth

Shared auth files:

- `lib/better-auth.js`
- `lib/better-auth-client.js`
- `lib/better-auth-server.js`

Better Auth route:

- `app/api/better-auth/[...all]/route.js`

Current auth behavior:

- Better Auth handles Google OAuth plus session management.
- Better Auth stores auth records in lowercase tables:
  - `user`
  - `session`
  - `account`
  - `verification`
- The app still uses its own Supabase tables like `User` and `Project`.
- `lib/better-auth.js` uses Better Auth `databaseHooks.user.create/update` to sync auth users into the app-level `User` table.
- `lib/better-auth.js` also exports `deleteBetterAuthUserByEmail(email)` for full account deletion.
- `lib/better-auth-server.js` provides `getBetterAuthSession(req, { syncAppUser: true })` for Pages API routes.
- Use `syncAppUser: true` on authenticated API routes when the app-level `User` row must exist.

Client auth usage:

- `betterAuthClient.useSession()` for client session state
- `betterAuthClient.signIn.social({ provider: 'google', callbackURL })` for sign-in
- `betterAuthClient.signOut()` for sign-out

Important origin requirements:

- `BETTER_AUTH_URL` must exactly match the origin used in the browser in local dev.
- Do not mix `localhost` and `192.168.0.55` inside the same auth flow.
- `lib/better-auth.js` explicitly trusts:
  - `BETTER_AUTH_URL`
  - `NEXT_PUBLIC_APP_URL`
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
  - `http://192.168.0.55:3000`

Google OAuth callback URL must match the active origin:

- `http://localhost:3000/api/better-auth/callback/google`
- or `http://192.168.0.55:3000/api/better-auth/callback/google`

App-level providers:

- `app/providers.jsx`

Protected app screens still use a client-side auth guard:

- `components/UI/auth-guard.jsx`

This is pragmatic, not final architecture. If stricter protection is needed later, move more checks server-side.

## Environment Notes

Expected local environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Important distinctions:

- `SUPABASE_SERVICE_ROLE_KEY` is required for `utils/supabase-admin.js`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is for client Supabase usage
- `BETTER_AUTH_DATABASE_URL` or `SUPABASE_DB_URL` is the Postgres connection string for Better Auth
- `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` must match the real dev origin exactly

Common setup-sensitive failures:

- If `SUPABASE_SERVICE_ROLE_KEY` is missing, server-side Supabase access fails even if Better Auth works.
- If Supabase only has Better Auth tables and not the app tables from `supabase/schema.sql`, profile/project APIs fail because tables like `User` and `Project` do not exist.
- If Better Auth works but the app-level `User` row is missing, some profile/settings routes can return `null` until the lazy sync path runs.
- If only the app `User` row is deleted without deleting Better Auth records, the user can be recreated later by auth sync. The current delete-account flow now deletes both.

## UI System

Prefer local UI primitives in `components/UI` where possible:

- `button.jsx`
- `card.jsx`
- `input.jsx`
- `textarea.jsx`
- `dialog.jsx`
- `dropdown-menu.jsx`
- `select.jsx`
- `badge.jsx`
- `avatar.jsx`
- `profile-avatar.jsx`

The project does **not** use the shadcn CLI directly, but follows standard shadcn/ui component patterns and CSS variables.

### Visual Direction

The UI direction is modern, high-contrast, and editorial:

- Palette: zinc / black / white
- Typography: Inter for UI text
- Layout: editorial sections, bento-style groupings, generous whitespace
- Branding: Japanese character `技` as logo / watermark
- Common effects:
  - `glass`
  - `bg-grid-zinc`
  - mesh / radial gradients
  - strong type hierarchy

## Product Model Mapping

### Current semantic intent

The app speaks in terms like:

- collaborator profile
- project
- project brief
- project stage
- time commitment
- strengths
- industries and interests
- proof and context

### Current physical storage reality

Legacy fields still back the product:

- `Project.title` -> project title
- `Project.description` -> project summary / why this matters
- `Project.tags` -> markets / themes / sectors
- `Project.skills` -> ideal collaborator strengths
- `Project.technology_stack` -> helpful backgrounds / domains
- `Project.development_status` -> project stage
- `Project.difficulty_level` -> time commitment
- `Project.team_need` -> number of collaborators wanted

Legacy related tables are also repurposed:

- `Communication` -> contact and presence links
- `DevelopmentTool` -> proof, prototype, planning, and work-signal links

Do not rename these lightly without coordinating:

- Supabase schema
- API payloads
- migration scripts
- route UI

## Two-Sided Discovery Direction

The current intended product split is:

- `/projects` for projects looking for collaborators
- `/collaborators` for people advertising themselves as available to work on projects

Current interaction model:

- `Apply` on projects
- `Connect` on people profiles
- no GitHub-comment / Giscus discussion layer on project pages

Important nuance:

- Registration alone does **not** mean a user should appear on `/collaborators`.
- A user may only want to publish projects.
- People discovery visibility is now explicit opt-in.

Current behavior:

- `User.show_in_collaborator_feed` controls whether a person appears on `/collaborators`
- `User.availability` stores their declared discovery availability
- Default is `false`
- Settings page exposes this as a `Private` / `Public` visibility choice
- Settings page also exposes availability values such as `exploring`, `part_time`, and `full_time`
- `listUsers()` only returns users with:
  - `show_in_collaborator_feed === true`
  - and enough profile signal to be meaningful
- Profile cards now enrich user data with:
  - `projectCount`
  - `connectionCount`
  - `signalRating`
  - `isConnectedToViewer`

Schema note:

- `supabase/schema.sql` now includes `show_in_collaborator_feed boolean not null default false` on `User`
- `supabase/schema.sql` now includes `availability text not null default 'not_specified'` on `User`
- `supabase/schema.sql` now includes a `Connection` table for user-to-user connections
- Existing Supabase projects may need the manual SQL:
  - `alter table public."User" add column if not exists show_in_collaborator_feed boolean not null default false;`
  - `alter table public."User" add column if not exists availability text not null default 'not_specified';`
  - create `public."Connection"` if the project predates connections

## API Payloads

Project API routes should use the current project/collaborator payload names only.

Relevant files:

- `pages/api/project/createProject.js`
- `pages/api/project/update/putUserProject.js`

Do not add old vocabulary aliases unless a migration requires it explicitly.

## Data Layer

Primary data helper:

- `utils/supabase-db.js`

Important exported functions include:

- `syncUserFromAuth`
- `getUserByEmail`
- `getUserById`
- `listUsers`
- `listProjects`
- `getProjectById`
- `getProjectsByUserEmail`
- `searchProjects`
- `createProjectForUser`
- `createConnectionBetweenUsers`
- `updateProjectById`
- `updateUserSettingsByEmail`
- `deleteProjectById`
- `deleteUserById`

Notes:

- Function names still use `Project` terminology. This is technical debt, but still accurate for the current schema.
- `User.name` is currently treated as a full-name field in the UI.
- There is no separate surname / last-name column.
- `User.hobbies` currently backs “passions, industries, and interests” in the UI.
- `User.availability` stores people-discovery availability, not project-level commitment.

## Schema Status

Runtime storage uses Supabase.

Supabase has two distinct groups of tables:

1. Better Auth tables:
   - `user`
   - `session`
   - `account`
   - `verification`

2. App tables from `supabase/schema.sql`:
   - `User`
   - `UserSocialProfile`
   - `Project`
   - `DevelopmentTool`
   - `Communication`
   - `Connection`

Both groups are required. Creating only the Better Auth tables is not enough for the app to function.

Migration-related work currently lives in:

- `scripts/migrate-postgres-to-supabase.mjs`

If you perform a real backend model rename, update:

- Supabase SQL
- API handlers
- `utils/supabase-db.js`
- migration scripts
- docs in `README.md`

## Error Handling

The application generally uses user-friendly API/UI messages while logging detailed errors server-side.

Examples:

- API routes often return generic messages like `Unable to load projects at this time`
- UI surfaces often use error cards with retry actions
- environment/configuration problems log more detail on the server than the client sees

## Known Architectural Debt

These are still valid follow-up areas:

1. Some backend table names are still technical implementation names.
2. Some API route names still reflect the older product model.
3. Search/filtering is still listing-metadata-driven, not real fit matching.
4. App Router auth protection is still mostly client-side.
5. The settings/profile flows still contain substantial repetitive form logic.
6. Project applications are still lightweight CTA-driven, not a full in-app application system.
7. Profile credibility is currently a computed signal score, not a true review or endorsement system.
8. `@giscus/react` may still remain in dependencies even though the project page discussion block has been removed.

## Files Worth Reading First

If you are picking up work, read these first:

- `package.json`
- `next.config.js`
- `app/layout.jsx`
- `app/providers.jsx`
- `lib/better-auth.js`
- `lib/better-auth-client.js`
- `lib/better-auth-server.js`
- `utils/supabase-db.js`
- `app/page.jsx`
- `app/projects/page.jsx`
- `app/collaborators/page.jsx`
- `app/projects/[id]/page.jsx`
- `app/projects/create-project/page.jsx`
- `app/settings/page.jsx`
- `app/user/[id]/page.jsx`
- `components/NavbarUI/Navbar.jsx`
- `components/ProjectsCard.jsx`
- `components/CollaboratorCard.jsx`

## Safety Notes

- The worktree may already be dirty. Do not revert unrelated user changes.
- Prefer incremental refactors over large schema renames unless you are explicitly completing the backend migration too.
- If you add new matching fields, decide whether they are:
  - UI aliases mapped to existing columns, or
  - real storage fields requiring schema changes

Be explicit about that choice before implementing.
