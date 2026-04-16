import { getBetterAuthSession } from '../../../lib/better-auth-server';
import { getUserByEmail } from '../../../utils/supabase-db';

export default async function main(req, res) {
  try {
    const session = await getBetterAuthSession(req, { syncAppUser: true });
    const userData = await getUserByEmail(session?.user?.email);
    return res.status(200).json(userData);
  } catch (err) {
    console.error('Issue with getUserInformation: ', err);
    return res.status(500).json({ error: err.message });
  }

  return res.status(500).json({ message: 'Error inside getUserInformation' });
}
