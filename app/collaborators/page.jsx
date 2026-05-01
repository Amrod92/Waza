'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpDown,
  BriefcaseBusiness,
  Filter,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TimerReset,
  Users2,
  X,
} from 'lucide-react';

import CollaboratorCard from '../../components/CollaboratorCard';
import { Button } from '../../components/UI/button';
import { Card, CardContent } from '../../components/UI/card';
import { Input } from '../../components/UI/input';
import { Badge } from '../../components/UI/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/UI/select';

const QUICK_FILTERS = [
  'Technical',
  'Product',
  'Marketing',
  'Design',
  'Sales',
  'Operations',
];

const AVAILABILITY_FILTERS = [
  { value: 'all', label: 'Any availability' },
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'evenings_weekends', label: 'Evenings' },
  { value: 'exploring', label: 'Exploring' },
];

const SORT_OPTIONS = [
  { value: 'signal', label: 'Highest signal' },
  { value: 'connections', label: 'Most connected' },
  { value: 'projects', label: 'Most active' },
  { value: 'recent', label: 'Newest profiles' },
];

function getAvailabilityLabel(value) {
  return AVAILABILITY_FILTERS.find(item => item.value === value)?.label || 'Not specified';
}

function CollaboratorSkeleton() {
  return (
    <div className='grid gap-6'>
      {[1, 2, 3].map(i => (
        <Card key={i} className='overflow-hidden rounded-[32px] border-zinc-200/80 bg-white p-0 shadow-sm animate-pulse'>
          <div className='grid gap-0 md:grid-cols-[220px_minmax(0,1fr)]'>
            <div className='border-b border-zinc-100 bg-zinc-50/50 p-6 md:border-b-0 md:border-r'>
              <div className='space-y-4'>
                <div className='h-20 w-20 rounded-[24px] bg-zinc-200' />
                <div className='space-y-2'>
                  <div className='h-6 w-3/4 rounded bg-zinc-200' />
                  <div className='h-4 w-full rounded bg-zinc-200' />
                </div>
              </div>
            </div>
            <div className='p-6 space-y-6'>
              <div className='space-y-2'>
                <div className='h-4 w-1/4 rounded bg-zinc-200' />
                <div className='h-4 w-full rounded bg-zinc-200' />
                <div className='h-4 w-5/6 rounded bg-zinc-200' />
              </div>
              <div className='grid gap-5 md:grid-cols-2'>
                <div className='space-y-3'>
                  <div className='h-3 w-1/3 rounded bg-zinc-200' />
                  <div className='flex gap-2'>
                    <div className='h-6 w-16 rounded-full bg-zinc-200' />
                    <div className='h-6 w-20 rounded-full bg-zinc-200' />
                  </div>
                </div>
                <div className='space-y-3'>
                  <div className='h-3 w-1/3 rounded bg-zinc-200' />
                  <div className='flex gap-2'>
                    <div className='h-6 w-20 rounded-full bg-zinc-200' />
                    <div className='h-6 w-16 rounded-full bg-zinc-200' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function CollaboratorsPage() {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('signal');

  const fetchUsers = async () => {
    const response = await fetch('/api/user/getAllUsers', { method: 'GET' });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || `HTTP error! status: ${response.status}`);
    }

    return payload.users || [];
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ['collaborators'],
    queryFn: fetchUsers,
  });

  const toggleFilter = filter => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const marketplaceStats = useMemo(() => {
    const users = data || [];
    const availableNow = users.filter(user =>
      ['full_time', 'part_time'].includes(user.availability)
    ).length;
    const totalConnections = users.reduce(
      (total, user) => total + (user.connectionCount || 0),
      0
    );
    const activeProjects = users.reduce(
      (total, user) => total + (user.projectCount || 0),
      0
    );
    const averageSignal =
      users.length > 0
        ? users.reduce((total, user) => total + (user.signalRating || 0), 0) /
          users.length
        : 0;

    return {
      availableNow,
      totalConnections,
      activeProjects,
      averageSignal,
    };
  }, [data]);

  const filteredUsers = useMemo(() => {
    let result = data || [];
    const normalizedSearch = search.trim().toLowerCase();

    if (normalizedSearch) {
      result = result.filter(user => {
        const haystack = [
          user.name,
          user.short_bio,
          user.bio,
          user.work,
          user.education,
          ...(user.skills || []),
          ...(user.hobbies || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedSearch);
      });
    }

    if (activeFilters.length > 0) {
      result = result.filter(user => {
        const userTags = [
          ...(user.skills || []),
          ...(user.hobbies || []),
          user.short_bio,
        ].filter(Boolean).map(t => t.toLowerCase());

        return activeFilters.every(filter =>
          userTags.some(tag => tag.includes(filter.toLowerCase()))
        );
      });
    }

    if (availability !== 'all') {
      result = result.filter(user => user.availability === availability);
    }

    return [...result].sort((first, second) => {
      if (sortBy === 'connections') {
        return (second.connectionCount || 0) - (first.connectionCount || 0);
      }

      if (sortBy === 'projects') {
        return (second.projectCount || 0) - (first.projectCount || 0);
      }

      if (sortBy === 'recent') {
        return new Date(second.createdAt) - new Date(first.createdAt);
      }

      return (second.signalRating || 0) - (first.signalRating || 0);
    });
  }, [data, search, activeFilters, availability, sortBy]);

  const hasActiveFilters =
    search.trim() || activeFilters.length > 0 || availability !== 'all';

  const clearFilters = () => {
    setSearch('');
    setActiveFilters([]);
    setAvailability('all');
    setSortBy('signal');
  };

  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-950 selection:bg-zinc-950 selection:text-white'>
      <div className='fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(24,24,27,0.04),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(24,24,27,0.02),transparent_30%)]' />
      <div className='fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(24,24,27,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.015)_1px,transparent_1px)] bg-[size:64px_64px]' />

      <div className='container mx-auto px-4 py-12 md:py-20'>
        <div className='mx-auto max-w-7xl space-y-10'>
          <header className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end'>
            <div className='space-y-6'>
              <div className='flex flex-wrap items-center gap-3'>
                <Badge variant='outline' className='rounded-full border-zinc-200 bg-white/70 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-sm'>
                  People discovery
                </Badge>
                <span className='rounded-full bg-zinc-950 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-white'>
                  Opt-in profiles only
                </span>
              </div>

              <div className='space-y-4'>
                <h1 className='max-w-4xl text-5xl font-black leading-none tracking-tight text-zinc-950 md:text-7xl'>
                  Find people who are ready to build.
                </h1>
                <p className='max-w-3xl text-lg leading-8 text-zinc-600 md:text-xl'>
                  Browse collaborator profiles by strengths, availability,
                  credibility signal, and active projects. Every profile here has
                  chosen to be visible in discovery.
                </p>
              </div>
            </div>

            <div className='rounded-[32px] border border-zinc-200 bg-white p-5 shadow-[0_24px_70px_-50px_rgba(24,24,27,0.35)]'>
              <div className='grid grid-cols-2 gap-3'>
                <div className='rounded-2xl bg-zinc-50 p-4'>
                  <Users2 className='h-4 w-4 text-zinc-400' />
                  <p className='mt-3 text-2xl font-black tracking-tight text-zinc-950'>
                    {String(data?.length || 0).padStart(2, '0')}
                  </p>
                  <p className='text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400'>
                    Visible profiles
                  </p>
                </div>
                <div className='rounded-2xl bg-zinc-50 p-4'>
                  <TimerReset className='h-4 w-4 text-zinc-400' />
                  <p className='mt-3 text-2xl font-black tracking-tight text-zinc-950'>
                    {String(marketplaceStats.availableNow).padStart(2, '0')}
                  </p>
                  <p className='text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400'>
                    Available now
                  </p>
                </div>
                <div className='rounded-2xl bg-zinc-50 p-4'>
                  <ShieldCheck className='h-4 w-4 text-zinc-400' />
                  <p className='mt-3 text-2xl font-black tracking-tight text-zinc-950'>
                    {String(marketplaceStats.totalConnections).padStart(2, '0')}
                  </p>
                  <p className='text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400'>
                    Connections
                  </p>
                </div>
                <div className='rounded-2xl bg-zinc-50 p-4'>
                  <Star className='h-4 w-4 text-zinc-400' />
                  <p className='mt-3 text-2xl font-black tracking-tight text-zinc-950'>
                    {marketplaceStats.averageSignal.toFixed(1)}
                  </p>
                  <p className='text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400'>
                    Avg signal
                  </p>
                </div>
              </div>
            </div>
          </header>

          <section className='sticky top-4 z-30 space-y-3'>
            <div className='rounded-[28px] border border-zinc-200 bg-white/90 p-3 shadow-[0_30px_90px_-60px_rgba(24,24,27,0.55)] backdrop-blur-xl'>
              <div className='grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_180px] lg:items-center'>
                <div className='relative'>
                  <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400' />
                  <Input
                    type='search'
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    className='h-13 min-h-13 w-full rounded-2xl border-zinc-100 bg-zinc-50 pl-12 pr-10 text-base font-medium placeholder:text-zinc-400 focus-visible:bg-white'
                    placeholder='Search by name, role, market, strength...'
                  />
                  {search ? (
                    <button
                      type='button'
                      onClick={() => setSearch('')}
                      className='absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950'
                      aria-label='Clear search'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  ) : null}
                </div>

                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger className='h-13 min-h-13 rounded-2xl border-zinc-100 bg-zinc-50 font-bold text-zinc-700'>
                    <TimerReset className='mr-2 h-4 w-4 text-zinc-400' />
                    <SelectValue placeholder='Availability' />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABILITY_FILTERS.map(item => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className='h-13 min-h-13 rounded-2xl border-zinc-100 bg-zinc-50 font-bold text-zinc-700'>
                    <ArrowUpDown className='mr-2 h-4 w-4 text-zinc-400' />
                    <SelectValue placeholder='Sort by' />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map(item => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='mt-3 flex items-center gap-2 overflow-x-auto pb-1'>
                <div className='flex items-center gap-2 pr-1 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400'>
                  <Filter className='h-4 w-4' />
                  Focus
                </div>
                {QUICK_FILTERS.map(filter => (
                  <button
                    key={filter}
                    type='button'
                    onClick={() => toggleFilter(filter)}
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                      activeFilters.includes(filter)
                        ? 'bg-zinc-950 text-white shadow-lg'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
                {hasActiveFilters ? (
                  <Button 
                    variant='ghost' 
                    onClick={clearFilters}
                    className='h-10 shrink-0 rounded-xl px-3 text-sm font-bold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950'
                  >
                    <X className='h-4 w-4' />
                    Clear
                  </Button>
                ) : null}
              </div>
            </div>

            {hasActiveFilters ? (
              <div className='flex flex-wrap gap-2 px-2'>
                {search.trim() ? (
                  <Badge variant='outline' className='rounded-full border-zinc-200 bg-white px-3 py-1 text-xs font-bold text-zinc-600'>
                    Search: {search.trim()}
                  </Badge>
                ) : null}
                {availability !== 'all' ? (
                  <Badge variant='outline' className='rounded-full border-zinc-200 bg-white px-3 py-1 text-xs font-bold text-zinc-600'>
                    {getAvailabilityLabel(availability)}
                  </Badge>
                ) : null}
                {activeFilters.map(filter => (
                  <Badge key={filter} variant='outline' className='rounded-full border-zinc-200 bg-white px-3 py-1 text-xs font-bold text-zinc-600'>
                    {filter}
                  </Badge>
                ))}
              </div>
            ) : null}
          </section>

          <section className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start'>
            <div className='rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm'>
              <div className='grid gap-4 md:grid-cols-3'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white'>
                    <BriefcaseBusiness className='h-5 w-5' />
                  </div>
                  <div>
                    <p className='text-sm font-black text-zinc-950'>
                      {marketplaceStats.activeProjects} active project{marketplaceStats.activeProjects === 1 ? '' : 's'}
                    </p>
                    <p className='text-xs text-zinc-500'>Across visible profiles</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700'>
                    <ShieldCheck className='h-5 w-5' />
                  </div>
                  <div>
                    <p className='text-sm font-black text-zinc-950'>
                      {marketplaceStats.totalConnections} connection{marketplaceStats.totalConnections === 1 ? '' : 's'}
                    </p>
                    <p className='text-xs text-zinc-500'>Used as social proof</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700'>
                    <TimerReset className='h-5 w-5' />
                  </div>
                  <div>
                    <p className='text-sm font-black text-zinc-950'>
                      {marketplaceStats.availableNow} high-availability profile{marketplaceStats.availableNow === 1 ? '' : 's'}
                    </p>
                    <p className='text-xs text-zinc-500'>Full-time or part-time</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='rounded-[28px] border border-zinc-200 bg-zinc-950 p-5 text-white shadow-[0_28px_90px_-58px_rgba(24,24,27,0.8)]'>
              <p className='text-[10px] font-black uppercase tracking-[0.22em] text-white/45'>
                Want to be listed?
              </p>
              <p className='mt-3 text-sm leading-6 text-white/70'>
                Turn on people discovery in settings and choose your
                current availability.
              </p>
              <Link href='/settings' className='mt-4 block'>
                <Button
                  variant='secondary'
                  className='h-11 w-full rounded-2xl !bg-white text-sm font-black !text-zinc-950 hover:!bg-zinc-200'
                >
                  Update profile settings
                </Button>
              </Link>
            </div>
          </section>

          <main className='space-y-8 pb-20'>
            {isLoading ? (
              <CollaboratorSkeleton />
            ) : isError ? (
              <Card className='mx-auto max-w-md border-zinc-200 bg-white shadow-xl rounded-[32px]'>
                <CardContent className='space-y-4 pt-10 text-center pb-10'>
                  <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500'>
                    <X className='h-8 w-8' />
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-xl font-black tracking-tight text-zinc-950'>
                      Connection Error
                    </h3>
                    <p className='text-sm leading-relaxed text-zinc-600'>{error.message}</p>
                  </div>
                  <Button variant='outline' onClick={() => refetch()} className='rounded-2xl border-zinc-200 px-8'>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredUsers.length === 0 ? (
              <div className='flex flex-col items-center justify-center rounded-[48px] border-2 border-dashed border-zinc-200 bg-white/50 py-32 text-center backdrop-blur-sm'>
                <div className='mx-auto max-w-sm space-y-4'>
                  <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-50 text-zinc-300'>
                    <Sparkles className='h-10 w-10' />
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-2xl font-black tracking-tight text-zinc-950'>No people found</h3>
                    <p className='text-base leading-relaxed text-zinc-500'>
                      We couldn't find anyone matching those criteria. Try broadening your search or clearing filters.
                    </p>
                  </div>
                  <Button 
                    variant='outline' 
                    onClick={clearFilters}
                    className='rounded-2xl border-zinc-200'
                  >
                    Clear everything
                  </Button>
                </div>
              </div>
            ) : (
              <div className='grid gap-8'>
                <div className='flex flex-col gap-2 px-2 sm:flex-row sm:items-center sm:justify-between'>
                  <p className='text-xs font-black uppercase tracking-[0.2em] text-zinc-400'>
                    {filteredUsers.length} result{filteredUsers.length === 1 ? '' : 's'} matched
                  </p>
                  <p className='text-xs font-medium text-zinc-500'>
                    Sorted by {SORT_OPTIONS.find(item => item.value === sortBy)?.label.toLowerCase()}
                  </p>
                </div>
                <div className='grid gap-6'>
                  {filteredUsers.map(user => (
                    <CollaboratorCard key={user.id} user={user} />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
