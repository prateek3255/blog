'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    // Simulate submission — wire up to your mailing list provider here
    await new Promise((r) => setTimeout(r, 800))
    setStatus('success')
    setEmail('')
  }

  return (
    <div>
      <p className="text-[0.9375rem] text-foreground leading-relaxed">
        I occasionally write about things I&apos;m building, reading, or thinking about.
        No spam, unsubscribe any time.
      </p>
      {status === 'success' ? (
        <p className="mt-5 text-sm text-muted-foreground">
          You&apos;re in. Talk soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 flex items-center gap-2 max-w-sm">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 h-9 rounded-none border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="h-9 px-4 text-sm bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-50 shrink-0"
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="mt-2 text-xs text-red-500">Something went wrong. Please try again.</p>
      )}
    </div>
  )
}
