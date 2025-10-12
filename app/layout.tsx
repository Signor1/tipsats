import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css'
import { TipSatsHeader } from '@/components/TipSatsHeader'
import { TipSatsFooter } from '@/components/TipSatsFooter'
import { Providers } from '@/contexts/provider'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TipSats - Tips at the Speed of Lightning',
  description: 'Frictionless Bitcoin tipping platform powered by Turnkey embedded wallets and Stacks sBTC. Tip content creators with one click, no seed phrases, no extensions.',
  keywords: [
    'Bitcoin tipping',
    'sBTC',
    'Stacks blockchain',
    'embedded wallet',
    'Turnkey wallet',
    'creator monetization',
    'cryptocurrency tips',
    'Web3 tipping',
    'Bitcoin payments',
    'Stacks builders'
  ],
  authors: [{ name: 'TipSats Team' }],
  creator: 'TipSats',
  publisher: 'TipSats',
  openGraph: {
    title: 'TipSats - Tips at the Speed of Lightning',
    description: 'One-click Bitcoin tipping for content creators',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TipSats',
    description: 'Tips at the Speed of Lightning. Powered by Bitcoin.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className='bg-background' suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <Providers>
          <TipSatsHeader />
          <main className="min-h-screen">
            {children}
          </main>
          <TipSatsFooter />
        </Providers>
      </body>
    </html>
  )
}
