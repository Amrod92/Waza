import Link from 'next/link';
import { ArrowRight, Compass, Search, UserPlus, Users, Zap } from 'lucide-react';

import { Button } from '../UI/button';

function HeroSection({ scrollDown }) {
  return (
    <section className='relative pt-24 pb-32 md:pt-32 md:pb-48 overflow-hidden'>
      {/* Background patterns */}
      <div className='absolute inset-0 bg-grid-zinc -z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_100%)] opacity-40' />
      <div className='absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-full max-w-[1200px] bg-primary/5 blur-[120px] rounded-full' />
      
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center text-center space-y-10'>
          {/* Floating Badge */}
          <div className='inline-flex items-center gap-2 rounded-full border glass px-4 py-2 text-sm font-semibold shadow-xl ring-1 ring-border animate-in fade-in slide-in-from-top-4 duration-1000'>
            <div className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
            <span className='text-muted-foreground'>Now live for startup projects and co-founder discovery</span>
          </div>

          {/* Main Title */}
          <div className='max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
            <h1 className='text-6xl font-black tracking-tight lg:text-8xl leading-[0.9] text-gradient'>
              Find a co-founder, <br />
              or join the right startup.
            </h1>
            <p className='mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed md:text-2xl font-medium'>
              Waza is a two-sided startup network: browse projects that need a
              co-founder, or advertise yourself as someone looking for the
              right startup to join.
            </p>
          </div>

          {/* CTAs */}
          <div className='flex flex-col sm:flex-row gap-5 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000'>
            <Link href='/projects'>
              <Button size='lg' className='px-10 h-14 text-lg font-bold rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:translate-y-[-2px] transition-all'>
                Find Projects
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
            <Link href='/cofounders'>
              <Button
                variant='outline'
                size='lg'
                className='px-10 h-14 text-lg font-bold rounded-2xl glass hover:bg-muted/50 transition-all'
              >
                Find Co-Founders
              </Button>
            </Link>
          </div>

          {/* Feature highlights grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl pt-24'>
            <div className='group relative p-8 rounded-3xl border bg-card/50 glass hover:bg-card transition-all duration-300'>
              <div className='absolute -top-4 left-8 p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg ring-4 ring-background'>
                <Users className='h-6 w-6' />
              </div>
              <div className='pt-4'>
                <h3 className='text-xl font-bold mb-3'>Co-Founders</h3>
                <p className='text-muted-foreground leading-relaxed'>
                  Discover technical and non-technical people who are actively
                  looking for the right startup to join.
                </p>
              </div>
            </div>
            
            <div className='group relative p-8 rounded-3xl border bg-card/50 glass hover:bg-card transition-all duration-300'>
              <div className='absolute -top-4 left-8 p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg ring-4 ring-background'>
                <Compass className='h-6 w-6' />
              </div>
              <div className='pt-4'>
                <h3 className='text-xl font-bold mb-3'>Project Discovery</h3>
                <p className='text-muted-foreground leading-relaxed'>
                  Browse startup briefs by stage, commitment, and role gap to
                  find projects that are genuinely worth joining.
                </p>
              </div>
            </div>
            
            <div className='group relative p-8 rounded-3xl border bg-card/50 glass hover:bg-card transition-all duration-300'>
              <div className='absolute -top-4 left-8 p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg ring-4 ring-background'>
                <Zap className='h-6 w-6' />
              </div>
              <div className='pt-4'>
                <h3 className='text-xl font-bold mb-3'>Clear Next Step</h3>
                <p className='text-muted-foreground leading-relaxed'>
                  Make the fit obvious early, then move directly into an
                  application or co-founder conversation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
