'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Giscus from '@giscus/react';
import { 
  Calendar, 
  Clock, 
  Users, 
  ArrowLeft, 
  Layout, 
  MessageSquare, 
  Briefcase, 
  Send,
  Sparkles,
  Link2,
  Info,
  ChevronRight
} from 'lucide-react';

import { betterAuthClient } from '../../../lib/better-auth-client';
import CommunicationToolsCard from '../../../components/CommunicationToolsCard';
import DevelopmentToolsCard from '../../../components/DevelopmentToolsCard';
import ProgressionBar from '../../../components/ProgressionBar';
import SettingsUI from '../../../components/ProjectUI/Settings';
import { Button } from '../../../components/UI/button';
import { Badge } from '../../../components/UI/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/UI/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/UI/dialog';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import { ProfileAvatar } from '../../../components/UI/profile-avatar';

export default function ProjectPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = betterAuthClient.useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const fetchGetProjectByID = async () => {
    const response = await fetch(`/api/project/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return data;
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ['project', id],
    queryFn: fetchGetProjectByID,
    enabled: !!id,
  });

  const userDeleteMutation = async () => {
    const response = await fetch(`/api/project/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  const mutation = useMutation({
    mutationFn: userDeleteMutation,
    onSuccess: () => {
      router.push('/dashboard');
    },
  });

  if (isLoading) return <div className='min-h-screen flex items-center justify-center bg-zinc-50'><LoadingSpinner /></div>;
  
  if (isError) return (
    <div className='min-h-screen bg-zinc-50 flex items-center justify-center p-4'>
      <Card className='max-w-md w-full border-zinc-200 bg-white shadow-xl rounded-[32px] overflow-hidden'>
        <CardContent className='pt-12 pb-12 text-center space-y-6'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500 shadow-inner'>
            <Info className='h-10 w-10' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-2xl font-black tracking-tight text-zinc-950'>Connection Issue</h3>
            <p className='text-base text-zinc-500 px-6'>{error.message}</p>
          </div>
          <Button variant='outline' onClick={() => refetch()} className='rounded-2xl border-zinc-200 px-10 h-12 font-bold'>Try Again</Button>
        </CardContent>
      </Card>
    </div>
  );

  if (!id || !data) return null;

  const isCancelled = data.development_status === 'cancelled';
  const applyHref = data.user?.email
    ? `mailto:${data.user.email}?subject=${encodeURIComponent(
        `Interested in joining ${data.title}`
      )}`
    : null;

  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-950 pb-24'>
      {/* Background Decor */}
      <div className='fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(24,24,27,0.04),transparent_40%)]' />
      <div className='fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(24,24,27,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.015)_1px,transparent_1px)] bg-[size:64px_64px]' />

      <div className='container mx-auto px-4 pt-10 md:pt-16 space-y-12 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700'>
        {/* Navigation & Header */}
        <div className='space-y-8'>
          <div className='flex items-center justify-between'>
            <Button 
              variant='ghost' 
              size='sm' 
              onClick={() => router.back()} 
              className='group flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 text-zinc-600 shadow-sm backdrop-blur hover:bg-white hover:text-zinc-950'
            >
              <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
              Back to Feed
            </Button>
            
            <div className='flex items-center gap-2'>
              <SettingsUI
                session={session}
                data={data}
                id={id}
                mutation={mutation}
                openModal={() => setIsOpen(true)}
              />
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className='rounded-[32px] border-zinc-200 shadow-2xl'>
                  <DialogHeader>
                    <DialogTitle className='text-2xl font-black tracking-tight text-red-600'>Delete Brief</DialogTitle>
                    <DialogDescription className='text-zinc-500'>
                      This will permanently remove your listing.
                    </DialogDescription>
                  </DialogHeader>
                  <p className='text-sm leading-relaxed text-zinc-600 py-2'>
                    Are you sure you want to delete your brief? All related data, proof links, 
                    and context will be permanently removed. This action cannot be undone.
                  </p>
                  <DialogFooter className='gap-3'>
                    <Button variant='outline' onClick={() => setIsOpen(false)} className='rounded-2xl'>Cancel</Button>
                    <Button variant='destructive' onClick={() => mutation.mutate()} className='rounded-2xl px-8'>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='flex flex-wrap gap-2.5'>
              <Badge variant='outline' className='rounded-full border-zinc-200 bg-zinc-950 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg'>
                Venture Brief
              </Badge>
              {data.tags.map(tag => (
                <Badge key={tag} variant='outline' className='rounded-full border-zinc-200 bg-white/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-sm'>
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className='text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.06em] text-zinc-950 leading-[0.9] max-w-5xl'>
              {data.title}
            </h1>
          </div>
        </div>

        <div className='grid gap-12 lg:grid-cols-12'>
          {/* Main Content Column */}
          <div className='lg:col-span-8 space-y-12'>
            <section className='space-y-6'>
              <div className='flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400'>
                <Layout className='h-4 w-4' />
                Project Summary
              </div>
              <Card className='border-zinc-200/60 bg-white shadow-[0_32px_80px_-40px_rgba(24,24,27,0.1)] rounded-[40px] overflow-hidden'>
                <CardContent className='p-8 md:p-12'>
                  <p className='text-xl md:text-2xl leading-relaxed md:leading-[1.6] text-zinc-700 whitespace-pre-line font-medium tracking-tight'>
                    {data.description}
                  </p>
                </CardContent>
              </Card>
            </section>

            <div className='grid sm:grid-cols-2 gap-8'>
              <Card className='rounded-[40px] border-zinc-200 bg-zinc-50/50 p-8 space-y-6'>
                <div className='flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400'>
                  <Briefcase className='h-4 w-4' />
                  Ideal Backgrounds
                </div>
                {data.technology_stack.length === 0 ? (
                  <p className='text-sm text-zinc-400 italic'>No specific background preference</p>
                ) : (
                  <div className='flex flex-wrap gap-2.5'>
                    {data.technology_stack.map(tech => (
                      <Badge key={tech} variant='outline' className='rounded-xl border-zinc-200 bg-white px-3.5 py-2 text-sm font-bold text-zinc-600 shadow-sm capitalize'>{tech}</Badge>
                    ))}
                  </div>
                )}
              </Card>

              <Card className='rounded-[40px] border-zinc-200 bg-zinc-50/50 p-8 space-y-6'>
                <div className='flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400'>
                  <Users className='h-4 w-4' />
                  Co-founder Strengths
                </div>
                {data.skills.length === 0 ? (
                  <p className='text-sm text-zinc-400 italic'>No specific strengths stated</p>
                ) : (
                  <div className='flex flex-wrap gap-2.5'>
                    {data.skills.map(skill => (
                      <Badge key={skill} variant='outline' className='rounded-xl border-zinc-200 bg-white px-3.5 py-2 text-sm font-bold text-zinc-600 shadow-sm capitalize'>{skill}</Badge>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <section className='space-y-6'>
              <div className='flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400'>
                <MessageSquare className='h-4 w-4' />
                Discussion & Feedback
              </div>
              <div className='bg-white rounded-[40px] border border-zinc-200 p-8 md:p-12 shadow-sm'>
                <Giscus
                  id='comments'
                  repo='Amrod92/Waza'
                  repoId='R_kgDOH6dOqQ'
                  category='Comments'
                  categoryId='DIC_kwDOH6dOqc4CTWDK'
                  mapping='pathname'
                  strict='0'
                  reactionsEnabled='1'
                  emitMetadata='0'
                  inputPosition='top'
                  theme='light'
                  lang='en'
                  loading='lazy'
                />
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <aside className='lg:col-span-4 space-y-8'>
            <Card className='rounded-[40px] overflow-hidden shadow-2xl shadow-zinc-200 border-zinc-200 bg-white sticky top-10'>
              <CardHeader className='bg-zinc-50 border-b border-zinc-100 p-8'>
                <div className='flex items-center gap-5'>
                  <Link href={`/user/${data.userId}`}>
                    <ProfileAvatar
                      className='h-16 w-16 rounded-[24px] border-2 border-white bg-white shadow-md ring-1 ring-zinc-200'
                      src={data.user.image}
                      name={data.user.name}
                      sizes='64px'
                    />
                  </Link>
                  <div className='space-y-1'>
                    <Link href={`/user/${data.userId}`} className='text-lg font-black tracking-tight text-zinc-950 hover:underline'>
                      {data.user.name}
                    </Link>
                    <p className='text-xs font-medium text-zinc-500 line-clamp-1'>{data.user.short_bio || 'Founder'}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='p-8 space-y-8'>
                {applyHref && (
                  <a href={applyHref} className='block w-full'>
                    <Button className='w-full h-14 rounded-2xl bg-zinc-950 text-white font-black text-base transition-all hover:bg-zinc-800 hover:shadow-xl active:scale-95'>
                      <Send className='mr-2.5 h-5 w-5' />
                      Apply to Join
                    </Button>
                  </a>
                )}

                <div className='space-y-6'>
                  <div className='flex items-center justify-between text-sm font-medium'>
                    <div className='flex items-center gap-3 text-zinc-400 uppercase tracking-widest text-[10px] font-black'>
                      <Calendar className='h-4 w-4' />
                      <span>Listed on</span>
                    </div>
                    <span className='text-zinc-950 font-bold'>
                      {new Date(data.createdAt).toLocaleDateString('en-gb', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  
                  <div className='flex items-center justify-between text-sm font-medium'>
                    <div className='flex items-center gap-3 text-zinc-400 uppercase tracking-widest text-[10px] font-black'>
                      <Clock className='h-4 w-4' />
                      <span>Commitment</span>
                    </div>
                    <Badge variant='outline' className='rounded-lg border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-bold capitalize text-zinc-600'>
                      {data.difficulty_level}
                    </Badge>
                  </div>

                  <div className='flex items-center justify-between text-sm font-medium'>
                    <div className='flex items-center gap-3 text-zinc-400 uppercase tracking-widest text-[10px] font-black'>
                      <Users className='h-4 w-4' />
                      <span>Open roles</span>
                    </div>
                    <span className='text-zinc-950 font-bold'>{data.team_need || '1'} co-founder</span>
                  </div>
                </div>

                <div className='pt-8 border-t border-zinc-100 space-y-6'>
                  <div className='flex items-center justify-between'>
                    <span className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>Venture Stage</span>
                    <Badge 
                      variant={isCancelled ? 'destructive' : 'outline'}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize ${!isCancelled && 'border-emerald-500/20 bg-emerald-50 text-emerald-600'}`}
                    >
                      {data.development_status}
                    </Badge>
                  </div>
                  <ProgressionBar progression={data.development_status} />
                </div>
              </CardContent>
            </Card>

            {/* Context Bento */}
            <div className='space-y-4'>
              <h3 className='text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 px-4'>Signals & Context</h3>
              <Card className='rounded-[40px] border-zinc-200 bg-white p-8 space-y-8 shadow-sm'>
                <div className='space-y-5'>
                  <h4 className='text-xs font-black uppercase tracking-widest text-zinc-950 flex items-center gap-2.5'>
                    <Sparkles className='h-4 w-4 text-zinc-400' />
                    Contact Points
                  </h4>
                  <CommunicationToolsCard commTools={data.communication[0]} />
                </div>
                <div className='space-y-5 pt-8 border-t border-zinc-100'>
                  <h4 className='text-xs font-black uppercase tracking-widest text-zinc-950 flex items-center gap-2.5'>
                    <Link2 className='h-4 w-4 text-zinc-400' />
                    Proof of Work
                  </h4>
                  <DevelopmentToolsCard devTools={data.developmentTool[0]} />
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
