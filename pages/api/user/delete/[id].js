import { getBetterAuthSession } from '../../../../lib/better-auth-server';
import { deleteBetterAuthUserByEmail } from '../../../../lib/better-auth';
import { deleteUserById, getUserByEmail } from '../../../../utils/supabase-db';

export default async function main(req, res) {
  const { id } = req.query;

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const session = await getBetterAuthSession(req, { syncAppUser: true });

    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const currentUser = await getUserByEmail(session.user.email);

    if (!currentUser || currentUser.id !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await deleteUserById(id);
    await deleteBetterAuthUserByEmail(session.user.email);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Issue with Project[id]: ', err);
    return res.status(500).json({ error: err.message });
  }
}
