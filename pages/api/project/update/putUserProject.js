import { updateProjectById } from '../../../../utils/supabase-db';

export default async function main(req, res) {
  const {
    id,
    title,
    venture_name,
    description,
    concept_summary,
    developmentStatus,
    ventureStage,
    difficulty,
    commitmentLevel,
    teamNeed,
    cofoundersWanted,
    discord,
    preferred_contact,
    twitch,
    intro_call_link,
    twitter,
    social_profile,
    slack,
    team_space_link,
    github,
    proof_of_work_url,
    jira,
    research_url,
    figma,
    prototype_url,
    trello,
    traction_url,
    notion,
    memo_url,
    communicationId,
    devToolsId,
  } = req.body;
  try {
    const project = await updateProjectById(id, {
      title: venture_name || title,
      description: concept_summary || description,
      team_need: parseInt(cofoundersWanted || teamNeed, 10),
      development_status: ventureStage || developmentStatus,
      difficulty_level: commitmentLevel || difficulty,
      discord: preferred_contact || discord,
      twitch: intro_call_link || twitch,
      twitter: social_profile || twitter,
      slack: team_space_link || slack,
      github: proof_of_work_url || github,
      jira: research_url || jira,
      figma: prototype_url || figma,
      trello: traction_url || trello,
      notion: memo_url || notion,
      communicationId,
      devToolsId,
    });

    return res.status(200).json(project);
  } catch (err) {
    console.error('Issue with putUserProject: ', err);
    return res.status(500).json({ error: err.message });
  }
}
