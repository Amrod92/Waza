import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '../UI/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../UI/dropdown-menu';

export default function SettingsBar({ session, data, id, openModal }) {
  return (
    <div className='top-16 w-56 text-right sm:w-auto'>
      {session && session.user.email == data.user.email ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='gap-2 text-zinc-700'>
              Options
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-44'>
            <DropdownMenuItem asChild>
              <Link href={`/projects/update/${id}`}>Edit listing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-red-700 focus:bg-red-50 focus:text-red-800'
              onClick={openModal}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
