import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'Sutralab - Consulting & AI Solutions',
  description: 'We are a Consulting company that deliver actual product as solution, our aim is to reduce capital for companies, whether is it human, financial or time.',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 0.67,
    maximumScale: 5,
    userScalable: true, // Cho phép người dùng zoom
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '1024x1024' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/icon.png', type: 'image/png', sizes: '384x384' },
      { url: '/icon.png', type: 'image/png', sizes: '360x360' },
      { url: '/icon.png', type: 'image/png', sizes: '288x288' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon.png', type: 'image/png', sizes: '144x144' },
    ],
    shortcut: [
      { url: '/icon.png', type: 'image/png', sizes: '1024x1024' },
    ],
    apple: [
      { url: '/icon.png', sizes: '360x360', type: 'image/png' },
      { url: '/icon.png', sizes: '1024x1024', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
