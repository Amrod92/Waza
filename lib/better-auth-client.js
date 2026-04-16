'use client';

import { createAuthClient } from 'better-auth/react';

export const betterAuthClient = createAuthClient({
  basePath: '/api/better-auth',
});
