'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Rocket, 
  UsersRound, 
  Sparkles, 
  PlusCircle, 
  Check, 
  MessageCircle, 
  Link2, 
  Info, 
  BookOpenText,
  Save
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

import { AuthGuard } from '../../../../components/UI/auth-guard';
import { Button } from '../../../../components/UI/button';
import { Card } from '../../../../components/UI/card';
import { Input } from '../../../../components/UI/input';
import LoadingSpinner from '../../../../components/UI/LoadingSpinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/UI/select';
import { Textarea } from '../../../../components/UI/textarea';
import { Badge } from '../../../../components/UI/badge';

const DEVELOPMENT_STATUS_OPTIONS = [
  'just exploring',
  'problem validation',
  'customer discovery',
  'prototype in progress',
  'pilot users',
  'early traction',
  'raising or preparing to raise',
  'operating and growing',
  'cancelled',
];

const DIFFICULTY_OPTIONS = [
  'nights and weekends',
  'part-time',
  'full-time soon',
  'full-time now',
];

const titleCase = value => value?.replace(/\b\w/g, char => char.toUpperCase());

const buildProjectFormData = data => ({
  title: data.title,
  description: data.description,
  teamNeed: data.team_need,
  discord: data.communication?.[0]?.discord || '',
  twitch: data.communication?.[0]?.twitch || '',
  twitter: data.communication?.[0]?.twitter || '',
  slack: data.communication?.[0]?.slack || '',
  github: data.developmentTool?.[0]?.github || '',
  jira: data.developmentTool?.[0]?.jira || '',
  figma: data.developmentTool?.[0]?.figma || '',
  trello: data.developmentTool?.[0]?.trello || '',
  notion: data.developmentTool?.[0]?.notion || '',
});

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className='space-y-2'>
      <p className='text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500'>
        {eyebrow}
      </p>
      <h2 className='text-2xl font-black tracking-tight text-zinc-950'>
        {title}
      </h2>
      <p className='max-w-2xl text-sm leading-7 text-zinc-600'>{description}</p>
    </div>
  );
}

function LinkField({ icon: Icon, iconClassName = '', label, required = false, ...props }) {
  return (
    <div className='space-y-2.5'>
      <label className='flex items-center gap-2 text-sm font-medium text-zinc-800'>
        <span className='flex h-8 w-8 items-center justify-center rounded-2xl border border-zinc-200 bg-white'>
          <Icon className={`h-4 w-4 ${iconClassName}`} />
        </span>
        <span>
          {label}
          {required ? ' *' : ''}
        </span>
      </label>
      <Input
        {...props}
        className='h-12 rounded-2xl border-zinc-300 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:bg-white'
      />
    </div>
  );
}

function UpdateProjectContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const fetchGetProject = async () => {
    const response = await fetch(`/api/project/update/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['projectData', id],
    queryFn: fetchGetProject,
    enabled: !!id,
  });

  const [developmentStatus, setDevelopmentStatus] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [formData, setFormData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...(prev || buildProjectFormData(data)), [name]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const response = await fetch('/api/project/update/putUserProject', {
      method: 'PUT',
      body: JSON.stringify({
        id,
        ...currentFormData,
        developmentStatus: currentDevelopmentStatus,
        difficulty: currentDifficulty,
        communicationId: data.communication?.[0]?.id,
        devToolsId: data.developmentTool?.[0]?.id,
      }),
      headers: { 'content-Type': 'application/json' },
    });

    const responseData = await response.json();
    if (responseData) router.push(`/projects/${responseData.id}`);
  };

  if (isLoading) return <div className='min-h-screen flex items-center justify-center bg-zinc-50'><LoadingSpinner /></div>;
  if (isError) return <div className='container mx-auto py-20 text-center text-red-500'>Error: {error.message}</div>;
  if (!id || !data) return null;

  const currentFormData = formData || buildProjectFormData(data);
  const currentDevelopmentStatus = developmentStatus ?? data.development_status;
  const currentDifficulty = difficulty ?? data.difficulty_level;
  const isFormValid = currentFormData.title && currentFormData.description && currentDevelopmentStatus && currentDifficulty && currentFormData.github;

  return (
    <div className='relative overflow-hidden bg-zinc-50 text-zinc-950 pb-20'>
      {/* Background Decor */}
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(24,24,27,0.08),transparent_28%),radial-gradient(circle_at_top,rgba(212,212,216,0.42),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,0.98),rgba(244,244,245,0.96))]' />
      <div className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(24,24,27,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_top,black_14%,transparent_76%)]' />

      <div className='container mx-auto px-4 py-10 md:py-14'>
        <div className='mx-auto max-w-7xl space-y-8'>
          <div className='flex items-center justify-between'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.back()}
              className='gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 text-zinc-600 shadow-sm backdrop-blur hover:bg-white hover:text-zinc-950'
            >
              <ArrowLeft className='h-4 w-4' />
              Back
            </Button>
          </div>

          <section className='overflow-hidden rounded-[40px] border border-zinc-200/80 bg-white shadow-[0_40px_120px_-60px_rgba(24,24,27,0.3)]'>
            <div className='px-6 py-8 md:px-10 md:py-10 border-b border-zinc-100'>
              <div className='space-y-4'>
                <p className='inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500'>
                  Edit Mode
                </p>
                <h1 className='text-4xl font-black tracking-[-0.05em] text-zinc-950 md:text-6xl'>
                  Refine your project brief.
                </h1>
                <p className='max-w-3xl text-base leading-8 text-zinc-600 md:text-lg'>
                  Keep your search active by updating your stage, commitment
                  needs, and recent proof of work.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='grid gap-0 lg:grid-cols-[minmax(0,1fr)_380px]'>
              <div className='lg:border-r lg:border-zinc-100'>
                {/* Overview Section */}
                <section className='border-b border-zinc-100 px-6 py-10 md:px-10'>
                  <div className='space-y-8'>
                    <SectionHeading
                      eyebrow='Core Identity'
                      title='The Vision'
                      description='Describe the project clearly, the goal, and why it matters.'
                    />
                    <div className='space-y-6 rounded-[32px] border border-zinc-200 bg-zinc-50/50 p-6 md:p-8'>
                      <div className='space-y-2.5'>
                        <label className='text-sm font-bold text-zinc-800'>Project title</label>
                        <Input
                          name='title'
                          value={currentFormData.title}
                          onChange={handleChange}
                          required
                          className='h-12 rounded-2xl border-zinc-300 bg-white text-zinc-950'
                        />
                      </div>
                      <div className='space-y-2.5'>
                        <label className='text-sm font-bold text-zinc-800'>Detailed description</label>
                        <Textarea
                          name='description'
                          value={currentFormData.description}
                          onChange={handleChange}
                          rows={8}
                          required
                          className='rounded-2xl border-zinc-300 bg-white text-zinc-950 leading-relaxed'
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Stage Section */}
                <section className='border-b border-zinc-100 px-6 py-10 md:px-10'>
                  <div className='space-y-8'>
                    <SectionHeading
                      eyebrow='Project Maturity'
                      title='Stage & Commitment'
                      description='Update how far along you are and what you expect from a collaborator.'
                    />
                    <div className='grid gap-6 md:grid-cols-2'>
                      <div className='space-y-2.5'>
                        <label className='text-sm font-bold text-zinc-800'>Current stage</label>
                        <Select value={currentDevelopmentStatus} onValueChange={setDevelopmentStatus}>
                          <SelectTrigger className='h-12 rounded-2xl border-zinc-300 bg-zinc-50'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DEVELOPMENT_STATUS_OPTIONS.map(opt => (
                              <SelectItem key={opt} value={opt}>{titleCase(opt)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2.5'>
                        <label className='text-sm font-bold text-zinc-800'>Time commitment</label>
                        <Select value={currentDifficulty} onValueChange={setDifficulty}>
                          <SelectTrigger className='h-12 rounded-2xl border-zinc-300 bg-zinc-50'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DIFFICULTY_OPTIONS.map(opt => (
                              <SelectItem key={opt} value={opt}>{titleCase(opt)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2.5'>
                        <label className='text-sm font-bold text-zinc-800'>Collaborators wanted</label>
                        <Input
                          type='number'
                          name='teamNeed'
                          value={currentFormData.teamNeed}
                          onChange={handleChange}
                          min='0'
                          className='h-12 rounded-2xl border-zinc-300 bg-zinc-50'
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Links Sections */}
                <section className='px-6 py-10 md:px-10'>
                  <div className='grid gap-12 md:grid-cols-2'>
                    <div className='space-y-8'>
                      <SectionHeading
                        eyebrow='Presence'
                        title='Communication'
                        description='Where can people find you?'
                      />
                      <div className='space-y-4'>
                        <LinkField icon={SiDiscord} iconClassName='text-[#5865F2]' label='Discord' name='discord' value={currentFormData.discord} onChange={handleChange} />
                        <LinkField icon={SiSlack} iconClassName='text-[#4A154B]' label='Slack' name='slack' value={currentFormData.slack} onChange={handleChange} />
                        <LinkField icon={SiX} iconClassName='text-zinc-950' label='X' name='twitter' value={currentFormData.twitter} onChange={handleChange} />
                        <LinkField icon={SiTwitch} iconClassName='text-[#9146FF]' label='Twitch' name='twitch' value={currentFormData.twitch} onChange={handleChange} />
                      </div>
                    </div>
                    <div className='space-y-8'>
                      <SectionHeading
                        eyebrow='Validation'
                        title='Proof of Work'
                        description='Show, dont just tell.'
                      />
                      <div className='space-y-4'>
                        <LinkField icon={SiGithub} iconClassName='text-zinc-950' label='GitHub' name='github' value={currentFormData.github} onChange={handleChange} required />
                        <LinkField icon={SiFigma} iconClassName='text-[#F24E1E]' label='Figma' name='figma' value={currentFormData.figma} onChange={handleChange} />
                        <LinkField icon={SiJira} iconClassName='text-[#0052CC]' label='Jira' name='jira' value={currentFormData.jira} onChange={handleChange} />
                        <LinkField icon={SiNotion} iconClassName='text-zinc-950' label='Notion' name='notion' value={currentFormData.notion} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <aside className='bg-zinc-50/50 p-8 lg:sticky lg:top-0 lg:h-fit space-y-8'>
                <div className='rounded-[32px] bg-zinc-950 p-6 text-white shadow-2xl space-y-6'>
                  <div className='space-y-2'>
                    <p className='text-[10px] font-black uppercase tracking-widest text-white/40'>Quick Preview</p>
                    <h3 className='text-2xl font-black leading-tight'>{currentFormData.title || 'Untitled'}</h3>
                    <div className='pt-2 flex flex-wrap gap-2'>
                      <Badge variant='outline' className='border-white/10 bg-white/5 text-white/80 text-[10px] uppercase font-black px-2 py-0.5'>{currentDevelopmentStatus}</Badge>
                      <Badge variant='outline' className='border-white/10 bg-white/5 text-white/80 text-[10px] uppercase font-black px-2 py-0.5'>{currentDifficulty}</Badge>
                    </div>
                  </div>
                  <p className='text-sm text-white/60 leading-relaxed line-clamp-4 italic'>"{currentFormData.description}"</p>
                </div>

                <Card className='rounded-[32px] border-zinc-200 p-6 space-y-6 shadow-sm'>
                  <div className='space-y-1'>
                    <h4 className='text-sm font-black uppercase tracking-widest text-zinc-950'>Submission Signal</h4>
                    <p className='text-xs text-zinc-500'>Ensure your brief is complete.</p>
                  </div>
                  <div className='space-y-3'>
                    {[
                      ['Title', !!currentFormData.title],
                      ['Summary', !!currentFormData.description],
                      ['GitHub Proof', !!currentFormData.github],
                    ].map(([label, ok]) => (
                      <div key={label} className='flex items-center gap-3 text-sm'>
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center ${ok ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-300'}`}>
                          <Check className='h-3 w-3' />
                        </div>
                        <span className={ok ? 'text-zinc-900 font-bold' : 'text-zinc-400'}>{label}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className='pt-4'>
                  <Button
                    type='submit'
                    disabled={!isFormValid}
                    className='w-full h-16 rounded-[24px] bg-zinc-950 text-white font-black text-lg transition-all hover:bg-zinc-800 hover:shadow-xl active:scale-95 disabled:opacity-30'
                  >
                    <Save className='mr-3 h-5 w-5' />
                    Save Updates
                  </Button>
                  {!isFormValid && (
                    <p className='mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-red-500'>
                      Missing Required Fields
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

export default function UpdateProjectPage() {
  return (
    <AuthGuard>
      <UpdateProjectContent />
    </AuthGuard>
  );
}
