import { updateProjectById } from '../../../../utils/supabase-db';

export default async function main(req, res) {
  const {
    id,
    title,
    description,
    developmentStatus,
    difficulty,
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
    communicationId,
    devToolsId,
  } = req.body;
  try {
    const project = await updateProjectById(id, {
      title,
      description,
      team_need: parseInt(teamNeed, 10),
      development_status: developmentStatus,
      difficulty_level: difficulty,
      discord,
      twitch,
      twitter,
      slack,
      github,
      jira,
      figma,
      trello,
      notion,
      communicationId,
      devToolsId,
    });

    return res.status(200).json(project);
  } catch (err) {
    console.error('Issue with putUserProject: ', err);
    return res.status(500).json({ error: err.message });
  }
}
