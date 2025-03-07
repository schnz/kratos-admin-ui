'use client';

import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';

// Load Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [theme] = useState(() =>
    createTheme({
      palette: {
        primary: {
          main: '#3f51b5',
        },
        secondary: {
          main: '#f50057',
        },
      },
      typography: {
        fontFamily: inter.style.fontFamily,
      },
    })
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
