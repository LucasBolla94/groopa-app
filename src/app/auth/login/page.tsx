import LoginForm from '@/components/auth/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login to Groopa',
}

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold text-[var(--gp-dark)] mb-6">Log In</h1>
      <LoginForm />
    </main>
  )
}
