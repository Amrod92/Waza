![Waza Logo](https://github.com/Amrod92/Waza/blob/main/assets/waza_full_logo.png)

# Waza 🥋

Waza is a community-driven platform that enables people to collaborate on personal and non-commercial projects. Our platform provides a space for individuals to connect with others who share their interests and collaborate on projects of mutual interest.

## Description 👓

Waza is a platform that allows users to create and collaborate on personal and non-commercial projects. The platform is community-driven, which means that users are the ones who drive the content and direction of the platform. Waza, which comes from the Japanese word for technique, provides a space for individuals to connect with others who share their interests and collaborate on projects of mutual interest.

## Documentation 📚

For more information about Waza, please see our [Waza Wiki](https://www.notion.so/Waza-Wiki-3649dfbed24d453584ebc4b124a9870e).

## Installation ⚡

To get started with Waza, please follow these steps:

1. Clone the repository to your local machine.

2. Run `npm install` to install the project dependencies.

3. Create a `.env.local` file based on the `.env.local.example` file and update the values as needed.

4. Create the Supabase schema by running the SQL in `supabase/schema.sql` in your Supabase project.

To run the development server, use the command `npm run dev`.

## Data Migration

If you need to move existing data from an older PostgreSQL database into Supabase:

1. Set `SOURCE_DATABASE_URL` to the old PostgreSQL database.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for the target Supabase project.
3. Run `npm run migrate:data` to upsert data into Supabase.
4. Run `npm run migrate:data -- --truncate` if you want to clear the target app tables before importing.

The migration script copies the app tables `User`, `UserSocialProfile`, `Project`, `DevelopmentTool`, and `Communication`. It does not migrate legacy NextAuth auth tables because the app now uses JWT sessions in NextAuth.

## Tech Stack 🧪

The current tech stack with its relative documentation, tips and tricks can be found [here](https://www.notion.so/Tech-Stack-a6c1bcecd71d41498665bc4aa6a4d9d6)

**Client:** React, Next.js 16, TailwindCSS, NextAuth.js, React Icons, TanStack Query v5

**Server:** Node, Next.js API routes, Supabase

**Database & Hosting:** Supabase Postgres, Vercel
