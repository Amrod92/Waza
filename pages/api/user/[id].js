import { getBetterAuthSession } from '../../../lib/better-auth-server';
import { getUserByEmail, getUserById } from '../../../utils/supabase-db';

export default async function main(req, res) {
  const { id } = req.query;

  try {
    const session = await getBetterAuthSession(req, { syncAppUser: true });
    const viewer = session?.user?.email
      ? await getUserByEmail(session.user.email)
      : null;
    const user = await getUserById(id, { viewerId: viewer?.id || null });
    return res.status(200).json(user);
  } catch (err) {
    console.error('Issue with Project[id]: ', err);
    return res.status(500).json({ error: err.message });
  }
}
