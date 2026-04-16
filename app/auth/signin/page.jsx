'use client';

import { SiGithub } from 'react-icons/si';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { betterAuthClient } from '../../../lib/better-auth-client';
import { Button } from '../../../components/UI/button';
import { Card, CardContent } from '../../../components/UI/card';

export default function SignInPage() {
  return (
    <div className='relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden'>
      {/* Background elements */}
      <div className='absolute inset-0 bg-grid-zinc -z-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-40' />
      <div className='absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[600px] w-full max-w-[1200px] bg-primary/5 blur-[120px] rounded-full' />

      <div className='container max-w-5xl mx-auto'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* Left Side: Brand & Value Prop */}
          <div className='hidden lg:flex flex-col space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000'>
            <Link href='/' className='flex items-center space-x-3 group w-fit'>
              <div className='h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-2xl group-hover:scale-110 transition-transform'>
                技
              </div>
              <span className='font-black text-3xl tracking-tighter'>WAZA</span>
            </Link>

            <div className='space-y-6'>
              <h1 className='text-6xl font-black tracking-tight leading-[1.1] text-gradient'>
                Build with the <br /> right people.
              </h1>
              <p className='text-xl text-muted-foreground leading-relaxed max-w-md'>
                Join the startup network for people looking for a co-founder or
                looking for the right startup project to join.
              </p>
            </div>

            <div className='space-y-4 pt-4'>
              <div className='flex items-center gap-3 text-sm font-medium p-4 rounded-2xl bg-card border shadow-sm w-fit'>
                <ShieldCheck className='h-5 w-5 text-primary' />
                Secure authentication via trusted providers
              </div>
              <div className='flex items-center gap-3 text-sm font-medium p-4 rounded-2xl bg-card border shadow-sm w-fit'>
                <Sparkles className='h-5 w-5 text-primary' />
                Access startup projects and co-founder profiles
              </div>
            </div>
          </div>

          {/* Right Side: Login Card */}
          <div className='animate-in fade-in slide-in-from-right-8 duration-1000'>
            <Card className='border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] rounded-[48px] overflow-hidden glass'>
              <CardContent className='p-8 sm:p-12 space-y-10'>
                <div className='text-center space-y-2'>
                  <div className='lg:hidden inline-flex h-12 w-12 bg-primary rounded-2xl items-center justify-center text-primary-foreground font-bold text-2xl shadow-xl mb-4'>
                    技
                  </div>
                  <h2 className='text-3xl font-black tracking-tight'>Welcome Back</h2>
                  <p className='text-muted-foreground font-medium'>
                    Choose your preferred sign in method
                  </p>
                </div>

                <div className='space-y-4'>
                  <Button
                    onClick={() =>
                      betterAuthClient.signIn.social({
                        provider: 'github',
                        callbackURL: '/dashboard',
                      })
                    }
                    variant='outline'
                    size='lg'
                    className='w-full h-16 text-lg font-bold rounded-2xl border-2 hover:bg-muted/50 transition-all flex items-center justify-center gap-3 group'
                  >
                    <SiGithub className='h-6 w-6' />
                    Continue with GitHub
                    <ArrowRight className='h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all' />
                  </Button>
                </div>

                <div className='pt-6 border-t'>
                  <p className='text-center text-sm text-muted-foreground leading-relaxed'>
                    By signing in, you agree to our community standards and
                    commitment to serious founder conversations.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Mobile Brand Link */}
            <div className='lg:hidden text-center mt-8'>
              <Link href='/' className='inline-flex items-center space-x-2 font-black tracking-tighter'>
                <span>WAZA</span>
                <span className='text-primary'>技</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
