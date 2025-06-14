'use client'
import { FormEvent, useState } from 'react'
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import Input from './Input'
import Checkbox from './Checkbox'
import { useRouter } from 'next/navigation'

type Err = { email?: string; password?: string }

export default function LoginForm() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Err>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [successName, setSuccessName] = useState<string | null>(null)

  const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const validate = (data: FormData): Err => {
    const err: Err = {}
    const email = data.get('email') as string
    if (!isEmail(email)) err.email = 'Invalid email'
    const pass = data.get('password') as string
    if (!pass) err.password = 'Required'
    return err
  }
  const filterTouched = (err: Err): Err =>
    Object.fromEntries(Object.entries(err).filter(([k]) => touched[k]))

  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }))
    setErrors(filterTouched(validate(new FormData(e.currentTarget))))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const errs = validate(data)
    setErrors(errs)
    setTouched({ email: true, password: true })
    if (Object.keys(errs).length) return

    const keepLogged = data.get('remember')

    setLoading(true)
    try {
      await setPersistence(
        auth,
        keepLogged ? browserLocalPersistence : browserSessionPersistence
      )

      const cred = await signInWithEmailAndPassword(
        auth,
        data.get('email') as string,
        data.get('password') as string
      )

      const snap = await getDoc(doc(db, 'users', cred.user.uid))
      const firstName = snap.exists() ? (snap.data().firstName as string) : 'User'

      setSuccessName(firstName)
      setTimeout(() => router.push('/dash'), 2000)
    } catch (err) {
      if (err instanceof Error) {
        setErrors({ email: err.message })
      } else {
        setErrors({ email: 'Unknown error occurred' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        onChange={handleChange}
        className="w-full max-w-md bg-[var(--gp-white)] rounded-2xl shadow-lg p-6 flex flex-col gap-4"
      >
        <Input name="email" label="Email" type="email" error={errors.email} />
        <Input name="password" label="Password" type="password" error={errors.password} />

        <Checkbox name="remember" label="Keep me logged in (30 days)" />

        <button
          disabled={loading || Object.keys(errors).length > 0}
          className="rounded-full bg-gradient-to-r from-[var(--gp-dark)] to-[var(--gp-light)]
                     text-[var(--gp-white)] py-2 font-semibold
                     hover:from-[var(--gp-light)] hover:to-[var(--gp-dark)] hover:text-[var(--gp-dark)]
                     transition disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      {successName && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-[var(--gp-light)] text-[var(--gp-dark)] px-6 py-4 rounded-xl shadow-xl animate-scale">
            {`Welcome back, ${successName}!`}
          </div>
        </div>
      )}
    </>
  )
}
