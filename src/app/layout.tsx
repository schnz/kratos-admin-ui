import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import ThemeRegistry from "../lib/providers/ThemeRegistry";
import Providers from "../lib/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kratos Admin UI",
  description: "Admin interface for Ory Kratos identity service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeRegistry>
            <Providers>
              {children}
            </Providers>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
