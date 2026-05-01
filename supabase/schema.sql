create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new."updatedAt" = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public."User" (
  id text primary key default gen_random_uuid()::text,
  "createdAt" timestamptz not null default timezone('utc', now()),
  "updatedAt" timestamptz not null default timezone('utc', now()),
  name text,
  email text unique,
  "emailVerified" timestamptz,
  image text,
  bio text,
  short_bio text,
  education text,
  work text,
  skills text[] not null default '{}',
  hobbies text[] not null default '{}',
  show_in_collaborator_feed boolean not null default false,
  availability text not null default 'not_specified'
);

do $$
declare
  previous_visibility_column text := 'show_in_' || 'co' || 'foun' || 'der_feed';
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'User'
      and column_name = previous_visibility_column
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'User'
      and column_name = 'show_in_collaborator_feed'
  ) then
    execute format(
      'alter table public."User" rename column %I to show_in_collaborator_feed',
      previous_visibility_column
    );
  elsif exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'User'
      and column_name = previous_visibility_column
  ) then
    execute format(
      'update public."User" set show_in_collaborator_feed = show_in_collaborator_feed or %I',
      previous_visibility_column
    );
    execute format(
      'alter table public."User" drop column %I',
      previous_visibility_column
    );
  end if;
end $$;

alter table public."User"
add column if not exists show_in_collaborator_feed boolean not null default false;

alter table public."User"
add column if not exists availability text not null default 'not_specified';

create table if not exists public."UserSocialProfile" (
  id text primary key default gen_random_uuid()::text,
  "userId" text not null unique references public."User"(id) on delete cascade,
  discord text,
  linkedin text,
  twitch text,
  website text,
  github text,
  twitter text,
  medium text,
  dev text
);

create table if not exists public."Project" (
  id text primary key default gen_random_uuid()::text,
  "createdAt" timestamptz not null default timezone('utc', now()),
  "updatedAt" timestamptz not null default timezone('utc', now()),
  "userId" text not null references public."User"(id) on delete cascade,
  title text not null,
  tags text[] not null default '{}',
  description text not null,
  difficulty_level text,
  skills text[] not null default '{}',
  technology_stack text[] not null default '{}',
  development_status text,
  team_need integer
);

create table if not exists public."DevelopmentTool" (
  id text primary key default gen_random_uuid()::text,
  "projectId" text not null unique references public."Project"(id) on delete cascade,
  github text,
  jira text,
  figma text,
  trello text,
  notion text
);

create table if not exists public."Communication" (
  id text primary key default gen_random_uuid()::text,
  "projectId" text not null unique references public."Project"(id) on delete cascade,
  discord text,
  twitch text,
  twitter text,
  slack text
);

create table if not exists public."Connection" (
  id text primary key default gen_random_uuid()::text,
  "createdAt" timestamptz not null default timezone('utc', now()),
  "userAId" text not null references public."User"(id) on delete cascade,
  "userBId" text not null references public."User"(id) on delete cascade,
  unique ("userAId", "userBId"),
  check ("userAId" <> "userBId")
);

create index if not exists "Project_userId_idx" on public."Project" ("userId");
create index if not exists "Project_title_idx" on public."Project" (title);
create index if not exists "User_email_idx" on public."User" (email);
create index if not exists "Connection_userAId_idx" on public."Connection" ("userAId");
create index if not exists "Connection_userBId_idx" on public."Connection" ("userBId");

drop trigger if exists "User_set_updated_at" on public."User";
create trigger "User_set_updated_at"
before update on public."User"
for each row
execute procedure public.set_updated_at();

drop trigger if exists "Project_set_updated_at" on public."Project";
create trigger "Project_set_updated_at"
before update on public."Project"
for each row
execute procedure public.set_updated_at();
