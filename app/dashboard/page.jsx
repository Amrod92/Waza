'use client';

import { useQuery } from '@tanstack/react-query';
import { PlusSquare, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

import ProjectsCard from '../../components/ProjectsCard';
import DashboardSkeleton from '../../components/Skeleton/DashboardSkeleton';
import { AuthGuard } from '../../components/UI/auth-guard';
import { Button } from '../../components/UI/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/UI/card';

function DashboardContent() {
  const fetchGetProjects = async () => {
    const response = await fetch('/api/project/getProjectsByEmail', {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchGetProjects,
  });

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return (
    <div className='container mx-auto py-20 px-4'>
      <Card className='max-w-md mx-auto border-destructive/20 bg-destructive/5'>
        <CardContent className='pt-6 text-center space-y-4'>
          <div className='mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center'>
            <LayoutDashboard className='h-6 w-6 text-destructive' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-lg font-bold text-destructive'>Dashboard Error</h3>
            <p className='text-sm text-muted-foreground'>
              {error.message || 'We are having trouble loading your projects.'}
            </p>
          </div>
          <Button 
            variant='outline' 
            onClick={() => refetch()}
            className='mt-2'
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className='container mx-auto py-12 px-4 space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-primary'>
            <LayoutDashboard className='h-5 w-5' />
            <span className='text-sm font-bold uppercase tracking-widest'>Workspace</span>
          </div>
          <h1 className='text-4xl font-extrabold tracking-tight'>Personal Dashboard</h1>
          <p className='text-muted-foreground text-lg'>
            Manage your public profile and the project briefs you have published.
          </p>
        </div>
        
        <Link href='/projects/create-project'>
          <Button className='h-12 px-6 rounded-full shadow-lg hover:shadow-primary/20 transition-all'>
            <PlusSquare className='mr-2 h-5 w-5' />
            Start New Project
          </Button>
        </Link>
      </div>

      <div className='grid gap-8'>
        <Card className='border-none shadow-none bg-muted/30'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-xl'>Your active projects</CardTitle>
            <CardDescription>
              {data.length} project{data.length === 1 ? '' : 's'} currently visible to potential collaborators.
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-6 space-y-6'>
            {data.length === 0 ? (
              <div className='py-12 text-center border-2 border-dashed rounded-2xl bg-background'>
                <p className='text-muted-foreground mb-4'>You have not published any projects yet.</p>
                <Link href='/projects/create-project'>
                  <Button variant='outline' size='sm'>Get started by publishing your first project</Button>
                </Link>
              </div>
            ) : (
              <div className='grid gap-6'>
                {data.map(prj => (
                  <ProjectsCard key={prj.id} prj={prj} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
