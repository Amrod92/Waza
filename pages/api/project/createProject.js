import { getBetterAuthSession } from '../../../lib/better-auth-server';
import { createProjectForUser } from '../../../utils/supabase-db';

export default async function main(req, res) {
  const {
    title,
    tags,
    description,
    skills,
    technology_stack,
    development_status,
    difficulty_level,
    teamNeed,
    discord,
    twitch,
    twitter,
    slack,
    github,
    jira,
    figma,
    trello,
    notion,
  } = req.body;

  const session = await getBetterAuthSession(req, { syncAppUser: true });

  try {
    const result = await createProjectForUser(session?.user?.email, {
      title,
      tags,
      description,
      skills,
      technology_stack,
      development_status,
      difficulty_level,
      team_need: parseInt(teamNeed, 10),
      discord,
      twitch,
      twitter,
      slack,
      github,
      jira,
      figma,
      trello,
      notion,
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('Issue with createProject: ', err);
    return res.status(500).json({ error: err.message });
  }
}
