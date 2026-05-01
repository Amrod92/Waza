import { getBetterAuthSession } from '../../../lib/better-auth-server';
import { getUserByEmail, listUsers } from '../../../utils/supabase-db';

export default async function main(req, res) {
  try {
    const session = await getBetterAuthSession(req, { syncAppUser: true });
    const viewer = session?.user?.email
      ? await getUserByEmail(session.user.email)
      : null;
    const users = await listUsers({ viewerId: viewer?.id || null });
    return res.status(200).json({ users });
  } catch (err) {
    console.error('Issue with getAllUsers: ', err);
    return res
      .status(500)
      .json({ error: 'Unable to load collaborator profiles at this time.' });
  }
}
