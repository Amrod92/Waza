'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  ExternalLink,
  GraduationCap,
  Mail,
  User,
} from 'lucide-react';
import {
  SiDevdotto,
  SiDiscord,
  SiGithub,
  SiMedium,
  SiTwitch,
  SiX,
} from 'react-icons/si';
import { FaLinkedinIn } from 'react-icons/fa6';

import { Badge } from '../../../components/UI/badge';
import { Button } from '../../../components/UI/button';
import { Card, CardContent } from '../../../components/UI/card';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import { ProfileAvatar } from '../../../components/UI/profile-avatar';

const socialConfig = [
  { label: 'Website', key: 'website', short: 'Website' },
  { label: 'GitHub', key: 'github', short: 'GitHub', icon: SiGithub },
  { label: 'LinkedIn', key: 'linkedin', short: 'LinkedIn', icon: FaLinkedinIn },
  { label: 'Discord', key: 'discord', short: 'Discord', icon: SiDiscord },
  { label: 'Twitch', key: 'twitch', short: 'Twitch', icon: SiTwitch },
  { label: 'Medium', key: 'medium', short: 'Medium', icon: SiMedium },
  { label: 'Dev.to', key: 'dev', short: 'Dev.to', icon: SiDevdotto },
  { label: 'X', key: 'twitter', short: 'X', icon: SiX },
];

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className='space-y-2'>
      <p className='text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground'>
        {eyebrow}
      </p>
      <h2 className='text-2xl font-black tracking-tight'>{title}</h2>
      {description ? (
        <p className='max-w-2xl text-sm leading-relaxed text-muted-foreground'>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function DetailSection({ eyebrow, title, description, children, className = '' }) {
  return (
    <section className={`px-6 py-8 md:px-8 md:py-10 ${className}`}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <div className='mt-6'>{children}</div>
    </section>
  );
}

function PillList({ items, tone = 'soft', emptyLabel }) {
  if (!items?.length) {
    return <p className='text-sm text-muted-foreground'>{emptyLabel}</p>;
  }

  const toneClasses =
    tone === 'outline'
      ? 'border-zinc-300 bg-transparent text-zinc-700'
      : 'border-zinc-200 bg-zinc-100/80 text-zinc-700';

  return (
    <div className='flex flex-wrap gap-2.5'>
      {items.map(item => (
        <Badge
          key={item}
          variant='outline'
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium shadow-none ${toneClasses}`}
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const fetchUserProfile = async () => {
    const response = await fetch(`/api/user/${id}`, { method: 'GET' });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || `HTTP error! status: ${response.status}`);
    }

    return payload;
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: fetchUserProfile,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className='container mx-auto flex justify-center py-24'>
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='container mx-auto py-24'>
        <Card className='mx-auto max-w-md border-destructive/20 bg-destructive/5'>
          <CardContent className='space-y-4 pt-6 text-center'>
            <h3 className='text-lg font-bold text-destructive'>
              Unable to load profile
            </h3>
            <p className='text-sm text-muted-foreground'>{error.message}</p>
            <Button variant='outline' onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!id || !data) return null;

  const joinedDate = new Date(data.createdAt).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
  const socialProfile = data.userSocialProfile?.[0] || {};
  const socialLinks = socialConfig
    .map(item => ({
      ...item,
      value: socialProfile[item.key],
    }))
    .filter(item => item.value);
  const initial = data.name?.trim()?.charAt(0)?.toUpperCase() || 'W';
  const highlights = [
    { label: 'Public links', value: String(socialLinks.length).padStart(2, '0') },
    { label: 'Skills', value: String(data.skills?.length || 0).padStart(2, '0') },
    {
      label: 'Interests',
      value: String(data.hobbies?.length || 0).padStart(2, '0'),
    },
  ];

  return (
    <div className='relative min-h-screen overflow-hidden bg-zinc-50 text-zinc-950'>
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(24,24,27,0.08),transparent_28%),radial-gradient(circle_at_top,rgba(212,212,216,0.48),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,0.98),rgba(244,244,245,0.94))]' />
      <div className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(24,24,27,0.028)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.028)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_top,black_12%,transparent_74%)]' />

      <div className='container mx-auto px-4 py-10 md:py-14'>
        <div className='mx-auto max-w-7xl space-y-8 md:space-y-10'>
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

          <section className='relative overflow-hidden rounded-[40px] border border-zinc-200/80 bg-white shadow-[0_40px_120px_-56px_rgba(24,24,27,0.3)]'>
            <div className='absolute right-4 top-3 text-[140px] font-black leading-none tracking-[-0.08em] text-zinc-100 md:right-8 md:top-5 md:text-[220px]'>
              {initial}
            </div>

            <div className='relative grid gap-8 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10'>
              <div className='space-y-8'>
                <div className='space-y-5'>
                  <p className='inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500'>
                      Co-founder profile
                  </p>
                  <div className='space-y-4'>
                    <h1 className='max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.06em] text-zinc-950 md:text-7xl'>
                      {data.name}
                    </h1>
                    <p className='max-w-3xl text-lg leading-relaxed text-zinc-600 md:text-xl'>
                      {data.short_bio ||
                        'This person has not added a one-line introduction yet.'}
                    </p>
                  </div>
                </div>

                <div className='grid gap-3 sm:grid-cols-3'>
                  <div className='rounded-[24px] border border-zinc-200 bg-zinc-50 px-4 py-4'>
                    <p className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400'>
                      Contact
                    </p>
                    <div className='mt-3 flex items-start gap-2 text-sm font-medium text-zinc-800'>
                      <Mail className='mt-0.5 h-4 w-4 flex-none text-zinc-500' />
                      <span className='break-all'>{data.email}</span>
                    </div>
                  </div>
                  <div className='rounded-[24px] border border-zinc-200 bg-zinc-50 px-4 py-4'>
                    <p className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400'>
                      Member since
                    </p>
                    <div className='mt-3 flex items-start gap-2 text-sm font-medium text-zinc-800'>
                      <Calendar className='mt-0.5 h-4 w-4 flex-none text-zinc-500' />
                      <span>{joinedDate}</span>
                    </div>
                  </div>
                  <div className='rounded-[24px] border border-zinc-200 bg-zinc-50 px-4 py-4'>
                    <p className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400'>
                      Visible signal
                    </p>
                    <p className='mt-3 text-sm font-medium text-zinc-800'>
                      {socialLinks.length} links, {data.skills?.length || 0} skills,
                      {' '}
                      {data.hobbies?.length || 0} interests
                    </p>
                  </div>
                </div>

                <div className='rounded-[32px] border border-zinc-200 bg-zinc-50/80 p-6 md:p-7'>
                  <div className='mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-500'>
                    <User className='h-4 w-4' />
                    Personal summary
                  </div>
                  <p className='max-w-3xl whitespace-pre-line text-base leading-8 text-zinc-700'>
                    {data.bio || 'No background details shared yet.'}
                  </p>
                </div>
              </div>

              <aside className='rounded-[32px] bg-zinc-950 p-6 text-white shadow-[0_28px_90px_-50px_rgba(24,24,27,0.8)] md:p-7'>
                <div className='space-y-7'>
                  <div className='space-y-5'>
                    <ProfileAvatar
                      className='h-24 w-24 rounded-[28px] border border-white/10 bg-white/10 md:h-28 md:w-28'
                      src={data.image}
                      name={data.name}
                      priority
                      sizes='112px'
                    />
                    <div className='space-y-2'>
                      <p className='text-[10px] font-black uppercase tracking-[0.24em] text-white/45'>
                        Public card
                      </p>
                      <h2 className='!text-white text-2xl font-black tracking-tight'>
                        {data.name}
                      </h2>
                      <p className='text-sm leading-relaxed text-white/70'>
                        A focused read on background, strengths, interests, and
                        proof of presence.
                      </p>
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-3'>
                    {highlights.map(item => (
                      <div
                        key={item.label}
                        className='rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center'
                      >
                        <p className='text-2xl font-black tracking-[-0.05em] text-white'>
                          {item.value}
                        </p>
                        <p className='mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50'>
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className='space-y-3'>
                    <Link href='/projects'>
                      <Button className='w-full rounded-full bg-white text-zinc-950 hover:bg-zinc-200'>
                      Explore startup projects
                      </Button>
                    </Link>
                    <p className='text-xs leading-relaxed text-white/50'>
                      Better profiles reduce ambiguity before the first
                      co-founder conversation starts.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]'>
            <div className='overflow-hidden rounded-[36px] border border-zinc-200/80 bg-white shadow-[0_26px_90px_-54px_rgba(24,24,27,0.22)]'>
              <DetailSection
                eyebrow='Background'
                title='Studies, expertise, and what they bring'
                description='A cleaner read on where this person has built depth and what kind of contribution they are likely to make.'
                className='border-b border-zinc-200'
              >
                <div className='grid gap-5 md:grid-cols-2'>
                  <div className='rounded-[28px] border border-zinc-200 bg-zinc-50 p-5 md:p-6'>
                    <div className='mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-500'>
                      <GraduationCap className='h-4 w-4' />
                      Background, studies, or expertise
                    </div>
                    <p className='text-sm leading-7 text-zinc-700'>
                      {data.education || 'Not shared yet.'}
                    </p>
                  </div>

                  <div className='rounded-[28px] border border-zinc-200 bg-zinc-50 p-5 md:p-6'>
                    <div className='mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-500'>
                      <Briefcase className='h-4 w-4' />
                      Experience and what they bring
                    </div>
                    <p className='text-sm leading-7 text-zinc-700'>
                      {data.work || 'Not shared yet.'}
                    </p>
                  </div>
                </div>
              </DetailSection>

              <DetailSection
                eyebrow='Strengths'
                title='Skills'
                      description='Capabilities this person wants potential co-founders to understand quickly.'
                className='border-b border-zinc-200'
              >
                <PillList items={data.skills} emptyLabel='No skills shared yet.' />
              </DetailSection>

              <DetailSection
                eyebrow='Interests'
                title='Passions and industries'
                description='Themes, sectors, and long-term curiosities that shape what they are drawn toward.'
              >
                <PillList
                  items={data.hobbies}
                  tone='outline'
                  emptyLabel='No interests shared yet.'
                />
              </DetailSection>
            </div>

            <aside className='space-y-5 lg:sticky lg:top-24 lg:self-start'>
              <section className='rounded-[32px] border border-zinc-200/80 bg-white p-6 shadow-[0_20px_70px_-50px_rgba(24,24,27,0.22)]'>
                <SectionHeader
                  eyebrow='Links'
                  title='Public profiles'
                  description='Writing, social presence, portfolio, and other public surfaces.'
                />
                <div className='mt-6 grid gap-3'>
                  {socialLinks.length > 0 ? (
                    socialLinks.map(link => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={link.key}
                          href={link.value}
                          target='_blank'
                          rel='noreferrer'
                          className='group flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-100/70'
                        >
                          <div className='flex min-w-0 items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-zinc-700 shadow-sm'>
                              {Icon ? (
                                <Icon className='h-4 w-4' />
                              ) : (
                                <ExternalLink className='h-4 w-4' />
                              )}
                            </div>
                            <div className='min-w-0'>
                              <p className='text-sm font-semibold text-zinc-950'>
                                {link.label}
                              </p>
                              <p className='truncate text-xs text-zinc-500'>
                                {String(link.value).replace(
                                  /^https?:\/\/(www\.)?/,
                                  ''
                                )}
                              </p>
                            </div>
                          </div>
                          <ExternalLink className='h-4 w-4 text-zinc-400 transition-colors group-hover:text-zinc-700' />
                        </a>
                      );
                    })
                  ) : (
                    <p className='rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-500'>
                      No public links shared yet.
                    </p>
                  )}
                </div>
              </section>

              <section className='rounded-[32px] border border-zinc-200/80 bg-zinc-950 p-6 text-white shadow-[0_28px_90px_-58px_rgba(24,24,27,0.8)]'>
                <p className='text-[10px] font-black uppercase tracking-[0.24em] text-white/50'>
                  Profile intent
                </p>
                <div className='mt-4 space-y-3'>
                  <h2 className='!text-white text-2xl font-black tracking-tight'>
                    Designed for a faster fit-read.
                  </h2>
                  <p className='text-sm leading-7 text-white/72'>
                    The point is simple: identity, proof, interests, and real
                    working context should be legible before outreach.
                  </p>
                </div>
                <div className='mt-6 border-t border-white/10 pt-5'>
                  <Link href='/projects'>
                    <Button
                      variant='secondary'
                      className='w-full rounded-full border-0 bg-white text-zinc-950 hover:bg-zinc-200'
                    >
                      Browse profiles
                    </Button>
                  </Link>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
