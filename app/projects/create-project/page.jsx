'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  BookOpenText,
  Check,
  Info,
  Link2,
  MessageCircle,
  PlusCircle,
  Rocket,
  Sparkles,
  UsersRound,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import {
  SiDiscord,
  SiFigma,
  SiGithub,
  SiJira,
  SiNotion,
  SiSlack,
  SiTrello,
  SiTwitch,
  SiX,
} from 'react-icons/si';

import SkillsTag from '../../../components/UI/SkillsTagsInput';
import TagsInput from '../../../components/UI/TagsInput';
import TechnologyStack from '../../../components/UI/TechnologyStackInput';
import { AuthGuard } from '../../../components/UI/auth-guard';
import { Badge } from '../../../components/UI/badge';
import { Button } from '../../../components/UI/button';
import { Input } from '../../../components/UI/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/UI/select';
import { Textarea } from '../../../components/UI/textarea';
import { Card, CardContent } from '../../../components/UI/card';

const DEVELOPMENT_STATUS_OPTIONS = [
  'just exploring',
  'problem validation',
  'customer discovery',
  'prototype in progress',
  'pilot users',
  'early traction',
  'raising or preparing to raise',
  'operating and growing',
];

const DIFFICULTY_OPTIONS = [
  'nights and weekends',
  'part-time',
  'full-time soon',
  'full-time now',
];

const titleCase = value => value?.replace(/\b\w/g, char => char.toUpperCase());

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className='space-y-2'>
      <p className='text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400'>
        {eyebrow}
      </p>
      <h2 className='text-2xl font-black tracking-tight text-zinc-950'>
        {title}
      </h2>
      <p className='max-w-2xl text-sm leading-relaxed text-zinc-500'>{description}</p>
    </div>
  );
}

function LinkField({ icon: Icon, iconClassName = '', label, required = false, ...props }) {
  return (
    <div className='space-y-2.5'>
      <label className='flex items-center gap-2 text-sm font-bold text-zinc-800'>
        <span className='flex h-8 w-8 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm'>
          <Icon className={`h-4 w-4 ${iconClassName}`} />
        </span>
        <span>
          {label}
          {required ? ' *' : ''}
        </span>
      </label>
      <Input
        {...props}
        className='h-12 rounded-2xl border-zinc-300 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:bg-white transition-all'
      />
    </div>
  );
}

function CreateProjectContent() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const [technologyStack, setTechStack] = useState([]);
  const [developmentStatus, setDevStatus] = useState('');
  const [difficultyLevel, setDiffLevel] = useState('');
  const [teamNeed, setTeamNeed] = useState(1);
  const [discord, setDiscord] = useState('');
  const [twitch, setTwitch] = useState('');
  const [twitter, setTwitter] = useState('');
  const [slack, setSlack] = useState('');
  const [github, setGithub] = useState('');
  const [jira, setJira] = useState('');
  const [figma, setFigma] = useState('');
  const [trello, setTrello] = useState('');
  const [notion, setNotion] = useState('');
  const [tagsValid, setTagsValid] = useState(false);
  const [techStackValid, setTechStackValid] = useState(false);
  const [skillsValid, setSkillsValid] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();

    const response = await fetch('/api/project/createProject', {
      method: 'POST',
      body: JSON.stringify({
        title,
        tags,
        description,
        skills,
        technology_stack: technologyStack,
        development_status: developmentStatus,
        difficulty_level: difficultyLevel,
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
      }),
      headers: {
        'content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (data) router.push(`/projects/${data.id}`);
  };

  const requiredChecks = [
    { label: 'Project title', complete: Boolean(title.trim()) },
    { label: 'Why this matters', complete: Boolean(description.trim()) },
    { label: 'Markets and themes', complete: tagsValid },
    { label: 'Ideal co-founder strengths', complete: skillsValid },
    { label: 'Helpful backgrounds', complete: techStackValid },
    { label: 'Project stage', complete: Boolean(developmentStatus) },
    { label: 'Commitment level', complete: Boolean(difficultyLevel) },
    { label: 'Public proof link', complete: Boolean(github.trim()) },
  ];

  const completedChecks = requiredChecks.filter(item => item.complete).length;
  const completionPercent = Math.round(
    (completedChecks / requiredChecks.length) * 100
  );
  const missingRequirements = requiredChecks
    .filter(item => !item.complete)
    .map(item => item.label);

  const isFormValid =
    title &&
    description &&
    developmentStatus &&
    difficultyLevel &&
    github &&
    tagsValid &&
    techStackValid &&
    skillsValid;

  return (
    <div className='relative min-h-screen bg-zinc-50 text-zinc-950 selection:bg-zinc-950 selection:text-white'>
      {/* Background Decor */}
      <div className='fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(24,24,27,0.08),transparent_28%),radial-gradient(circle_at_top,rgba(212,212,216,0.42),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,0.98),rgba(244,244,245,0.96))]' />
      <div className='fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(24,24,27,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.015)_1px,transparent_1px)] bg-[size:64px_64px]' />

      <div className='container mx-auto px-4 py-12 md:py-20'>
        <div className='mx-auto max-w-7xl space-y-12'>
          
          <div className='flex items-center justify-between'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.back()}
              className='group flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 text-zinc-600 shadow-sm backdrop-blur hover:bg-white hover:text-zinc-950'
            >
              <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
              Back
            </Button>
          </div>

          <header className='space-y-8'>
            <div className='space-y-6'>
              <Badge variant='outline' className='rounded-full border-zinc-200 bg-white/50 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-sm'>
                Project Builder
              </Badge>
              <div className='space-y-4'>
                <h1 className='text-balance text-5xl font-black tracking-[-0.06em] text-zinc-950 md:text-7xl lg:text-8xl'>
                  Define your venture, <span className='text-zinc-400'>find your partner.</span>
                </h1>
                <p className='max-w-2xl text-lg leading-relaxed text-zinc-600 md:text-xl'>
                  A strong brief makes the co-founder gap obvious. Detail your vision, 
                  the current stage, and the specific strengths you need.
                </p>
              </div>
            </div>

            <div className='flex flex-wrap gap-4'>
              <div className='inline-flex items-center gap-4 rounded-3xl border border-zinc-200 bg-white p-4 pr-8 shadow-sm'>
                <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-xl'>
                  <Sparkles className='h-6 w-6' />
                </div>
                <div>
                  <p className='text-2xl font-black tracking-tight text-zinc-950'>
                    {String(completionPercent).padStart(2, '0')}%
                  </p>
                  <p className='text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400'>Brief Readiness</p>
                </div>
              </div>
            </div>
          </header>

          <section className='overflow-hidden rounded-[48px] border border-zinc-200 bg-white shadow-[0_40px_120px_-60px_rgba(24,24,27,0.2)]'>
            <form onSubmit={handleSubmit} className='grid gap-0 lg:grid-cols-[minmax(0,1fr)_400px]'>
              <div className='lg:border-r lg:border-zinc-100'>
                {/* Vision Section */}
                <section className='border-b border-zinc-100 px-6 py-10 md:px-10 md:py-14'>
                  <div className='space-y-10'>
                    <SectionHeading
                      eyebrow='Overview'
                      title='The Vision'
                      description='State the project clearly, then explain why it exists and what makes it worth joining.'
                    />
                    <div className='space-y-6 rounded-[40px] border border-zinc-200 bg-zinc-50/50 p-6 md:p-10'>
                      <div className='space-y-3'>
                        <label className='text-sm font-black uppercase tracking-widest text-zinc-400 ml-1'>Project Title</label>
                        <Input
                          value={title}
                          required
                          onChange={e => setTitle(e.target.value)}
                          placeholder='e.g. Next-gen renewable energy credits marketplace'
                          className='h-14 rounded-2xl border-zinc-300 bg-white text-lg font-bold text-zinc-950 shadow-sm focus-visible:ring-zinc-950'
                        />
                      </div>
                      <div className='space-y-3'>
                        <label className='text-sm font-black uppercase tracking-widest text-zinc-400 ml-1'>Detailed Brief</label>
                        <Textarea
                          value={description}
                          rows={8}
                          required
                          onChange={e => setDescription(e.target.value)}
                          placeholder='Describe the goal, the problem you are solving, and the specific impact you intend to have.'
                          className='rounded-2xl border-zinc-300 bg-white text-base leading-relaxed text-zinc-900 shadow-sm focus-visible:ring-zinc-950'
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Market Fit Section */}
                <section className='border-b border-zinc-100 px-6 py-10 md:px-10 md:py-14'>
                  <div className='space-y-10'>
                    <SectionHeading
                      eyebrow='Signal'
                      title='Markets & Strengths'
                      description='Help people understand if their background fits your needs in seconds.'
                    />
                    <div className='grid gap-6 xl:grid-cols-3'>
                      <div className='rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm'>
                        <div className='mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-zinc-400'>
                          <BookOpenText className='h-4 w-4' />
                          Markets
                        </div>
                        <TagsInput tags={tags} setTags={setTags} setTagsValid={setTagsValid} />
                      </div>
                      <div className='rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm'>
                        <div className='mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-zinc-400'>
                          <Sparkles className='h-4 w-4' />
                          Required Strengths
                        </div>
                        <SkillsTag skills={skills} setSkills={setSkills} setSkillsValid={setSkillsValid} />
                      </div>
                      <div className='rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm'>
                        <div className='mb-6 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-zinc-400'>
                          <Info className='h-4 w-4' />
                          Tech / Domain
                        </div>
                        <TechnologyStack technology_stack={technologyStack} setTechStack={setTechStack} setTechStackValid={setTechStackValid} />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Logistics Section */}
                <section className='border-b border-zinc-100 px-6 py-10 md:px-10 md:py-14'>
                  <div className='space-y-10'>
                    <SectionHeading
                      eyebrow='Logistics'
                      title='Stage & Commitment'
                      description='Be precise about where you are and how much help you need.'
                    />
                    <div className='grid gap-6 md:grid-cols-3'>
                      <div className='rounded-[32px] border border-zinc-200 bg-zinc-50/50 p-6'>
                        <label className='mb-3 block text-[10px] font-black uppercase tracking-widest text-zinc-400'>Project Stage</label>
                        <Select value={developmentStatus} onValueChange={setDevStatus}>
                          <SelectTrigger className='h-12 rounded-xl border-zinc-300 bg-white font-bold'>
                            <SelectValue placeholder='Select stage' />
                          </SelectTrigger>
                          <SelectContent>
                            {DEVELOPMENT_STATUS_OPTIONS.map(opt => (
                              <SelectItem key={opt} value={opt}>{titleCase(opt)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='rounded-[32px] border border-zinc-200 bg-zinc-50/50 p-6'>
                        <label className='mb-3 block text-[10px] font-black uppercase tracking-widest text-zinc-400'>Commitment</label>
                        <Select value={difficultyLevel} onValueChange={setDiffLevel}>
                          <SelectTrigger className='h-12 rounded-xl border-zinc-300 bg-white font-bold'>
                            <SelectValue placeholder='Select time' />
                          </SelectTrigger>
                          <SelectContent>
                            {DIFFICULTY_OPTIONS.map(opt => (
                              <SelectItem key={opt} value={opt}>{titleCase(opt)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='rounded-[32px] border border-zinc-200 bg-zinc-50/50 p-6'>
                        <label className='mb-3 block text-[10px] font-black uppercase tracking-widest text-zinc-400'>Partners Wanted</label>
                        <Input
                          type='number'
                          value={teamNeed}
                          onChange={e => setTeamNeed(e.target.value)}
                          min='1'
                          className='h-12 rounded-xl border-zinc-300 bg-white font-bold'
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Socials & Proof Section */}
                <section className='px-6 py-10 md:px-10 md:py-14'>
                  <div className='grid gap-12 md:grid-cols-2'>
                    <div className='space-y-10'>
                      <SectionHeading eyebrow='Presence' title='Communication' description='Where can people find you?' />
                      <div className='space-y-4'>
                        <LinkField icon={SiDiscord} iconClassName='text-[#5865F2]' label='Discord' value={discord} onChange={e => setDiscord(e.target.value)} placeholder='Invite or username' />
                        <LinkField icon={SiSlack} iconClassName='text-[#4A154B]' label='Slack' value={slack} onChange={e => setSlack(e.target.value)} placeholder='Workspace or invite' />
                        <LinkField icon={SiX} iconClassName='text-zinc-950' label='X' value={twitter} onChange={e => setTwitter(e.target.value)} placeholder='Profile or project page' />
                        <LinkField icon={SiTwitch} iconClassName='text-[#9146FF]' label='Twitch' value={twitch} onChange={e => setTwitch(e.target.value)} placeholder='Stream or demo' />
                      </div>
                    </div>
                    <div className='space-y-10'>
                      <SectionHeading eyebrow='Validation' title='Proof of Work' description='Show, dont just tell.' />
                      <div className='space-y-4'>
                        <LinkField icon={SiGithub} iconClassName='text-zinc-950' label='GitHub' required value={github} onChange={e => setGithub(e.target.value)} placeholder='Repository or code proof' />
                        <LinkField icon={SiFigma} iconClassName='text-[#F24E1E]' label='Figma' value={figma} onChange={e => setFigma(e.target.value)} placeholder='Prototype or designs' />
                        <LinkField icon={SiJira} iconClassName='text-[#0052CC]' label='Jira' value={jira} onChange={e => setJira(e.target.value)} placeholder='Roadmap or board' />
                        <LinkField icon={SiNotion} iconClassName='text-zinc-950' label='Notion' value={notion} onChange={e => setNotion(e.target.value)} placeholder='Strategy or docs' />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <aside className='bg-zinc-50/50 p-8 lg:sticky lg:top-0 lg:h-fit space-y-10'>
                {/* Real-time Card Preview */}
                <div className='space-y-4'>
                  <p className='text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 px-2'>Feed Preview</p>
                  <div className='rounded-[32px] bg-white border border-zinc-200 shadow-2xl overflow-hidden scale-[0.9] origin-top'>
                    <div className='p-6 space-y-6'>
                      <div className='space-y-4'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <Badge className='rounded-full px-2 py-0.5 text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border-emerald-100'>
                            {developmentStatus || 'Draft'}
                          </Badge>
                          <div className='flex items-center gap-1 text-[9px] font-black uppercase text-zinc-400'>
                            <Clock className='h-2.5 w-2.5' />
                            {difficultyLevel || 'TBD'}
                          </div>
                        </div>
                        <h3 className='text-xl font-black tracking-tight text-zinc-950 line-clamp-1'>{title || 'Untitled Venture'}</h3>
                        <p className='text-xs leading-relaxed text-zinc-500 line-clamp-3 italic'>
                          {description || 'Your vision will appear here...'}
                        </p>
                      </div>
                      <div className='flex flex-wrap gap-1.5'>
                        {tags.slice(0, 3).map(t => (
                          <Badge key={t} variant='outline' className='rounded-full text-[9px] px-2 py-0'>{t}</Badge>
                        ))}
                      </div>
                      <div className='pt-4 border-t border-zinc-100'>
                        <div className='h-10 w-full rounded-xl bg-zinc-950 flex items-center justify-center text-[10px] font-black text-white'>
                          VIEW DETAILS <ArrowUpRight className='ml-1 h-3 w-3' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signal Checklist */}
                <Card className='rounded-[32px] border-zinc-200 p-6 space-y-6 shadow-sm'>
                  <div className='space-y-1'>
                    <h4 className='text-sm font-black uppercase tracking-widest text-zinc-950'>Submission Signal</h4>
                    <p className='text-xs text-zinc-500'>Complete key requirements to publish.</p>
                  </div>
                  <div className='space-y-3'>
                    {requiredChecks.map(item => (
                      <div key={item.label} className='flex items-center gap-3 text-sm'>
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-colors ${item.complete ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-300'}`}>
                          <Check className='h-3 w-3' />
                        </div>
                        <span className={item.complete ? 'text-zinc-950 font-bold' : 'text-zinc-400'}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Action */}
                <div className='pt-4'>
                  <Button
                    type='submit'
                    disabled={!isFormValid}
                    className='w-full h-16 rounded-[24px] bg-zinc-950 text-white font-black text-lg transition-all hover:bg-zinc-800 hover:shadow-xl active:scale-95 disabled:opacity-30'
                  >
                    <PlusCircle className='mr-3 h-5 w-5' />
                    Publish Brief
                  </Button>
                  {!isFormValid && (
                    <p className='mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-red-500 animate-pulse'>
                      Still Needs Required Signal
                    </p>
                  )}
                </div>
              </aside>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function CreateProjectPage() {
  return (
    <AuthGuard>
      <CreateProjectContent />
    </AuthGuard>
  );
}
