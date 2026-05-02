import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import BenefitsSection from '@/components/home/BenefitsSection'
import ScentHighlights from '@/components/home/ScentHighlights'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import NewsletterSection from '@/components/home/NewsletterSection'

export const metadata: Metadata = {
  title: 'BlossomRays — Premium Botanical Car Air Fresheners',
  description:
    'Shop BlossomRays premium car air fresheners. Lavender, Rose and Millennium botanical scents lasting 120+ days. Made in Canada.',
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <ScentHighlights />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  )
}

