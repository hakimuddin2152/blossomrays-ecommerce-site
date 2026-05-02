'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

const LoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type LoginForm = z.infer<typeof LoginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(LoginSchema) })

  const onSubmit = async ({ email, password }: LoginForm) => {
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Invalid email or password. Please try again.')
      return
    }

    router.push('/account')
    router.refresh()
  }

  return (
    <Card padding="lg" hover={false}>
      <div className="space-y-6">
        <div className="text-center">
          <Link href="/" className="font-display text-2xl font-semibold italic text-plum">
            BlossomRays
          </Link>
          <h1 className="font-display text-3xl font-semibold text-plum mt-4">Welcome Back</h1>
          <p className="font-body text-muted text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          {error && (
            <p className="text-sm font-body text-red-600 bg-red-50 px-4 py-2.5 rounded-xl border border-red-200">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Sign In
          </Button>
        </form>

        <p className="text-center font-body text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-lavender-dark font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </Card>
  )
}
