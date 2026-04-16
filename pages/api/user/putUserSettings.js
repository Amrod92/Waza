import { getBetterAuthSession } from '../../../lib/better-auth-server';
import { updateUserSettingsByEmail } from '../../../utils/supabase-db';

export default async function main(req, res) {
  const { data } = req.body;

  const session = await getBetterAuthSession(req, { syncAppUser: true });

  try {
    const result = await updateUserSettingsByEmail(session?.user?.email, data);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Issue with putUserSettings: ', err);
    return res.status(500).json({ error: err.message });
  }
}
