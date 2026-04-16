'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Search, Sparkles, Users2, Filter, X } from 'lucide-react';

import CofounderCard from '../../components/CofounderCard';
import { Button } from '../../components/UI/button';
import { Card, CardContent } from '../../components/UI/card';
import { Input } from '../../components/UI/input';
import { Badge } from '../../components/UI/badge';

const QUICK_FILTERS = [
  'Technical',
  'Product',
  'Marketing',
  'Design',
  'Sales',
  'Operations',
];

function CofounderSkeleton() {
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

export default function CofoundersPage() {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  const fetchUsers = async () => {
    const response = await fetch('/api/user/getAllUsers', { method: 'GET' });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || `HTTP error! status: ${response.status}`);
    }

    return payload.users || [];
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ['cofounders'],
    queryFn: fetchUsers,
  });

  const toggleFilter = filter => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

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

    return result;
  }, [data, search, activeFilters]);

  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-950 selection:bg-zinc-950 selection:text-white'>
      {/* Background Decor */}
      <div className='fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(24,24,27,0.04),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(24,24,27,0.02),transparent_30%)]' />
      <div className='fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(24,24,27,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.015)_1px,transparent_1px)] bg-[size:64px_64px]' />

      <div className='container mx-auto px-4 py-12 md:py-20'>
        <div className='mx-auto max-w-7xl space-y-12'>
          
          {/* Hero Section */}
          <header className='space-y-8'>
            <div className='space-y-6'>
              <Badge variant='outline' className='rounded-full border-zinc-200 bg-white/50 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-sm'>
                Founder Network
              </Badge>
              <div className='space-y-4'>
                <h1 className='text-balance text-5xl font-black tracking-[-0.06em] text-zinc-950 md:text-7xl lg:text-8xl'>
                  The right partner is <span className='text-zinc-400'>half the battle.</span>
                </h1>
                <p className='max-w-2xl text-lg leading-relaxed text-zinc-600 md:text-xl'>
                  Discover people, not projects. This page is focused on the
                  person behind the profile: what they bring, how available they
                  are, how active they are, and whether they feel like the right
                  co-founder fit.
                </p>
              </div>
            </div>

            {/* Stats Bento (Inline) */}
            <div className='flex flex-wrap gap-4'>
              <div className='inline-flex items-center gap-4 rounded-3xl border border-zinc-200 bg-white p-4 pr-8 shadow-sm'>
                <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-xl'>
                  <Users2 className='h-6 w-6' />
                </div>
                <div>
                  <p className='text-2xl font-black tracking-tight text-zinc-950'>
                    {String(data?.length || 0).padStart(2, '0')}
                  </p>
                  <p className='text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400'>Available Founders</p>
                </div>
              </div>
            </div>
          </header>

          {/* Search & Filter Bar */}
          <section className='sticky top-6 z-30 space-y-4'>
            <div className='group relative rounded-[32px] border border-zinc-200 bg-white/80 p-3 shadow-2xl shadow-zinc-200/50 backdrop-blur-xl transition-all hover:border-zinc-300'>
              <div className='flex flex-col gap-3 md:flex-row md:items-center'>
                <div className='relative flex-1'>
                  <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-zinc-950' />
                  <Input
                    type='search'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className='h-14 w-full rounded-2xl border-transparent bg-zinc-100/50 pl-12 pr-4 text-base font-medium ring-offset-0 placeholder:text-zinc-400 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-zinc-200'
                    placeholder='Search by skills, industries, or name...'
                  />
                </div>
                <div className='flex items-center gap-2 overflow-x-auto pb-1 md:pb-0'>
                  <div className='h-8 w-[1px] bg-zinc-200 hidden md:block' />
                  <Filter className='h-4 w-4 text-zinc-400 ml-2 hidden md:block' />
                  {QUICK_FILTERS.map(filter => (
                    <button
                      key={filter}
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
                  {activeFilters.length > 0 && (
                    <Button 
                      variant='ghost' 
                      size='icon' 
                      onClick={() => setActiveFilters([])}
                      className='h-10 w-10 rounded-xl hover:bg-zinc-100'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Results Grid */}
          <main className='space-y-8 pb-20'>
            {isLoading ? (
              <CofounderSkeleton />
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
                    <h3 className='text-2xl font-black tracking-tight text-zinc-950'>No founders found</h3>
                    <p className='text-base leading-relaxed text-zinc-500'>
                      We couldn't find anyone matching those criteria. Try broadening your search or clearing filters.
                    </p>
                  </div>
                  <Button 
                    variant='outline' 
                    onClick={() => { setSearch(''); setActiveFilters([]); }}
                    className='rounded-2xl border-zinc-200'
                  >
                    Clear everything
                  </Button>
                </div>
              </div>
            ) : (
              <div className='grid gap-8'>
                <div className='flex items-center justify-between px-2'>
                  <p className='text-xs font-black uppercase tracking-[0.2em] text-zinc-400'>
                    {filteredUsers.length} Results matched
                  </p>
                </div>
                <div className='grid gap-6'>
                  {filteredUsers.map(user => (
                    <CofounderCard key={user.id} user={user} />
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
