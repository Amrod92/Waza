import { getBetterAuthSession } from '../../../../lib/better-auth-server';
import { createConnectionBetweenUsers } from '../../../../utils/supabase-db';

export default async function main(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const session = await getBetterAuthSession(req, { syncAppUser: true });

    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Sign in to connect with co-founders.' });
    }

    const result = await createConnectionBetweenUsers(
      session.user.email,
      req.query.id
    );

    return res.status(200).json({ connection: result });
  } catch (err) {
    console.error('Issue with user connect: ', err);
    return res.status(500).json({ error: err.message });
  }
}
