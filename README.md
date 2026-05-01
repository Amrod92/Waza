![Waza Logo](https://github.com/Amrod92/Waza/blob/main/assets/waza_full_logo.png)

# Waza

Waza is a project matching platform for people who want to find someone to work with.

It currently supports a two-sided flow:

- people can publish projects that need collaborators
- individuals can opt into public people discovery and advertise themselves for the right project

The product is intentionally agnostic: a project can be a shop, startup, local initiative, creative idea, personal project, research effort, or anything else that benefits from the right person.

## Current Product Model

Waza is not limited to startups.

The current direction is:

- project-focused
- collaborator-oriented
- technical and non-technical users welcome
- profile signal and project clarity over volume

Important caveat:

- the UI should speak in project / collaborator language
- the Supabase schema still uses technical table names like `Project`, `DevelopmentTool`, and `Communication`

## Main Flows

### Projects

`/projects` lists projects that are looking for collaborators.

Users can:

- browse project briefs
- inspect stage, commitment, tags, and strengths sought
- view project details
- use the lightweight apply flow
- use native product actions instead of public discussion threads

### People

`/collaborators` lists individual profiles, not projects.

Users only appear there when they explicitly opt in from profile settings.

Profile cards currently show:

- profile summary
- strengths and interests
- active project count
- availability
- connection count
- computed signal rating

## Tech Stack

**Client**

- React 19
- Next.js 16
- Tailwind CSS v4
- TanStack Query v5
- Radix-based local UI primitives
- React Icons

**Server**

- Next.js App Router for UI routes
- Next.js Pages Router for API routes
- Better Auth
- Supabase

**Database**

- Supabase Postgres
- Better Auth tables for auth
- custom Supabase app tables for product data

## Auth

The app uses Better Auth with Google OAuth.

Key points:

- Better Auth handles auth/session state
- auth records live in lowercase tables:
  - `user`
  - `session`
  - `account`
  - `verification`
- the app separately stores product data in app tables like `User` and `Project`
- auth users are synced into the app-level `User` table

Better Auth route:

- `app/api/better-auth/[...all]/route.js`

Useful files:

- `lib/better-auth.js`
- `lib/better-auth-client.js`
- `lib/better-auth-server.js`

## Supabase Schema

You need both groups of tables:

### Better Auth tables

Created by:

```bash
npm run auth:migrate
```

These include:

- `user`
- `session`
- `account`
- `verification`

### App tables

Created by running:

- `supabase/schema.sql`

These include:

- `User`
- `UserSocialProfile`
- `Project`
- `DevelopmentTool`
- `Communication`
- `Connection`

If your project was created before recent people-discovery changes, make sure these columns exist on `public."User"`:

```sql
alter table public."User"
add column if not exists show_in_collaborator_feed boolean not null default false;

alter table public."User"
add column if not exists availability text not null default 'not_specified';
```

And make sure the connection table exists:

```sql
create table if not exists public."Connection" (
  id text primary key default gen_random_uuid()::text,
  "createdAt" timestamptz not null default timezone('utc', now()),
  "userAId" text not null references public."User"(id) on delete cascade,
  "userBId" text not null references public."User"(id) on delete cascade,
  unique ("userAId", "userBId"),
  check ("userAId" <> "userBId")
);

create index if not exists "Connection_userAId_idx" on public."Connection" ("userAId");
create index if not exists "Connection_userBId_idx" on public."Connection" ("userBId");
```

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` from `.env.local.example`.
4. Run the SQL in `supabase/schema.sql` in your Supabase project.
5. Run Better Auth migrations:

```bash
npm run auth:migrate
```

6. Start the dev server:

```bash
npm run dev
```

## Environment Variables

Expected local environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

SUPABASE_DB_URL=
BETTER_AUTH_DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
NEXT_PUBLIC_APP_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Important notes:

- `SUPABASE_SERVICE_ROLE_KEY` is required for the server-side data layer
- `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` should match the exact dev origin you use in the browser
- do not mix `localhost` and LAN IPs in the same auth flow

Google OAuth callback URL must match the active origin, for example:

- `http://localhost:3000/api/better-auth/callback/google`
- or `http://192.168.0.55:3000/api/better-auth/callback/google`

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
npm run auth:migrate
npm run migrate:data
```

Notes:

- `npm run build` uses `next build --webpack`
- this is intentional for this repo

## Data Migration

If you need to move existing data from an older PostgreSQL database into Supabase:

1. Set `SOURCE_DATABASE_URL` to the old PostgreSQL database
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for the target Supabase project
3. Run:

```bash
npm run migrate:data
```

4. To clear the target app tables before importing:

```bash
npm run migrate:data -- --truncate
```

The migration script copies app tables such as:

- `User`
- `UserSocialProfile`
- `Project`
- `DevelopmentTool`
- `Communication`

It does not migrate Better Auth auth tables for you.

## Important Product Behaviors

### People discovery visibility is opt-in

Signing up does not automatically make a user visible on `/collaborators`.

That visibility is controlled by:

- `User.show_in_collaborator_feed`

Default:

- `false`

### Availability is explicit

People discovery availability is stored on:

- `User.availability`

Current values include:

- `not_specified`
- `exploring`
- `evenings_weekends`
- `part_time`
- `full_time`

### Connections are stored

People discovery uses a real connection model:

- connections are stored in `Connection`
- connection count contributes to credibility / signal on profile cards
- duplicate connections between the same two users are prevented

### Public discussion was removed

Project detail pages no longer use GitHub comment threads or Giscus-style public discussion.

Current intent:

- `Apply` for project-side interest
- `Connect` for profile-side interest
- profile review before direct outreach

This keeps interaction product-native and higher signal than open comment threads.

### Delete account removes auth too

The delete-account flow now removes:

- app-level user/profile data
- Better Auth user/session/account records

That prevents the deleted account from being silently recreated on the next authenticated request.

## Documentation

Legacy Notion/wiki links may still exist, but the codebase is the most accurate source of truth right now.

Useful files to inspect first:

- `app/page.jsx`
- `app/projects/page.jsx`
- `app/collaborators/page.jsx`
- `app/settings/page.jsx`
- `app/user/[id]/page.jsx`
- `utils/supabase-db.js`
- `lib/better-auth.js`
- `supabase/schema.sql`
