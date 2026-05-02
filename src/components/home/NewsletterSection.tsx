'use client'

import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error ?? 'Something went wrong')
      }
      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <section className="bg-[#1A1A1A] py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-body text-[10px] font-semibold tracking-[0.28em] uppercase text-gold mb-5">
          Stay in the Loop
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight mb-4">
          Stay in the Know
        </h2>
        <p className="font-body text-white/45 text-[15px] mb-10">
          Sign up for new scents, seasonal drops, and exclusive offers.
        </p>

        {status === 'success' ? (
          <div className="border border-white/15 px-8 py-6">
            <p className="font-display text-2xl text-white font-semibold mb-1">You&apos;re in!</p>
            <p className="font-body text-white/45 text-sm">
              Thank you for subscribing. Watch your inbox for updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto rounded-full overflow-hidden border border-white/20">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-transparent text-white placeholder:text-white/30 font-body text-sm outline-none px-5 py-3.5 border-0"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-gold hover:bg-gold/90 text-white font-body text-[11px] font-semibold tracking-[0.18em] uppercase px-7 py-3.5 transition-colors disabled:opacity-60 whitespace-nowrap border-l border-white/20 rounded-r-full"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="font-body text-rose text-sm mt-3">{errorMsg}</p>
        )}

        <p className="font-body text-white/25 text-[11px] tracking-wide mt-6 uppercase">
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}
