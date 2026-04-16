'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Sparkles, Rocket } from 'lucide-react';

import Pagination from '../../components/Pagination';
import ProjectCard from '../../components/ProjectsCard';
import ProjectSkeleton from '../../components/Skeleton/ProjectsSkeleton';
import { Button } from '../../components/UI/button';
import { Card, CardContent } from '../../components/UI/card';
import { Input } from '../../components/UI/input';
import { Badge } from '../../components/UI/badge';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [searchValue, setSearchValue] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortingColumn, setSortingColumn] = useState('createdAt');
  const [sortingDirection, setSortingDirection] = useState('desc');

  const handleSortingChange = column => {
    if (column === sortingColumn) {
      setSortingDirection(sortingDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortingColumn(column);
      setSortingDirection('asc');
    }
  };

  const fetchGetAllProjects = async () => {
    const response = await fetch(
      `/api/project/getAllProjects?page=${currentPage}&sortBy=${sortingColumn}&sortDirection=${sortingDirection}`,
      { method: 'GET' }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  };

  const handleSearch = async event => {
    event.preventDefault();
    const response = await fetch(`/api/search/${search}`, {
      method: 'GET',
    });

    const dataJSON = await response.json();

    if (!response.ok) {
      throw new Error(dataJSON.error || `HTTP error! status: ${response.status}`);
    }

    setSearchValue(dataJSON);
    return dataJSON;
  };

  const {
    isLoading: getProjectLoading,
    isError: getProjectIsError,
    data: getProjectData,
    error: getProjectError,
    refetch,
  } = useQuery({
    queryKey: ['projects', currentPage, sortingColumn, sortingDirection],
    queryFn: fetchGetAllProjects,
    refetchOnWindowFocus: true,
  });

  if (getProjectLoading) return <ProjectSkeleton />;

  const displayData = searchValue.result?.length >= 1 ? searchValue : getProjectData;
  const projects = displayData?.result || displayData?.projects || [];
  const hasNoProjects = projects.length === 0;

  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-950'>
      {/* Background Decor */}
      <div className='fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(24,24,27,0.04),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(24,24,27,0.02),transparent_30%)]' />
      <div className='fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(24,24,27,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.015)_1px,transparent_1px)] bg-[size:64px_64px]' />

      <div className='container mx-auto px-4 py-12 md:py-20'>
        <div className='mx-auto max-w-7xl space-y-12'>
          
          {/* Hero Section */}
          <header className='space-y-8'>
            <div className='space-y-6'>
              <Badge variant='outline' className='rounded-full border-zinc-200 bg-white/50 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-sm'>
                Startup Opportunity Feed
              </Badge>
              <div className='space-y-4'>
                <h1 className='text-balance text-5xl font-black tracking-[-0.06em] text-zinc-950 md:text-7xl lg:text-8xl'>
                  Build something <span className='text-zinc-400'>that matters.</span>
                </h1>
                <p className='max-w-2xl text-lg leading-relaxed text-zinc-600 md:text-xl'>
                  Discover projects looking for early partners. 
                  Filter by venture stage, commitment level, and co-founder strengths.
                </p>
              </div>
            </div>

            <div className='flex flex-wrap gap-4'>
              <div className='inline-flex items-center gap-4 rounded-3xl border border-zinc-200 bg-white p-4 pr-8 shadow-sm'>
                <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-xl'>
                  <Rocket className='h-6 w-6' />
                </div>
                <div>
                  <p className='text-2xl font-black tracking-tight text-zinc-950'>
                    {String(displayData?.totalItems || projects.length).padStart(2, '0')}
                  </p>
                  <p className='text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400'>Active Listings</p>
                </div>
              </div>
            </div>
          </header>

          {/* Search & Sort Bar */}
          <section className='sticky top-6 z-30 space-y-4'>
            <div className='group relative rounded-[32px] border border-zinc-200 bg-white/80 p-3 shadow-2xl shadow-zinc-200/50 backdrop-blur-xl transition-all hover:border-zinc-300'>
              <div className='flex flex-col gap-3 md:flex-row md:items-center'>
                <form onSubmit={handleSearch} className='relative flex-1'>
                  <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-zinc-950' />
                  <Input
                    type='search'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className='h-14 w-full rounded-2xl border-transparent bg-zinc-100/50 pl-12 pr-4 text-base font-medium ring-offset-0 placeholder:text-zinc-400 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-zinc-200'
                    placeholder='Search projects, markets, or founder roles...'
                  />
                  {search.length > 0 && (
                    <p className='absolute -bottom-6 left-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider animate-in fade-in slide-in-from-top-1'>
                      Press enter to search or type `all` to reset
                    </p>
                  )}
                </form>

                <div className='flex items-center gap-2'>
                  <div className='h-8 w-[1px] bg-zinc-200 hidden md:block mx-2' />
                  <div className='flex items-center gap-1.5 p-1 bg-zinc-100/50 rounded-2xl'>
                    <Button
                      variant={sortingColumn === 'createdAt' ? 'default' : 'ghost'}
                      size='sm'
                      onClick={() => handleSortingChange('createdAt')}
                      className={`h-10 rounded-xl px-4 text-xs font-bold transition-all ${
                        sortingColumn === 'createdAt' ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-200'
                      }`}
                    >
                      Recent
                      {sortingColumn === 'createdAt' && (
                        <ArrowUpDown className='ml-2 h-3 w-3 opacity-50' />
                      )}
                    </Button>
                    <Button
                      variant={sortingColumn === 'title' ? 'default' : 'ghost'}
                      size='sm'
                      onClick={() => handleSortingChange('title')}
                      className={`h-10 rounded-xl px-4 text-xs font-bold transition-all ${
                        sortingColumn === 'title' ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-200'
                      }`}
                    >
                      A-Z
                      {sortingColumn === 'title' && (
                        <ArrowUpDown className='ml-2 h-3 w-3 opacity-50' />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Results Area */}
          <main className='space-y-8 pb-20'>
            {getProjectIsError ? (
              <Card className='mx-auto max-w-md border-zinc-200 bg-white shadow-xl rounded-[40px]'>
                <CardContent className='space-y-6 pt-12 pb-12 text-center'>
                  <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500 shadow-inner'>
                    <SlidersHorizontal className='h-10 w-10' />
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-2xl font-black tracking-tight text-zinc-950'>Connection issue</h3>
                    <p className='text-base text-zinc-500 px-6'>{getProjectError.message}</p>
                  </div>
                  <Button variant='outline' onClick={() => refetch()} className='rounded-2xl border-zinc-200 px-10 h-12 font-bold'>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : hasNoProjects ? (
              <div className='flex flex-col items-center justify-center rounded-[48px] border-2 border-dashed border-zinc-200 bg-white/50 py-32 text-center backdrop-blur-sm'>
                <div className='mx-auto max-w-sm space-y-6'>
                  <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-50 text-zinc-300'>
                    <Sparkles className='h-10 w-10' />
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-2xl font-black tracking-tight text-zinc-950'>No projects found</h3>
                    <p className='text-base leading-relaxed text-zinc-500'>
                      Try a different search term or check back later for new opportunities.
                    </p>
                  </div>
                  <Button 
                    variant='outline' 
                    onClick={() => { setSearch(''); setSearchValue([]); refetch(); }}
                    className='rounded-2xl border-zinc-200 px-8 h-12 font-bold'
                  >
                    Clear Search
                  </Button>
                </div>
              </div>
            ) : (
              <div className='space-y-8'>
                <div className='flex items-center justify-between px-2'>
                  <p className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400'>
                    {projects.length} Results available
                  </p>
                </div>
                <div className='grid gap-8'>
                  {projects.map(prj => (
                    <ProjectCard key={prj.id} prj={prj} />
                  ))}
                </div>
                {displayData?.totalPages > 1 && (
                  <div className='pt-12 flex justify-center'>
                    <Pagination
                      prjData={displayData}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
