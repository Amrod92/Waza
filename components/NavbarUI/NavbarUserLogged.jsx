'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusSquare } from 'lucide-react';

import { betterAuthClient } from '../../lib/better-auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '../UI/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../UI/dropdown-menu';

const NavbarUserLogged = ({ session }) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='rounded-full focus:outline-none focus:ring-2 focus:ring-[#b44d24] focus:ring-offset-2'>
          <Avatar className='h-12 w-12 border border-[#d9cdbf] shadow-sm'>
            <AvatarImage src={session.user?.image} alt='Profile Photo' />
            <AvatarFallback>
              {session.user?.name?.slice(0, 1) || 'U'}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56 rounded-2xl border-[#eadfce] bg-[#fffaf2]'>
        <DropdownMenuLabel className='flex flex-col'>
          <span className='text-sm font-medium'>{session.user?.name}</span>
          <span className='truncate text-xs text-zinc-500'>
            {session.user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className='hidden md:flex'>
          <Link href='/projects/create-project'>
            <PlusSquare className='mr-2 h-4 w-4' />
            Post Idea
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/dashboard'>Workspace</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/settings'>Profile settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-red-700 focus:bg-red-50 focus:text-red-800'
          onClick={async () => {
            await betterAuthClient.signOut();
            router.push('/');
            router.refresh();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarUserLogged;
