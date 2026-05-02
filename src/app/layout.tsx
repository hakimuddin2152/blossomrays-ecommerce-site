import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  icons: {
    icon: '/images/favicon.png',
    shortcut: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blossomrays.netlify.app',
  ),
  title: {
    default: 'BlossomRays — Premium Botanical Car Air Fresheners',
    template: '%s | BlossomRays',
  },
  description:
    'Discover BlossomRays premium car air fresheners in Lavender and Rose. Long-lasting botanical fragrance for a luxurious driving experience.',
  keywords: [
    'car air freshener',
    'lavender car freshener',
    'rose car freshener',
    'botanical car fragrance',
    'premium car freshener',
    'BlossomRays',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'BlossomRays',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BlossomRays Premium Car Air Fresheners',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@blossomrays',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
