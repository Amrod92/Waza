import { getBetterAuthSession } from '../../../lib/better-auth-server';
import { createProjectForUser } from '../../../utils/supabase-db';

export default async function main(req, res) {
  const {
    title,
    venture_name,
    tags,
    sectors,
    description,
    concept_summary,
    skills,
    cofounder_traits,
    technology_stack,
    helpful_backgrounds,
    development_status,
    venture_stage,
    difficulty_level,
    commitment_level,
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
  } = req.body;

  const session = await getBetterAuthSession(req, { syncAppUser: true });

  try {
    const result = await createProjectForUser(session?.user?.email, {
      title: venture_name || title,
      tags: sectors || tags,
      description: concept_summary || description,
      skills: cofounder_traits || skills,
      technology_stack: helpful_backgrounds || technology_stack,
      development_status: venture_stage || development_status,
      difficulty_level: commitment_level || difficulty_level,
      team_need: parseInt(cofoundersWanted || teamNeed, 10),
      discord: preferred_contact || discord,
      twitch: intro_call_link || twitch,
      twitter: social_profile || twitter,
      slack: team_space_link || slack,
      github: proof_of_work_url || github,
      jira: research_url || jira,
      figma: prototype_url || figma,
      trello: traction_url || trello,
      notion: memo_url || notion,
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('Issue with createProject: ', err);
    return res.status(500).json({ error: err.message });
  }
}
