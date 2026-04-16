import Image from 'next/image';

import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback } from './avatar';

function getInitials(name) {
  if (!name) return '?';

  const initials = name
    .trim()
    .split(/\s+/)
    .map(part => part[0])
    .join('')
    .slice(0, 2);

  return initials.toUpperCase();
}

export function ProfileAvatar({
  src,
  name,
  alt,
  className,
  priority = false,
  sizes = '64px',
}) {
  return (
    <Avatar className={cn('bg-muted font-medium text-muted-foreground', className)}>
      {src ? (
        <Image
          src={src}
          alt={alt || `${name || 'User'} profile image`}
          fill
          sizes={sizes}
          className='object-cover'
          priority={priority}
        />
      ) : null}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
