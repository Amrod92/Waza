'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { betterAuthClient } from '../../lib/better-auth-client';
import LoadingSpinner from './LoadingSpinner';

export function AuthGuard({ children }) {
  const { data: session, isPending } = betterAuthClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace('/auth/signin');
    }
  }, [isPending, router, session]);

  if (isPending || !session?.user) {
    return <LoadingSpinner />;
  }

  return children;
}
