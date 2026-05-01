'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  CircleAlert,
  Eye,
  EyeOff,
  ExternalLink,
  GraduationCap,
  Link2,
  Sparkles,
  Trash2,
  Check,
  User,
  Layout,
  Globe,
  Settings,
} from 'lucide-react';

import HobbiesTags from '../../components/SettingsUI/SettingsHobbiesTag';
import SkillsTags from '../../components/SettingsUI/SettingsSkillsTag';
import { AuthGuard } from '../../components/UI/auth-guard';
import { Button } from '../../components/UI/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/UI/dialog';
import { Input } from '../../components/UI/input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { ProfileAvatar } from '../../components/UI/profile-avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/UI/select';
import { Textarea } from '../../components/UI/textarea';
import { Badge } from '../../components/UI/badge';
import { Card, CardContent } from '../../components/UI/card';
import { betterAuthClient } from '../../lib/better-auth-client';

const socialFields = [
  { key: 'website', label: 'Website', placeholder: 'https://your-site.com', icon: Globe },
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username', icon: Link2 },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username', icon: Link2 },
  { key: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/username', icon: Link2 },
  { key: 'discord', label: 'Discord', placeholder: 'Username or invite link', icon: Link2 },
  { key: 'twitch', label: 'Twitch', placeholder: 'https://twitch.tv/username', icon: Link2 },
  { key: 'medium', label: 'Medium', placeholder: 'https://medium.com/@username', icon: Link2 },
  { key: 'dev', label: 'Dev.to', placeholder: 'https://dev.to/username', icon: Link2 },
];

const availabilityOptions = [
  { value: 'not_specified', label: 'Not specified' },
  { value: 'exploring', label: 'Exploring opportunities' },
  { value: 'evenings_weekends', label: 'Evenings and weekends' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'full_time', label: 'Full-time' },
];

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className='space-y-3'>
      <p className='text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400'>
        {eyebrow}
      </p>
      <h2 className='text-3xl font-black tracking-tight text-zinc-950'>
        {title}
      </h2>
      {description && (
        <p className='max-w-2xl text-base leading-relaxed text-zinc-500'>
          {description}
        </p>
      )}
    </div>
  );
}

function SaveActions({
  isDirty,
  isPending,
  submitLabel = 'Save Changes',
  onCancel,
}) {
  if (!isDirty) return null;

  return (
    <div className='flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-300'>
      <Button
        type='button'
        variant='ghost'
        onClick={onCancel}
        disabled={isPending}
        className='rounded-xl text-zinc-500 font-bold hover:bg-zinc-100'
      >
        Cancel
      </Button>
      <Button
        type='submit'
        disabled={isPending}
        className='rounded-xl bg-zinc-950 px-6 font-black text-white hover:bg-zinc-800 shadow-lg shadow-zinc-200'
      >
        {isPending ? 'Saving...' : submitLabel}
      </Button>
    </div>
  );
}

function SettingsContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [isHobbiesDirty, setIsHobbiesDirty] = useState(false);
  const [isSkillsDirty, setIsSkillsDirty] = useState(false);

  const [profileInfoDraft, setProfileInfoDraft] = useState(null);
  const [educationDraft, setEducationDraft] = useState(null);
  const [workHistoryDraft, setWorkHistoryDraft] = useState(null);
  const [socialDraft, setSocialDraft] = useState(null);
  const [marketVisibilityDraft, setMarketVisibilityDraft] = useState(null);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const fetchGetUserInformation = async () => {
    const response = await fetch('/api/user/getUserInformation');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['userData'],
    queryFn: fetchGetUserInformation,
  });

  const mutation = useMutation({
    mutationFn: async payload => {
      const response = await fetch('/api/user/putUserSettings', {
        method: 'POST',
        body: JSON.stringify({ data: payload }),
        headers: { 'content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userData']);
      setProfileInfoDraft(null);
      setEducationDraft(null);
      setWorkHistoryDraft(null);
      setSocialDraft(null);
      setMarketVisibilityDraft(null);
      setIsHobbiesDirty(false);
      setIsSkillsDirty(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 4000);
    },
    onError: () => {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 4000);
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/user/delete/${data.id}`, {
        method: 'DELETE',
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || `HTTP error! status: ${response.status}`);
      }

      return payload;
    },
    onSuccess: async () => {
      setIsOpen(false);
      await betterAuthClient.signOut();
      router.push('/');
    },
    onError: () => {
      setIsOpen(false);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 4000);
    },
  });

  if (isLoading) return <div className='min-h-screen flex items-center justify-center bg-zinc-50'><LoadingSpinner /></div>;
  if (isError) return <div className='min-h-screen flex items-center justify-center bg-zinc-50 text-red-500'>Error: {error.message}</div>;
  if (!data) return null;

  const profileInfoForm = profileInfoDraft || {
    name: data.name || '',
    short_bio: data.short_bio || '',
    bio: data.bio || '',
  };
  const educationForm = educationDraft ?? (data.education || '');
  const workHistoryForm = workHistoryDraft ?? (data.work || '');
  const socialForm = socialDraft || (data.userSocialProfile?.[0] || {});
  const currentSkills = skills.length > 0 ? skills : data.skills || [];
  const currentHobbies = hobbies.length > 0 ? hobbies : data.hobbies || [];
  const socialLinkCount = socialFields.filter(f => socialForm[f.key]?.trim()).length;
  const marketVisibility = marketVisibilityDraft ?? Boolean(data.show_in_collaborator_feed);
  const availabilityDraft = profileInfoDraft?.availability ?? data.availability ?? 'not_specified';

  const isUserSectionFormDirty = profileInfoForm.name !== (data.name || '') || profileInfoForm.short_bio !== (data.short_bio || '');
  const isAboutMeFormDirty = profileInfoForm.bio !== (data.bio || '');
  const isEducationFormDirty = educationForm !== (data.education || '');
  const isWorkHistoryFormDirty = workHistoryForm !== (data.work || '');
  const isMarketVisibilityDirty = marketVisibility !== Boolean(data.show_in_collaborator_feed) || availabilityDraft !== (data.availability || 'not_specified');
  const isSocialFormDirty = Object.keys(socialForm).some(k => socialForm[k] !== (data.userSocialProfile?.[0]?.[k] || '')) || Object.keys(socialForm).length !== Object.keys(data.userSocialProfile?.[0] || {}).length;

  const profileCompletionChecks = [
    { label: 'Identity', ok: !!profileInfoForm.name?.trim() && !!profileInfoForm.short_bio?.trim() },
    { label: 'Personal Summary', ok: !!profileInfoForm.bio?.trim() },
    { label: 'Background', ok: !!educationForm?.trim() || !!workHistoryForm?.trim() },
    { label: 'Strengths', ok: currentSkills.length > 0 },
    { label: 'Public Links', ok: socialLinkCount > 0 },
  ];
  const completedSections = profileCompletionChecks.filter(c => c.ok).length;
  const completionPercent = Math.round((completedSections / profileCompletionChecks.length) * 100);

  const onMarketVisibilitySubmit = event => {
    event.preventDefault();
    mutation.mutate({
      show_in_collaborator_feed: marketVisibility,
      availability: availabilityDraft,
    });
  };

  const onUserSectionSubmit = event => {
    event.preventDefault();
    mutation.mutate({
      name: profileInfoForm.name,
      short_bio: profileInfoForm.short_bio,
    });
  };

  const onAboutMeSubmit = event => {
    event.preventDefault();
    mutation.mutate({
      bio: profileInfoForm.bio,
    });
  };

  const onEducationSubmit = event => {
    event.preventDefault();
    mutation.mutate({
      education: educationForm,
    });
  };

  const onWorkSubmit = event => {
    event.preventDefault();
    mutation.mutate({
      work: workHistoryForm,
    });
  };

  const onSkillsSubmit = event => {
    event.preventDefault();
    mutation.mutate({
      skills: currentSkills,
    });
    setIsSkillsDirty(false);
  };

  const onHobbiesSubmit = event => {
    event.preventDefault();
    mutation.mutate({
      hobbies: currentHobbies,
    });
    setIsHobbiesDirty(false);
  };

  const onSocialSubmit = event => {
    event.preventDefault();
    mutation.mutate({
      ...socialForm,
      userId: data.id,
    });
  };

  return (
    <div className='relative min-h-screen bg-zinc-50 text-zinc-950 selection:bg-zinc-950 selection:text-white'>
      {/* Background Decor */}
      <div className='fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(24,24,27,0.06),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(24,24,27,0.02),transparent_30%)]' />
      <div className='fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(24,24,27,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.015)_1px,transparent_1px)] bg-[size:64px_64px]' />

      <div className='container mx-auto px-4 py-12 md:py-20'>
        <div className='mx-auto max-w-7xl space-y-12'>
          
          {/* Status Toasts */}
          <div className='fixed top-24 right-4 z-50 space-y-3 pointer-events-none'>
            {(showSuccessMessage || showErrorMessage) && (
              <div className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-10 duration-500 pointer-events-auto min-w-[300px] ${
                showSuccessMessage ? 'border-emerald-200 bg-white/90 text-emerald-900' : 'border-red-200 bg-white/90 text-red-900'
              }`}>
                <div className='flex items-center gap-3'>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${showSuccessMessage ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    {showSuccessMessage ? <Check className='h-4 w-4' /> : <CircleAlert className='h-4 w-4' />}
                  </div>
                  <div>
                    <p className='font-black text-sm uppercase tracking-tight'>{showSuccessMessage ? 'Success' : 'Error'}</p>
                    <p className='text-xs font-medium opacity-70'>{showSuccessMessage ? 'Profile settings updated.' : 'Failed to save changes.'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <header className='space-y-8'>
            <div className='space-y-6'>
              <Badge variant='outline' className='rounded-full border-zinc-200 bg-white/50 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-sm'>
                Profile Settings
              </Badge>
              <div className='space-y-4'>
                <h1 className='text-balance text-5xl font-black tracking-[-0.06em] text-zinc-950 md:text-7xl'>
                  Refine your <span className='text-zinc-400'>collaborator signal.</span>
                </h1>
                <p className='max-w-2xl text-lg leading-relaxed text-zinc-600 md:text-xl'>
                  Maintain an accurate profile so people can understand what
                  you bring, what you like working on, and when you are
                  available.
                </p>
              </div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3'>
                <p className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>Profile Strength</p>
                <p className='text-3xl font-black tracking-tighter text-zinc-950'>{completionPercent}%</p>
                <div className='h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden'>
                  <div className='h-full bg-zinc-950 transition-all duration-1000' style={{ width: `${completionPercent}%` }} />
                </div>
              </div>
              <div className='rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-1'>
                <p className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>Public Links</p>
                <p className='text-3xl font-black tracking-tighter text-zinc-950'>{String(socialLinkCount).padStart(2, '0')}</p>
                <p className='text-[10px] font-bold text-zinc-400 uppercase'>Verified Surfaces</p>
              </div>
              <div className='rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-1'>
                <p className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>Active Signals</p>
                <p className='text-3xl font-black tracking-tighter text-zinc-950'>{String(currentSkills.length + currentHobbies.length).padStart(2, '0')}</p>
                <p className='text-[10px] font-bold text-zinc-400 uppercase'>Skills & Hobbies</p>
              </div>
              <div className='rounded-3xl border border-zinc-200 bg-zinc-950 p-5 shadow-xl space-y-1 group hover:scale-[1.02] transition-transform cursor-pointer' onClick={() => router.push(`/user/${data.id}`)}>
                <p className='text-[10px] font-black uppercase tracking-widest text-white/40'>Public Profile</p>
                <div className='flex items-center justify-between pt-1'>
                  <p className='text-xl font-black tracking-tight text-white leading-tight'>View as others see you</p>
                  <ArrowUpRight className='h-5 w-5 text-white/40 group-hover:text-white transition-colors' />
                </div>
              </div>
            </div>
          </header>

          <section className='overflow-hidden rounded-[48px] border border-zinc-200 bg-white shadow-[0_40px_120px_-60px_rgba(24,24,27,0.2)]'>
            <div className='grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]'>
              
              {/* Sidebar Guide */}
              <aside className='lg:border-r lg:border-zinc-100 bg-zinc-50/50 p-8 space-y-12 lg:sticky lg:top-0 lg:h-fit'>
                <div className='space-y-6'>
                  <ProfileAvatar
                    className='h-24 w-24 rounded-[32px] border-4 border-white shadow-2xl ring-1 ring-zinc-200'
                    src={data.image}
                    name={data.name}
                    priority
                    sizes='96px'
                  />
                  <div className='space-y-1'>
                    <h3 className='text-2xl font-black tracking-tight text-zinc-950'>{data.name || 'Your Name'}</h3>
                    <p className='text-xs font-bold text-zinc-400 uppercase tracking-widest'>Member since {new Date(data.createdAt).getFullYear()}</p>
                  </div>
                </div>

                <div className='space-y-8'>
                  <div className='space-y-4'>
                    <h4 className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>Submission Signal</h4>
                    <div className='space-y-3'>
                      {profileCompletionChecks.map(c => (
                        <div key={c.label} className='flex items-center gap-3 text-xs font-bold transition-all'>
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-colors ${c.ok ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-300'}`}>
                            <Check className='h-3 w-3' />
                          </div>
                          <span className={c.ok ? 'text-zinc-950' : 'text-zinc-400'}>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='rounded-[32px] bg-white border border-zinc-200 p-6 space-y-4 shadow-sm'>
                    <p className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>Quick Note</p>
                    <p className='text-xs leading-relaxed text-zinc-500 font-medium'>
                      The strongest profiles focus on "Proof of Work" rather than just a list of skills. 
                      Add links that verify your claims.
                    </p>
                  </div>
                </div>
              </aside>

              {/* Form Content */}
              <div className='divide-y divide-zinc-100'>
                
                {/* Visibility Section */}
                <section className='p-8 md:p-12 space-y-10'>
                  <form onSubmit={onMarketVisibilitySubmit}>
                    <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10'>
                      <SectionHeading
                        eyebrow='Visibility'
                        title='Discovery Presence'
                        description='Control how you appear in the people discovery feed.'
                      />
                      <SaveActions
                        isDirty={isMarketVisibilityDirty}
                        isPending={mutation.isPending}
                        onCancel={() => {
                          setMarketVisibilityDraft(null);
                          setProfileInfoDraft(null);
                        }}
                      />
                    </div>

                    <div className='grid gap-4 md:grid-cols-2'>
                      <button
                        type='button'
                        onClick={() => setMarketVisibilityDraft(false)}
                        className={`group relative overflow-hidden rounded-[32px] border p-6 text-left transition-all duration-300 ${
                          !marketVisibility
                            ? 'border-zinc-950 bg-zinc-950 text-white shadow-2xl shadow-zinc-300'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <div className='flex items-start gap-4 relative z-10'>
                          <div className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-colors ${!marketVisibility ? 'bg-white/10' : 'bg-zinc-100'}`}>
                            <EyeOff className='h-5 w-5' />
                          </div>
                          <div className='space-y-1'>
                            <p className='font-black uppercase tracking-widest text-xs'>Private Mode</p>
                            <p className={`text-xs leading-relaxed font-medium ${!marketVisibility ? 'text-white/60' : 'text-zinc-400'}`}>
                              Hidden from the discovery page. Best if you're only browsing or posting projects.
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        type='button'
                        onClick={() => setMarketVisibilityDraft(true)}
                        className={`group relative overflow-hidden rounded-[32px] border p-6 text-left transition-all duration-300 ${
                          marketVisibility
                            ? 'border-zinc-950 bg-zinc-950 text-white shadow-2xl shadow-zinc-300'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <div className='flex items-start gap-4 relative z-10'>
                          <div className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-colors ${marketVisibility ? 'bg-white/10' : 'bg-zinc-100'}`}>
                            <Eye className='h-5 w-5' />
                          </div>
                          <div className='space-y-1'>
                            <p className='font-black uppercase tracking-widest text-xs'>Publicly Available</p>
                            <p className={`text-xs leading-relaxed font-medium ${marketVisibility ? 'text-white/60' : 'text-zinc-400'}`}>
                              Visible in people discovery. Ready to receive inbound interest from potential collaborators.
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className='mt-8 max-w-sm space-y-4 rounded-3xl bg-zinc-50 p-6 border border-zinc-100'>
                      <div className='space-y-1.5'>
                        <label className='text-xs font-black uppercase tracking-widest text-zinc-400 ml-1'>Availability Status</label>
                        <Select
                          value={availabilityDraft}
                          onValueChange={v => setProfileInfoDraft(prev => ({ ...(prev || profileInfoForm), availability: v }))}
                        >
                          <SelectTrigger className='h-12 rounded-xl border-zinc-200 bg-white font-bold'>
                            <SelectValue placeholder='Select availability' />
                          </SelectTrigger>
                          <SelectContent>
                            {availabilityOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </form>
                </section>

                {/* Identity Section */}
                <section className='p-8 md:p-12 space-y-10'>
                  <form onSubmit={onUserSectionSubmit}>
                    <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10'>
                      <SectionHeading
                        eyebrow='Identity'
                        title='Core Basics'
                        description='Your name and the single sentence people should remember about you.'
                      />
                      <SaveActions
                        isDirty={isUserSectionFormDirty}
                        isPending={mutation.isPending}
                        onCancel={() => setProfileInfoDraft(prev => ({ ...(prev || {}), name: data.name || '', short_bio: data.short_bio || '' }))}
                      />
                    </div>

                    <div className='grid gap-8 md:grid-cols-2 rounded-[40px] border border-zinc-200 bg-zinc-50/50 p-8'>
                      <div className='space-y-3'>
                        <label className='text-xs font-black uppercase tracking-widest text-zinc-400 ml-1'>Full Name</label>
                        <Input
                          value={profileInfoForm.name}
                          onChange={e => setProfileInfoDraft(prev => ({ ...(prev || profileInfoForm), name: e.target.value }))}
                          placeholder='Your full name'
                          className='h-14 rounded-2xl border-zinc-300 bg-white text-lg font-bold text-zinc-950 focus-visible:ring-zinc-950'
                        />
                      </div>
                      <div className='space-y-3'>
                        <label className='text-xs font-black uppercase tracking-widest text-zinc-400 ml-1'>One-line Intro</label>
                        <Input
                          value={profileInfoForm.short_bio}
                          onChange={e => setProfileInfoDraft(prev => ({ ...(prev || profileInfoForm), short_bio: e.target.value }))}
                          placeholder='What should people understand about you fast?'
                          className='h-14 rounded-2xl border-zinc-300 bg-white text-base font-bold text-zinc-900 focus-visible:ring-zinc-950'
                        />
                      </div>
                    </div>
                  </form>
                </section>

                {/* About Section */}
                <section className='p-8 md:p-12 space-y-10'>
                  <form onSubmit={onAboutMeSubmit}>
                    <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10'>
                      <SectionHeading
                        eyebrow='Bio'
                        title='Personal Summary'
                        description='A concise description of how you think and what kind of working dynamic you prefer.'
                      />
                      <SaveActions
                        isDirty={isAboutMeFormDirty}
                        isPending={mutation.isPending}
                        onCancel={() => setProfileInfoDraft(prev => ({ ...(prev || profileInfoForm), bio: data.bio || '' }))}
                      />
                    </div>
                    <div className='rounded-[40px] border border-zinc-200 bg-zinc-50/50 p-8'>
                      <Textarea
                        rows={10}
                        value={profileInfoForm.bio}
                        onChange={e => setProfileInfoDraft(prev => ({ ...(prev || profileInfoForm), bio: e.target.value }))}
                        className='rounded-2xl border-zinc-300 bg-white text-base leading-relaxed text-zinc-900 focus-visible:ring-zinc-950 p-6'
                        placeholder='Share your background, motivation, and what kind of people you work well with...'
                      />
                    </div>
                  </form>
                </section>

                {/* Experience Grid */}
                <section className='grid gap-0 md:grid-cols-2 divide-x divide-zinc-100'>
                  <form onSubmit={onEducationSubmit} className='p-8 md:p-12 space-y-8'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-400'>
                        <GraduationCap className='h-4 w-4' />
                        Education
                      </div>
                      <SaveActions isDirty={isEducationFormDirty} isPending={mutation.isPending} onCancel={() => setEducationDraft(null)} />
                    </div>
                    <div className='space-y-4'>
                      <SectionHeading title='Studies & Expertise' description='What do you know deeply?' />
                      <Input
                        value={educationForm}
                        onChange={e => setEducationDraft(e.target.value)}
                        placeholder='e.g. Stanford CS, or 10 years of Logistics...'
                        className='h-12 rounded-xl border-zinc-300 bg-zinc-50 focus-visible:bg-white transition-all'
                      />
                    </div>
                  </form>

                  <form onSubmit={onWorkSubmit} className='p-8 md:p-12 space-y-8'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-400'>
                        <Briefcase className='h-4 w-4' />
                        Work
                      </div>
                      <SaveActions isDirty={isWorkHistoryFormDirty} isPending={mutation.isPending} onCancel={() => setWorkHistoryDraft(null)} />
                    </div>
                    <div className='space-y-4'>
                      <SectionHeading title='What you bring' description='Practical operating value.' />
                      <Input
                        value={workHistoryForm}
                        onChange={e => setWorkHistoryDraft(e.target.value)}
                        placeholder='e.g. Engineering Lead at Stripe...'
                        className='h-12 rounded-xl border-zinc-300 bg-zinc-50 focus-visible:bg-white transition-all'
                      />
                    </div>
                  </form>
                </section>

                {/* Tags Section */}
                <section className='grid gap-0 md:grid-cols-2 divide-x divide-zinc-100'>
                  <form onSubmit={onSkillsSubmit} className='p-8 md:p-12 space-y-10'>
                    <div className='flex items-center justify-between'>
                      <SectionHeading eyebrow='Capabilities' title='Strengths' />
                      <SaveActions isDirty={isSkillsDirty} isPending={mutation.isPending} onCancel={() => { setSkills(data.skills || []); setIsSkillsDirty(false); }} />
                    </div>
                    <SkillsTags
                      skills={skills}
                      setSkills={setSkills}
                      dataSkills={data.skills}
                      formChange={setIsSkillsDirty}
                    />
                  </form>

                  <form onSubmit={onHobbiesSubmit} className='p-8 md:p-12 space-y-10'>
                    <div className='flex items-center justify-between'>
                      <SectionHeading eyebrow='Themes' title='Interests' />
                      <SaveActions isDirty={isHobbiesDirty} isPending={mutation.isPending} onCancel={() => { setHobbies(data.hobbies || []); setIsHobbiesDirty(false); }} />
                    </div>
                    <HobbiesTags
                      hobbies={hobbies}
                      setHobbies={setHobbies}
                      dataHobbies={data.hobbies}
                      formChange={setIsHobbiesDirty}
                    />
                  </form>
                </section>

                {/* Links Section */}
                <section className='p-8 md:p-12 space-y-10'>
                  <form onSubmit={onSocialSubmit}>
                    <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10'>
                      <SectionHeading
                        eyebrow='Proof'
                        title='Verified Surfaces'
                        description='Links to your work, writing, or existing professional reputation.'
                      />
                      <SaveActions isDirty={isSocialFormDirty} isPending={mutation.isPending} onCancel={() => setSocialDraft(null)} />
                    </div>

                    <div className='grid gap-6 md:grid-cols-2 rounded-[40px] border border-zinc-200 bg-zinc-50/50 p-8'>
                      {socialFields.map(field => (
                        <div key={field.key} className='space-y-2.5'>
                          <label className='flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1'>
                            <field.icon className='h-3.5 w-3.5' />
                            {field.label}
                          </label>
                          <Input
                            value={socialForm[field.key] || ''}
                            placeholder={field.placeholder}
                            onChange={e => setSocialDraft(prev => ({ ...(prev || socialForm), [field.key]: e.target.value }))}
                            className='h-12 rounded-xl border-zinc-300 bg-white shadow-sm focus-visible:ring-zinc-950'
                          />
                        </div>
                      ))}
                    </div>
                  </form>
                </section>

                {/* Account Section */}
                <section className='p-8 md:p-12 space-y-8'>
                  <div className='rounded-[40px] border border-red-100 bg-red-50/30 p-8 md:p-12'>
                    <div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
                      <div className='space-y-4'>
                        <div className='flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.2em] text-red-600'>
                          <CircleAlert className='h-4 w-4' />
                          Danger Zone
                        </div>
                        <div className='space-y-2'>
                          <h2 className='text-3xl font-black tracking-tight text-red-950'>Delete Account</h2>
                          <p className='max-w-xl text-base font-medium leading-relaxed text-red-900/60'>
                            This will permanently remove your profile and all associated listings. This action cannot be reversed.
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setIsOpen(true)}
                        variant='destructive'
                        className='h-14 rounded-2xl px-8 font-black text-white hover:bg-red-700 shadow-xl shadow-red-200 active:scale-95 transition-all'
                      >
                        <Trash2 className='h-5 w-5 mr-2' />
                        Delete Permanently
                      </Button>
                    </div>
                  </div>

                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className='rounded-[32px] border-zinc-200 shadow-2xl'>
                      <DialogHeader>
                        <DialogTitle className='text-2xl font-black tracking-tight text-red-600'>Delete Account</DialogTitle>
                        <DialogDescription className='text-zinc-500'>This action is permanent and irreversible.</DialogDescription>
                      </DialogHeader>
                      <p className='text-sm leading-relaxed text-zinc-600 py-4'>
                        Are you sure you want to delete your account? You will lose access to your projects, profile data, and all public signals.
                      </p>
                      <DialogFooter className='gap-3'>
                        <Button variant='outline' onClick={() => setIsOpen(false)} className='rounded-2xl'>Keep Account</Button>
                        <Button variant='destructive' onClick={() => deleteAccount.mutate()} className='rounded-2xl px-8'>Delete Everything</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </section>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
