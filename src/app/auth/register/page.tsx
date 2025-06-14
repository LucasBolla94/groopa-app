import RegisterForm from '@/components/auth/RegisterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up – Groopa',
}

export default function RegisterPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold text-[var(--gp-dark)] mb-6">Create your account</h1>
      <RegisterForm />
    </main>
  )
}
