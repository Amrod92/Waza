import { getSupabaseAdmin } from './supabase-admin';

const PROJECTS_PER_PAGE = 5;
const ALLOWED_PROJECT_SORT_COLUMNS = new Set(['createdAt', 'title']);

function supabase() {
  return getSupabaseAdmin();
}

function throwIfError(error, context) {
  if (error) {
    throw new Error(`${context}: ${error.message}`);
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function optionalText(value) {
  return value ? value : null;
}

async function fetchUsersByIds(userIds) {
  const ids = unique(userIds);

  if (ids.length === 0) return new Map();

  const { data, error } = await supabase()
    .from('User')
    .select('*')
    .in('id', ids);

  throwIfError(error, 'Unable to fetch users');

  return new Map((data || []).map(user => [user.id, user]));
}

async function fetchUserSocialProfiles(userIds) {
  const ids = unique(userIds);

  if (ids.length === 0) return new Map();

  const { data, error } = await supabase()
    .from('UserSocialProfile')
    .select('*')
    .in('userId', ids);

  throwIfError(error, 'Unable to fetch social profiles');

  return new Map((data || []).map(profile => [profile.userId, profile]));
}

async function fetchDevelopmentTools(projectIds) {
  const ids = unique(projectIds);

  if (ids.length === 0) return new Map();

  const { data, error } = await supabase()
    .from('DevelopmentTool')
    .select('*')
    .in('projectId', ids);

  throwIfError(error, 'Unable to fetch development tools');

  return new Map((data || []).map(tool => [tool.projectId, tool]));
}

async function fetchProjectCounts(userIds) {
  const ids = unique(userIds);

  if (ids.length === 0) return new Map();

  const { data, error } = await supabase()
    .from('Project')
    .select('userId')
    .in('userId', ids);

  throwIfError(error, 'Unable to fetch project counts');

  const counts = new Map();

  for (const item of data || []) {
    counts.set(item.userId, (counts.get(item.userId) || 0) + 1);
  }

  return counts;
}

async function fetchConnectionCounts(userIds) {
  const ids = unique(userIds);

  if (ids.length === 0) return new Map();

  const [{ data: aSide, error: aError }, { data: bSide, error: bError }] =
    await Promise.all([
      supabase().from('Connection').select('"userAId"').in('userAId', ids),
      supabase().from('Connection').select('"userBId"').in('userBId', ids),
    ]);

  throwIfError(aError || bError, 'Unable to fetch connection counts');

  const counts = new Map();

  for (const item of aSide || []) {
    counts.set(item.userAId, (counts.get(item.userAId) || 0) + 1);
  }

  for (const item of bSide || []) {
    counts.set(item.userBId, (counts.get(item.userBId) || 0) + 1);
  }

  return counts;
}

async function fetchConnectedUserIdsForViewer(viewerId, userIds) {
  const ids = unique(userIds);

  if (!viewerId || ids.length === 0) return new Set();

  const [{ data: asUserA, error: aError }, { data: asUserB, error: bError }] =
    await Promise.all([
      supabase()
        .from('Connection')
        .select('"userBId"')
        .eq('userAId', viewerId)
        .in('userBId', ids),
      supabase()
        .from('Connection')
        .select('"userAId"')
        .eq('userBId', viewerId)
        .in('userAId', ids),
    ]);

  throwIfError(aError || bError, 'Unable to fetch viewer connections');

  return new Set([
    ...(asUserA || []).map(item => item.userBId),
    ...(asUserB || []).map(item => item.userAId),
  ]);
}

function countSocialLinks(profile) {
  if (!profile) return 0;

  return [
    profile.website,
    profile.github,
    profile.linkedin,
    profile.discord,
    profile.twitch,
    profile.medium,
    profile.dev,
    profile.twitter,
  ].filter(Boolean).length;
}

function computeSignalRating(
  user,
  projectCount = 0,
  socialLinksCount = 0,
  connectionCount = 0
) {
  const checks = [
    Boolean(user?.name?.trim()),
    Boolean(user?.short_bio?.trim()),
    Boolean(user?.bio?.trim()),
    Boolean(user?.education?.trim() || user?.work?.trim()),
    asArray(user?.skills).length >= 2,
    asArray(user?.hobbies).length >= 2,
    socialLinksCount > 0,
    projectCount > 0,
    user?.availability && user.availability !== 'not_specified',
    connectionCount > 0,
  ];

  const completed = checks.filter(Boolean).length;
  const ratio = completed / checks.length;
  const rating = 2.8 + ratio * 2.2;

  return Number(Math.min(5, rating).toFixed(1));
}

async function fetchCommunications(projectIds) {
  const ids = unique(projectIds);

  if (ids.length === 0) return new Map();

  const { data, error } = await supabase()
    .from('Communication')
    .select('*')
    .in('projectId', ids);

  throwIfError(error, 'Unable to fetch communication tools');

  return new Map((data || []).map(comm => [comm.projectId, comm]));
}

async function enrichProjects(projects) {
  const items = asArray(projects);

  if (items.length === 0) return [];

  const [usersById, toolsByProjectId, commsByProjectId] = await Promise.all([
    fetchUsersByIds(items.map(project => project.userId)),
    fetchDevelopmentTools(items.map(project => project.id)),
    fetchCommunications(items.map(project => project.id)),
  ]);

  return items.map(project => ({
    ...project,
    user: usersById.get(project.userId) || null,
    developmentTool: toolsByProjectId.get(project.id)
      ? [toolsByProjectId.get(project.id)]
      : [],
    communication: commsByProjectId.get(project.id)
      ? [commsByProjectId.get(project.id)]
      : [],
  }));
}

async function enrichUser(user, options = {}) {
  if (!user) return null;
  const { viewerId = null } = options;

  const [socialProfilesByUserId, projectCountsByUserId, connectionCountsByUserId] =
    await Promise.all([
    fetchUserSocialProfiles([user.id]),
    fetchProjectCounts([user.id]),
    fetchConnectionCounts([user.id]),
  ]);
  const socialProfile = socialProfilesByUserId.get(user.id) || null;
  const projectCount = projectCountsByUserId.get(user.id) || 0;
  const connectionCount = connectionCountsByUserId.get(user.id) || 0;
  const connectedUserIds = viewerId
    ? await fetchConnectedUserIdsForViewer(viewerId, [user.id])
    : new Set();

  return {
    ...user,
    userSocialProfile: socialProfile ? [socialProfile] : [],
    projectCount,
    connectionCount,
    isConnectedToViewer: connectedUserIds.has(user.id),
    signalRating: computeSignalRating(
      user,
      projectCount,
      countSocialLinks(socialProfile),
      connectionCount
    ),
  };
}

async function enrichUsers(users, options = {}) {
  const items = asArray(users);
  const { viewerId = null } = options;

  if (items.length === 0) return [];

  const [
    socialProfilesByUserId,
    projectCountsByUserId,
    connectionCountsByUserId,
    connectedUserIds,
  ] = await Promise.all([
    fetchUserSocialProfiles(items.map(user => user.id)),
    fetchProjectCounts(items.map(user => user.id)),
    fetchConnectionCounts(items.map(user => user.id)),
    fetchConnectedUserIdsForViewer(
      viewerId,
      items.map(user => user.id)
    ),
  ]);

  return items.map(user => ({
    ...user,
    userSocialProfile: socialProfilesByUserId.get(user.id)
      ? [socialProfilesByUserId.get(user.id)]
      : [],
    projectCount: projectCountsByUserId.get(user.id) || 0,
    connectionCount: connectionCountsByUserId.get(user.id) || 0,
    isConnectedToViewer: connectedUserIds.has(user.id),
    signalRating: computeSignalRating(
      user,
      projectCountsByUserId.get(user.id) || 0,
      countSocialLinks(socialProfilesByUserId.get(user.id) || null),
      connectionCountsByUserId.get(user.id) || 0
    ),
  }));
}

export async function syncUserFromAuth(user) {
  if (!user?.email) {
    throw new Error('Authenticated user is missing an email address.');
  }

  const { data, error } = await supabase()
    .from('User')
    .upsert(
      {
        email: user.email,
        name: user.name || null,
        image: user.image || null,
      },
      { onConflict: 'email' }
    )
    .select('*')
    .single();

  throwIfError(error, 'Unable to sync authenticated user');

  return enrichUser(data);
}

export async function getUserByEmail(email) {
  if (!email) return null;

  const { data, error } = await supabase()
    .from('User')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  throwIfError(error, 'Unable to load user by email');

  return enrichUser(data);
}

export async function getUserById(id, options = {}) {
  const { data, error } = await supabase()
    .from('User')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  throwIfError(error, 'Unable to load user');

  return enrichUser(data, options);
}

export async function listUsers(options = {}) {
  const { viewerId = null } = options;
  const { data, error } = await supabase()
    .from('User')
    .select('*')
    .order('createdAt', { ascending: false });

  throwIfError(error, 'Unable to list users');

  const enrichedUsers = await enrichUsers(data || [], { viewerId });

  // Keep the discovery page focused on profiles with some real signal.
  return enrichedUsers.filter(
    user =>
      user.show_in_cofounder_feed === true &&
      (user.name ||
        user.short_bio ||
        user.bio ||
        asArray(user.skills).length > 0 ||
        asArray(user.hobbies).length > 0)
  );
}

export async function createConnectionBetweenUsers(viewerEmail, targetUserId) {
  const viewer = await getUserByEmail(viewerEmail);

  if (!viewer?.id) {
    throw new Error('You must be signed in to connect with a co-founder.');
  }

  if (!targetUserId) {
    throw new Error('Missing target user.');
  }

  if (viewer.id === targetUserId) {
    throw new Error('You cannot connect with your own profile.');
  }

  const target = await getUserById(targetUserId);

  if (!target) {
    throw new Error('The selected co-founder profile does not exist.');
  }

  const [userAId, userBId] = [viewer.id, targetUserId].sort();

  const { data, error } = await supabase()
    .from('Connection')
    .upsert(
      {
        userAId,
        userBId,
      },
      { onConflict: 'userAId,userBId' }
    )
    .select('*')
    .single();

  throwIfError(error, 'Unable to create connection');

  return data;
}

export async function listProjects({
  page = 1,
  sortBy = 'createdAt',
  sortDirection = 'desc',
} = {}) {
  const safeSortBy = ALLOWED_PROJECT_SORT_COLUMNS.has(sortBy)
    ? sortBy
    : 'createdAt';
  const ascending = sortDirection === 'asc';
  const from = (page - 1) * PROJECTS_PER_PAGE;
  const to = from + PROJECTS_PER_PAGE - 1;

  const [{ count, error: countError }, { data, error }] = await Promise.all([
    supabase().from('Project').select('id', { count: 'exact', head: true }),
    supabase()
      .from('Project')
      .select('*')
      .order(safeSortBy, { ascending })
      .range(from, to),
  ]);

  throwIfError(countError, 'Unable to count projects');
  throwIfError(error, 'Unable to list projects');

  return {
    projects: await enrichProjects(data || []),
    currentPage: page,
    totalPages: Math.max(1, Math.ceil((count || 0) / PROJECTS_PER_PAGE)),
  };
}

export async function getProjectById(id) {
  const { data, error } = await supabase()
    .from('Project')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  throwIfError(error, 'Unable to load project');

  const [project] = await enrichProjects(data ? [data] : []);
  return project || null;
}

export async function getProjectsByUserEmail(email) {
  const user = await getUserByEmail(email);

  if (!user) return [];

  const { data, error } = await supabase()
    .from('Project')
    .select('*')
    .eq('userId', user.id)
    .order('createdAt', { ascending: false });

  throwIfError(error, 'Unable to load user projects');

  return enrichProjects(data || []);
}

export async function searchProjects(searchText, page = 1) {
  const normalizedSearch = (searchText || '').trim();

  if (!normalizedSearch || normalizedSearch.toLowerCase() === 'all') {
    const { projects, currentPage, totalPages } = await listProjects({ page });
    return { result: projects, currentPage, totalPages };
  }

  const from = (page - 1) * PROJECTS_PER_PAGE;
  const to = from + PROJECTS_PER_PAGE - 1;

  const baseQuery = supabase()
    .from('Project')
    .select('*')
    .ilike('title', `%${normalizedSearch}%`);

  const [{ count, error: countError }, { data, error }] = await Promise.all([
    supabase()
      .from('Project')
      .select('id', { count: 'exact', head: true })
      .ilike('title', `%${normalizedSearch}%`),
    baseQuery.order('createdAt', { ascending: false }).range(from, to),
  ]);

  throwIfError(countError, 'Unable to count search results');
  throwIfError(error, 'Unable to search projects');

  const usersById = await fetchUsersByIds((data || []).map(project => project.userId));

  return {
    result: (data || []).map(project => ({
      ...project,
      user: usersById.get(project.userId) || null,
    })),
    currentPage: page,
    totalPages: Math.max(1, Math.ceil((count || 0) / PROJECTS_PER_PAGE)),
  };
}

export async function createProjectForUser(email, projectInput) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error('Unable to create a project without a matching user.');
  }

  const { data: project, error: projectError } = await supabase()
    .from('Project')
    .insert({
      title: projectInput.title,
      description: projectInput.description,
      tags: asArray(projectInput.tags),
      skills: asArray(projectInput.skills),
      difficulty_level: projectInput.difficulty_level || null,
      technology_stack: asArray(projectInput.technology_stack),
      development_status: projectInput.development_status || null,
      team_need: Number.isFinite(projectInput.team_need)
        ? projectInput.team_need
        : null,
      userId: user.id,
    })
    .select('*')
    .single();

  throwIfError(projectError, 'Unable to create project');

  const toolPayload = {
    projectId: project.id,
    github: optionalText(projectInput.github),
    jira: optionalText(projectInput.jira),
    figma: optionalText(projectInput.figma),
    trello: optionalText(projectInput.trello),
    notion: optionalText(projectInput.notion),
  };
  const communicationPayload = {
    projectId: project.id,
    discord: optionalText(projectInput.discord),
    twitch: optionalText(projectInput.twitch),
    twitter: optionalText(projectInput.twitter),
    slack: optionalText(projectInput.slack),
  };

  const [{ error: toolError }, { error: communicationError }] = await Promise.all([
    supabase().from('DevelopmentTool').insert(toolPayload),
    supabase().from('Communication').insert(communicationPayload),
  ]);

  if (toolError || communicationError) {
    await supabase().from('Project').delete().eq('id', project.id);
    throwIfError(toolError || communicationError, 'Unable to create project relations');
  }

  return getProjectById(project.id);
}

export async function updateProjectById(projectId, updates) {
  const projectPayload = {
    title: updates.title,
    description: updates.description,
    team_need: Number.isFinite(updates.team_need) ? updates.team_need : null,
    development_status: updates.development_status || null,
    difficulty_level: updates.difficulty_level || null,
  };

  const { error: projectError } = await supabase()
    .from('Project')
    .update(projectPayload)
    .eq('id', projectId);

  throwIfError(projectError, 'Unable to update project');

  const communicationPayload = {
    discord: optionalText(updates.discord),
    twitch: optionalText(updates.twitch),
    twitter: optionalText(updates.twitter),
    slack: optionalText(updates.slack),
  };
  const toolPayload = {
    github: optionalText(updates.github),
    jira: optionalText(updates.jira),
    figma: optionalText(updates.figma),
    trello: optionalText(updates.trello),
    notion: optionalText(updates.notion),
  };

  if (updates.communicationId) {
    const { error } = await supabase()
      .from('Communication')
      .update(communicationPayload)
      .eq('id', updates.communicationId);

    throwIfError(error, 'Unable to update communication tools');
  } else {
    const { error } = await supabase().from('Communication').upsert(
      {
        projectId,
        ...communicationPayload,
      },
      { onConflict: 'projectId' }
    );

    throwIfError(error, 'Unable to upsert communication tools');
  }

  if (updates.devToolsId) {
    const { error } = await supabase()
      .from('DevelopmentTool')
      .update(toolPayload)
      .eq('id', updates.devToolsId);

    throwIfError(error, 'Unable to update development tools');
  } else {
    const { error } = await supabase().from('DevelopmentTool').upsert(
      {
        projectId,
        ...toolPayload,
      },
      { onConflict: 'projectId' }
    );

    throwIfError(error, 'Unable to upsert development tools');
  }

  return getProjectById(projectId);
}

export async function deleteProjectById(id) {
  const project = await getProjectById(id);

  const { error } = await supabase().from('Project').delete().eq('id', id);

  throwIfError(error, 'Unable to delete project');

  return project;
}

export async function updateUserSettingsByEmail(email, data) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error('Unable to update a user that does not exist.');
  }

  const userUpdates = {};

  if (Object.prototype.hasOwnProperty.call(data, 'name')) {
    userUpdates.name = data.name;
  }

  if (Object.prototype.hasOwnProperty.call(data, 'short_bio')) {
    userUpdates.short_bio = data.short_bio;
  }

  if (
    Object.prototype.hasOwnProperty.call(data, 'bio') ||
    Object.prototype.hasOwnProperty.call(data, 'aboutMe')
  ) {
    userUpdates.bio = data.bio ?? data.aboutMe;
  }

  if (Object.prototype.hasOwnProperty.call(data, 'education')) {
    userUpdates.education = data.education;
  }

  if (Object.prototype.hasOwnProperty.call(data, 'work')) {
    userUpdates.work = data.work;
  }

  if (Object.prototype.hasOwnProperty.call(data, 'skills')) {
    userUpdates.skills = asArray(data.skills);
  }

  if (Object.prototype.hasOwnProperty.call(data, 'hobbies')) {
    userUpdates.hobbies = asArray(data.hobbies);
  }

  if (Object.prototype.hasOwnProperty.call(data, 'show_in_cofounder_feed')) {
    userUpdates.show_in_cofounder_feed = Boolean(data.show_in_cofounder_feed);
  }

  if (Object.prototype.hasOwnProperty.call(data, 'availability')) {
    userUpdates.availability = data.availability || 'not_specified';
  }

  if (Object.keys(userUpdates).length > 0) {
    const { data: updatedUser, error } = await supabase()
      .from('User')
      .update(userUpdates)
      .eq('email', email)
      .select('*')
      .single();

    throwIfError(error, 'Unable to update user settings');
    return updatedUser;
  }

  const { data: profile, error } = await supabase()
    .from('UserSocialProfile')
    .upsert(
      {
        userId: user.id,
        website: optionalText(data.website),
        github: optionalText(data.github),
        linkedin: optionalText(data.linkedin),
        discord: optionalText(data.discord),
        twitch: optionalText(data.twitch),
        medium: optionalText(data.medium),
        dev: optionalText(data.dev),
        twitter: optionalText(data.twitter),
      },
      { onConflict: 'userId' }
    )
    .select('*')
    .single();

  throwIfError(error, 'Unable to update social profile');

  return profile;
}

export async function deleteUserById(id) {
  const { data, error } = await supabase()
    .from('User')
    .delete()
    .eq('id', id)
    .select('*')
    .maybeSingle();

  throwIfError(error, 'Unable to delete user');

  return data;
}
