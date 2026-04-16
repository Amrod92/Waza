import { auth } from './better-auth';
import { syncUserFromAuth } from '../utils/supabase-db';

export async function getBetterAuthSession(req, options = {}) {
  const { syncAppUser = false } = options;
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers || {})) {
    if (Array.isArray(value)) {
      value.forEach(item => headers.append(key, item));
    } else if (typeof value === 'string') {
      headers.set(key, value);
    }
  }

  const result = await auth.api.getSession({ headers });

  if (result?.user && syncAppUser) {
    await syncUserFromAuth(result.user);
  }

  return result?.user ? result : null;
}
