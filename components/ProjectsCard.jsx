import Link from 'next/link';
import { Calendar, Users, Rocket, ArrowUpRight, Clock } from 'lucide-react';

import { Badge } from './UI/badge';
import { Card, CardContent } from './UI/card';
import { ProfileAvatar } from './UI/profile-avatar';
import { excerpt } from '../utils/util';

export default function ProjectCard({ prj }) {
  const isCancelled = prj.development_status === 'cancelled';
  const applyHref = prj.user?.email
    ? `mailto:${prj.user.email}?subject=${encodeURIComponent(
        `Interested in joining ${prj.title}`
      )}`
    : null;
  
  return (
    <Card className='group overflow-hidden rounded-[32px] border-zinc-200/80 bg-white shadow-[0_18px_60px_-42px_rgba(24,24,27,0.25)] transition-all duration-300 hover:border-zinc-300 hover:shadow-[0_28px_90px_-50px_rgba(24,24,27,0.32)]'>
      <CardContent className='p-0'>
        <div className='grid gap-0 md:grid-cols-[240px_minmax(0,1fr)]'>
          {/* Sidebar / Founder Info */}
          <div className='border-b border-zinc-100 bg-zinc-50/50 p-6 md:border-b-0 md:border-r'>
            <div className='flex flex-col h-full justify-between gap-6'>
              <div className='space-y-4'>
                <ProfileAvatar
                  className='h-20 w-20 rounded-[24px] border-2 border-white bg-white shadow-sm ring-1 ring-zinc-200'
                  src={prj.user.image}
                  name={prj.user.name}
                  sizes='80px'
                />
                <div className='space-y-1'>
                  <Link href={`/user/${prj.userId}`} className='text-lg font-black tracking-tight text-zinc-950 hover:text-zinc-600 transition-colors'>
                    {prj.user.name}
                  </Link>
                  <p className='text-xs font-medium leading-relaxed text-zinc-500 line-clamp-2'>
                    {prj.user.short_bio || 'Founder'}
                  </p>
                </div>
              </div>

              <div className='space-y-3 pt-4 border-t border-zinc-100/80'>
                <div className='flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400'>
                  <Calendar className='h-3.5 w-3.5' />
                  <span>
                    {new Date(prj.createdAt).toLocaleDateString('en-GB', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className='flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400'>
                  <Users className='h-3.5 w-3.5' />
                  <span>{prj.team_need || '1'} co-founder{prj.team_need === 1 ? '' : 's'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='p-8 md:p-10'>
            <div className='space-y-6'>
              <div className='space-y-4'>
                <div className='flex flex-wrap items-center gap-3'>
                  <Badge 
                    variant={isCancelled ? 'destructive' : 'outline'}
                    className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-[0.15em] ${
                      !isCancelled && 'border-emerald-500/20 bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {prj.development_status}
                  </Badge>
                  <div className='flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400'>
                    <Clock className='h-3 w-3' />
                    {prj.difficulty_level || 'Commitment TBD'}
                  </div>
                </div>

                <Link href={`/projects/${prj.id}`} className='group/title block'>
                  <h3 className='text-3xl font-black tracking-[-0.04em] text-zinc-950 group-hover/title:text-zinc-600 transition-colors'>
                    {prj.title}
                  </h3>
                </Link>

                <p className='text-base leading-8 text-zinc-600 line-clamp-3'>
                  {prj.description}
                </p>
              </div>

              <div className='space-y-4'>
                <div className='flex flex-wrap gap-2'>
                  {prj.tags.slice(0, 6).map(tag => (
                    <Badge 
                      key={tag} 
                      variant='outline' 
                      className='rounded-full border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-bold text-zinc-600'
                    >
                      {tag}
                    </Badge>
                  ))}
                  {prj.tags.length > 6 && (
                    <span className='text-[10px] font-black uppercase tracking-widest text-zinc-400 pt-1.5'>
                      +{prj.tags.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              <div className='flex items-center justify-between border-t border-zinc-100 pt-6'>
                <Link
                  href={`/projects/${prj.id}`}
                  className='group/btn inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-6 py-3 text-sm font-black text-white transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-95'
                >
                  View Details
                  <ArrowUpRight className='h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5' />
                </Link>

                {applyHref && (
                  <a 
                    href={applyHref}
                    className='text-sm font-bold text-zinc-400 hover:text-zinc-950 transition-colors'
                  >
                    Quick Apply
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
