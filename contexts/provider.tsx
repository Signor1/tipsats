'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TurnkeyWrapper } from '@/lib/turnkey/provider';

interface ProvidersProps {
    children: ReactNode
}

const queryClient = new QueryClient();

export const Providers = ({ children }: ProvidersProps) => {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <QueryClientProvider client={queryClient}>
                <TurnkeyWrapper>
                    {children}
                    <Toaster />
                </TurnkeyWrapper>
            </QueryClientProvider>
        </ThemeProvider>
    );
};