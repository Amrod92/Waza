import { getProjectById } from '../../../../utils/supabase-db';

export default async function main(req, res) {
  const { id } = req.query;

  try {
    const project = await getProjectById(id);
    return res.status(200).json(project);
  } catch (err) {
    console.error('Issue with Project[id]: ', err);
    return res.status(500).json({ error: err.message });
  }
}
