'use client';

import { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Combines all application providers in the correct order
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}
