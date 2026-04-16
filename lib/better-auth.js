import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { syncUserFromAuth } from '../utils/supabase-db';

let db;

function getDatabase() {
  if (db) return db;

  const connectionString =
    process.env.BETTER_AUTH_DATABASE_URL || process.env.SUPABASE_DB_URL;

  if (!connectionString) {
    throw new Error(
      'Missing Better Auth database URL. Set BETTER_AUTH_DATABASE_URL or SUPABASE_DB_URL.'
    );
  }

  db = new Kysely({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString,
      }),
    }),
  });

  return db;
}

export async function deleteBetterAuthUserByEmail(email) {
  if (!email) {
    throw new Error('Missing email for auth user deletion.');
  }

  const authUser = await getDatabase()
    .selectFrom('user')
    .select(['id', 'email'])
    .where('email', '=', email)
    .executeTakeFirst();

  if (!authUser?.id) {
    return null;
  }

  await getDatabase()
    .deleteFrom('session')
    .where('userId', '=', authUser.id)
    .execute();

  await getDatabase()
    .deleteFrom('account')
    .where('userId', '=', authUser.id)
    .execute();

  await getDatabase()
    .deleteFrom('user')
    .where('id', '=', authUser.id)
    .execute();

  return authUser;
}

function getTrustedOrigins() {
  return [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.0.55:3000',
  ].filter(Boolean);
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: '/api/better-auth',
  trustedOrigins: getTrustedOrigins(),
  database: {
    db: getDatabase(),
    type: 'postgres',
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    },
  },
  plugins: [nextCookies()],
  databaseHooks: {
    user: {
      create: {
        async after(user) {
          await syncUserFromAuth(user);
        },
      },
      update: {
        async after(user) {
          await syncUserFromAuth(user);
        },
      },
    },
  },
});

export default auth;
