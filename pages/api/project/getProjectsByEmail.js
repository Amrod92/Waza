import { getBetterAuthSession } from '../../../lib/better-auth-server';
import { getProjectsByUserEmail } from '../../../utils/supabase-db';

export default async function main(req, res) {
  try {
    const session = await getBetterAuthSession(req, { syncAppUser: true });
    const projects = await getProjectsByUserEmail(session?.user?.email);
    return res.status(200).json(projects);
  } catch (err) {
    console.error('Issue with getProjectsByEmails: ', err);
    return res.status(500).json({ error: 'Unable to load your dashboard projects at this time.' });
  }

  return res.status(500).json({ message: 'Error inside getProjectsByEmails' });
}
