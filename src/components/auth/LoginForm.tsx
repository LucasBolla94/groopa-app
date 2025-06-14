'use client'
import { FormEvent, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Input from './Input'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = data.get('email') as string
    const password = data.get('password') as string

    setLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <Input name="email" type="email" label="Email" required />
      <Input name="password" type="password" label="Password" required />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        disabled={loading}
        className="rounded-full bg-[var(--gp-dark)] text-[var(--gp-white)] py-2 font-semibold hover:bg-[var(--gp-light)] hover:text-[var(--gp-dark)] transition disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Log In'}
      </button>
    </form>
  )
}
