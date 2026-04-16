'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, LayoutDashboard, Menu, PlusSquare, Sparkles, Users } from 'lucide-react';

import { betterAuthClient } from '../../lib/better-auth-client';
import { Button } from '../UI/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../UI/dropdown-menu';
import NavbarLogin from './NavbarLogin';
import NavbarUserLogged from './NavbarUserLogged';

const Navbar = () => {
  const { data: sessionData } = betterAuthClient.useSession();
  const pathname = usePathname();
  const session = sessionData || null;

  const navItems = [
    {
      href: '/projects',
      label: 'Projects',
      icon: Compass,
    },
    {
      href: '/cofounders',
      label: 'Co-Founders',
      icon: Users,
    },
    {
      href: '/about',
      label: 'About',
      icon: Sparkles,
    },
  ];

  const workspaceItems = session
    ? [
        {
          href: '/dashboard',
          label: 'Workspace',
          icon: LayoutDashboard,
        },
        {
          href: '/projects/create-project',
          label: 'Start Project',
          icon: PlusSquare,
        },
      ]
    : [];

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between'>
        <div className='flex items-center gap-6 md:gap-10'>
          <Link href='/' className='flex items-center space-x-2 group'>
            <div className='h-9 w-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg group-hover:scale-110 transition-transform'>
              技
            </div>
            <span className='inline-block font-black text-2xl tracking-tighter'>
              WAZA
            </span>
          </Link>
          <nav className='hidden md:flex gap-6'>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className='flex items-center gap-4'>
          <div className='hidden items-center gap-4 md:flex'>
            {session ? (
              <Link href='/projects/create-project'>
                <Button variant='default' size='sm'>
                  <PlusSquare className='mr-2 h-4 w-4' />
                  Start Project
                </Button>
              </Link>
            ) : null}
            {!session ? <NavbarLogin /> : <NavbarUserLogged session={session} />}
          </div>

          <div className='flex items-center md:hidden'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='h-9 w-9'>
                  <Menu className='h-5 w-5' />
                  <span className='sr-only'>Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                {navItems.map(item => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className='flex items-center'>
                      <item.icon className='mr-2 h-4 w-4' />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                {session ? (
                  <>
                    <DropdownMenuSeparator />
                    {workspaceItems.map(item => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} className='flex items-center'>
                          <item.icon className='mr-2 h-4 w-4' />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                ) : null}
                <DropdownMenuSeparator />
                {!session ? (
                  <DropdownMenuItem asChild>
                    <Link href='/auth/signin'>Sign In</Link>
                  </DropdownMenuItem>
                ) : (
                  <NavbarUserLogged session={session} isMobile />
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
