import { searchProjects } from '../../../utils/supabase-db';

export default async function main(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const searchText = req.query.slug;

  try {
    const result = await searchProjects(searchText, page);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Issue with Search project: ', err);
    return res.status(500).json({ error: 'Unable to perform search at this time.' });
  }
}
