import { listProjects } from '../../../utils/supabase-db';

export default async function main(req, res) {
  const page = parseInt(req.query.page || '1', 10);
  const sortBy = req.query.sortBy;
  const sortDirection = req.query.sortDirection;

  try {
    const result = await listProjects({ page, sortBy, sortDirection });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Issue with getAllProjects: ', err);

    if (
      err?.message?.includes("Could not find the table 'public.Project'") ||
      err?.message?.includes("relation \"public.Project\" does not exist")
    ) {
      return res.status(500).json({
        error:
          'Supabase schema is not ready. Run supabase/schema.sql and verify the public."Project" table exists.',
      });
    }

    return res.status(500).json({ error: 'Unable to load projects at this time.' });
  }
}
