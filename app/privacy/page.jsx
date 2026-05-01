import {
  Database,
  Eye,
  Lock,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { SiGithub } from 'react-icons/si';

const principles = [
  {
    icon: ShieldCheck,
    title: 'Limited collection',
    description:
      'Waza stores the information needed to run sign-in, profiles, projects, and people discovery.',
  },
  {
    icon: Eye,
    title: 'User-controlled visibility',
    description:
      'Your profile does not appear on the people page unless you explicitly opt in from settings.',
  },
  {
    icon: Trash2,
    title: 'Delete means delete',
    description:
      'Deleting your account removes both your app data and the Better Auth account records used for sign-in.',
  },
];

const sections = [
  {
    eyebrow: 'What We Collect',
    title: 'Account and profile data',
    body: [
      'When you sign in with Google, Waza stores the minimum account information needed to identify you and run the product, such as your name, email, and profile image.',
      'If you choose to build out your profile, Waza can also store your bio, strengths, interests, social links, availability, and whether you want to appear in people discovery.',
    ],
  },
  {
    eyebrow: 'Product Data',
    title: 'Projects, discovery settings, and connections',
    body: [
      'Waza stores project briefs you publish, including things like title, summary, stage, commitment, strengths sought, and supporting links.',
      'If you use people discovery, Waza may store explicit connection relationships between users. Connection counts can be used as part of the credibility signal shown on profile cards.',
    ],
  },
  {
    eyebrow: 'Authentication',
    title: 'Google and Better Auth',
    body: [
      'Authentication is handled through Google OAuth and Better Auth. Better Auth manages auth-related records such as user, session, account, and verification data.',
      'Waza also syncs your authenticated identity into the app-level profile tables used by the product itself.',
    ],
  },
  {
    eyebrow: 'Storage',
    title: 'Where data lives',
    body: [
      'Product data is stored in Supabase. Auth data for Better Auth is also stored in Postgres. Internal implementation details may change over time, but the goal is the same: only store what is needed to operate the product.',
      'Analytics may also be used at a product level to understand usage patterns and improve the service.',
    ],
  },
  {
    eyebrow: 'Visibility',
    title: 'What is public',
    body: [
      'Projects you publish are intended to be visible to other users of the platform.',
      'Your profile is only intended to appear in public discovery when you explicitly set it to public in settings. If that toggle is off, registration alone does not put you in people discovery.',
    ],
  },
  {
    eyebrow: 'Control',
    title: 'Your choices',
    body: [
      'You can update your profile, visibility, links, and availability from the settings page.',
      'You can also delete your account. The current delete flow removes both app-level data and Better Auth records so the account is not silently recreated by future authenticated requests.',
    ],
  },
];

function SectionBlock({ eyebrow, title, body }) {
  return (
    <section className='rounded-[32px] border border-zinc-200/80 bg-white p-6 shadow-[0_24px_80px_-56px_rgba(24,24,27,0.35)] md:p-8'>
      <div className='space-y-3'>
        <p className='text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400'>
          {eyebrow}
        </p>
        <h2 className='text-2xl font-black tracking-tight text-zinc-950'>
          {title}
        </h2>
      </div>
      <div className='mt-5 space-y-4 text-sm leading-7 text-zinc-600 md:text-base'>
        {body.map(paragraph => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-zinc-50 text-zinc-950'>
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(24,24,27,0.06),transparent_28%),radial-gradient(circle_at_top,rgba(212,212,216,0.38),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,0.98),rgba(244,244,245,0.96))]' />
      <div className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(24,24,27,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_top,black_14%,transparent_76%)]' />

      <div className='container mx-auto px-4 py-12 md:py-20'>
        <div className='mx-auto max-w-6xl space-y-10'>
          <section className='overflow-hidden rounded-[40px] border border-zinc-200/80 bg-white shadow-[0_40px_120px_-60px_rgba(24,24,27,0.3)]'>
            <div className='grid gap-8 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end'>
              <div className='space-y-6'>
                <div className='inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500'>
                  Privacy
                </div>
                <div className='space-y-4'>
                  <h1 className='max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.06em] text-zinc-950 md:text-7xl'>
                    Clear privacy for a product built on trust.
                  </h1>
                  <p className='max-w-3xl text-base leading-8 text-zinc-600 md:text-lg'>
                    Waza exists to help people find the right person to work with.
                    That only works if profile data, project data, and account
                    data are handled with restraint and clarity.
                  </p>
                </div>
              </div>

              <div className='rounded-[32px] bg-zinc-950 p-6 text-white shadow-[0_28px_90px_-58px_rgba(24,24,27,0.8)]'>
                <div className='space-y-4'>
                  <p className='text-[10px] font-black uppercase tracking-[0.24em] text-white/45'>
                    Current stack
                  </p>
                  <div className='space-y-3 text-sm leading-6 text-white/75'>
                    <div className='flex items-center gap-3'>
                      <SiGithub className='h-4 w-4 text-white/45' />
                      <span>Google OAuth for sign-in</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Lock className='h-4 w-4 text-white/45' />
                      <span>Better Auth for sessions</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Database className='h-4 w-4 text-white/45' />
                      <span>Supabase for product data</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className='grid gap-4 md:grid-cols-3'>
            {principles.map(item => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className='rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-[0_20px_70px_-52px_rgba(24,24,27,0.28)]'
                >
                  <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white'>
                    <Icon className='h-5 w-5' />
                  </div>
                  <h2 className='mt-5 text-xl font-black tracking-tight text-zinc-950'>
                    {item.title}
                  </h2>
                  <p className='mt-3 text-sm leading-7 text-zinc-600'>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </section>

          <section className='grid gap-5 lg:grid-cols-2'>
            {sections.map(section => (
              <SectionBlock key={section.title} {...section} />
            ))}
          </section>

          <section className='rounded-[36px] border border-zinc-200/80 bg-zinc-950 px-6 py-8 text-white shadow-[0_32px_100px_-58px_rgba(24,24,27,0.82)] md:px-8 md:py-10'>
            <div className='max-w-4xl space-y-4'>
              <p className='text-[10px] font-black uppercase tracking-[0.24em] text-white/45'>
                Practical note
              </p>
              <h2 className='!text-white text-3xl font-black tracking-tight md:text-4xl'>
                This page is a product summary, not a full legal agreement.
              </h2>
              <p className='text-sm leading-7 text-white/72 md:text-base'>
                The goal here is to explain, in plain language, what Waza
                currently stores and why. If the product model or data model
                changes materially, this page should be updated to match the
                implementation.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
