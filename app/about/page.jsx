'use client';

import Link from 'next/link';
import { ArrowRight, UserPlus } from 'lucide-react';

import { Button } from '../../components/UI/button';

const principles = [
  {
    title: 'Project-First Signal',
    description:
      'Waza is designed to help serious founders and future co-founders find each other faster, with less ambiguity and less noise.',
    stat: '01',
  },
  {
    title: 'Complementary People',
    description:
      'Good co-founder matching is rarely about identical backgrounds. It is about fit, shared motivation, and useful overlap.',
    stat: '02',
  },
  {
    title: 'Clearer Expectations',
    description:
      'Stage, commitment, and proof of work should be legible before anyone spends time on the wrong conversation.',
    stat: '03',
  },
];

const pillars = [
  {
    eyebrow: 'Discovery',
    title: 'See what is real',
    description:
      'Browse startup briefs that explain the idea, the stage, the co-founder need, and why the work matters.',
  },
  {
    eyebrow: 'Positioning',
    title: 'Explain the gap',
    description:
      'Profiles and listings are structured to show what you bring, what you need, and what kind of co-founder fits.',
  },
  {
    eyebrow: 'Momentum',
    title: 'Move to conversation',
    description:
      'The goal is not passive browsing. The goal is enough trust and clarity to justify a first serious founder conversation.',
  },
];

const processSteps = [
  {
    title: 'Define the Gap',
    description:
      'Describe the startup, the stage, and the co-founder need with precision.',
  },
  {
    title: 'Surface Proof',
    description:
      'Provide strengths and context so potential co-founders can assess credibility immediately.',
  },
  {
    title: 'Evaluate Fit',
    description:
      'Decide whether the fit is worth exploring before time gets wasted on outreach.',
  },
];

const signals = [
  'Clear co-founder intent instead of vague networking.',
  'A two-sided flow for startup projects and co-founder profiles.',
  'Better first conversations through stronger signal and context.',
];

const SectionLabel = ({ children, inverted = false }) => (
  <div
    className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${
      inverted
        ? 'border-white/10 bg-white/5 text-white/80'
        : 'border-border bg-muted/50 text-muted-foreground'
    }`}
  >
    {children}
  </div>
);

export default function AboutPage() {
  return (
    <div className='relative min-h-screen bg-background selection:bg-primary selection:text-primary-foreground'>
      <div className='absolute inset-0 -z-10 bg-grid-zinc [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_80%)] opacity-[0.12]' />
      <div className='absolute left-1/2 top-0 -z-10 h-[600px] w-full max-w-[1200px] -translate-x-1/2 rounded-full bg-primary/[0.02] blur-[140px]' />

      <main className='container mx-auto px-6 py-24 md:py-40'>
        <div className='space-y-32 md:space-y-40'>
          <section className='grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_320px] lg:items-end'>
            <div className='space-y-10'>
              <SectionLabel>The Craft of Co-Founder Matching</SectionLabel>
              <div className='space-y-12'>
                <h1 className='text-7xl font-black leading-[0.85] tracking-[-0.05em] md:text-[120px]'>
                  Great things
                  <br />
                  start with <span className='text-primary/20 italic'>技</span>
                  <br />
                  the right fit.
                </h1>
                <p className='max-w-2xl text-2xl font-medium leading-tight tracking-tight text-muted-foreground md:text-3xl'>
                  Waza is where startup builders either publish a project that
                  needs a co-founder or advertise themselves as the right
                  person to join one.
                </p>
                <div className='flex flex-col gap-5 pt-2 sm:flex-row'>
                  <Link href='/projects'>
                    <Button
                      size='lg'
                      className='h-16 rounded-[24px] px-10 text-lg font-black shadow-2xl transition-transform hover:scale-105'
                    >
                      Browse Projects
                      <ArrowRight className='ml-2 h-5 w-5' />
                    </Button>
                  </Link>
                  <Link href='/cofounders'>
                    <Button
                      variant='outline'
                      size='lg'
                      className='h-16 rounded-[24px] border-2 px-10 text-lg font-bold'
                    >
                      Browse Co-Founders
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className='space-y-6 border-l border-border/60 pl-6 lg:pl-8'>
              <p className='text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground'>
                What Waza Optimizes For
              </p>
              {signals.map(signal => (
                <p key={signal} className='text-base leading-relaxed text-foreground'>
                  {signal}
                </p>
              ))}
            </div>
          </section>

          <section className='grid gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start'>
            <div className='space-y-8'>
              <SectionLabel>Philosophy</SectionLabel>
              <h2 className='text-5xl font-black leading-none tracking-tighter md:text-7xl'>
                Beyond vague
                <br />
                founder networking.
              </h2>
              <p className='max-w-md text-xl font-medium leading-relaxed text-muted-foreground'>
                Most platforms make introductions easy and evaluation hard.
                Waza is built to make founder fit legible from the first look.
              </p>
            </div>

            <div className='overflow-hidden rounded-[36px] border border-border/60 bg-background/80'>
              {principles.map(item => (
                <div
                  key={item.title}
                  className='grid gap-4 border-b border-border/60 p-8 last:border-b-0 md:grid-cols-[72px_minmax(0,1fr)]'
                >
                  <div className='text-3xl font-black tracking-[-0.04em] text-primary/25'>
                    {item.stat}
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-2xl font-black tracking-tight'>
                      {item.title}
                    </h3>
                    <p className='text-lg leading-relaxed text-muted-foreground'>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className='space-y-14'>
            <div className='grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end'>
              <div className='max-w-3xl space-y-6'>
                <SectionLabel>How It Works</SectionLabel>
                <h2 className='text-4xl font-black leading-tight tracking-tight md:text-6xl'>
                  Co-founder matching works better when both sides can read the room.
                </h2>
              </div>
              <p className='text-lg leading-relaxed text-muted-foreground'>
                The platform asks for enough context that both sides can judge
                whether there is real startup alignment before outreach begins.
              </p>
            </div>

            <div className='grid gap-0 overflow-hidden rounded-[36px] border border-border/60 md:grid-cols-3'>
              {pillars.map(item => (
                <div
                  key={item.title}
                  className='border-b border-border/60 bg-background p-8 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 md:p-10'
                >
                  <div className='space-y-6'>
                    <div className='space-y-2'>
                      <p className='text-[10px] font-black uppercase tracking-[0.25em] text-primary/60'>
                        {item.eyebrow}
                      </p>
                      <h3 className='text-2xl font-black tracking-tight'>
                        {item.title}
                      </h3>
                    </div>
                    <p className='text-lg font-medium leading-relaxed text-muted-foreground'>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className='grid gap-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start'>
            <div className='space-y-10'>
              <div className='space-y-5'>
                <SectionLabel>The Flow</SectionLabel>
                <h2 className='text-4xl font-black tracking-tight md:text-6xl'>
                  The art of the impression.
                </h2>
                <p className='max-w-2xl text-lg leading-relaxed text-muted-foreground'>
                  Stronger co-founder conversations start with clearer inputs.
                  Waza is designed to make those inputs easier to understand at
                  a glance.
                </p>
              </div>

              <div className='overflow-hidden rounded-[36px] border border-border/60 bg-background/70'>
                {processSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className='grid gap-4 border-b border-border/60 p-8 last:border-b-0 md:grid-cols-[96px_minmax(0,1fr)]'
                  >
                    <span className='text-5xl font-black tracking-[-0.05em] text-primary/15'>
                      0{index + 1}
                    </span>
                    <div className='space-y-2 pt-1'>
                      <h4 className='text-xl font-bold tracking-tight'>
                        {step.title}
                      </h4>
                      <p className='max-w-md leading-relaxed text-muted-foreground'>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='rounded-[40px] border border-border/60 bg-muted/20 p-8 md:p-10'>
              <p className='text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground'>
                Design Principle
              </p>
              <div className='mt-8 space-y-6'>
                <span className='block text-8xl font-black leading-none text-primary/10'>
                  技
                </span>
                <p className='text-2xl font-black leading-tight tracking-tight'>
                  Clarity should do most of the work.
                </p>
                <p className='text-base leading-relaxed text-muted-foreground'>
                  The product is intentionally lighter weight than a typical
                  startup network. Less clutter, stronger signal, better fit.
                </p>
              </div>
            </div>
          </section>

          <section className='pt-8'>
            <div className='relative overflow-hidden rounded-[48px] border border-border bg-zinc-950 px-8 py-12 text-primary-foreground md:px-14 md:py-16'>
              <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%)]' />
              <div className='pointer-events-none absolute inset-0 bg-grid-zinc opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_100%)]' />
              <div className='absolute right-[-1rem] top-1/2 hidden -translate-y-1/2 text-[240px] font-black leading-none text-white/[0.05] md:block'>
                技
              </div>

              <div className='relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_320px] lg:items-end'>
                <div className='space-y-6'>
                  <SectionLabel inverted>Build With Intent</SectionLabel>
                  <h2 className='!text-white text-5xl font-black leading-[0.9] tracking-tighter md:text-7xl'>
                    Find the co-founder
                    <br />
                    worth building with.
                  </h2>
                  <p className='max-w-2xl text-xl font-medium leading-relaxed text-white md:text-2xl'>
                    Join Waza and start with clearer startup briefs, stronger
                    co-founder signals, and better first conversations.
                  </p>
                </div>

                <div className='flex flex-col gap-4'>
                  <Link href='/projects' className='w-full'>
                    <Button
                      size='lg'
                      variant='secondary'
                      className='h-14 w-full justify-between rounded-2xl px-6 text-base font-black'
                    >
                      Browse Startup Projects
                      <ArrowRight className='h-5 w-5' />
                    </Button>
                  </Link>
                  <Link href='/cofounders' className='w-full'>
                    <Button
                      size='lg'
                      variant='outline'
                      className='h-14 w-full justify-between rounded-2xl border-white/15 bg-white/10 px-6 text-base font-bold text-white hover:bg-white/20'
                    >
                      Browse Co-Founders
                      <UserPlus className='h-5 w-5' />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className='border-t pt-16 text-center'>
            <p className='text-sm font-bold uppercase tracking-[0.4em] text-muted-foreground/40'>
              Crafted by builders for builders • 技 Waza
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
