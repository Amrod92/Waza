import Link from 'next/link';
import {
  ArrowRight,
  Check,
  MessageCircleHeart,
  Search,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { SiGithub } from 'react-icons/si';

import { Button } from '../UI/button';

const signals = [
  'For technical and non-technical co-founders',
  'Clear startup briefs instead of vague profiles',
  'Built for serious early-stage partnership discovery',
];

const quickActions = [
  {
    label: 'Browse active projects',
    description: 'See startup listings by stage, market, and co-founder fit.',
    href: '/projects',
    icon: Search,
  },
  {
    label: 'Publish your startup brief',
    description: 'Show what you are building and who should join you.',
    href: '/projects/create-project',
    icon: UserPlus,
  },
];

function Newsletter() {
  return (
    <section className='container mx-auto px-4 py-32'>
      <div className='relative overflow-hidden rounded-[56px] border border-border bg-zinc-950 px-6 py-8 text-primary-foreground shadow-3xl md:px-10 md:py-10 lg:px-14'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_22%)] pointer-events-none' />
        <div className='absolute inset-0 bg-grid-zinc opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_100%)] pointer-events-none' />
        <div className='absolute -right-20 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl pointer-events-none' />

        <div className='relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.9fr)] lg:items-stretch'>
          <div className='space-y-8 rounded-[40px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-10'>
            <div className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.18em]'>
              <Sparkles className='h-4 w-4' />
              Final Step
            </div>
            <div className='max-w-2xl space-y-5'>
              <h2 className='!text-white text-4xl font-black leading-[0.95] tracking-tight [text-shadow:0_2px_18px_rgba(0,0,0,0.35)] md:text-6xl lg:text-7xl'>
                Stop searching blindly.
                <br />
                Start finding the right co-founder.
              </h2>
              <p className='max-w-xl text-lg font-medium leading-relaxed text-white/75 md:text-xl'>
                Waza helps you publish a clearer startup brief, discover the
                right project or co-founder, and move toward the first real
                founder conversation.
              </p>
            </div>

            <div className='grid gap-3 pt-2 sm:grid-cols-3'>
              {signals.map(signal => (
                <div
                  key={signal}
                  className='flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4'
                >
                  <div className='mt-0.5 rounded-full bg-white/10 p-1.5'>
                    <Check className='h-3.5 w-3.5' />
                  </div>
                  <p className='text-sm font-medium leading-relaxed text-white/80'>
                    {signal}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='flex h-full flex-col gap-4'>
            {quickActions.map(action => {
              const Icon = action.icon;

              return (
                <Link key={action.label} href={action.href} className='group'>
                  <div className='flex h-full items-center justify-between gap-5 rounded-[32px] border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:translate-y-[-2px] md:p-7'>
                    <div className='flex items-start gap-4'>
                      <div className='rounded-2xl bg-white text-zinc-950 p-3 shadow-lg'>
                        <Icon className='h-5 w-5' />
                      </div>
                      <div className='space-y-2'>
                        <h3 className='text-xl font-black tracking-tight text-white'>
                          {action.label}
                        </h3>
                        <p className='max-w-sm text-sm leading-relaxed text-white/70'>
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className='h-5 w-5 shrink-0 text-white/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white' />
                  </div>
                </Link>
              );
            })}

            <div className='grid gap-4 rounded-[32px] border border-white/10 bg-white/5 p-6 md:grid-cols-2 md:p-7'>
              <a
                href='https://discord.gg/WqAjnrqJJ5'
                target='_blank'
                rel='noreferrer'
              >
                <Button
                  variant='outline'
                  className='h-14 w-full rounded-2xl border-white/15 bg-white/10 text-base font-bold text-white hover:bg-white/20'
                >
                  <MessageCircleHeart className='h-5 w-5' />
                  Join Discord
                </Button>
              </a>
              <a
                href='https://github.com/sponsors/Amrod92'
                target='_blank'
                rel='noreferrer'
              >
                <Button
                  variant='outline'
                  className='h-14 w-full rounded-2xl border-white/15 bg-transparent text-base font-bold text-white hover:bg-white/10'
                >
                  <SiGithub className='h-5 w-5' />
                  Sponsor Waza
                </Button>
              </a>
              <p className='md:col-span-2 text-sm leading-relaxed text-white/60'>
                Prefer to look first? Explore current startup briefs, then
                publish your own when the fit feels real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
