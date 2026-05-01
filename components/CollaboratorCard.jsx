'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase,
  Calendar,
  ShieldCheck,
  Sparkles,
  Star,
  TimerReset,
  UserPlus,
} from 'lucide-react';

import { Badge } from './UI/badge';
import { Button } from './UI/button';
import { Card, CardContent } from './UI/card';
import { ProfileAvatar } from './UI/profile-avatar';
import { betterAuthClient } from '../lib/better-auth-client';

function PillGroup({ items, emptyLabel }) {
  if (!items?.length) {
    return <p className='text-sm text-muted-foreground'>{emptyLabel}</p>;
  }

  return (
    <div className='flex flex-wrap gap-2'>
      {items.slice(0, 5).map(item => (
        <Badge
          key={item}
          variant='outline'
          className='rounded-full border-zinc-200 bg-zinc-100/80 px-3 py-1 text-xs font-medium text-zinc-700'
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}

function getAvailabilityLabel(value) {
  switch (value) {
    case 'full_time':
      return 'Full-time';
    case 'part_time':
      return 'Part-time';
    case 'evenings_weekends':
      return 'Evenings & weekends';
    case 'exploring':
      return 'Exploring';
    default:
      return 'Not specified';
  }
}

export default function CollaboratorCard({ user }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: sessionData } = betterAuthClient.useSession();
  const sessionUserEmail = sessionData?.user?.email || null;
  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
  const socialProfile = user.userSocialProfile?.[0] || null;
  const socialCount = socialProfile
    ? [
        socialProfile.website,
        socialProfile.github,
        socialProfile.linkedin,
        socialProfile.discord,
        socialProfile.twitch,
        socialProfile.medium,
        socialProfile.dev,
        socialProfile.twitter,
      ].filter(Boolean).length
    : 0;

  const connectMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/user/connect/${user.id}`, {
        method: 'POST',
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || `HTTP error! status: ${response.status}`);
      }

      return payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile', user.id] });
    },
  });

  const isOwnProfile = sessionUserEmail && sessionUserEmail === user.email;
  const isConnected = Boolean(user.isConnectedToViewer);

  const onConnect = () => {
    if (!sessionData?.user) {
      router.push('/auth/signin');
      return;
    }

    if (isOwnProfile || isConnected || connectMutation.isPending) {
      return;
    }

    connectMutation.mutate();
  };

  return (
    <Card className='overflow-hidden rounded-[32px] border-zinc-200/80 bg-white shadow-[0_18px_60px_-42px_rgba(24,24,27,0.25)] transition-all duration-300 hover:border-zinc-300 hover:shadow-[0_28px_90px_-50px_rgba(24,24,27,0.32)]'>
      <CardContent className='p-0'>
        <div className='grid gap-0 md:grid-cols-[280px_minmax(0,1fr)]'>
          <div className='border-b border-zinc-100 bg-zinc-50/50 p-6 md:border-b-0 md:border-r'>
            <div className='flex flex-col h-full justify-between gap-6'>
              <div className='space-y-4'>
                <ProfileAvatar
                  className='h-24 w-24 rounded-[28px] border-2 border-white bg-white shadow-sm ring-1 ring-zinc-200'
                  src={user.image}
                  name={user.name}
                  sizes='96px'
                />
                <div className='space-y-1.5'>
                  <Link
                    href={`/user/${user.id}`}
                    className='text-2xl font-black tracking-tight text-zinc-950 transition-colors hover:text-zinc-500'
                  >
                    {user.name || 'Unnamed profile'}
                  </Link>
                  <p className='text-sm font-medium leading-relaxed text-zinc-500'>
                    {user.short_bio || 'Open to joining the right project.'}
                  </p>
                </div>
                <div className='flex flex-wrap gap-2 pt-1'>
                  <Badge className='rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-950'>
                    {getAvailabilityLabel(user.availability)}
                  </Badge>
                  <Badge
                    variant='outline'
                    className='rounded-full border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600'
                  >
                    {user.projectCount || 0} active project{user.projectCount === 1 ? '' : 's'}
                  </Badge>
                  <Badge
                    variant='outline'
                    className='rounded-full border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600'
                  >
                    {user.connectionCount || 0} connection{user.connectionCount === 1 ? '' : 's'}
                  </Badge>
                </div>
              </div>

              <div className='space-y-2.5 pt-4'>
                <div className='flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400'>
                  <Calendar className='h-3.5 w-3.5' />
                  <span>Since {joinedDate}</span>
                </div>
                <div className='flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400'>
                  <ShieldCheck className='h-3.5 w-3.5' />
                  <span>{socialCount > 0 ? `${socialCount} public link${socialCount === 1 ? '' : 's'}` : 'No public links yet'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='p-8 md:p-10'>
            <div className='space-y-8'>
              <div className='grid gap-3 sm:grid-cols-3'>
                <div className='rounded-[24px] border border-zinc-200 bg-zinc-50 px-4 py-4'>
                  <p className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400'>
                    Signal rating
                  </p>
                  <div className='mt-3 flex items-center gap-2'>
                    <span className='text-3xl font-black tracking-[-0.05em] text-zinc-950'>
                      {user.signalRating?.toFixed(1) || '0.0'}
                    </span>
                    <div className='flex text-zinc-950'>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(user.signalRating || 0)
                              ? 'fill-current'
                              : 'text-zinc-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className='mt-1 text-sm text-zinc-500'>
                    Based on profile completeness and proof
                  </p>
                </div>
                <div className='rounded-[24px] border border-zinc-200 bg-zinc-50 px-4 py-4'>
                  <p className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400'>
                    Credibility
                  </p>
                  <div className='mt-3 flex items-center gap-2 text-sm font-medium text-zinc-800'>
                    <ShieldCheck className='h-4 w-4 text-zinc-500' />
                    <span>{user.connectionCount || 0} connection{user.connectionCount === 1 ? '' : 's'}</span>
                  </div>
                  <p className='mt-1 text-sm text-zinc-500'>
                    Connections strengthen social proof over time
                  </p>
                </div>
                <div className='rounded-[24px] border border-zinc-200 bg-zinc-50 px-4 py-4'>
                  <p className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400'>
                    Availability
                  </p>
                  <div className='mt-3 flex items-center gap-2 text-sm font-medium text-zinc-800'>
                    <TimerReset className='h-4 w-4 text-zinc-500' />
                    <span>{getAvailabilityLabel(user.availability)}</span>
                  </div>
                </div>
                <div className='rounded-[24px] border border-zinc-200 bg-zinc-50 px-4 py-4'>
                  <p className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400'>
                    Active projects
                  </p>
                  <div className='mt-3 flex items-center gap-2 text-sm font-medium text-zinc-800'>
                    <Sparkles className='h-4 w-4 text-zinc-500' />
                    <span>
                      {user.projectCount || 0} project{user.projectCount === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400'>
                  <Briefcase className='h-3.5 w-3.5' />
                  Profile summary
                </div>
                <p className='text-base leading-8 text-zinc-700'>
                  {user.work || user.bio || 'This person has not added a detailed background yet.'}
                </p>
              </div>

              <div className='grid gap-8 md:grid-cols-2'>
                <div className='space-y-4'>
                  <p className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400'>
                    Top Strengths
                  </p>
                  <PillGroup
                    items={user.skills}
                    emptyLabel='No strengths listed yet.'
                  />
                </div>
                <div className='space-y-4'>
                  <p className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400'>
                    Interests
                  </p>
                  <PillGroup
                    items={user.hobbies}
                    emptyLabel='No interests listed yet.'
                  />
                </div>
              </div>

              <div className='flex items-center justify-between border-t border-zinc-100 pt-6'>
                <div className='flex flex-wrap items-center gap-3'>
                  <Link
                    href={`/user/${user.id}`}
                    className='group inline-flex items-center gap-2 rounded-2xl !bg-zinc-950 px-6 py-3 text-sm font-black !text-white transition-all hover:!bg-zinc-800 hover:shadow-lg active:scale-95'
                  >
                    View Profile
                    <span className='transition-transform group-hover:translate-x-1'>→</span>
                  </Link>
                  <Button
                    type='button'
                    onClick={onConnect}
                    disabled={isOwnProfile || isConnected || connectMutation.isPending}
                    variant='outline'
                    className='rounded-2xl border-zinc-200 bg-white px-5 py-3 text-sm font-black text-zinc-900 hover:bg-zinc-50'
                  >
                    <UserPlus className='h-4 w-4' />
                    {isOwnProfile
                      ? 'Your profile'
                      : isConnected
                        ? 'Connected'
                        : connectMutation.isPending
                          ? 'Connecting...'
                          : 'Connect'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
