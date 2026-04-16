import 'dotenv/config';

import process from 'node:process';
import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js';

const SOURCE_DATABASE_URL = process.env.SOURCE_DATABASE_URL;
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SHOULD_TRUNCATE = process.argv.includes('--truncate');
const SHOULD_SHOW_HELP = process.argv.includes('--help');
const BATCH_SIZE = 500;

if (SHOULD_SHOW_HELP) {
  console.log(`
Usage:
  npm run migrate:data
  npm run migrate:data -- --truncate

Required env vars:
  SOURCE_DATABASE_URL
  NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
`);
  process.exit(0);
}

if (!SOURCE_DATABASE_URL) {
  throw new Error('Missing SOURCE_DATABASE_URL.');
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY.'
  );
}

const source = new Client({
  connectionString: SOURCE_DATABASE_URL,
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function chunk(items, size) {
  const result = [];

  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }

  return result;
}

function normalizeNullableText(record, keys) {
  const next = { ...record };

  for (const key of keys) {
    if (next[key] === '') {
      next[key] = null;
    }
  }

  return next;
}

async function fetchRows(tableName) {
  const query = `select * from public."${tableName}" order by "createdAt" asc nulls first`;
  const { rows } = await source.query(query);
  return rows;
}

async function fetchRowsWithoutCreatedAt(tableName, orderColumn = 'id') {
  const query = `select * from public."${tableName}" order by "${orderColumn}" asc`;
  const { rows } = await source.query(query);
  return rows;
}

async function upsertBatches(tableName, rows, onConflict) {
  if (rows.length === 0) {
    console.log(`Skipping ${tableName}: no rows to migrate.`);
    return;
  }

  for (const batch of chunk(rows, BATCH_SIZE)) {
    const { error } = await supabase
      .from(tableName)
      .upsert(batch, { onConflict, ignoreDuplicates: false });

    if (error) {
      throw new Error(`Failed to upsert ${tableName}: ${error.message}`);
    }
  }

  console.log(`Migrated ${rows.length} rows into ${tableName}.`);
}

async function truncateTargetTables() {
  const tables = [
    'Communication',
    'DevelopmentTool',
    'Project',
    'UserSocialProfile',
    'User',
  ];

  for (const tableName of tables) {
    const { error } = await supabase.from(tableName).delete().not('id', 'is', null);

    if (error) {
      throw new Error(`Failed to truncate ${tableName}: ${error.message}`);
    }
  }

  console.log('Truncated target Supabase tables.');
}

async function main() {
  await source.connect();

  try {
    if (SHOULD_TRUNCATE) {
      await truncateTargetTables();
    }

    const users = await fetchRows('User');
    const userSocialProfiles = await fetchRowsWithoutCreatedAt('UserSocialProfile');
    const projects = await fetchRows('Project');
    const developmentTools = await fetchRowsWithoutCreatedAt('DevelopmentTool');
    const communications = await fetchRowsWithoutCreatedAt('Communication');

    await upsertBatches(
      'User',
      users.map(user => ({
        ...user,
        skills: Array.isArray(user.skills) ? user.skills : [],
        hobbies: Array.isArray(user.hobbies) ? user.hobbies : [],
      })),
      'id'
    );

    await upsertBatches(
      'UserSocialProfile',
      userSocialProfiles.map(profile =>
        normalizeNullableText(profile, [
          'discord',
          'linkedin',
          'twitch',
          'website',
          'github',
          'twitter',
          'medium',
          'dev',
        ])
      ),
      'id'
    );

    await upsertBatches(
      'Project',
      projects.map(project => ({
        ...project,
        tags: Array.isArray(project.tags) ? project.tags : [],
        skills: Array.isArray(project.skills) ? project.skills : [],
        technology_stack: Array.isArray(project.technology_stack)
          ? project.technology_stack
          : [],
      })),
      'id'
    );

    await upsertBatches(
      'DevelopmentTool',
      developmentTools.map(tool =>
        normalizeNullableText(tool, ['github', 'jira', 'figma', 'trello', 'notion'])
      ),
      'id'
    );

    await upsertBatches(
      'Communication',
      communications.map(comm =>
        normalizeNullableText(comm, ['discord', 'twitch', 'twitter', 'slack'])
      ),
      'id'
    );

    console.log('Data migration completed successfully.');
    console.log(
      'Note: Legacy NextAuth tables (Account, Session, VerificationToken) were not migrated because the app now uses JWT sessions and Supabase-backed app tables.'
    );
  } finally {
    await source.end();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
