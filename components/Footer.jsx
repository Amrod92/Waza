import Link from 'next/link';
import { Mail } from 'lucide-react';
import { SiGithub, SiX } from 'react-icons/si';

import { currentYear } from '../utils/util';

export default function Footer() {
  return (
    <footer className='border-t bg-muted/30'>
      <div className='container mx-auto px-4 py-12 md:py-16'>
        <div className='grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8'>
          <div className='col-span-1 lg:col-span-2 space-y-4'>
            <Link href='/' className='flex items-center gap-2'>
              <span className='font-bold text-2xl tracking-tighter'>WAZA</span>
            </Link>
            <p className='max-w-xs text-muted-foreground text-sm leading-relaxed'>
              A startup network for people looking for a co-founder or looking
              for the right startup project to join.
            </p>
          </div>

          <div>
            <h4 className='font-bold text-sm uppercase tracking-widest mb-6'>Explore</h4>
            <ul className='space-y-4 text-sm'>
              <li>
                <Link href='/about' className='text-muted-foreground hover:text-foreground transition-colors'>
                  About
                </Link>
              </li>
              <li>
                <Link href='/projects' className='text-muted-foreground hover:text-foreground transition-colors'>
                  Projects
                </Link>
              </li>
              <li>
                <Link href='/cofounders' className='text-muted-foreground hover:text-foreground transition-colors'>
                  Co-Founders
                </Link>
              </li>
              <li>
                <Link href='/privacy' className='text-muted-foreground hover:text-foreground transition-colors'>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-bold text-sm uppercase tracking-widest mb-6'>Connect</h4>
            <div className='flex gap-4'>
              <a
                href='mailto:manlio92--@live.it'
                className='h-10 w-10 flex items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all shadow-sm'
                aria-label='Email'
              >
                <Mail className='h-4 w-4' />
              </a>
              <a
                href='https://twitter.com/Amrod92'
                target='_blank'
                rel='noreferrer'
                className='h-10 w-10 flex items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all shadow-sm'
                aria-label='Twitter'
              >
                <SiX className='h-4 w-4' />
              </a>
              <a
                href='https://github.com/Amrod92/Waza'
                target='_blank'
                rel='noreferrer'
                className='h-10 w-10 flex items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all shadow-sm'
                aria-label='GitHub'
              >
                <SiGithub className='h-4 w-4' />
              </a>
            </div>
          </div>
        </div>

        <div className='mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium'>
          <p>Copyright © {currentYear()} WAZA. All rights reserved.</p>
          <div className='flex gap-6'>
            <span>Designed for startup builders</span>
            <span>Technical & non-technical welcome</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
