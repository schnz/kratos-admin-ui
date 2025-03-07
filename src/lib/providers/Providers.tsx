'use client';

import { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { CustomMuiThemeProvider } from './MuiThemeProvider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Combines all application providers in the correct order
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <CustomMuiThemeProvider>
          {children}
        </CustomMuiThemeProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
