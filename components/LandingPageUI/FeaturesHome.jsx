'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, BriefcaseBusiness, Layers3, Users2, CheckCircle2, Zap } from 'lucide-react';

import BuildingWebsite from '../../assets/building_websites.png';
import Hire from '../../assets/hire.png';
import PairProgramming from '../../assets/pair_programming.png';
import { Button } from '../UI/button';
import { Card } from '../UI/card';

const featureTabs = [
  {
    id: 1,
    eyebrow: 'Discover',
    title: 'Find the right projects',
    description:
      'Browse projects by theme, stage, and collaboration fit so you can focus on opportunities that are actually worth a serious conversation.',
    image: PairProgramming,
    points: ['Advanced filtering by theme and role need', 'Transparent project stage indicators', 'Direct insight into what the project still lacks'],
    icon: Users2,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    eyebrow: 'Build',
    title: 'Craft your project brief',
    description:
      'Waza gives you a clearer way to describe the idea, why it matters, and exactly what kind of person would make it stronger.',
    image: BuildingWebsite,
    points: ['Optimized posting flow for clarity', 'Signal your proof and seriousness', 'Credible, context-rich people profiles'],
    icon: Layers3,
    color: 'bg-purple-500',
  },
  {
    id: 3,
    eyebrow: 'Grow',
    title: 'Move to the right conversation',
    description:
      'Manage your project briefs and track interest from potential collaborators. The goal is to move from first look to the first serious conversation faster.',
    image: Hire,
    points: ['Dedicated project dashboards', 'Real-time interest signals', 'Streamlined path to a working conversation'],
    icon: BriefcaseBusiness,
    color: 'bg-emerald-500',
  },
];

function Features() {
  const [activeTab, setActiveTab] = useState(1);
  const activeFeature = featureTabs.find(f => f.id === activeTab);

  return (
    <section className='container mx-auto px-4 py-32'>
      <div className='flex flex-col lg:flex-row gap-20 items-center'>
        <div className='lg:w-1/2 space-y-12'>
          <div className='space-y-6'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider'>
              <Zap className='h-3 w-3' />
              The Collaboration Flow
            </div>
            <h2 className='text-5xl font-black tracking-tight leading-[1.1]'>
              One platform. <br />
              Zero guesswork.
            </h2>
            <p className='text-xl text-muted-foreground leading-relaxed max-w-xl'>
              Waza is designed around the three stages that matter most:
              discovery, positioning, and working conversation.
            </p>
          </div>

          <div className='grid gap-4'>
            {featureTabs.map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group relative flex items-start gap-6 p-6 rounded-3xl text-left border-2 transition-all duration-300 ${
                    active
                      ? 'bg-card border-primary/50 shadow-2xl shadow-primary/10'
                      : 'bg-muted/30 border-transparent hover:border-border hover:bg-muted/50'
                  }`}
                >
                  <div className={`p-4 rounded-2xl transition-colors duration-300 ${active ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground group-hover:bg-background/80'}`}>
                    <Icon className='h-6 w-6' />
                  </div>
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center justify-between'>
                      <p className={`text-sm font-bold tracking-tight uppercase ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                        {item.eyebrow}
                      </p>
                      {active && <ArrowRight className='h-4 w-4 text-primary' />}
                    </div>
                    <h3 className={`text-xl font-black ${active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      {item.title}
                    </h3>
                  </div>
                  {active && (
                    <div className='absolute left-[-10px] top-1/2 -translate-y-1/2 w-1.5 h-12 bg-primary rounded-full hidden lg:block' />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className='lg:w-1/2 w-full'>
          <Card className='border-0 bg-muted/40 overflow-hidden rounded-[40px] shadow-2xl ring-1 ring-border'>
            <div className='p-8 space-y-8'>
              <div className='relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl'>
                <Image
                  src={activeFeature.image}
                  alt={activeFeature.title}
                  fill
                  className='object-cover'
                  priority
                />
              </div>
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <h3 className='text-3xl font-black tracking-tight'>{activeFeature.title}</h3>
                  <p className='text-muted-foreground text-lg leading-relaxed'>
                    {activeFeature.description}
                  </p>
                </div>
                <div className='grid gap-4 pt-2'>
                  {activeFeature.points.map(point => (
                    <div key={point} className='flex items-center gap-3 font-medium text-sm p-4 rounded-2xl bg-background border shadow-sm transition-transform hover:scale-[1.02] cursor-default'>
                      <CheckCircle2 className='h-5 w-5 text-primary shrink-0' />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Features;
