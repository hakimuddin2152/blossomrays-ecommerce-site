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

const RegisterSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
})
type RegisterForm = z.infer<typeof RegisterSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(RegisterSchema) })

  const onSubmit = async ({ email, password, full_name }: RegisterForm) => {
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    })

    if (authError) {
      setError(authError.message)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <Card padding="lg" hover={false}>
        <div className="text-center space-y-4">
          <span className="text-5xl">✉️</span>
          <h2 className="font-display text-2xl font-semibold text-plum">Check Your Email</h2>
          <p className="font-body text-muted text-sm">
            We&apos;ve sent a confirmation link to your email. Click it to activate your account.
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-2">Back to Login</Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <Card padding="lg" hover={false}>
      <div className="space-y-6">
        <div className="text-center">
          <Link href="/" className="font-display text-2xl font-semibold italic text-plum">
            BlossomRays
          </Link>
          <h1 className="font-display text-3xl font-semibold text-plum mt-4">Create Account</h1>
          <p className="font-body text-muted text-sm mt-1">Join the BlossomRays community</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" placeholder="Jane Smith" error={errors.full_name?.message} {...register('full_name')} />
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" placeholder="Min. 8 characters" error={errors.password?.message} {...register('password')} />
          <Input label="Confirm Password" type="password" placeholder="••••••••" error={errors.confirm_password?.message} {...register('confirm_password')} />

          {error && (
            <p className="text-sm font-body text-red-600 bg-red-50 px-4 py-2.5 rounded-xl border border-red-200">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <p className="text-center font-body text-sm text-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-lavender-dark font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  )
}
