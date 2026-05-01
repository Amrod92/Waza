import { Compass, FlaskConical, GitBranch, MessageSquareShare, PenTool, Users } from 'lucide-react';
import { Card, CardContent } from '../UI/card';

const features = [
  {
    title: 'Project discovery',
    description: 'Filter opportunities by stage, commitment, strengths, and theme instead of guessing what is worth joining.',
    icon: Compass,
  },
  {
    title: 'Clear project briefs',
    description: 'Project listings show what is being built, why it matters, and what kind of person is still missing.',
    icon: MessageSquareShare,
  },
  {
    title: 'Personal workspaces',
    description: 'Each user can manage their public profile, project briefs, and outreach-ready signals in one place.',
    icon: GitBranch,
  },
  {
    title: 'Profiles with signal',
    description: 'Background, strengths, interests, and proof of work help people decide whether they trust the fit.',
    icon: Users,
  },
  {
    title: 'Made for useful matching',
    description: 'The product is designed around intent, credibility, and role gaps rather than generic networking.',
    icon: FlaskConical,
  },
  {
    title: 'Built for mixed teams',
    description: 'Technical and non-technical people can both show what they bring and what they need.',
    icon: PenTool,
  },
];

function FeaturesBlocks() {
  return (
    <section className='container mx-auto px-4 py-32'>
      <div className='flex flex-col lg:flex-row items-baseline justify-between gap-12 mb-20'>
        <div className='max-w-xl space-y-6'>
          <h2 className='text-5xl font-black tracking-tight leading-tight'>
            Everything needed to make collaboration legible.
          </h2>
        </div>
        <p className='max-w-lg text-xl text-muted-foreground leading-relaxed'>
          Waza gives people enough structure to describe a project, show
          credibility, and find the right person to work with.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <Card key={index} className='group relative p-8 rounded-[32px] border-2 border-transparent bg-muted/30 hover:bg-card hover:border-primary/20 hover:shadow-2xl transition-all duration-300'>
              <div className='mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:rotate-6'>
                <Icon className='h-7 w-7' />
              </div>
              <h3 className='text-2xl font-black mb-3 tracking-tight'>{feature.title}</h3>
              <p className='text-muted-foreground leading-relaxed text-lg'>
                {feature.description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturesBlocks;
