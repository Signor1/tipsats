'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';

interface ProvidersProps {
    children: ReactNode
}

const queryClient = new QueryClient();

export const Providers = ({ children }: ProvidersProps) => {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster />
            </QueryClientProvider>
        </ThemeProvider>
    );
};