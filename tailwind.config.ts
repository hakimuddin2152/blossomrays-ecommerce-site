import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Stelina palette
        cream: {
          DEFAULT: '#FAFAF8',  // warm off-white body
          dark: '#E8E5E0',     // neutral borders/dividers
          light: '#F5F3F0',    // section bg, product image bg
        },
        lavender: {
          light: '#ECEDF7',
          DEFAULT: '#8B89C8',
          dark: '#5856A6',
        },
        rose: {
          light: '#F5ECE9',
          DEFAULT: '#C87868',
          dark: '#9A4E40',
        },
        // Rich ink black — headings, CTAs, footer, dark panels
        plum: '#111111',
        // Warm honey gold — CTA buttons, eyebrows, prices, accents
        gold: '#C49A6C',
        // Neutral mid-gray — body text, secondary info
        muted: '#777777',
        // Sage green — kept for trust marks
        sage: {
          light: '#D8E9D2',
          DEFAULT: '#6B8F61',
          dark: '#3F6038',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft:    '0 2px 20px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 6px 40px rgba(0, 0, 0, 0.10)',
        'soft-xl': '0 16px 64px rgba(0, 0, 0, 0.14)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-lavender': 'linear-gradient(135deg, #ECEDF7 0%, #EAE0D4 100%)',
        'gradient-rose':     'linear-gradient(135deg, #F5ECE9 0%, #EAE0D4 100%)',
        'gradient-hero':     'linear-gradient(165deg, #F5F0EB 0%, #F0EDEA 40%, #FFFFFF 100%)',
        'gradient-brand':    'linear-gradient(135deg, #1A1A1A 0%, #333333 100%)',
        'gradient-sage':     'linear-gradient(135deg, #D8E9D2 0%, #F0EDEA 100%)',
        'shimmer-bg':
          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}

export default config
